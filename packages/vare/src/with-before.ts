import {AnyFunction} from './types'

export type Before<T extends AnyFunction> = (action: T, ...args: Parameters<T>) => any

export function withBefore<T extends AnyFunction>(action: T, before?: Before<T>): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    before?.(action, ...args)
    return action(...args)
  }) as T
}
