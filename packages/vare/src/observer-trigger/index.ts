import {AnyFunc} from '@/types'
import {observerActor} from './observer-actor'
import {Triggers} from './types'

interface TriggerOptions<N, S, T> {
  triggers: Triggers<N, S, any>
  state?: S
  action: T,
  namespace?: string
  name?: string
  type: N
}

type CreateTriggerOptions<N, S> = Omit<TriggerOptions<N, S, any>, 'action' | 'name'>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createObserverTrigger = <N, S>(options: CreateTriggerOptions<N, S>) => {
  const {type, state, triggers, namespace} = options
  return <T extends AnyFunc>(action: T, name: string = 'unknown'): T =>
    observerTrigger({
      triggers, state, action, namespace, name, type,
    })
}

export const observerTrigger = <N, S, T extends AnyFunc>(options: TriggerOptions<N, S, T>): T => {
  const {namespace = 'unknown', name = 'unknown', action, state = {} as S, triggers, type} = options
  const wrapper: any = (...args: any[]) => observerActor<N, S, T>({
    action, state, wrapper, type, namespace, name, args, triggers,
  })
  return wrapper
}
