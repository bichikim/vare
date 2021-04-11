import {State, StateIdentifierName} from '@/state'
import {Mutation, MutationIdentifierName} from '@/mutate'
import {Computation, ComputationIdentifierName} from '@/compute'
import {Action, ActionIdentifierName} from '@/act'
import {Ref} from 'vue-demi'
import {info} from '@/info'

export type AllKinds = State<any> | Mutation<any> | Computation<any, any> | Action<any>

export type Identifier = MutationIdentifierName
  | StateIdentifierName
  | ComputationIdentifierName
  | ActionIdentifierName

export interface VareMember {
  identifier: Identifier
  relates: Set<AllKinds>
  name?: string
  description?: string
  type?: string
  watchFlag?: Ref<any>
}

export const getIdentifier = (value?: AllKinds): undefined | Identifier => {
  const valueInfo = info.get(value)
  return valueInfo?.identifier
}

export const getName = (value?: AllKinds) => {
  const valueInfo = info.get(value)
  return valueInfo?.name
}

export const setName = (value: AllKinds, name: string) => {
  const valueInfo = info.get(value)
  if (valueInfo) {
    valueInfo.name = name
  }
}

export const getRelates = (target: AllKinds): Set<AllKinds> | undefined => {
  return info.get(target)?.relates
}

export const getDescription = (value?: AllKinds): undefined | string => {
  const valueInfo = info.get(value)
  return valueInfo?.description
}

export const describe = (value: AllKinds, description: string) => {
  const valueInfo = info.get(value)
  if (valueInfo) {
    valueInfo.description = description
  }
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

export const isSSR = (): boolean => {
  return typeof window === 'undefined'
}
