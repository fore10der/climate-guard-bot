import { ChooseIntoSubmenuOptions } from 'telegraf-inline-menu/dist/source/buttons/submenu'
import { BotContext, Entities } from '../interfaces/bot'
import { PaginationOptions } from 'telegraf-inline-menu/dist/source/buttons/pagination'

const OBJECTS_PER_PAGE = 5

export const buildChoicesList = (entityKey: keyof Entities) => {
  return function (ctx: BotContext) {
    const entity = ctx.session.entities[entityKey]
    return entity.list
      .slice(OBJECTS_PER_PAGE * (entity.page - 1), OBJECTS_PER_PAGE * entity.page)
      .map(item => item.id.toString())
  }
}

export function buildChoicesOptions (entityKey: keyof Entities, titleKey: string | string[], overwriteOptions: Partial<ChooseIntoSubmenuOptions<BotContext>> = {}) {
  const options: ChooseIntoSubmenuOptions<BotContext> = {
    buttonText: (ctx, key) => {
      const entity = ctx.session.entities[entityKey].list.find(group => group.id.toString() === key)
      if (Array.isArray(titleKey)) {
        for (const key of titleKey) {
          if (entity[key]) {
            return entity[key]
          }
        }
      } else {
        return entity[titleKey]
      }
    },
    columns: 1,
    ...overwriteOptions
  }
  return options
}

export function buildPaginationOptions (entityKey: keyof Entities) {
  const options: PaginationOptions<BotContext> = {
    getCurrentPage: ctx => ctx.session.entities[entityKey].page,
    setPage: (ctx, page) => { ctx.session.entities[entityKey].page = page },
    getTotalPages: ctx => Math.ceil(ctx.session.entities[entityKey].list.length / OBJECTS_PER_PAGE)
  }
  return options
}
