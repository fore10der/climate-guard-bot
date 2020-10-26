import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext, Entity } from '../../interfaces/bot'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'
import { getID } from '../../utils/getters'
import { ClimateGuardApi } from '../../api'
import { Box } from '../../interfaces'
import { boxListView } from '../boxesView'

export const ROOM = 'room'

export const roomListView = new MenuTemplate<BotContext>(async (ctx, path) => {
  const id = getID(path)
  const { token } = ctx.session
  ctx.session.entities.box = new Entity<Box>()
  ctx.session.entities.room.list = await ClimateGuardApi.getRooms(id, token)
  return 'Комнаты'
})

roomListView.chooseIntoSubmenu(ROOM,
  buildChoicesList(ROOM),
  boxListView,
  buildChoicesOptions(ROOM, 'title_room')
)

roomListView.pagination(PAGINATE, buildPaginationOptions(ROOM))

roomListView.manualRow(BACK_BUTTONS)
