import { telegram } from '../bot'
import { scheduledJobs, scheduleJob } from 'node-schedule'
import { LocalStorage } from '../interfaces/bot'
import { ClimateGuardApi } from '../api'
import { EventNotification, RegularNotification } from '../interfaces'
import { CLOSE_EXTRA, HEARTS } from '../constants'
import moment from 'moment'

const buildHeader = (boxTitle: string, roomTitle: string, buildingTitle: string, from: string, to?: string): string => {
  let text: string = ''
  if (to) {
    text += `Период: ${moment(from).format('hh:mm DD.MM.YY')} - ${moment(to).format('hh:mm DD.MM.YY')}\n`
  } else {
    text += `Время: ${moment(from).format('hh:mm DD.MM.YY')}\n`
  }
  text += `Устройство: ${boxTitle}\n`
  text += `Комната: ${roomTitle}\n`
  text += `Строение: ${buildingTitle}\n\n`
  return text
}

const buildRegularNotification = (notifications: RegularNotification[], header: string): string => {
  let text = '<u>РЕГУЛЯРНОЕ УВЕДОМЛЕНИЕ</u>\n'
  text += header
  for (const notification of notifications) {
    text += `<b>${notification.label}</b>\n`
    text += `Мин: ${notification.min.value} ${notification.measure} ${HEARTS[notification.min.color] ? HEARTS[notification.min.color] : ''}`
    text += '\n'
    text += `Макс: ${notification.max.value} ${notification.measure} ${HEARTS[notification.max.color] ? HEARTS[notification.max.color] : ''}`
    text += '\n'
  }
  return text
}

const buildEventNotification = (notification: EventNotification, header: string): string => {
  let text = '<u>СОБЫТИЙНОЕ УВЕДОМЛЕНИЕ</u>\n'
  text += `<b>${notification.label}</b>: `
  text += `${notification.value} ${notification.measure} ${HEARTS[notification.color] ? HEARTS[notification.color] : ''}\n`
  // text += `Описание: ${notification.description}\n`
  text += header
  text += '\n'
  return text
}

const checkNotifications = (chatId: string, token: string) => {
  return async () => {
    const notifications = await ClimateGuardApi.getNotifications(token)
    console.log(notifications)
    if (notifications?.data) {
      const notificationsData = notifications.data || []
      for (const node of notificationsData) {
        const regularNotifications = node?.notifications?.regular || []
        const eventNotifications = node?.notifications?.event || []
        if (regularNotifications.length) {
          const header = buildHeader(
            node.name || node.uuid,
            node.room_title || node.room_id.toLocaleString(),
            node.building_title || node.building_id.toLocaleString(),
            notifications.last_reported,
            notifications.reported_at
          )
          await telegram.sendMessage(chatId, buildRegularNotification(regularNotifications,
            header
          ), CLOSE_EXTRA)
        }
        for (const notification of eventNotifications) {
          if (notification.type !== 'noMeasurements') {
            const header = buildHeader(
              node.name || node.uuid,
              node.room_title || node.room_id.toLocaleString(),
              node.building_title || node.building_id.toLocaleString(),
              notification.event_time
            )
            await telegram.sendMessage(chatId, buildEventNotification(notification,
              header
            ), CLOSE_EXTRA)
          }
        }
      }
    }
  }
}

export const bindNotification = (chatId: string, token: string, skipInvoke?: boolean) => {
  const job = scheduleJob(chatId, '*/10 * * * *', checkNotifications(chatId, token))
  if (!skipInvoke) {
    job.invoke()
  }
}

export const unbindNotification = (chatId: string) => {
  const job = scheduledJobs[chatId]
  job.cancel()
}

export const initJobs = (storage : LocalStorage) => {
  const sessions = storage.sessions
  for (const session of sessions) {
    const [chatId] = session.id.split(':')
    bindNotification(chatId, session.data.token, true)
  }
}
