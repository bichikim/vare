import {AnyObject, UnwrapNestedRefs} from '@/types'
import {reactive} from 'vue-demi'
import {VareMember, getType, beVareMember, AllKinds, createUuid} from '@/utils'

const stateUuid = createUuid('unknown')

export const STATE_RELATES = Symbol('state-relate')

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

export const relateState = (state: State<any> | State<any>[] | Record<string, State<any>>, target: AllKinds) => {
  if (isState(state)) {
    state[STATE_RELATES].add(target)
  }
  if (Array.isArray(state)) {
    (state as State<any>[]).forEach((item) => {
      if (isState(item)) {
        item[STATE_RELATES].add(target)
      }
    })
  }
  if (typeof state === 'object') {
    Object.keys(state).forEach((key) => {
      const item: State<any> = state[key]
      if (isState(item)) {
        item[STATE_RELATES].add(target)
      }
    })
  }
}

/**
 * state is the vue reactive
 */
export const state = <S extends AnyObject>(initState: S, name?: string): State<S> => {
  const _name = name ?? stateUuid()

  return reactive<S>(initState) as any

  // return beVareMember<State<S>>(reactive<S>(initState), stateType, _name)
}
