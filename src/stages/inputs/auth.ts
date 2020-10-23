import WizardScene from 'telegraf/scenes/wizard'
import { BaseScene } from 'telegraf'
import { BotContext } from '../../interfaces/bot'
import { ClimateGuardApi } from '../../api'
import { backToMenu } from '../../utils'

export const AUTH = 'AUTH'

const mapResultAction = async (result: boolean, ctx: BotContext) => {
  if (result) {
    ctx.session.entities = {}
    return backToMenu(ctx)
  } else {
    await ctx.reply('Неизвестная ошибка')
  }
}

export const auth: BaseScene<BotContext> = new WizardScene(
  AUTH,
  async (ctx: BotContext) => {
    await ctx.reply('Добро пожаловать в бота ClimateGuardBot')
    await ctx.reply('Введите логин')
    return ctx.wizard.next()
  },
  async (ctx: BotContext) => {
    const text = ctx.message && ctx.message.text
    if (text) {
      ctx.scene.state['login'] = text
      await ctx.reply('Ввведите пароль')
      return ctx.wizard.next()
    } else {
      return ctx.wizard.back()
    }
  },
  async (ctx: BotContext) => {
    const text = ctx.message && ctx.message.text
    if (text) {
      ctx.scene.state['password'] = text
      const state = ctx.scene.state
      ctx.session.api = new ClimateGuardApi()
      let result
      try {
        result = await ctx.session.api.auth(state['login'], state['password'])
      } catch (e) {
        await ctx.reply(e.message)
        await ctx.reply('Введите логин')
        return ctx.wizard.back()
      }
      await mapResultAction(result, ctx)
    } else {
      return ctx.wizard.back()
    }
  }
)
