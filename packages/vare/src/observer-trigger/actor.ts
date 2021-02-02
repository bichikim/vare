import {AnyFunction} from '@/types'
import {withAnnounce} from '@/with-announce'
import {Before} from '@/with-before'
import {After} from '@/with-after'

export interface Triggers<T extends AnyFunction, C = any, A = any> {
  argsGetter?: (args: any[]) => any[]
  wrap?: (function_: T) => T
  beforeArgsGetter?: (action: T, args: Parameters<T>) => C[]
  afterArgsGetter?: (action: T, args: Parameters<T>) => A[]
  after?: (...args: C[]) => any
  before?: (...args: A[]) => any
}

const getWrappedFunction = (function_, wrap?) => {
  if (wrap) {
    return wrap(function_)
  }
  return function_
}

export const actor = <T extends AnyFunction>(action: T, triggers: Triggers<T> = {}): (...args: Parameters<T>) => ReturnType<T> => {
  const {
    before,
    after,
    wrap,
    afterArgsGetter,
    beforeArgsGetter,
    argsGetter,
  } = triggers

  const wrappedFunction: T = getWrappedFunction(action, wrap)

  const resolveArgsFunction: T = ((...args) => {
    if (argsGetter) {
      return wrappedFunction(...argsGetter(args))
    }
    return wrappedFunction(...args)
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

  return withAnnounce(resolveArgsFunction, {
    after: after_,
    before: before_,
  })
}
