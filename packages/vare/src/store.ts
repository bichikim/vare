import {ComputedRef, Ref, UnwrapRef} from '@vue/reactivity'
import {_triggerDevToolAction, _triggerDevToolMutation, _triggerDevToolInit} from './devtool'
import {createSubscribe, Subscribe} from './subscribe'
import {reactive, computed} from 'vue-demi'
import {trigger} from './observer-trigger'
import {AnyFunction, AnyObject, PromiseAnyFunc, State, DropParameters, OneAndAnyFunc} from './types'
import {executeFunctions} from 'src/execute-functions'
import {mayFunction} from './may-function'

let storeUid = 0

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

export const INIT = 'init'

export const ACTION = 'action'

export const MUTATION = 'mutation'

export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]

export const defaultSubscribeName = MUTATION

export type StoreSubscribeNames = 'init' | 'action' | 'mutation' | 'computation'

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

  defineMutation<T extends AnyFunction>(mutation: T, name?: string): T

  actions<T extends Record<string, ActionFunc>>(actionTree: T): T

  action<T extends PromiseAnyFunc>(action: T, name?: string): T

  computes<K extends string, F extends OneAndAnyFunc<S>>(memoTree: Record<K, F>, name?: string): Record<K, (...args: DropParameters<F, S>) => ComputedRef<ReturnType<F>>>

  compute<A extends any[], R>(memo: (state: S, ...args) => R, name?: string): (...args: A) => ComputedRef<R>

  defineAction<T extends PromiseAnyFunc>(action: T, name?: string): T

  clear(type: ClearNames): void
}

export type InitStateFunction<S> = () => S

export const createStore = <S extends AnyObject>(
  initState: S | InitStateFunction<S>,
  options: StoreOptions = {},
): Store<S> => {
  const {name: namespace = String(storeUid += 1)} = options
  const originalState = {...initState}
  const subscribe = createSubscribe<StoreSubscribeFunc<S>, StoreSubscribeNames>(
    storeSubscribeNames,
    defaultSubscribeName,
  )

  let reactiveState: UnwrapNestedRefs<S>

  const createReactiveState = () => {
    const reactiveState = reactive(mayFunction(initState))
    subscribe.trigger('init', namespace, [originalState], createReactiveState, createReactiveState)
    return reactiveState
  }

  reactiveState = createReactiveState()

  _triggerDevToolInit(namespace, reactiveState)

  const actMutation = trigger<StoreSubscribeNames, S>({
    namespace,
    before: subscribe.trigger,
    after: _triggerDevToolMutation,
    type: 'mutation',
    state: reactiveState,
    argsGetter: (args) => [reactiveState, ...args],
  })

  const actAction = trigger<StoreSubscribeNames, S>({
    namespace,
    before: subscribe.trigger,
    after: _triggerDevToolAction,
    type: 'action',
    state: reactiveState,
  })

  const actCompute = trigger<StoreSubscribeNames, S>({
    namespace,
    before: subscribe.trigger,
    type: 'computation',
    state: reactiveState,
    argsGetter: (args) => [reactiveState, ...args],
  })

  const compute = (memo, name) => actCompute(memo, (function_) => (...args) => computed(() => function_(...args)), name)

  const computes = (memoTree) => executeFunctions(memoTree, compute)

  const mutation = (mutation, name) => actMutation(mutation, undefined, name)

  const mutations = (mutationTree) => executeFunctions(mutationTree, mutation)

  const action = (action, name?) => actAction(action, undefined, name)

  const actions = (actionTree) => executeFunctions(actionTree, action)

  const clear = (type: ClearNames): void => {
    switch (type) {
      case 'state':
        reactiveState = createReactiveState()
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
    compute,
    computes,
    defineMutation: mutation,
    mutation,
    mutations,
    defineAction: action,
    action,
    actions,
    clear,
  })
}
