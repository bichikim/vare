import {_triggerDevToolAction, _triggerDevToolInit, _triggerDevToolMutation} from '@/devtool'
import {executeFunctions} from '@/execute-functions'
import {mayFunction} from '@/may-function'
import {act} from '@/observer-trigger'
import {createSubscribe, Subscribe} from '@/subscribe'
import {AnyFunction, AnyObject, DropParameters, OneAndAnyFunc, PromiseAnyFunc, State} from '@/types'
import {getUnknownName} from '@/uid'
import {ComputedRef} from '@vue/reactivity'
import {computed, reactive} from 'vue-demi'
import {ACTION, INIT, MUTATION} from './names'
import {ActionFunc, ClearNames, StoreOptions, StoreSubscribeFunc, StoreSubscribeNames, UnwrapNestedRefs} from './types'

export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]

export const defaultSubscribeName = MUTATION

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
  const {name: namespace = getUnknownName()} = options
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

  const compute: AnyFunction = act({
    before: (args, name) => subscribe.trigger('computation', name, args),
  })((function_) => (...args) => computed(() => function_(...args)))([reactiveState])

  const computes = (memoTree) => executeFunctions(memoTree, compute)

  const mutation: AnyFunction = act({
    before: (args, name) => subscribe.trigger('mutation', name, args),
    after: (args, result, name) => _triggerDevToolMutation(namespace, name, args, reactiveState),
  })()([reactiveState])

  const mutations = (mutationTree) => executeFunctions(mutationTree, mutation)

  const action: AnyFunction = act({
    before: (args, name) => subscribe.trigger('action', name, args, reactiveState),
    after: (args, result, name) => _triggerDevToolAction(namespace, name, args, reactiveState),
  })()([])

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
