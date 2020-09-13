import {AnyFunc} from '@/types'
import {isPromise} from '@/utils'
import {Triggers} from './types'

interface ObserverActorOptions<N, S, T extends AnyFunc> {
  action: T
  wrapper?: T
  state?: S
  type: N
  namespace?: string
  name?: string
  triggers?: Triggers<N, S, any>
  args: any[]
}

export const observerActor = <N, S, T extends AnyFunc>(options: ObserverActorOptions<N, S, T>): ReturnType<T> => {
  const {triggers = {}, args, action, name = 'unknown', namespace = 'unknown', state = {} as S, type, wrapper = action} = options
  const {acted, called} = triggers
  const triggerActed = () => {
    if (acted) {
      acted(namespace, name, args, state)
    }
  }
  const result = action(...args)
  if (called) {
    called(type, name, args, action, wrapper)
  }

  if (isPromise(result)) {
    return new Promise((resolve, reject) => {
      result.then((value) => {
        triggerActed()
        resolve(value)
      }).catch(reject)
    },
    ) as ReturnType<T>
  }

  triggerActed()

  return result
}
