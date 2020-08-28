import {AnyFunc, AnyObject} from './types'

const withNest = <Pr extends AnyObject, F extends AnyFunc, P>(originalFunc: (props: Pr & NestProps<F, P>) => any, nest: Map<P, Map<F, true>>) => {
  return (props: Pr & NestProps<F, P>) => {
    originalFunc({...props, nest} as Pr & NestProps<F, P>)
  }
}

const withLink = <Pr extends AnyObject> (originalFunc: (props: Pr & LinkProps) => any, link) => {
  return (props: Pr) => {
    originalFunc({...props, link} as Pr & LinkProps)
  }
}

interface LinkProps {
  link?: Map<Subscribe<any, any>, true>
}

interface NestProps<F, P> {
  nest?: Map<P, Map<F, true>>
}

interface SubscribeProps<F, P> {
  nest?: Map<P, Map<F, true>>
  type?: P
  func?: F
}

const typedSubscribe = <F extends AnyFunc, P>(props: SubscribeProps<F, P>) => {
  const {nest, type, func} = props
  if (!nest || !type || !func) {
    return
  }
  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.set(func, true)
  }
}

const typedUnsubscribe = <F extends AnyFunc, P>(props: SubscribeProps<F, P>) => {
  const {nest, type, func} = props

  if (!nest || !type || !func) {
    return
  }

  const subscribes = nest.get(type)
  if (subscribes) {
    subscribes.delete(func)
  }
}

interface WithSubscribes<F extends AnyFunc | AnyObject> {
  subscribes?: Map<F, true>
  execute?: (target: F, ...args: any[]) => any
  args?: any[]
}

export const withSubscribes = <F extends AnyFunc | AnyObject>(originalFunc: (props: WithSubscribes<F>) => any, subscribes: Map<F, true>) => {
  return (props: WithSubscribes<F>): any => {
    return originalFunc({...props, subscribes})
  }
}

const defaultExecute = <F extends AnyFunc | AnyObject>(target: F, ...args: any[]) => {
  if (typeof target !== 'object') {
    return (target as AnyFunc)(...args)
  }
}

export const callAllSubscribes = <F extends AnyFunc | AnyObject>(props: WithSubscribes<F>) => {
  const {subscribes = [], execute = defaultExecute, args = []} = props
  subscribes.forEach((_, subscribe) => {
    execute(subscribe, ...args)
  })
}

interface TypedTriggerProps<F extends AnyFunc, P> extends SubscribeProps<F, P>, Omit<WithSubscribes<F>, 'subscribes'>, LinkProps {
  args?: any[]
}

export const typedTrigger = <F extends AnyFunc, P>(props: TypedTriggerProps<F, P>): void => {
  const {args = [], nest, type, execute, func, link} = props

  if (!nest || !type || !func) {
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

  const triggerFunc = withLink<TypedTriggerProps<F, P>>(withNest(typedTrigger, nest), link)
  const subscribeFunc = withNest(typedSubscribe, nest)
  const unsubscribeFunc = withNest(typedUnsubscribe, nest)

  const trigger = (type: P, ...args: any[]) => triggerFunc({type, args})

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
