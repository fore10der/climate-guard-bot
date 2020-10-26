import { telegram } from '../bot'
import { scheduledJobs, scheduleJob } from 'node-schedule'
import { LocalStorage } from '../interfaces/bot'

const checkNotifications = (chatId: string) => {
  return async () => {
    await telegram.sendMessage(chatId, 'Это уведомление')
  }
}

export const bindNotification = (chatId: string) => {
  scheduleJob(chatId, '*/1 * * * *', checkNotifications(chatId)).invoke()
}

export const unbindNotification = (chatId: string) => {
  const job = scheduledJobs[chatId]
  job.cancel()
}

export const initJobs = (storage : LocalStorage) => {
  const sessions = storage.sessions
  for (const session of sessions) {
    const [chatId] = session.id.split(':')
    bindNotification(chatId)
  }
}