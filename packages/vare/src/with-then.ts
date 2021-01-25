import {isPromise} from './is-promise'
import {AnyFunction} from './types'

export type Then<T extends AnyFunction, R> = (action: T, result: R, ...args: Parameters<T>) => any

export function withThen<T extends AnyFunction>(action: T, then?: Then<T, any>): T {
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
