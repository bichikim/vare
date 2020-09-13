/* eslint-disable @typescript-eslint/ban-types */
import {reactive, Ref, UnwrapRef} from 'vue'
import {_triggerDevToolAction, _triggerDevToolMutation} from './devtool'
import {Subscribe} from './Subscribe'
import {StoreTree} from './StoreTree'
import {Vare} from './Vare'

export type State<S> = S extends Ref ? S : UnwrapRef<S>

export interface StoreOptions<S extends object> {
  /**
   * @default 'unknown'
   */
  name?: string
  /**
   * @default true
   */
  vare?: Vare<any>

  stores?: S
}
export type AnyFunc = (...args: any[]) => any

export type ActionFunc = (...args: any[]) => PromiseLike<any> | any

export const INIT = 'init'
export const ACTION = 'action'
export const MUTATION = 'mutation'
export const storeSubscribeNames: StoreSubscribeNames[] = [INIT, ACTION, MUTATION]
export const defaultSubscribeName = MUTATION
export type StoreSubscribeNames = 'init' | 'action' | 'mutation'
export type StoreSubscribeFunc<S> = (type: StoreSubscribeNames, name: string, args: any[], state: State<S>) => any

export const createInitState = <S extends object>(originalState: S, callback: (state) => any) => {
  return (): State<S> => {
    const state = reactive(originalState)
    callback(state)
    return state
  }
}

interface StoreInterface {
  name: string
  state: string
}

export class Store<S extends object, SS extends object> {
  private _subscribe = new Subscribe<StoreSubscribeFunc<S>, StoreSubscribeNames>(storeSubscribeNames, defaultSubscribeName)
  private _storeTree: StoreTree<SS>
  private readonly _name: string
  private _state: State<S>
  private readonly _originalState: S

  constructor(state: S, options: StoreOptions<SS> = {}) {
    const {vare, name, stores} = options
    this._storeTree = new StoreTree<SS>(stores, this as any)
    this._initState()
    this._originalState = {...state}
    this._name = typeof name === 'undefined' ? 'unknown' : name
  }

  subscribe(func: StoreSubscribeFunc<S>, type: StoreSubscribeNames): void {
    return this._subscribe.subscribe(func, type)
  }

  unsubscribe(func: StoreSubscribeFunc<S>, type: StoreSubscribeNames): void {
    return this._subscribe.unsubscribe(func, type)
  }

  get store(): Readonly<SS> {
    return this._storeTree.store
  }

  get state(): State<S> {
    return this._state
  }

  registerParent(store: Store<any, any>): void {
    this._subscribe.link(store._subscribe)
  }

  unRegisterParent(store: Store<any, any>): void {
    this._subscribe.unLink(store._subscribe)
  }

  /**
   * define mutation functions
   * @param mutationTree
   */
  defineMutations<T extends Record<string, any>>(mutationTree: T): T {
    return this.mutations(mutationTree)
  }

  /**
   * define mutation functions
   * @param mutationTree functions in an object
   */
  mutations<T extends Record<string, AnyFunc>>(mutationTree: T): T {
    return (
      Object.keys(mutationTree).reduce((tree: Record<string, any>, key) => {
        const value = mutationTree[key]
        tree[key] = this.mutation(value, key)
        return tree
      }, {})
    ) as any
  }

  /**
   * define a mutation function
   * @param mutation
   * @param name mutation name useful for debugging
   */
  mutation<T extends AnyFunc>(mutation: T, name: string = 'unknown'): T {
    const func = (...args: any[]) => {
      this._subscribe.trigger('mutation', name, args, mutation, func)
      const result = mutation(...args)
      _triggerDevToolMutation(this._name, name, args, this._state)
      return result
    }
    return func as any
  }

  getter<T>(getter: (state) => T): () => T {
    return () => {
      return getter(this.state)
    }
  }

  actions<T extends Record<string, ActionFunc>>(actionTree: T): T {
    return (
      Object.keys(actionTree).reduce((tree: Record<string, any>, key) => {
        const value = actionTree[key]
        tree[key] = this.action(value, key)
        return tree
      }, {})
    ) as any
  }

  action<T extends ActionFunc>(action: T, name: string = 'unknown'): T {
    const func = async (...args: any[]) => {
      this._subscribe.trigger('action', name, args, action, func)
      const result = await action(...args)
      _triggerDevToolAction(this._name, name, args, this._state)
      return result
    }

    return func as any
  }

  clear(type: 'state' | StoreSubscribeNames): void {
    switch (type) {
      case 'state':
        this._initState()
        return
      default:
        this._subscribe.clear(type)
    }
  }

  protected _initState(): void {
    this._state = reactive(this._originalState)
    this._subscribe.trigger('init',
      this._name,
      [this._originalState],
      this.constructor,
      this.constructor,
    )
  }
}
