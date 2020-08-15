/* eslint-disable @typescript-eslint/ban-types */
import {StoreSubscribes, SubscribeFunc} from './StoreSubscribes'

export function _callAllSubscribes(
  subscribes: Map<SubscribeFunc, StoreSubscribes>,
  name: string,
  args: any[],
  original: Function,
  wrapper: Function): void {
  subscribes.forEach((_, subscribe) => {
    subscribe(name, args, original, wrapper)
  })
}
