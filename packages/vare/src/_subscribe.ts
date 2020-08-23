
interface SubscribeLike<F, P> {
  nest: Map<P, Map<F, true>>
  link: Map<SubscribeLike<any, any>, true>
  defaultType: P
}

export const createSubscribeFunc = <F, P>(subscribeObj: SubscribeLike<F, P>) => {
  return (func: F, type: P = subscribeObj.defaultType): void => {
    return subscribe(subscribeObj, func, type)
  }
}

export const subscribe = <F, P>(subscribe: SubscribeLike<F, P>, func: F, type: P = subscribe.defaultType): void => {
  const subscribes = subscribe.nest.get(type)
  if (subscribes) {
    subscribes.set(func, true)
  }
}

const createUnsubscribeFunc = <F, P>(subscribe: SubscribeLike<F, P>) => {
  return (func: F, type: P = subscribe.defaultType) => {
    return unsubscribe(subscribe, func, type)
  }
}

export const unsubscribe = <F, P>(subscribe: SubscribeLike<F, P>, func: F, type: P = subscribe.defaultType): void => {
  const subscribes = subscribe.nest.get(type)
  if (subscribes) {
    subscribes.delete(func)
  }
}

export const createSubscribe = <F, P>(types: P[], defaultType: P) => {
  const nest: Map<P, Map<F, true>> = new Map()
  const link: Map<SubscribeLike<any, any>, true> = new Map()

  return {
    subscribe: createSubscribeFunc({nest, link, defaultType}),
    unsubscribe: createUnsubscribeFunc({nest, link, defaultType}),
  }
}
