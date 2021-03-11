import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { TokenResponse } from './interfaces/token'
import { Box, Building, NotificationsResponse, Room } from '../interfaces'
import { PORTAL_URL } from '../settings'
import { requestLogger } from '../bot'
import { ErrorType } from 'typescript-logging'

const BASE_URL = PORTAL_URL

const buildHeaders = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export class ClimateGuardApi {
  static async auth (login: string, password: string) {
    const data = {
      email: login,
      password
    }
    const response = await axios.post<TokenResponse>(`${BASE_URL}/api/loginViaApi`, data)
    const result = response.data
    if (result.error) {
      throw Error(result.error)
    } else if (result.success) {
      return result.success.access_token
    } else {
      return false
    }
  }

  static async getBuildings (token: string) {
    try {
      const response = await axios.get<Building[]>(`${BASE_URL}/api/telegramBot/getBuildings`, buildHeaders(token))
      return response.data
    } catch (e) {
      requestLogger.info(e)
      return []
    }
  }

  static async getRooms (building_id: number, token: string) {
    try {
      const response = await axios.get<Room[]>(`${BASE_URL}/api/telegramBot/getRooms?building_id=${building_id}`, buildHeaders(token))
      return response.data
    } catch (e) {
      requestLogger.info(e)
      return []
    }
  }

  static async getBoxes (room_id: number, token: string) {
    try {
      const response = await axios.get<Box[]>(`${BASE_URL}/api/telegramBot/getBoxes?room_id=${room_id}`, buildHeaders(token))
      return response.data
    } catch (e) {
      requestLogger.info(e)
      return []
    }
  }

  static async getBoxLastData (box_id: number, token: string) {
    try {
      const response = await axios.get<Box>(`${BASE_URL}/api/telegramBot/getLastBoxData?box_id=${box_id}`, buildHeaders(token))
      return response.data
    } catch (e) {
      requestLogger.info(e)
      return {}
    }
  }

  static async searchBoxes (query: string, token: string) {
    try {
      const response = await axios.get<Box[]>(`${BASE_URL}/api/telegramBot/searchBoxes?name_or_uuid=${query}`, buildHeaders(token))
      return response.data
    } catch (e) {
      requestLogger.info(e)
    }
  }

  static async getNotifications (token: string, chatId: string) {
    try {
      const response = await axios.get<NotificationsResponse>(
          `${BASE_URL}/api/telegramBot/getNotifications?telegram_id=${chatId}`, buildHeaders(token)
      )
      return response.data
    } catch (e) {
      requestLogger.info(e)
    }
  }
}
