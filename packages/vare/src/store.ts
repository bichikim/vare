import {_triggerDevToolAction, _triggerDevToolMutation, _triggerDevToolInit} from '@/devtool'
import {createSubscribe, Subscribe} from '@/subscribe'
import {reactive} from 'vue-demi'
import {createObserverTrigger} from './observer-trigger'
import {AnyFunc, AnyObject, PromiseAnyFunc, State, DropParameters, OneAndAnyFunc} from './types'
import {wraps} from '@/utils'

export const INIT = 'init'
export const ACTION = 'action'
export const MUTATION = 'mutation'
export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]
export const defaultSubscribeName = MUTATION
export type StoreSubscribeNames = 'init' | 'action' | 'mutation'
export type ClearNames = 'state' | StoreSubscribeNames
export type ActionFunc = (...args: any[]) => PromiseLike<any> | any

export type StoreSubscribeFunc<S> = (type: StoreSubscribeNames, name: string, args: any[], state: State<S>) => any

export interface StoreOptions {
  /**
   * @default 'unknown'
   */
  name?: string
}

export interface Store<S extends AnyObject> extends Subscribe<any, any> {
  readonly state: State<S>

  mutations<K extends string, F extends OneAndAnyFunc<S>>(mutationTree: Record<K, F>): Record<K, (...args: DropParameters<F, S>) => ReturnType<F>>

  mutation<A extends any[], R>(mutation: (state: S, ...args: A) => R, name?: string): (...args: A) => R

  defineMutation<T extends AnyFunc>(mutation: T, name?: string): T

  actions<T extends Record<string, ActionFunc>>(actionTree: T): T

  action<T extends PromiseAnyFunc>(action: T, name?: string): T

  defineAction<T extends PromiseAnyFunc>(action: T, name?: string): T

  clear(type: ClearNames): void
}

export const createStore = <S extends AnyObject>(
  state: S,
  options: StoreOptions = {},
): Store<S> => {
  const {name: namespace = 'unknown'} = options
  const originalState = {...state}
  const subscribe = createSubscribe<StoreSubscribeFunc<S>, StoreSubscribeNames>(
    storeSubscribeNames,
    defaultSubscribeName,
  )

  let reactiveState = reactive(originalState)

  const initState = () => {
    reactiveState = reactive(originalState)
    subscribe.trigger('init', namespace, [originalState], initState, initState)
  }

  initState()

  _triggerDevToolInit(reactiveState)

  const actMutation = createObserverTrigger<StoreSubscribeNames, S>({
    namespace,
    triggers: {called: subscribe.trigger, acted: _triggerDevToolMutation},
    type: 'mutation',
    state: reactiveState,
    firstArgs: [reactiveState],
  })

  const actAction = createObserverTrigger<StoreSubscribeNames, S>({
    namespace,
    triggers: {called: subscribe.trigger, acted: _triggerDevToolAction},
    type: 'action',
    state: reactiveState,
  })

  const mutation = (mutation, name) => actMutation(mutation, name)

  const mutations = <K extends string, F extends OneAndAnyFunc<S>>(
    mutationTree: Record<K, F>,
  ): Record<K, (...args: DropParameters<F, S>) => ReturnType<F>> => wraps(mutationTree, mutation)

  const action = <T extends AnyFunc>(action: T, name?: string) => actAction(action, name)

  const actions = <T extends Record<string, ActionFunc>>(actionTree: T): T => wraps(actionTree, action)

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
    defineMutation: mutation,
    mutation,
    mutations,
    defineAction: action,
    action,
    actions,
    clear,
  })
}
