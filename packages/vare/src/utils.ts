/* eslint-disable @typescript-eslint/ban-types */
import {Constructor} from './types'
import {StoreSubscribesInterface, SubscribeFunc} from 'packages/vare/src/Subscribe'

export function _callAllSubscribes(
  subscribes: Map<SubscribeFunc, StoreSubscribesInterface>,
  name: string,
  args: any[],
  original: Function,
  wrapper: Function): void {
  subscribes.forEach((_, subscribe) => {
    subscribe(name, args, original, wrapper)
  })
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const attributes = Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      if (attributes) {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          attributes,
        )
      }
    })
  })
}
