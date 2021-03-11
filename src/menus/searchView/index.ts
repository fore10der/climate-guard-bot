import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext } from '../../interfaces/bot'
import { Telegraf } from 'telegraf'
import { editMenuOnContext, MenuMiddleware, replyMenuToContext } from 'telegraf-inline-menu'
import { ClimateGuardApi } from '../../api'
import { buildChoicesList, buildChoicesOptions } from '../../utils/builders'
import { BOX, boxListView } from '../boxesView'
import { boxDetailView } from '../boxesView/detail'

export const SEARCH = 'search'

export const searchView = new MenuTemplate<BotContext>(async (ctx, path) => {
  ctx.session.entities.box.list = await ClimateGuardApi.searchBoxes(ctx.session.searchQuery, ctx.session.token)
  if (ctx.session.entities.box.list.length === 0) {
    return 'По данному запросу коробки не найдены'
  }
  return 'Результаты поиска по коробкам'
})

searchView.chooseIntoSubmenu(BOX,
  buildChoicesList(BOX),
  boxDetailView,
  buildChoicesOptions(BOX, ['name', 'chip_id'])
)

const searchMiddleware = new MenuMiddleware('/search/', searchView)
export const securedSearchMiddleware = Telegraf.optional((ctx) => !!ctx.session.token, searchMiddleware.middleware())

export const queryHandler = Telegraf.optional<BotContext>((ctx) => !!ctx.session.token, async ctx => {
  ctx.session.searchQuery = ctx.message.text

  return searchMiddleware.replyToContext(ctx, searchMiddleware.rootTrigger)
})
