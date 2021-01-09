import { createBackMainMenuButtons } from 'telegraf-inline-menu'
import { Markup } from 'telegraf'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'

export const BACK_BUTTONS = createBackMainMenuButtons('Назад', 'В главное меню')

export const PAGINATE = 'paginate'

export const HEARTS: object = {
  red: '❤️',
  orange: '🧡',
  yellow: '💛',
  green: '💚',
  blue: '💙',
  purple: '💜'
}

export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'

export const CLOSE_MARKUP = Markup.inlineKeyboard(
  [Markup.callbackButton('Закрыть', CLOSE_NOTIFICATION)]
)

export const CLOSE_EXTRA: ExtraEditMessage = {
  reply_markup: CLOSE_MARKUP,
  parse_mode: 'HTML'
}
