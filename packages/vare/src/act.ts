import {fireSubscribe, SUBSCRIPTIONS, SubscribeHook} from './subscribe'
import {AnyFunction} from './types'

export type ActionRecipe<Args extends any[], Return> = (...args: Args) => Return | Promise<Return>

export const ACTION_IDENTIFIER = Symbol('act')

export type Action<Args extends any[], Return = any> = (...args: Args) => Return & {
  [ACTION_IDENTIFIER]: boolean
  [SUBSCRIPTIONS]: Set<SubscribeHook<Args>>
}

export const isAction = (item?: AnyFunction): item is Action<any> => {
  return Boolean(item?.[ACTION_IDENTIFIER])
}

export const act = <Args extends any[], Return>(
  recipe: ActionRecipe<Args, Return>,
): Action<Args> => {
  const self = (...args: Args): Return | Promise<Return> => {
    fireSubscribe(self, ...args)
    return recipe(...args)
  }

  return Object.assign(self, {
    [ACTION_IDENTIFIER]: true,
    [SUBSCRIPTIONS]: new Set(),
  })
}
