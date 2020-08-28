import {AnyFunc, AnyObject} from './types'

interface SubscribeProps<F, P> {
  nest: Map<P, Map<F, true>>
  link: Map<SubscribeProps<any, any>, true>
  defaultType: P
}

const defaultExecute = <F extends AnyFunc | AnyObject>(target: F, ...args: any[]) => {
  if (typeof target !== 'object') {
    return (target as AnyFunc)(...args)
  }
}

export const callAllSubscribes = <F extends AnyFunc | AnyObject>(subscribes: Map<F, true>) =>
  (execute: (target: F, ...args: any[]) => any = defaultExecute) =>
    (
      ...args: any[]
    ): void => {
      subscribes.forEach((_, subscribe) => {
        execute(subscribe, ...args)
      })
    }

export const typedSubscribe = <F extends AnyFunc, P>(nest: Map<P, Map<F, true>>, defaultType: P) =>
  (func: F, type: P = defaultType): void => {
    const subscribes = nest.get(type)
    if (subscribes) {
      subscribes.set(func, true)
    }
  }

export const typedUnsubscribe = <F, P>(nest: Map<P, Map<F, true>>, defaultType: P) =>
  (func: F, type: P = defaultType): void => {
    const subscribes = nest.get(type)
    if (subscribes) {
      subscribes.delete(func)
    }
  }

export const typedTrigger = <F extends AnyFunc, P>(nest: Map<P, Map<F, true>>) =>
  (callback: (type: P, ...args: any[]) => any) =>
    (
      type: P,
      ...args: any[]
    ): void => {
      const subscribes = nest.get(type)

      if (!subscribes) {
        return
      }

      callAllSubscribes<F>(subscribes)()(...args)

      callback(type, ...args)
    }

export const typedClear = <F extends AnyFunc, P>(nest: Map<P, Map<F, true>>) => (type: P): void => {
  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.clear()
  }
}

export interface Subscribe<F extends AnyFunc, P> {
  subscribe(func: F, type?: P): void
  unsubscribe(func: F, type?: P): void
  link(subscribe: Subscribe<any, any>)
  unlink(subscribe: Subscribe<any, any>)
  trigger(type: P, ...args: any[]): void
  clear(type: P): void
}

export const createSubscribe = <F extends AnyFunc, P>(types: P[], defaultType: P): Subscribe<F, P> => {
  const nest: Map<P, Map<F, true>> = new Map()
  const link: Map<Subscribe<any, any>, true> = new Map()

  types.forEach((type) => {
    nest.set(type, new Map<F, true>())
  })

  const linkExecute = (subscribe, type, ...args) => (subscribe.trigger(type, ...args))

  const callAllLinks = callAllSubscribes<Subscribe<any, any>>(link)(linkExecute)

  const afterTrigger = (type: P, ...args: any[]) => {
    callAllLinks(type, ...args)
  }

  const trigger = typedTrigger<F, P>(nest)(afterTrigger)

  const subscribe = typedSubscribe<F, P>(nest, defaultType)

  const unsubscribe = typedUnsubscribe<F, P>(nest, defaultType)

  const clear = typedClear<F, P>(nest)

  return Object.freeze({
    subscribe,
    unsubscribe,
    link: (subscribe) => (link.set(subscribe, true)),
    unlink: (subscribe) => (link.delete(subscribe)),
    trigger,
    clear,
  })
}
