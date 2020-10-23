import { Context } from 'telegraf'
import { SceneContextMessageUpdate } from 'telegraf/typings/stage'
import { ClimateGuardApi } from '../api'
import { Building } from './entity'

type BaseBotContext = Context & SceneContextMessageUpdate;

export class Entity<T> {
    list: T[]
    page: number

    constructor () {
      this.list = []
      this.page = 1
    }
}

export interface Entities {
    building?: Entity<Building>
}

export interface BotSession {
    path?: string
    api?: ClimateGuardApi
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
