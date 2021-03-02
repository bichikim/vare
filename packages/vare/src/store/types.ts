import {State} from '@/types'
import {Ref, UnwrapRef} from '@vue/reactivity'

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>

export type StoreSubscribeNames = 'init' | 'action' | 'mutation' | 'computation'

export type ClearNames = 'state' | StoreSubscribeNames

export type ActionFunc = (...args: any[]) => PromiseLike<any> | any

export type StoreSubscribeFunc<S> = (type: StoreSubscribeNames, name: string, args: any[], state: State<S>) => any

export interface StoreOptions {
  /**
   * @default 'unknown'
   */
  name?: string
}
