import { BotContext } from '../interfaces/bot'
import { menuMiddleware } from '../menus'

export const moveToScene = (sceneId: string, action: string = '') => {
  return async (ctx: BotContext, key) => {
    ctx.session.path = key.replace(action, '')
    await ctx.scene.enter(sceneId)
    return false
  }
}

export const backToMenu = async (ctx: BotContext) => {
  await ctx.scene.leave()
  return menuMiddleware.replyToContext(ctx, ctx.session.path)
}
