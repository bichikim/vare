import {AnyFunction} from '@/types'
import {actor} from './actor'

export interface TriggerOptions<N, S, T> {
  before?: (type: N, name: string, args: any[], original: T, wrapper: T) => any
  after?: (namespace: string, name: string, args: any[], state: S) => any
  state?: S
  action: T,
  namespace?: string
  name?: string
  type: N
  argsGetter?: (args: any[]) => any[]
}

export type CreateTriggerOptions<N, S> = Omit<TriggerOptions<N, S, any>, 'action' | 'name'>

export const createHookedFunction = <N, S>(options: CreateTriggerOptions<N, S>) => {
  return <T extends AnyFunction>(action: T, name: string = 'unknown'): T =>
    hookedFunction({
      ...options,
      action,
      name,
    })
}

export const hookedFunction = <N, S, T extends AnyFunction>(options: TriggerOptions<N, S, T>): T => {
  const {
    namespace = 'unknown',
    name = 'unknown',
    action,
    state = {} as S,
    before,
    after,
    type,
    argsGetter,
  } = options

  const beforeArgsGetter = (action: T, args: Parameters<T>) => [type, name, args, action, wrapper]

  const afterArgsGetter = (action: T, args: Parameters<T>) => [namespace, name, args, state]

  const wrapper = actor(action, {
    before,
    after,
    argsGetter,
    beforeArgsGetter,
    afterArgsGetter,
  })

  return wrapper
}
