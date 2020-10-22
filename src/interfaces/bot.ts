import { Context } from 'telegraf'
import { SceneContextMessageUpdate } from 'telegraf/typings/stage'
import { ClimateGuardApi } from '../api/ClimateGuardApi'

type BaseBotContext = Context & SceneContextMessageUpdate;

export interface BotSession {
    path?: string
    api?: ClimateGuardApi
}

interface Wizard {
    next: () => void
    back: () => void
}

export interface BotContext extends BaseBotContext {
    session: BotSession;
    wizard: Wizard;
}
