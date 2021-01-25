import {AnyFunction} from './types'

export type After<T extends AnyFunction> = (
  action: T, result: ReturnType<T>,
  ...args: Parameters<T>
) => any

export function withAfter<T extends AnyFunction>(
  action: T,
  after?: After<T>,
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const result = action(...args)
    after && after(action, result, ...args)
    return result
  }) as T
}
