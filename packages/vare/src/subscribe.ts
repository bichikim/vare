import {UnwrapNestedRefs} from '@/types'
import {computed, watch, WatchStopHandle, Ref, WatchCallback, ComputedRef} from 'vue-demi'
import {Action} from './act'
import {Computation, ComputationWritable} from './compute'
import {Mutation} from './mutate'
import {VareMember, getType} from '@/utils'

export const WATCH_FLAG = Symbol('watch-flag')

export type SubscribeHookArgs<Args extends any[]> = (current: Args, old: Args) => any
export type SubscribeHookValue<Value> = (current: Value, old: Value) => any

export interface SubscribeMember<Args extends any[] = any[]> extends VareMember {
  [WATCH_FLAG]: Ref<Args | null>
}

export type SubscribeTarget = Mutation<any> | Action<any> | Computation<any, any> | ComputationWritable<any, any>

export const setSubscribe = (target: SubscribeTarget, hook: WatchCallback<any>): WatchStopHandle => {
  const watchFlag = target[WATCH_FLAG]

  return watch(watchFlag, hook)
}

export const watchTarget = (target: any, hook: SubscribeHookArgs<any>): WatchStopHandle => {
  return watch(computed(() => target), hook, {deep: true})
}

/**
 * start the subscription
 * @param mutation
 * @param hook
 */
export function subscribe<Args extends any[]>(mutation: Mutation<Args>, hook: SubscribeHookArgs<Args>): WatchStopHandle
export function subscribe<Args extends any[], Return = any>(action: Action<Args, Return>, hook: SubscribeHookArgs<Args>): WatchStopHandle
export function subscribe<Args extends any[], Return = any>(computation: Computation<Args, Return>, hook: SubscribeHookArgs<Args>): WatchStopHandle
export function subscribe<Args extends any[], Return = any>(computation: ComputationWritable<Args, Return>, hook: SubscribeHookArgs<Args>): WatchStopHandle
export function subscribe<T>(computed: ComputedRef<T>, hook: SubscribeHookValue<T>): WatchStopHandle
export function subscribe<T>(state: UnwrapNestedRefs<T>, hook: SubscribeHookArgs<[T]>): WatchStopHandle
export function subscribe(
  target,
  hook,
) {
  const type = getType(target)
  // when Mutation, Action or Computation
  if (type === 'mutation' || type === 'action') {
    return setSubscribe(target, hook)
  }

  // state or any Ref
  return watchTarget(target, hook)
}
