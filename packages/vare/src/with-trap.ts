import {AnyFunction} from './types'

export type Trap<T extends AnyFunction> = (...args: Parameters<T>) => boolean

export function withTrap<T extends AnyFunction, A extends(args: Parameters<T>) => ReturnType<A>>(
  action: T,
  trap?: Trap<T>,
  afterTrap?: A,
): T {
  return ((...args: Parameters<T>): ReturnType<T> | Parameters<T> => {
    const result = trap && trap(...args)
    if (result) {
      return afterTrap ? afterTrap(args) : args
    }
    return action(...args)
  }) as T
}
