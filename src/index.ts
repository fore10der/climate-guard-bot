import { bot, botLogger } from './bot'

bot.launch().then(() => {
  botLogger.info('bot works')
})
