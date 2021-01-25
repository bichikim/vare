import {AnyFunction} from '@/types'
import {withAnnounce} from '@/with-announce'
import {Before} from '@/with-before'
import {After} from '@/with-after'

export interface Triggers<T extends AnyFunction, C = any, A = any> {
  argsGetter?: (args: any[]) => any[]
  beforeArgsGetter?: (action: T, args: Parameters<T>) => C[]
  afterArgsGetter?: (action: T, args: Parameters<T>) => A[]
  after?: (...args: C[]) => any
  before?: (...args: A[]) => any
}

export const actor = <T extends AnyFunction>(action: T, triggers: Triggers<T> = {}): (...args: Parameters<T>) => ReturnType<T> => {
  const {
    before,
    after,
    afterArgsGetter,
    beforeArgsGetter,
    argsGetter,
  } = triggers

  const myAction: T = ((...args) => {
    if (argsGetter) {
      return action(...argsGetter(args))
    }
    return action(...args)
  }) as any

  const after_: After<T> = (action, result, ...args) => {
    if (after) {
      const _args = afterArgsGetter ? afterArgsGetter(action, args) : [action, args]
      after(..._args)
    }
  }

  const before_: Before<T> = (action, ...args) => {
    if (before) {
      const _args = beforeArgsGetter ? beforeArgsGetter(action, args) : [action, args]
      before(..._args)
    }
  }

  return withAnnounce(myAction, {
    after: after_,
    before: before_,
  })
}
