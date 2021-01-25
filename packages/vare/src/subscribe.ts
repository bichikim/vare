import {AnyFunction, AnyObject} from './types'
import {withCombineProps} from './with-combine-props'

export interface LinkProps {
  link?: Map<Subscribe<any, any>, true>
}

export interface SubscribeProps<F, P> {
  nest?: Map<P, Map<F, true>>
  type?: P
  func?: F
}

const typedSubscribe = <F extends AnyFunction, P>(props: SubscribeProps<F, P>) => {
  const {nest, type, func} = props
  if (!nest || !type || !func) {
    return
  }
  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.set(func, true)
  }
}

const typedUnsubscribe = <F extends AnyFunction, P>(props: SubscribeProps<F, P>) => {
  const {nest, type, func} = props

  if (!nest || !type || !func) {
    return
  }

  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.delete(func)
  }
}

export interface WithSubscribes<F extends AnyFunction | AnyObject> {
  subscribes?: Map<F, true>
  execute?: (target: F, ...args: any[]) => any
  args?: any[]
}

export const withSubscribes = <F extends AnyFunction | AnyObject>(originalFunc: (props: WithSubscribes<F>) => any, subscribes: Map<F, true>) => {
  return (props: WithSubscribes<F>): any => {
    return originalFunc({...props, subscribes})
  }
}

const defaultExecute = <F extends AnyFunction | AnyObject>(target: F, ...args: any[]) => {
  if (typeof target !== 'object') {
    return (target as AnyFunction)(...args)
  }
}

export const callAllSubscribes = <F extends AnyFunction | AnyObject>(props: WithSubscribes<F>): void => {
  const {subscribes = [], execute = defaultExecute, args = []} = props
  subscribes.forEach((_, subscribe) => {
    execute(subscribe, ...args)
  })
}

export interface TypedTriggerProps<F extends AnyFunction, P> extends
  SubscribeProps<F, P>,
  Omit<WithSubscribes<F>, 'subscribes'>,
  LinkProps
{
  args?: any[]
}

export const typedTrigger = <F extends AnyFunction, P>(props: TypedTriggerProps<F, P>): void => {
  const {args = [], nest, type, execute, link} = props

  if (!nest || !type) {
    return
  }

  const subscribes = nest.get(type)

  if (!subscribes) {
    return
  }

  callAllSubscribes({subscribes, execute, args})

  if (link) {
    link.forEach((_, subscribe) => {
      subscribe.trigger(type, ...args)
    })
  }
}

export const typedClear = <F extends AnyFunction, P>(nest: Map<P, Map<F, true>>) => (type: P): void => {
  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.clear()
  }
}

export interface Subscribe<F extends AnyFunction, P> {
  subscribe(func: F, type?: P): void
  unsubscribe(func: F, type?: P): void
  link(subscribe: Subscribe<any, any>)
  unlink(subscribe: Subscribe<any, any>)
  trigger(type: P, ...args: any[]): void
  clear(type: P): void
}

export interface AdditionalProps<F extends AnyFunction, P> {
  nest: Map<P, Map<F, true>>
  link: Map<Subscribe<any, any>, true>
}

export const createSubscribe = <F extends AnyFunction, P>(types: P[], defaultType: P): Subscribe<F, P> => {
  const nest: Map<P, Map<F, true>> = new Map()

  const link: Map<Subscribe<any, any>, true> = new Map()

  types.forEach((type) => {
    nest.set(type, new Map<F, true>())
  })

  const triggerFunc = withCombineProps(typedTrigger, {nest, link})

  const subscribeFunc = withCombineProps(typedSubscribe, {nest})

  const unsubscribeFunc = withCombineProps(typedUnsubscribe, {nest})

  const trigger = (type: P, ...args: Parameters<F>) => triggerFunc({type, args})

  const subscribe = (func: F, type: P = defaultType) => subscribeFunc({func, type})

  const unsubscribe = (func: F, type: P = defaultType) => unsubscribeFunc({func, type})

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
