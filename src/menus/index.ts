import { BotContext, Entity } from '../interfaces/bot'
import { MenuMiddleware } from 'telegraf-inline-menu/dist/source/menu-middleware'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { Telegraf } from 'telegraf'
import { SUPPORT, supportView } from './supportView'
import { buildingListView } from './buildingsView'
import { Box, Building, Room } from '../interfaces'
import { SEARCH, searchView } from './searchView'

const ENTITIES = 'entities'

export const mainMenu = new MenuTemplate<BotContext>((ctx) => {
  ctx.session.entities.building = new Entity<Building>()
  ctx.session.entities.room = new Entity<Room>()
  ctx.session.entities.box = new Entity<Box>()
  return 'Добро пожаловать'
})

mainMenu.submenu('Поддержка', SUPPORT, supportView)
mainMenu.submenu('Строения', ENTITIES, buildingListView)
mainMenu.submenu('Поиск', SEARCH, searchView, { hide: () => true })

export const menuMiddleware = new MenuMiddleware('/', mainMenu)
export const securedMenuMiddleware = Telegraf.optional((ctx) => !!ctx.session.token, menuMiddleware.middleware())
