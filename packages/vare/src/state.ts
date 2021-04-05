import {AnyObject, UnwrapNestedRefs} from '@/types'
import {reactive} from 'vue-demi'
import {Mutation} from './mutate'

export const STATE_RELATES = Symbol('state-relate')

export interface RelateAble {
  [STATE_RELATES]: Set<State<any>>
}

export const STATE_IDENTIFIER = Symbol('state-identifier')

export const NAME = Symbol('name')

export type AllAbleRelates = Mutation<any>

export interface StateMembers {
  [STATE_IDENTIFIER]: boolean
  [STATE_RELATES]: Set<AllAbleRelates>
}

export type State<State> = UnwrapNestedRefs<State> & StateMembers

export const getStateRelates = (state: State<any>): Set<AllAbleRelates> => {
  return state[STATE_RELATES]
}

export const isState = (value: any): value is State<any> => {
  return Boolean(value?.[STATE_IDENTIFIER])
}

export const relateState = (state: State<any>, target) => {
  if (isState(state)) {
    state[STATE_RELATES].add(target)
  }
  if (Array.isArray(state)) {
    state.forEach((item) => {
      if (isState(item)) {
        item[STATE_RELATES].add(target)
      }
    })
  }
  if (typeof state === 'object') {
    Object.keys(state).forEach((key) => {
      const item = state[key]
      if (isState(item)) {
        item[STATE_RELATES].add(target)
      }
    })
  }
}

/**
 * state is the vue reactive
 */
export const state = <S extends AnyObject>(initState: S): State<S> => {
  return Object.assign(reactive<S>(initState), {
    [STATE_IDENTIFIER]: true,
    [STATE_RELATES]: new Set<AllAbleRelates>(),
  })
}
