import {State} from '../types'

export interface Triggers<N, S, T> {
  called?: (type: N, name: string, args: any[], original: T, wrapper: T) => any
  acted?: (namespace: string, name: string, args: any[], state: S) => any
}
