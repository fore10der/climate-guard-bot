import { BACK_BUTTONS, HEARTS } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext } from '../../interfaces/bot'
import { getID } from '../../utils/getters'
import { ClimateGuardApi } from '../../api'
import { Box } from '../../interfaces'
import moment from 'moment'

const buildBoxLastData = (boxDetail: Box) => {
  const date = moment(boxDetail.measured_at * 1000).format('YYYY-MM-DD hh:mm')
  let text = ''
  text += `Отчет от: ${date}\n`
  text += 'Параметры:\n\n'
  const measures = boxDetail.all_data || {}
  for (const [_, measure] of Object.entries(measures)) {
    text += measure.label + ': ' + (+measure.value).toFixed(1) + ' ' + measure.measure + ' ' + HEARTS[measure.color] + '\n'
  }
  return text
}

export const boxDetailView = new MenuTemplate<BotContext>(async (ctx, path) => {
  const id = getID(path)
  ctx.session.entities.box.detail = await ClimateGuardApi.getBoxLastData(id, ctx.session.token)
  const text = buildBoxLastData(ctx.session.entities.box.detail as Box)
  return {
    text,
    parse_mode: 'HTML'
  }
})

boxDetailView.manualRow(BACK_BUTTONS)
