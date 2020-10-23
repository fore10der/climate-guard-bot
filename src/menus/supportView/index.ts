import { BACK_BUTTONS } from '../../constants'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source/menu-template'
import { BotContext } from '../../interfaces/bot'

interface LinkButton {
    text: string
    url: string
}

export const SUPPORT = 'support'

const LINKS: LinkButton[][] = [
  [
    {
      text: 'Заказать',
      url: 'https://climateguard.ru/#preorder'
    },
    {
      text: 'Сообщество',
      url: 'https://www.facebook.com/ClimateGuard/'
    }
  ]
]

export const supportView = new MenuTemplate<BotContext>(() => {
  return 'Наши контакты'
})

LINKS.forEach((row) => {
  row.forEach((link, key) => {
    supportView.url(link.text, link.url, {
      joinLastRow: !!key
    })
  })
})

supportView.manualRow(BACK_BUTTONS)
