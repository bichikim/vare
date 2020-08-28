import {Store} from './_store'

export interface StoreTree {
  registerStore(store: Store<any, any>, name?: string | number | symbol): void
  unRegisterStore(store: Store<any, any> | string | number | symbol, callback?: (store) => any): void
}

//
export const createStoreTree = () => {
  return Object.freeze({
    //
  })
}
