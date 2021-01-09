import { telegram } from '../bot'
import { scheduledJobs, scheduleJob } from 'node-schedule'
import { LocalStorage } from '../interfaces/bot'
import {ClimateGuardApi } from '../api'

const checkNotifications = (chatId: string, token: string) => {
  return async () => {
    const notifications = await ClimateGuardApi.getNotifications(token)
    console.log(JSON.stringify(notifications))
    await telegram.sendMessage(chatId, 'Это уведомление')
  }
}

export const bindNotification = (chatId: string, token: string) => {
  scheduleJob(chatId, '*/10 * * * *', checkNotifications(chatId, token)).invoke()
}

export const unbindNotification = (chatId: string) => {
  const job = scheduledJobs[chatId]
  job.cancel()
}

export const initJobs = (storage : LocalStorage) => {
  const sessions = storage.sessions
  for (const session of sessions) {
    const [chatId] = session.id.split(':')
    bindNotification(chatId, session.data.token)
  }
}