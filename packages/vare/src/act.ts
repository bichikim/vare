import {info} from '@/info'
import {AnyFunction} from '@/types'
import {createUuid, getIdentifier} from '@/utils'
import {ref} from 'vue-demi'
import {devtools} from './devtool'
import {subscribe, SubscribeMember} from './subscribe'

const actionUuid = createUuid('unknown')

export type ActionRecipe<Args extends any[], Return> = (...args: Args) => Return | Promise<Return>

export type ActionIdentifierName = 'action'

export const actionName: ActionIdentifierName = 'action'

export type ActionMember<Args extends any[] = any[]> = SubscribeMember<Args>

export type Action<Args extends any[], Return = any> =
  ((...args: Args) => Return | Promise<Return>)
  & ActionMember<Args>

export const isAction = (value?: any): value is Action<any> => {
  return getIdentifier(value) === actionName
}

const _act = <Args extends any[], Return> (
  recipe: ActionRecipe<Args, Return>,
  name?: string,
): Action<Args> => {
  const flag = ref<any[] | null>(null)
  const _name = name ?? actionUuid()

  const self: any = (...args: Args): Return | Promise<Return> => {
    flag.value = args
    return recipe(...args)
  }

  info.set(self, {
    name: _name,
    identifier: actionName,
    relates: new Set(),
    watchFlag: flag,
  })

  if (process.env.NODE_ENV === 'development') {
    subscribe(self, () => {
      devtools?.updateTimeline('action', {
        title: _name,
      })
    })
  }

  return self
}

const _treeAct = <K extends string, F extends AnyFunction> (
  tree: Record<K, F>,
): Record<K, (...args: Parameters<F>) => ReturnType<F>> => {
  return Object.keys(tree).reduce((result, name) => {
    result[name] = _act(tree[name], name)
    return result
  }, {} as Record<any, any>)
}

export function act<K extends string, F extends AnyFunction> (tree: Record<K, F>): Record<K, (...args: Parameters<F>) => ReturnType<F>>
export function act<Args extends any[], Return> (
  recipe: ActionRecipe<Args, Return>,
  name?: string,
): Action<Args>
export function act(
  mayTree,
  name?: any,
): any {
  if (typeof mayTree === 'function') {
    return _act(mayTree, name)
  }
  return _treeAct(mayTree)
}
