import {AnyFunction} from '@/types'

type ArgGetter = (target, key) => any[]

const defaultGetter = (value, key) => [value, key]

export const executeFunctions = <T>(
  recode: T,
  func: AnyFunction,
  argGetter: ArgGetter = defaultGetter,
): any => {
  return Object.keys(recode).reduce((result: Record<any, any>, key) => {
    const value = recode[key]
    result[key] = func(...argGetter(value, key))
    return result
  }, {}) as any
}
