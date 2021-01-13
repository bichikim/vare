import {AnyFunc} from '@/types'
import {Triggers} from './types'
import {actor} from '@/utils'

interface TriggerOptions<N, S, T> {
  triggers: Triggers<N, S, any>
  state?: S
  action: T,
  namespace?: string
  name?: string
  type: N
  firstArgs?: any[]
}

type CreateTriggerOptions<N, S> = Omit<TriggerOptions<N, S, any>, 'action' | 'name'>

export const createObserverTrigger = <N, S>(options: CreateTriggerOptions<N, S>) => {
  const {type, state, triggers, namespace, firstArgs} = options
  return <T extends AnyFunc>(action: T, name: string = 'unknown'): T =>
    observerTrigger({
      triggers, state, action, namespace, name, type, firstArgs,
    })
}

export const observerTrigger = <N, S, T extends AnyFunc>(options: TriggerOptions<N, S, T>): T => {
  const {namespace = 'unknown', name = 'unknown', action, state = {} as S, triggers, type, firstArgs} = options

  const calledArgs = (action: T, args: Parameters<T>) => [type, name, args, action, wrapper]

  const actedArgs = (action: T, args: Parameters<T>) => [namespace, name, args, state]

  const wrapper = actor(action, firstArgs, {...triggers, calledArgs, actedArgs})

  return wrapper
}
