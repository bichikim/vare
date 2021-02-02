import {AnyFunction} from '@/types'

type ArgGetter = (target, key) => any[]

const defaultGetter = (value, key) => [value, key]

export const executeRecodeFunctions = <T>(
  recode: T,
  target: AnyFunction,
  argGetter: ArgGetter = defaultGetter,
): any => {
  return Object.keys(recode).reduce((result: Record<any, any>, key) => {
    const value = recode[key]
    result[key] = target(...argGetter(value, key))
    return result
  }, {}) as any
}
