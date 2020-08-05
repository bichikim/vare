import { Ref, UnwrapRef, reactive } from '@vue/reactivity'
import { _triggerDevToolAction, _triggerDevToolMutation } from './devtool'

export type SubscribeFunc = (name: string, args: any[], originalAction: Function, wrappedAction: Function) => any
export type ActionFunc = (...args: any[]) => PromiseLike<any> | any

function _callAllSubscribes (subscribes: Map<SubscribeFunc, boolean>, name: string, args: any[], original: Function, wrapper: Function) {
  subscribes.forEach((_, subscribe) => {
    subscribe(name, args, original, wrapper)
  })
}

export class Store<T extends object> {
  private readonly _state: T extends Ref ? T : UnwrapRef<T>
  private readonly _subscribes: Map<SubscribeFunc, boolean> = new Map()
  private readonly _actionSubscribes: Map<SubscribeFunc, boolean> = new Map()
  private readonly _name: string

  constructor (state: T, name: string = 'unknown') {
    this._state = reactive(state)
    this._name = name
  }

  mutation<T extends Function> (mutation: T, name = 'unknown'): T {
    const func = (...args: any[]) => {
      _callAllSubscribes(this._subscribes, name, args, mutation, func)
      const result = mutation(...args)
      _triggerDevToolMutation(this._name, name, args, this._state)
      return result
    }
    return func as any
  }

  action<T extends ActionFunc> (action: T, name: string = 'unknown'): T {
    const func = async (...args: any[]) => {
      _callAllSubscribes(this._actionSubscribes, name, args, action, func)
      const result = await action(...args)
      _triggerDevToolAction(this._name, name, args, this._state)
      return result
    }

    return func as any
  }

  get state () {
    return this._state
  }

  subscribe (func: SubscribeFunc) {
    this._subscribes.set(func, true)
  }

  subscribeAction (func: SubscribeFunc) {
    this._actionSubscribes.set(func, true)
  }

  unsubscribeAction (func: SubscribeFunc) {
    this._actionSubscribes.delete(func)
  }

  unsubscribe (func: SubscribeFunc) {
    this._subscribes.delete(func)
  }
}
