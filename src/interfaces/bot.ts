import { Context } from 'telegraf'
import { SceneContextMessageUpdate } from 'telegraf/typings/stage'
import { BaseEntity } from './entity'

type BaseBotContext = Context & SceneContextMessageUpdate;

export class Entity<T> {
    list: T[]
    page: number
    detail: T

    constructor () {
      this.list = []
      this.detail = null
      this.page = 1
    }
}

export interface Entities {
    [key: string]: Entity<BaseEntity>
}

export interface BotSession {
    path?: string
    token?: string,
    menuMessageId?: number
    entities?: Entities
}

interface Wizard {
    next: () => void
    back: () => void
}

export interface BotContext extends BaseBotContext {
    session: BotSession;
    wizard: Wizard;
}

export interface StorageInstance {
    id: string
}

export interface LocalStorage {
    sessions: StorageInstance[]
}
