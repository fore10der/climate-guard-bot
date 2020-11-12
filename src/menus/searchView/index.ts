import { BACK_BUTTONS, PAGINATE } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext, Entity } from '../../interfaces/bot'
import { buildChoicesList, buildChoicesOptions, buildPaginationOptions } from '../../utils/builders'
import { BOX_MOCKS } from '../../__mocks__/search'
import { boxDetailView } from '../boxesView/detail'
import { Telegraf } from 'telegraf'
import { BOX } from '../boxesView'
import { editMenuOnContext, replyMenuToContext } from 'telegraf-inline-menu'
import { mainMenu, menuMiddleware } from '../index'
import { Box } from '../../interfaces'

export const SEARCH = 'search'

export const searchView = new MenuTemplate<BotContext>(async (ctx, path) => {
  ctx.session.entities.box = new Entity<Box>()
  ctx.session.entities.box.list = BOX_MOCKS.filter((box) => (box.chip_id.includes(ctx.session.searchQuery) || box.name.includes(ctx.session.searchQuery)))
  return 'Коробки'
})

searchView.chooseIntoSubmenu(BOX,
  buildChoicesList(BOX),
  boxDetailView,
  buildChoicesOptions(BOX, ['name', 'chip_id'])
)

searchView.pagination(PAGINATE, buildPaginationOptions(BOX))

export const queryHandler = Telegraf.optional<BotContext>((ctx) => !!ctx.session.token, async ctx => {
  ctx.session.searchQuery = ctx.message.text
  await menuMiddleware.replyToContext(ctx, '/search/')
})
