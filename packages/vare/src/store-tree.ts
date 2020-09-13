import {AnyObject} from './types'
import {Store} from 'packages/vare/src/store'

export interface StoreTree {
  registerStore(store: Store<any, any>, name?: string | number | symbol): void
  unRegisterStore(store: Store<any, any> | string | number | symbol, callback?: (store) => any): void
}

export type StoreTreeMap<S extends AnyObject = AnyObject, SS extends AnyObject = AnyObject> =
  Map<Store<any, any>, true | string | number | symbol>
export type NameTreeMap = Map<string | number | symbol, Store<any, any>>
export type Name = string | number | symbol
export interface StoreNameTree<S extends AnyObject = AnyObject, SS extends AnyObject = AnyObject> {
  storeTree: StoreTreeMap<S, SS>
  nameTree: NameTreeMap
}

export const createStoreNameTree = <S extends AnyObject = AnyObject, SS extends AnyObject = AnyObject>(): StoreNameTree<S, SS> => {
  return {
    storeTree: new Map<Store<S, SS>, true | string | number | symbol>(),
    nameTree: new Map<string | number | symbol, Store<any, any>>(),
  }
}

export const registerStore = (tree: StoreNameTree, store: Store<any, any>, name?: Name): void => {
  if (name) {
    const isHas = tree.nameTree.has(name)
    if (isHas) {
      return
    }
    tree.storeTree.set(store, name)
    tree.nameTree.set(name, store)
  } else {
    tree.storeTree.set(store, true)
  }
  // if (this._parent) {
  //   store.registerParent(this._parent)
  // }
}

export function unregisterStore(tree: StoreNameTree, name: Name): void
export function unregisterStore(tree: StoreNameTree, store: Store<any, any>): void
export function unregisterStore(tree: StoreNameTree, storeOrName: Store<any, any> | Name): void {
  if (typeof storeOrName === 'object') {
    return unregisterStoreByStore(tree, storeOrName)
  }
  return unregisterStoreByName(tree, storeOrName)
}

export const unregisterStoreByStore = (tree: StoreNameTree, store: Store<any, any>): void => {
  const name = tree.storeTree.get(store)

  if (typeof name === 'string') {
    tree.nameTree.delete(name)
  }

  if (name === true) {
    tree.storeTree.delete(store)
  }

  // if (this._parent) {
  //   store.unRegisterParent(this._parent)
  // }
}

export const unregisterStoreByName = (tree: StoreNameTree, name: Name): void => {
  const savedStore = tree.nameTree.get(name)
  if (savedStore) {
    tree.storeTree.delete(savedStore)
    tree.nameTree.delete(name)
  }
}

//
export const createStoreTree = <S extends Record<Name, any>>() => {
  const storeNameTree = createStoreNameTree()
  return Object.freeze({
    //
  })
}
