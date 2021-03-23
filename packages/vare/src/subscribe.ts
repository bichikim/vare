import {AnyFunction} from '@/types'
import {computed, nextTick, watch, WatchStopHandle} from 'vue-demi'
import {Action, ACTION_IDENTIFIER, isAction} from './act'
import {Computation, ComputationWritable} from './compute'
import {isMutation, Mutation, MUTATION_IDENTIFIER} from './mutate'
import {State} from './state'

export type SubscribeHook<Args extends any[]> = (...args: Args) => any

export interface Subscribe<Callback extends AnyFunction, Type> {
  subscribe(callback: Callback, type?: Type): void

  unsubscribe(func: AnyFunction, type?: Type): void

  clear(type?: Type): void
}

export const SUBSCRIPTIONS = Symbol('hooks')

export type SubscribeTarget = Mutation<any> | Action<any> | Computation<any, any> | ComputationWritable<any, any>

export const setSubscribe = (target: SubscribeTarget, hook: SubscribeHook<any>) => {
  const hooks = target[SUBSCRIPTIONS]

  if (hooks) {
    hooks.add(hook)
  }
}

export const deleteSubscribe = (target: SubscribeTarget, hook: SubscribeHook<any>) => {
  const hooks = target[SUBSCRIPTIONS]

  if (hooks) {
    hooks.delete(hook)
  }
}

export const fireSubscribe = (target: SubscribeTarget, ...args: any[]) => {
  nextTick(() => {
    const hooks = target[SUBSCRIPTIONS]

    if (hooks) {
      hooks.forEach((hook) => {
        hook(...args)
      })
    }
  }).catch((error) => {
    // subscribe development error handling
    if (process.env.NODE_ENV === 'development') {
      console.error(`subscribe error target: ${target.name} ${target}, error: ${error}`)
    }
  })
}

export const watchHolder = new WeakMap<any, WatchStopHandle>()

export const watchTarget = (target: any, hook: SubscribeHook<any>) => {
  const stop = watch(computed(() => target), hook, {deep: true})
  watchHolder.set(hook, stop)
}

export const stopWatchTarget = (hook: SubscribeHook<any>) => {
  const stop = watchHolder.get(hook)

  if (stop) {
    stop()
  }
}

/**
 * start the subscription
 * @param mutation
 * @param hook
 */
export function subscribe<Args extends any[]>(mutation: Mutation<Args>, hook: SubscribeHook<Args>): void
export function subscribe<Args extends any[], Return = any>(action: Action<Args, Return>, hook: SubscribeHook<Args>): void
export function subscribe<Args extends any[], Return = any>(computation: Computation<Args, Return>, hook: SubscribeHook<Args>): void
export function subscribe<Args extends any[], Return = any>(computation: ComputationWritable<Args, Return>, hook: SubscribeHook<Args>): void
export function subscribe<T>(state: State<T>, hook: SubscribeHook<[T]>): void
export function subscribe(
  target,
  hook,
) {
  // when Mutation, Action or Computation
  if (isMutation(target) || isAction(target)) {
    setSubscribe(target, hook)
    return
  }

  // state or any Ref
  watchTarget(target, hook)
}

/**
 * stop the subscription
 * @param mutation
 * @param hook
 */
export function unsubscribe<Args extends any[]>(mutation: Mutation<Args>, hook: SubscribeHook<Args>): void
export function unsubscribe<Args extends any[], Return = any>(action: Action<Args, Return>, hook: SubscribeHook<Args>): void
export function unsubscribe<Args extends any[], Return = any>(computation: Computation<Args, Return>, hook: SubscribeHook<Args>): void
export function unsubscribe<Args extends any[], Return = any>(computation: ComputationWritable<Args, Return>, hook: SubscribeHook<Args>): void
export function unsubscribe<T>(state: State<T>, hook: SubscribeHook<[T]>): void
export function unsubscribe(target, hook) {
  // when Mutation, Action or Computation
  if (target[MUTATION_IDENTIFIER] || target[ACTION_IDENTIFIER]) {
    deleteSubscribe(target, hook)
    return
  }

  // state or any Ref
  stopWatchTarget(hook)
}
