import {State, AnyFunc} from '@/types'
import {actor} from './actor'

interface Triggers<N, S, T> {
  called?: (type: N, name: string, args: any[], original: T, wrapper: T) => any
  acted?: (namespace: string, name: string, args: any[], state: State<S>) => any
}

export const createStateTrigger = <N, S>(namespace: string = 'unknown', triggers: Triggers<N, S, any>, type: N) => {
  return (state: State<S>) => <T extends AnyFunc>(action: T, name: string = 'unknown'): T =>
    trigger({
      triggers, state, action, namespace, name, type,
    })
}

interface TriggerOptions<N, S, T> {
  triggers: Triggers<N, S, any>
  state: State<S>
  action: T,
  namespace: string
  name: string
  type: N
}

export const trigger = <N, S, T extends AnyFunc>(options: TriggerOptions<N, S, T>): T => {
  const {namespace = 'unknown', name = 'unknown', action, state, triggers, type} = options
  const wrapper: any = (...args: any[]) => actor<N, S, T>({
    action, state, wrapper, type, namespace, name, args, triggers,
  })
  return wrapper
}

export const isPromise = (value: any): value is Promise<any> => {
  return typeof value === 'object' && typeof value.then === 'function' && typeof value.catch === 'function'
}

// interface Triggers<S, T> {
//   called?: (type: StoreSubscribeNames, name: string, args: any[], original: T, wrapper: T) => any
//   acted?: (namespace: string, name: string, args: any[], state: State<S>) => any
// }
//
// const triggerAction = <S>(namespace: string = 'unknown', {called, acted}: Triggers<S, any> = {}) =>
//   (state: State<S>) =>
//       < T extends PromiseAnyFunc>(action: T, name: string = 'unknown') => {
//         const func: any = async (...args: any[]) => {
//           if (called) {
//             called('action', name, args, action, func)
//           }
//           const result = await action(...args)
//           if (acted) {
//             acted(namespace, name, args, state)
//           }
//           return result
//         }
//
//         return func as any
//       }
//
// const triggerMutation = <S>(namespace: string, {called, acted}: Triggers<S, any> = {}) =>
//   (state: State<S>) =>
//     <T extends AnyFunc>(mutation: T, name: string = 'unknown'): T => {
//       const func: any = (...args: any[]) => {
//         if (called) {
//           called('mutation', name, args, mutation, func)
//         }
//         const result = mutation(...args)
//         if (acted) {
//           acted(namespace, name, args, state)
//         }
//         return result
//       }
//       return func as any
//     }
