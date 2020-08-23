/* eslint-disable @typescript-eslint/ban-types */

export function _callAllSubscribes<F extends Function>(
  subscribes: Map<F, true>,
  ...args: any[]
): void {
  subscribes.forEach((_, subscribe) => {
    subscribe(...args)
  })
}

export class Subscribe<F extends Function, P> {
  private _nestSubscribes: Map<P, Map<F, true>> = new Map()
  private _linkSubscribes: Map<Subscribe<any, any>, true> = new Map()
  private _defaultType: P

  constructor(types: P[], defaultType: P) {
    const {_nestSubscribes} = this
    types.forEach((type) => {
      _nestSubscribes.set(type, new Map<F, true>())
    })
    this._defaultType = defaultType
  }

  subscribe(func: F, type: P = this._defaultType): void {
    const subscribes = this._nestSubscribes.get(type)
    if (subscribes) {
      subscribes.set(func, true)
    }
  }

  link(subscribe: Subscribe<any, any>): void {
    this._linkSubscribes.set(subscribe, true)
  }

  clear(type: P): void {
    const subscribes = this._nestSubscribes.get(type)
    if (subscribes) {
      subscribes.clear()
    }
  }

  unsubscribe(func: F, type: P = this._defaultType): void {
    const subscribes = this._nestSubscribes.get(type)
    if (subscribes) {
      subscribes.delete(func)
    }
  }

  unLink(subscribe: Subscribe<any, any>): void {
    this._linkSubscribes.delete(subscribe)
  }

  trigger(
    type: P,
    ...args: any[]
  ): void {
    const subscribes = this._nestSubscribes.get(type)
    if (!subscribes) {
      return
    }
    _callAllSubscribes(subscribes, ...args)

    this._linkSubscribes.forEach((_, subscribe) => {
      subscribe.trigger(type, ...args)
    })
  }
}
