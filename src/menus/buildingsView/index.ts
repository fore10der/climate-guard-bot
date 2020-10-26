import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext, Entity } from '../../interfaces/bot'
import { ROOM, roomListView } from '../roomsView'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'
import { ClimateGuardApi } from '../../api'
import { Room } from '../../interfaces'

export const BUILDING = 'building'

export const buildingListView = new MenuTemplate<BotContext>(async (ctx) => {
  const { token } = ctx.session
  ctx.session.entities.room = new Entity<Room>()
  ctx.session.entities.building.list = await ClimateGuardApi.getBuildings(token)
  return 'Строения'
})

buildingListView.chooseIntoSubmenu(ROOM,
  buildChoicesList(BUILDING),
  roomListView,
  buildChoicesOptions(BUILDING, 'title_building')
)

buildingListView.pagination(PAGINATE, buildPaginationOptions(BUILDING))

buildingListView.manualRow(BACK_BUTTONS)
