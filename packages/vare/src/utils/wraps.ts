import {AnyFunc} from '@/types'

type ArgGetter = (target, key) => any[]

const defaultGetter = (target, key) => [target, key]

export const wraps = <T>(targets: T, wrap: AnyFunc, argGetter: ArgGetter = defaultGetter): T => {
  return Object.keys(targets).reduce((result: Record<any, any>, key) => {
    const value = targets[key]
    result[key] = wrap(...argGetter(value, key))
    return result
  }, {}) as any
}
