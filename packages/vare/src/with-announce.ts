import {AnyFunction} from './types'
import {After, withAfter} from './with-after'
import {Before, withBefore} from './with-before'
import {Then, withThen} from './with-then'

export interface CreateHooks<T extends AnyFunction> {
  before?: Before<T>
  after?: After<T>
  then?: Then<T, any>
}

export function withAnnounce<T extends AnyFunction>(action: T, hooks: CreateHooks<T>): (...args: Parameters<T>) => ReturnType<T> {
  const {then, before, after} = hooks

  return withBefore(withThen(withAfter(action, after), then), before)
}
