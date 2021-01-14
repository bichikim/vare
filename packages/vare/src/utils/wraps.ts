import {AnyFunc} from '@/types'

type ArgGetter = (target, key) => any[]

const defaultGetter = (target, key) => [target, key]

export const wraps = <T>(targets: T, wrapFunc: AnyFunc, argGetter: ArgGetter = defaultGetter): any => {
  return Object.keys(targets).reduce((result: Record<any, any>, key) => {
    const value = targets[key]
    result[key] = wrap(value, wrapFunc, key, argGetter)
    return result
  }, {}) as any
}

export const wrap = <T>(target: T, wrapFunc: AnyFunc, name: string, argGetter: ArgGetter = defaultGetter): T => {
  return wrapFunc(...argGetter(target, name))
}
