import { BotContext } from '../../interfaces/bot'
import { Stage } from 'telegraf'
import { auth } from './auth'

export const inputs = new Stage<BotContext>([auth])
