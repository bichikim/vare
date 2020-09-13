import {_triggerDevToolAction, _triggerDevToolMutation} from '@/devtool'
import {createSubscribe, Subscribe} from '@/subscribe'
import {reactive} from 'vue'
import {createStateTrigger} from './trigger'
import {AnyFunc, AnyObject, PromiseAnyFunc, State} from './types'
import {Vare} from 'packages/vare/src/classes/Vare'

export const INIT = 'init'
export const ACTION = 'action'
export const MUTATION = 'mutation'
export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]
export const defaultSubscribeName = MUTATION
export type StoreSubscribeNames = 'init' | 'action' | 'mutation'
export type ClearNames = 'state' | StoreSubscribeNames
export type ActionFunc = (...args: any[]) => PromiseLike<any> | any

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

  const actMutation = createStateTrigger<StoreSubscribeNames, S>(
    namespace,
    {called: subscribe.trigger, acted: _triggerDevToolMutation},
    'mutation',
  )(reactiveState)

  const actAction = createStateTrigger<StoreSubscribeNames, S>(
    namespace,
    {called: subscribe.trigger, acted: _triggerDevToolAction},
    'action',
  )(reactiveState)

  const mutation = (mutation, name) => {
    return actMutation(mutation, name)
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
    return actAction(action, name)
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

  const clear = (type: ClearNames): void => {
    switch (type) {
      case 'state':
        initState()
        return
      default:
        subscribe.clear(type)
    }
  }

  return Object.freeze({
    ...subscribe,
    get state() {
      return reactiveState
    },
    get store() {
      // todo it needs store tree
      return {} as SS
    },
    defineMutation: mutation,
    mutation,
    mutations,
    defineAction: action,
    action,
    actions,
    clear,
  })
}
