import {SubscribeMember, WATCH_FLAG} from './subscribe'
import {createUuid, getType, beVareMember} from '@/utils'
import {ref} from 'vue-demi'

const actionUuid = createUuid('unknown')

export type ActionRecipe<Args extends any[], Return> = (...args: Args) => Return | Promise<Return>

export type ActionIdentifierName = 'action'

export const actionName: ActionIdentifierName = 'action'

export type ActionMember<Args extends any[] = any[]> = SubscribeMember<Args>

export type Action<Args extends any[], Return = any> = ((...args: Args) => Return | Promise<Return>) & ActionMember<Args>

export const isAction = (value?: any): value is Action<any> => {
  return getType(value) === actionName
}

export const act = <Args extends any[], Return>(
  recipe: ActionRecipe<Args, Return>,
  name?: string,
): Action<Args> => {
  const flag = ref<any[] | null>(null)
  const _name = name ?? actionUuid()

  const self: any = (...args: Args): Return | Promise<Return> => {
    flag.value = args
    return recipe(...args)
  }

  const member = beVareMember<Action<Args>>(self, actionName, _name)

  return Object.assign(member, {
    [WATCH_FLAG]: flag,
  })
}
