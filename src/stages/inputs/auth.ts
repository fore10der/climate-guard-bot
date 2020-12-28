import WizardScene from 'telegraf/scenes/wizard'
import { BaseScene, Extra, Markup } from 'telegraf'
import { BotContext } from '../../interfaces/bot'
import { ClimateGuardApi } from '../../api'
import { backToMenu, bindNotification } from '../../utils'

export const AUTH = 'AUTH'

const mapResultAction = async (result: string, ctx: BotContext) => {
  if (result) {
    ctx.session.token = result
    ctx.session.entities = {}
    bindNotification(ctx.chat.id.toString())
    return backToMenu(ctx)
  } else {
    await ctx.reply('Неизвестная ошибка')
  }
}

export const auth: BaseScene<BotContext> = new WizardScene(
  AUTH,
  async (ctx: BotContext) => {
    await ctx.reply('Добро пожаловать в бота ClimateGuardBot', Extra.markup(Markup.removeKeyboard()))
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
      let result
      try {
        result = await ClimateGuardApi.auth(state['login'], state['password'])
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
