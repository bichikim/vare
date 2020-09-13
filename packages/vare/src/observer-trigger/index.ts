import {AnyFunc} from '@/types'
import {actor} from './actor'
import {Triggers} from './types'

export const createObserverTrigger = <N, S>(namespace: string = 'unknown', triggers: Triggers<N, S, any>, type: N, state: S) =>
  <T extends AnyFunc>(action: T, name: string = 'unknown'): T =>
    observerTrigger({
      triggers, state, action, namespace, name, type,
    })

interface TriggerOptions<N, S, T> {
  triggers: Triggers<N, S, any>
  state: S
  action: T,
  namespace: string
  name: string
  type: N
}

export const observerTrigger = <N, S, T extends AnyFunc>(options: TriggerOptions<N, S, T>): T => {
  const {namespace = 'unknown', name = 'unknown', action, state, triggers, type} = options
  const wrapper: any = (...args: any[]) => actor<N, S, T>({
    action, state, wrapper, type, namespace, name, args, triggers,
  })
  return wrapper
}

export const isPromise = (value: any): value is Promise<any> => {
  return typeof value === 'object' && typeof value.then === 'function' && typeof value.catch === 'function'
}
