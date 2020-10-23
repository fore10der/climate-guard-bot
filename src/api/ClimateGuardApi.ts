import axios, { AxiosError, AxiosInstance } from 'axios'
import { TokenResponse } from './interfaces/token'
import { Building } from '../interfaces'

export class ClimateGuardApi {
    private instance: AxiosInstance

    async auth (login: string, password: string) {
      const data = {
        email: login,
        password
      }
      const response = await this.instance.post<TokenResponse>('/api/loginViaApi', data)
      const result = response.data
      if (result.error) {
        throw Error(result.error)
      } else if (result.success) {
        this.instance.defaults.headers.common['Authorization'] = `Bearer ${result.success.access_token}`
        return true
      } else {
        return false
      }
    }

    async getBuildings () {
      const response = await this.instance.get<Building[]>('/api/telegramBot/getBuildings')
      return response.data
    }

    constructor () {
      this.instance = axios.create({
        baseURL: 'https://api.climateguard.info'
      })
      this.instance.interceptors.response.use((res) => res, (error: AxiosError) => error.response)
    }
}
