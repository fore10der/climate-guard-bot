import { Telegraf } from 'telegraf'
import { inputs } from './stages'
import { initJobs, moveToScene, unbindNotification } from './utils'
import { AUTH } from './stages/inputs/auth'
import TelegrafSession from 'telegraf-session-local'
import chalk from 'chalk'
import { Category, CategoryServiceFactory, CategoryConfiguration, LogLevel } from 'typescript-logging'
import updateLogger from 'telegraf-update-logger'
import { BotContext } from './interfaces/bot'
import { menuMiddleware, securedMenuMiddleware } from './menus'
import { queryHandler, securedSearchMiddleware } from './menus/searchView'
import { BOT_TOKEN, REBOOT_SECRET } from './settings'
import { CLOSE_NOTIFICATION } from './constants'
export const bot = new Telegraf<BotContext>(BOT_TOKEN)
export const telegram = bot.telegram
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info))
export const botLogger = new Category('bot')
export const notificationLogger = new Category('notifications', botLogger)
export const requestLogger = new Category('request', botLogger)

const start = Telegraf.optional<BotContext>(ctx => !ctx.session.token, async (ctx) => {
  await moveToScene(AUTH)(ctx, '/')
})
const stop = Telegraf.optional<BotContext>(ctx => !!ctx.session.token, async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.session.menuMessageId)
  } catch (e) {
    console.log(e)
  }
  unbindNotification(ctx.chat.id.toString())
  ctx.session = {}
  await ctx.reply('Пока')
})

const localSession = new TelegrafSession({
  database: 'persist/sessions.json'
})

// @ts-ignore
initJobs(localSession.DB.value())

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

// bot.hears([REBOOT_SECRET], async (ctx) => {
//   await ctx.reply('Перезапуск...')
//   await bot.stop()
// })
bot.use(localSession.middleware())
bot.use(inputs.middleware())
bot.use(securedSearchMiddleware)
bot.use(securedMenuMiddleware)
bot.action(CLOSE_NOTIFICATION, ctx => ctx.deleteMessage(ctx.callbackQuery.message.message_id))
bot.start(start)
bot.command('menu', async (ctx) => {
  const menu = await menuMiddleware.replyToContext(ctx, menuMiddleware.rootTrigger)
  ctx.session.menuMessageId = menu?.message_id
})
bot.command('stop', stop)
bot.on('text', queryHandler)

bot.catch((e) => {
  console.log(e)
})
