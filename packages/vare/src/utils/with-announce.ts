import {AnyFunc} from '@/types'
import {isPromise} from '@/utils/'

export type Trap<T extends AnyFunc> = (...args: Parameters<T>) => boolean
export type Before<T extends AnyFunc> = (action: T, ...args: Parameters<T>) => any
export type After<T extends AnyFunc> = (action: T, result: ReturnType<T>, ...args: Parameters<T>) => any
export type Then<T extends AnyFunc, R> = (action: T, result: R, ...args: Parameters<T>) => any

export interface CreateHooks<T extends AnyFunc> {
  before?: Before<T>
  after?: After<T>
  then?: Then<T, any>
}

// eslint-disable-next-line space-before-function-paren
export function withTrap<T extends AnyFunc, A extends (args: Parameters<T>) => ReturnType<A>>
(action: T, trap?: Trap<T>, afterTrap?: A): T {
  return ((...args: Parameters<T>): ReturnType<T> | Parameters<T> => {
    const result = trap && trap(...args)
    if (result) {
      return afterTrap ? afterTrap(args) : args
    }
    return action(...args)
  }) as T
}

export function withBefore<T extends AnyFunc>(action: T, before?: Before<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    before?.(action, ...args)
    return action(...args)
  }) as T
}

export function withThen<T extends AnyFunc>(action: T, then?: Then<T, any>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const result: ReturnType<T> = action(...args)
    if (isPromise(result)) {
      return new Promise((resolve, reject) => {
        result.then((value) => {
          then && then(action, value, ...args)
          resolve(value)
        }).catch(reject)
      },
      ) as ReturnType<T>
    }
    then?.(action, result, ...args)
    return result
  }) as T
}

export function withAfter<T extends AnyFunc>(action: T, after?: After<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const result = action(...args)
    after && after(action, result, ...args)
    return result
  }) as T
}

export function withAnnounce<T extends AnyFunc>(action: T, hooks: CreateHooks<T>): (...args: Parameters<T>) => ReturnType<T> {
  const {then, before, after} = hooks

  return withBefore(withThen(withAfter(action, after), then), before)
}
