import {Ref, UnwrapRef, reactive} from '@vue/reactivity'
import {_triggerDevToolAction, _triggerDevToolMutation} from './devtool'

export type AnyFunc = (...args: any[]) => any
export type SubscribeFunc = (name: string, args: any[], originalAction: AnyFunc, wrappedAction: AnyFunc) => any
export type ActionFunc = (...args: any[]) => PromiseLike<any> | any
export type AnyObject = Record<string | number | symbol, any>
export type State<T> = T extends Ref ? T : UnwrapRef<T>

function _callAllSubscribes(subscribes: Map<SubscribeFunc, boolean>, name: string, args: any[], original: AnyFunc, wrapper: AnyFunc) {
  subscribes.forEach((_, subscribe) => {
    subscribe(name, args, original, wrapper)
  })
}

export class Store<T extends AnyObject> {
  private readonly _state: State<T>
  private readonly _subscribes: Map<SubscribeFunc, boolean> = new Map()
  private readonly _actionSubscribes: Map<SubscribeFunc, boolean> = new Map()
  private readonly _name: string

  constructor(state: T, name: string = 'unknown') {
    this._state = reactive(state)
    this._name = name
  }

  mutation<T extends AnyFunc>(mutation: T, name = 'unknown'): T {
    const func = (...args: any[]) => {
      _callAllSubscribes(this._subscribes, name, args, mutation, func)
      const result = mutation(...args)
      _triggerDevToolMutation(this._name, name, args, this._state)
      return result
    }
    return func as any
  }

  action<T extends ActionFunc>(action: T, name: string = 'unknown'): T {
    const func = async (...args: any[]) => {
      _callAllSubscribes(this._actionSubscribes, name, args, action, func)
      const result = await action(...args)
      _triggerDevToolAction(this._name, name, args, this._state)
      return result
    }

    return func as any
  }

  get state(): State<T> {
    return this._state
  }

  subscribe(func: SubscribeFunc): void {
    this._subscribes.set(func, true)
  }

  subscribeAction(func: SubscribeFunc): void {
    this._actionSubscribes.set(func, true)
  }

  unsubscribeAction(func: SubscribeFunc): void {
    this._actionSubscribes.delete(func)
  }

  unsubscribe(func: SubscribeFunc): void {
    this._subscribes.delete(func)
  }
}

export const createStore = <T>(state: T, name: string = 'unknown'): Store<T> => (new Store<T>(state, name))
