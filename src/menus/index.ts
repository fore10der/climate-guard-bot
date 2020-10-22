import { BotContext } from '../interfaces/bot'
import { MenuMiddleware } from 'telegraf-inline-menu/dist/source/menu-middleware'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { Telegraf } from 'telegraf'

export const mainMenu = new MenuTemplate<BotContext>((ctx) => {
  return 'Добро пожаловать'
})

export const menuMiddleware = new MenuMiddleware('/', mainMenu)
export const securedMenuMiddleware = Telegraf.optional((ctx) => !!ctx.session.api, menuMiddleware.middleware())
