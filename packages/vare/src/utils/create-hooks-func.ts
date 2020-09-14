import {AnyFunc} from '@/types'
import {isPromise} from '@/utils/'

export type Trap<T extends AnyFunc> = (...args: Parameters<T>) => boolean
export type Before<T extends AnyFunc> = (action: T, ...args: Parameters<T>) => any
export type After<T extends AnyFunc> = (action: T, result: ReturnType<T>, ...args: Parameters<T>) => any
export type Then<T extends AnyFunc, R> = (action: T, result: R, ...args: Parameters<T>) => any

export interface CreateTrap<T extends AnyFunc>{
  trap?: Trap<T>
}

export interface CreateHooks<T extends AnyFunc> {
  before?: Before<T>
  after?: After<T>
  then?: Then<T, any>
}

export interface CreateHooksOptions<T extends AnyFunc> extends CreateTrap<T>, CreateHooks<T> {
}

export function withTrapFunc<T extends AnyFunc>(action: T, trap?: Trap<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> | Parameters<T> => {
    const result = trap && trap(...args)
    if (result) {
      return args
    }
    return action(...args)
  }) as T
}

export function withBeforeFunc<T extends AnyFunc>(action: T, before?: Before<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    before && before(action, ...args)
    return action(...args)
  }) as T
}

export function withThenFunc<T extends AnyFunc>(action: T, then?: Then<T, any>): T {
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
    then && then(action, result, ...args)
    return result
  }) as T
}

export function withAfterFunc<T extends AnyFunc>(action: T, after?: After<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const result = action(...args)
    after && after(action, result, ...args)
    return result
  }) as T
}

export function withHooksFunc<T extends AnyFunc>(action: T, hooks: CreateTrap<T>): (...args: Parameters<T>) => ReturnType<T>
export function withHooksFunc<T extends AnyFunc>(action: T, hooks: CreateHooksOptions<T>): (...args: Parameters<T>) => ReturnType<T> | Parameters<T> {
  const {then, before, trap, after} = hooks

  return withTrapFunc(withBeforeFunc(withThenFunc(withAfterFunc(action, after), then), before), trap)
}
