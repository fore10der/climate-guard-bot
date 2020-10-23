import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext } from '../../interfaces/bot'
import { ROOM } from '../roomsView'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'

export const BUILDING = 'building'

export const buildingsView = new MenuTemplate<BotContext>(async (ctx) => {
  const { api } = ctx.session
  ctx.session.entities.building.list = await api.getBuildings()
  return 'Строения'
})

buildingsView.chooseIntoSubmenu(ROOM,
  buildChoicesList(BUILDING),
  new MenuTemplate('Мок'),
  buildChoicesOptions(BUILDING, 'title_building')
)

buildingsView.pagination(PAGINATE, buildPaginationOptions(BUILDING))

buildingsView.manualRow(BACK_BUTTONS)
