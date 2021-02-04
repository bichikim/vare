import {AnyFunction} from 'src/types'

export const isFunction = (value): value is AnyFunction => {
  return typeof value === 'function'
}
