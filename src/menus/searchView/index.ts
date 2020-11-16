import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext, Entity } from '../../interfaces/bot'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'
import { BOX_MOCKS } from '../../__mocks__/search'
import { boxDetailView } from '../boxesView/detail'
import { Telegraf } from 'telegraf'
import { BOX } from '../boxesView'
import { editMenuOnContext, replyMenuToContext, resendMenuToContext } from 'telegraf-inline-menu'
import { mainMenu, menuMiddleware } from '../index'
import { Box } from '../../interfaces'
import { ClimateGuardApi } from '../../api'
import { MenuMiddleware } from 'telegraf-inline-menu/dist/source/menu-middleware'
import { BUILDING } from '../buildingsView'

export const SEARCH = 'search'

const buildBoxPath = (boxId: number, roomId: number, buildingId: number) => {
  return `/entities/building:${buildingId}/room:${roomId}/box:${boxId}/`
}

export const searchView = new MenuTemplate<BotContext>(async (ctx, path) => {
  ctx.session.entities.box = new Entity<Box>()
  ctx.session.entities.box.list = await ClimateGuardApi.searchBoxes(ctx.session.searchQuery, ctx.session.token)
  if (ctx.session.entities.box.list.length === 0) {
    return 'По данному запросу коробки не найдены'
  }
  return 'Результаты поиска по коробкам'
})

searchView.choose(BUILDING,
  buildChoicesList(BOX),
  {
    ...buildChoicesOptions(BOX, ['name', 'chip_id']),
    do: async (ctx, key) => {
      const box: Box = ctx.session.entities.box.list.find(box => box.id.toString() === key) as Box
      console.log(buildBoxPath(box.id, box.room_id, box.building_id))
      return true
    }
  })

searchView.pagination(PAGINATE, buildPaginationOptions(BOX))

export const searchMiddleware = new MenuMiddleware('/search/', searchView)

export const queryHandler = Telegraf.optional<BotContext>((ctx) => !!ctx.session.token, async ctx => {
  ctx.session.searchQuery = ctx.message.text
  return searchMiddleware.replyToContext(ctx, searchMiddleware.rootTrigger)
})
