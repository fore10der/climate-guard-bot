import { BotContext, Entity } from '../interfaces/bot'
import { MenuMiddleware } from 'telegraf-inline-menu/dist/source/menu-middleware'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { Telegraf } from 'telegraf'
import { SUPPORT, supportView } from './supportView'
import { BUILDING, buildingListView } from './buildingsView'
import { Building } from '../interfaces'
import { SEARCH, searchView } from './searchView'

export const mainMenu = new MenuTemplate<BotContext>((ctx) => {
  ctx.session.entities.building = new Entity<Building>()
  return 'Добро пожаловать'
})

mainMenu.submenu('Поддержка', SUPPORT, supportView)
mainMenu.submenu('Строения', BUILDING, buildingListView)
mainMenu.submenu('Поиск', SEARCH, searchView, {
  hide: () => true
})

export const menuMiddleware = new MenuMiddleware('/', mainMenu)
export const securedMenuMiddleware = Telegraf.optional((ctx) => !!ctx.session.token, menuMiddleware.middleware())
