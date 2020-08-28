import {_triggerDevToolAction, _triggerDevToolMutation} from 'packages/vare/src/devtool'
import {ActionFunc} from 'packages/vare/src/Store'
import {Vare} from './Vare'
import {Ref, UnwrapRef, reactive} from 'vue'
import {createSubscribe, Subscribe} from './_subscribe'
import {AnyFunc, AnyObject, PromiseAnyFunc} from './types'
export const INIT = 'init'
export const ACTION = 'action'
export const MUTATION = 'mutation'
export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]
export const defaultSubscribeName = MUTATION
export type StoreSubscribeNames = 'init' | 'action' | 'mutation'
export type ClearNames = 'state' | StoreSubscribeNames
export type State<S> = S extends Ref ? S : UnwrapRef<S>
export type StoreSubscribeFunc<S> = (type: StoreSubscribeNames, name: string, args: any[], state: State<S>) => any

export interface StoreOptions<S extends AnyObject> {
  /**
   * @default 'unknown'
   */
  name?: string
  /**
   * @default true
   */
  vare?: Vare<any>

  stores?: S
}

interface Triggers<S, T> {
  called?: (type: StoreSubscribeNames, name: string, args: any[], original: T, wrapper: T) => any
  acted?: (namespace: string, name: string, args: any[], state: State<S>) => any
}

const triggerAction = <S>(namespace: string = 'unknown', {called, acted}: Triggers<S, any> = {}) =>
  (state: State<S>) =>
      < T extends PromiseAnyFunc>(action: T, name: string = 'unknown') => {
        const func: any = async (...args: any[]) => {
          if (called) {
            called('action', name, args, action, func)
          }
          const result = await action(...args)
          if (acted) {
            acted(namespace, name, args, state)
          }
          return result
        }

        return func as any
      }

const triggerMutation = <S>(namespace: string, {called, acted}: Triggers<S, any> = {}) =>
  (state: State<S>) =>
    <T extends AnyFunc>(mutation: T, name: string = 'unknown'): T => {
      const func: any = (...args: any[]) => {
        if (called) {
          called('mutation', name, args, mutation, func)
        }
        const result = mutation(...args)
        if (acted) {
          acted(namespace, name, args, state)
        }
        return result
      }
      return func as any
    }

export interface Store<S extends AnyObject, SS extends AnyObject> extends Subscribe<any, any> {
  readonly store: Readonly<SS>
  readonly state: State<S>

  mutations<T extends Record<string, AnyFunc>>(mutationTree: T): T
  mutation<T extends AnyFunc>(mutation: T, name?: string): T
  defineMutation<T extends AnyFunc>(mutation: T, name?: string): T
  actions<T extends Record<string, ActionFunc>>(actionTree: T): T
  action<T extends PromiseAnyFunc>(action: T, name?: string): T
  defineAction<T extends PromiseAnyFunc>(action: T, name?: string): T
  clear(type: ClearNames): void
}

export const createStore = <S extends AnyObject, SS extends AnyObject>(
  state: S,
  options: StoreOptions<SS> = {},
): Store<S, SS> => {
  const {name: namespace = 'unknown'} = options
  const originalState = {...state}
  const subscribe = createSubscribe<StoreSubscribeFunc<S>, StoreSubscribeNames>(
    storeSubscribeNames,
    defaultSubscribeName,
  )

  let reactiveState

  const initState = () => {
    reactiveState = reactive(originalState)
    subscribe.trigger('init', name, [originalState], initState, initState)
  }

  initState()

  const _mutation = triggerMutation<S>(namespace, {called: subscribe.trigger, acted: _triggerDevToolMutation})

  const _action = triggerAction<S>(namespace, {called: subscribe.trigger, acted: _triggerDevToolAction})

  const mutation = (mutation, name) => {
    return _mutation(reactiveState)(mutation, name)
  }

  const mutations = <T extends Record<string, AnyFunc>>(mutationTree: T): T => {
    return (
      Object.keys(mutationTree).reduce((tree: Record<string, any>, key) => {
        const value = mutationTree[key]
        tree[key] = mutation(value, key)
        return tree
      }, {})
    ) as any
  }

  const action = <T extends AnyFunc>(action: T, name?: string) => {
    return _action(reactiveState)(action, name)
  }

  const actions = <T extends Record<string, ActionFunc>>(actionTree: T): T => {
    return (
      Object.keys(actionTree).reduce((tree: Record<string, any>, key) => {
        const value = actionTree[key]
        tree[key] = action(value, key)
        return tree
      }, {})
    ) as any
  }

  return Object.freeze({
    ...subscribe,
    get state() {
      return reactiveState
    },
    get store() {
      return {} as SS
    },
    defineMutation: mutation,
    mutation,
    mutations,
    defineAction: action,
    action,
    actions,
    clear(type:ClearNames): void {
      switch (type) {
        case 'state':
          initState()
          return
        default:
          subscribe.clear(type)
      }
    },
  })
}
