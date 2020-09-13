import {isPromise} from '@/utils'
import {AnyFunc, State} from '@/types'
import {Triggers} from './types'

interface ActorOptions<N, S, T extends AnyFunc> {
  action: T
  wrapper: T
  state: S
  type: N
  namespace: string
  name: string
  triggers: Triggers<N, S, any>
  args: any[]
}

export const actor = <N, S, T extends AnyFunc>(options: ActorOptions<N, S, T>) => {
  const {triggers, args, action, name, namespace, state, type, wrapper} = options
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
    )
  }

  triggerActed()

  return result
}
