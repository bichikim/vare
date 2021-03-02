import {ReturnFunction} from 'src/types'
import {isFunction} from './is-function'

export const mayFunction = <T>(value: T | ReturnFunction<T>): T => {
  return isFunction(value) ? value() : value
}
