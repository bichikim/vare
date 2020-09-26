import {AnyFunc} from '@/types'
import {withAnnounce, After, Before} from '@/utils'

export interface Triggers<T extends AnyFunc, C = any, A = any> {
  calledArgs?: (action: T, args: Parameters<T>) => C[]
  actedArgs?: (action: T, args: Parameters<T>) => A[]
  acted?: (...args: C[]) => any
  called?: (...args: A[]) => any
}

export const actor = <T extends AnyFunc>(action: T, triggers: Triggers<T> = {}): (...args: Parameters<T>) => ReturnType<T> => {
  const {called, acted, actedArgs, calledArgs} = triggers

  console.log('actor', called)

  const after: After<T> = (action, result, ...args) => {
    if (acted) {
      const _args = actedArgs ? actedArgs(action, args) : [action, args]
      acted(..._args)
    }
  }

  const before: Before<T> = (action, ...args) => {
    if (called) {
      const _args = calledArgs ? calledArgs(action, args) : [action, args]
      called(..._args)
    }
  }

  return withAnnounce(action, {
    after,
    before,
  })
}
