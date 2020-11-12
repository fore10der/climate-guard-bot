import { BotContext } from '../interfaces/bot'
import { MenuTemplate } from 'telegraf-inline-menu/dist/source'
import { Box } from '../interfaces'

export const BOX_MOCKS: Box[] = [
  {
    id: 227,
    chip_id: '24471e01-73db-427c-8478-d8b485017fd6',
    name: 'Коробка 1'
  },
  {
    id: 228,
    chip_id: '5b143343-2e9e-40b6-a09f-a862016a233d',
    name: 'Коробка 2'
  },
  {
    id: 229,
    chip_id: 'b411647a-20fc-4d12-a7de-98173921ce55',
    name: 'Коробка 3'
  },
  {
    id: 230,
    chip_id: 'b411647a-20fc-4d12-a7de-98173921ce55',
    name: 'Коробка 4'
  },
  {
    id: 231,
    chip_id: 'b411647a-20fc-4d12-a7de-98173921ce55',
    name: 'Коробка 5'
  },
  {
    id: 232,
    chip_id: 'b411647a-20fc-4d12-a7de-98173921ce55',
    name: 'Коробка 3'
  },
  {
    id: 223,
    chip_id: 'b411647a-20fc-4d12-a7de-98173921ce55',
    name: 'Коробка 3'
  }
]

export const mockMenu = new MenuTemplate<BotContext>(() => 'Mock')
