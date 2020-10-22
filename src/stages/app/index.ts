import { BaseScene } from 'telegraf'
import { menuMiddleware } from '../../menus'
import { BotContext } from '../../interfaces/bot'

const APP = 'APP'

export const app = new BaseScene<BotContext>(APP)

app.enter((ctx) => menuMiddleware.replyToContext(ctx, ctx.session.path))
app.command('stop', async (ctx) => {
  ctx.session = {}
  await ctx.reply('Пока')
  await ctx.scene.leave()
})
