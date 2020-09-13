/* eslint-disable @typescript-eslint/ban-types */
// import {Constructor} from './types'
// import {StoreSubscribesInterface, SubscribeFunc} from './classes/Subscribe'
//
// export function _callAllSubscribes(
//   subscribes: Map<SubscribeFunc, StoreSubscribesInterface>,
//   name: string,
//   args: any[],
//   original: Function,
//   wrapper: Function): void {
//   subscribes.forEach((_, subscribe) => {
//     subscribe(name, args, original, wrapper)
//   })
// }

// export function applyMixins(derivedCtor: any, constructors: any[]) {
//   constructors.forEach((baseCtor) => {
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//       const attributes = Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
//       if (attributes) {
//         Object.defineProperty(
//           derivedCtor.prototype,
//           name,
//           attributes,
//         )
//       }
//     })
//   })
// }

export const isPromise = (value: any): value is Promise<any> => {
  return typeof value === 'object' && typeof value.then === 'function' && typeof value.catch === 'function'
}
