import { telegram } from '../bot'
import { scheduledJobs, scheduleJob } from 'node-schedule'
import { LocalStorage } from '../interfaces/bot'
import { ClimateGuardApi } from '../api'
import { RegularNotification } from '../interfaces'
import { CLOSE_EXTRA, HEARTS } from '../constants'
import moment from 'moment'

const buildHeader = (boxTitle: string, roomTitle: string, buildingTitle: string, from: string, to: string): string => {
  let text: string = `Устройство: ${boxTitle}\n`
  text += `Комната: ${roomTitle}\n`
  text += `Строение: ${buildingTitle}\n`
  text += `ДАННЫЕ ЗА ПЕРИОД ${moment(from).format('hh:mm:ss DD.MM.YYYY')} - ${moment(to).format('hh:mm:ss DD.MM.YYYY')}\n`
  return text
}

const buildRegularNotification = (notifications: RegularNotification[], header: string): string => {
  let text = 'РЕГУЛЯРНОЕ УВЕДОМЛЕНИЕ\n'
  text += header
  text += 'ПАРАМЕТРЫ:\n'
  for (const notification of notifications) {
    text += `<b>${notification.label}</b>\n`
    text += `Максимальное значение: ${notification.max.value} ${notification.measure} ${HEARTS[notification.max.color] ? HEARTS[notification.max.color] : ''}`
    text += '\n'
    text += `Минимальное значение: ${notification.min.value} ${notification.measure} ${HEARTS[notification.min.color] ? HEARTS[notification.min.color] : ''}`
    text += '\n'
  }
  return text
}

const checkNotifications = (chatId: string, token: string) => {
  return async () => {
    const notifications = await ClimateGuardApi.getNotifications(token)
    if (notifications?.data) {
      const notificationsData = notifications.data || []
      for (const node of notificationsData) {
        const header = buildHeader(
          node.name || node.uuid,
          node.room_title || node.room_id.toLocaleString(),
          node.building_title || node.building_id.toLocaleString(),
          notifications.last_reported,
          notifications.reported_at
        )
        const regularNotifications = node?.notifications?.regular || []
        // const eventNotifications = node?.notifications?.event || []
        if (regularNotifications.length) {
          await telegram.sendMessage(chatId, buildRegularNotification(regularNotifications,
            header
          ), CLOSE_EXTRA)
        }
      }
    }
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
