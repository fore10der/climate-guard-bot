import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext } from '../../interfaces/bot'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'
import { getID } from '../../utils/getters'
import { ClimateGuardApi } from '../../api'
import { boxDetailView } from './detail'

export const BOX = 'box'

export const boxListView = new MenuTemplate<BotContext>(async (ctx, path) => {
  const id = getID(path)
  const { token } = ctx.session
  ctx.session.entities.box.list = await ClimateGuardApi.getBoxes(id, token)
  return 'Коробки'
})

boxListView.chooseIntoSubmenu(BOX,
  buildChoicesList(BOX),
  boxDetailView,
  buildChoicesOptions(BOX, ['name', 'chip_id'])
)

boxListView.pagination(PAGINATE, buildPaginationOptions(BOX))

boxListView.manualRow(BACK_BUTTONS)
