import {AnyFunction} from '@/types'
import {computed, nextTick, watch, WatchStopHandle} from 'vue-demi'
import {Action} from './act'
import {Computation, ComputationWritable} from './compute'
import {Mutation} from './mutate'
import {State} from './state'
import {VareMember, getName, getType} from '@/utils'
import {SUBSCRIPTIONS} from './symbol'

export type SubscribeHook<Args extends any[]> = (...args: Args) => any

export interface Subscribe<Callback extends AnyFunction, Type> {
  subscribe(callback: Callback, type?: Type): void

  unsubscribe(func: AnyFunction, type?: Type): void

  clear(type?: Type): void
}

export interface SubscribeMember extends VareMember {
  [SUBSCRIPTIONS]: Set<SubscribeHook<any>>
}

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

export const fireSubscribe = (target: SubscribeMember, ...args: any[]) => {
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
      console.error(`subscribe error target: ${getName(target)} ${target}, error: ${error}`)
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
  const type = getType(target)
  // when Mutation, Action or Computation
  if (type === 'mutation' || type === 'action') {
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
  const type = getType(target)
  // when Mutation, Action or Computation
  if (type === 'mutation' || type === 'action') {
    deleteSubscribe(target, hook)
    return
  }

  // state or any Ref
  stopWatchTarget(hook)
}
