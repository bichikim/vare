/* eslint-disable @typescript-eslint/ban-types */
import {_callAllSubscribes} from './utils'
export type SubscribeFunc = (name: string, args: any[], original: Function, wrapped: Function) => any
export type ClearType = 'subscribeMutation' | 'subscribeAction' | 'subscribeAll'
export type SubscribeType = 'action' | 'mutation' | 'init'

export class StoreSubscribes {
  protected readonly _mutationSubscribes: Map<SubscribeFunc, StoreSubscribes> = new Map()
  protected readonly _actionSubscribes: Map<SubscribeFunc, StoreSubscribes> = new Map()
  protected readonly _initSubscribes: Map<SubscribeFunc, StoreSubscribes> = new Map()

  clear(type: ClearType): void {
    switch (type) {
      case 'subscribeMutation':
        this._mutationSubscribes.clear()
        return
      case 'subscribeAction':
        this._actionSubscribes.clear()
    }
  }

  protected _triggerSubscribe(
    type: SubscribeType,
    name: string,
    args: any[],
    original: Function,
    wrapper: Function,
  ): void {
    switch (type) {
      case 'init':
        _callAllSubscribes(this._initSubscribes, name, args, original, wrapper)
        return
      case 'action':
        _callAllSubscribes(this._actionSubscribes, name, args, original, wrapper)
        return
      case 'mutation':
        _callAllSubscribes(this._mutationSubscribes, name, args, original, wrapper)
    }
  }

  subscribe(func: SubscribeFunc, type: SubscribeType = 'mutation'): void {
    switch (type) {
      case 'action':
        this._actionSubscribes.set(func, this)
        return
      case 'mutation':
        this._mutationSubscribes.set(func, this)
        return
      case 'init':
        this._initSubscribes.set(func, this)
    }
  }

  unsubscribe(func: SubscribeFunc, type: SubscribeType = 'mutation'): void {
    switch (type) {
      case 'mutation':
        this._actionSubscribes.delete(func)
        return
      case 'action':
        this._mutationSubscribes.delete(func)
        return
      case 'init':
        this._initSubscribes.delete(func)
    }
  }
}
