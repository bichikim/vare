import {AnyObject, UnwrapNestedRefs} from '@/types'
import {reactive} from 'vue-demi'
import {VareMember, AllKinds, createUuid} from './utils'
import {info} from '@/info'

export const stateUuid = createUuid('unknown')

export type StateIdentifierName = 'state'

export type State<State> = UnwrapNestedRefs<State>

export type AnyStateGroup = State<any> | State<any>[] | Record<string, State<any>>

export const stateType: StateIdentifierName = 'state'

export type StateMembers = VareMember

export const isState = (value: any): value is State<any> => {
  const valueInfo = info.get(value)

  if (!valueInfo) {
    return false
  }

  return valueInfo.identifier === stateType
}

export const relate = (state: State<any>, target: AllKinds) => {
  const stateInfo = info.get(state)
  const targetInfo = info.get(target)

  if (stateInfo && targetInfo) {
    stateInfo.relates.add(target)
    targetInfo.relates.add(state)
  }
}

export const relateState = (state: State<any> | State<any>[] | Record<string, State<any>>, target: AllKinds) => {
  if (isState(state)) {
    relate(state, target)
    return
  }
  if (Array.isArray(state)) {
    (state as State<any>[]).forEach((item) => {
      if (isState(item)) {
        relate(item, target)
      }
    })
    return
  }
  if (typeof state === 'object') {
    Object.keys(state).forEach((key) => {
      const item: State<any> = state[key]
      if (isState(item)) {
        relate(item, target)
      }
    })
  }
}

/**
 * state is the vue reactive
 */
export const state = <S extends AnyObject>(initState: S, name?: string): State<S> => {
  const state = reactive<S>(initState)

  info.set(state, {
    identifier: stateType,
    name,
    relates: new Set(),
  })

  return state
}
