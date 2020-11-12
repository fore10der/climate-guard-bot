import { Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
import { inputs } from './stages/inputs'
import { initJobs, moveToScene, unbindNotification } from './utils'
import { AUTH } from './stages/inputs/auth'
import TelegrafSession from 'telegraf-session-local'
import chalk from 'chalk'
import updateLogger from 'telegraf-update-logger'
import { BotContext } from './interfaces/bot'
import { securedMenuMiddleware } from './menus'
import { queryHandler } from './menus/searchView'
dotenv.config()
export const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN)
export const telegram = bot.telegram

const start = Telegraf.optional<BotContext>(ctx => !ctx.session.token, async (ctx) => {
  await moveToScene(AUTH)(ctx, '/')
})
const stop = Telegraf.optional<BotContext>(ctx => !!ctx.session.token, async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.session.menuMessageId)
  } catch (e) {
    console.log(e)
  }
  // unbindNotification(ctx.chat.id.toString())
  ctx.session = {}
  await ctx.reply('Пока')
})

const localSession = new TelegrafSession({
  database: 'persist/sessions.json'
})

// @ts-ignore
// initJobs(localSession.DB.value())

bot.use(
  updateLogger({
    colors: {
      id: chalk.white,
      chat: chalk.yellow,
      user: chalk.green,
      type: chalk.bold
    }
  })
)

bot.use(localSession.middleware())
bot.use(inputs.middleware())
bot.use(securedMenuMiddleware)

bot.start(start)
bot.command('stop', stop)
// bot.on('text', queryHandler)

bot.catch((e) => {
  console.log(e)
})
