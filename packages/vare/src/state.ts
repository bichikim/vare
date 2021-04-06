import {AnyObject, UnwrapNestedRefs} from '@/types'
import {reactive} from 'vue-demi'
import {VareMember, getType, beVareMember, AllKinds, createUuid} from './utils'
import {STATE_RELATES} from './symbol'

export const stateUuid = createUuid('unknown')

export type StateIdentifierName = 'state'

export const stateType: StateIdentifierName = 'state'

export type StateMembers = VareMember

export type State<State> = UnwrapNestedRefs<State> & StateMembers

export const getStateRelates = (state: State<any>): Set<AllKinds> => {
  return state[STATE_RELATES]
}

export const isState = (value: any): value is State<any> => {
  return getType(value) === stateType
}

export const relate = (state: State<any>, target: AllKinds) => {
  state[STATE_RELATES].add(target)
  target[STATE_RELATES].add(state)
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
  const _name = name ?? stateUuid()

  return beVareMember<State<S>>(reactive<S>(initState), stateType, _name)
}
