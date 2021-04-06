import {State, STATE_RELATES, StateIdentifierName} from '@/state'
import {Mutation, MutationIdentifierName} from '@/mutate'
import {Computation, ComputationIdentifierName} from '@/compute'
import {Action, ActionIdentifierName} from '@/act'

export type AllKinds = State<any> | Mutation<any> | Computation<any, any> | Action<any>

export type Identifier = MutationIdentifierName
  | StateIdentifierName
  | ComputationIdentifierName
  | ActionIdentifierName

export const IDENTIFIER = Symbol('vare-identifier')
export const NAME = Symbol('name')

export interface VareMember {
  [IDENTIFIER]: Identifier
  [STATE_RELATES]: Set<AllKinds>
  [NAME]: string
  description?: string
}

export const getType = (value?: AllKinds): undefined | Identifier => {
  return value?.[IDENTIFIER]
}

export const getName = (value?: AllKinds) => {
  return value?.[NAME]
}

export const getDescription = (value?: AllKinds): undefined | string => {
  return value?.description
}

export const beVareMember = <Result extends AllKinds>(target: any, identifier: Identifier, name: string): Result => {
  return Object.assign(target, {
    [NAME]: name,
    [IDENTIFIER]: identifier,
    [STATE_RELATES]: new Set<AllKinds>(),
  })
}

export const drop = (array: any[]) => {
  const value = [...array]
  value.shift()
  return value
}

export const createUuid = (prefix: string = '') => {
  let count = 0
  return () => {
    count += 1
    return prefix + count
  }
}
