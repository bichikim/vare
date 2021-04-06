import {fireSubscribe, SubscribeHook} from './subscribe'
import {createUuid, getType, beVareMember, VareMember} from '@/utils'
import {SUBSCRIPTIONS} from './symbol'

const actionUuid = createUuid('unknown')

export type ActionRecipe<Args extends any[], Return> = (...args: Args) => Return | Promise<Return>

export type ActionIdentifierName = 'action'

export const actionName: ActionIdentifierName = 'action'

export interface ActionMember<Args extends any[]> extends VareMember {
  [SUBSCRIPTIONS]: Set<SubscribeHook<Args>>
}

export type Action<Args extends any[], Return = any> = ((...args: Args) => Return | Promise<Return>) & ActionMember<Args>

export const isAction = (value?: any): value is Action<any> => {
  return getType(value) === actionName
}

export const act = <Args extends any[], Return>(
  recipe: ActionRecipe<Args, Return>,
  name?: string,
): Action<Args> => {
  const self: any = (...args: Args): Return | Promise<Return> => {
    fireSubscribe(self, ...args)
    return recipe(...args)
  }

  const _name = name ?? actionUuid()

  const member = beVareMember<Action<Args>>(self, actionName, _name)

  return Object.assign(member, {
    [SUBSCRIPTIONS]: new Set(),
  })
}
