/* eslint-disable @typescript-eslint/ban-types */
import {Store} from 'packages/vare/src/classes/Store'

export class StoreTree<S extends object> {
  private _storeTree: Map<Store<any, any>, true | string | number | symbol> = new Map()
  private _storeNameTree: Map<string | number | symbol, Store<any, any>> = new Map()
  private readonly _store: Readonly<S>
  private readonly _parent?: Store<any, S>

  get store(): Readonly<S> {
    return this._store
  }

  constructor(stores?: S, parent?: Store<any, S>) {
    this._store = new Proxy({} as S, {
      get: (target, property) => {
        return this._storeNameTree.get(property)
      },
    })

    this._parent = parent

    if (stores) {
      this._registerStores(stores)
    }
  }

  registerStore(store: Store<any, any>, name?: string | number | symbol): void {
    if (name) {
      const isHas = this._storeNameTree.has(name)
      if (isHas) {
        return
      }
      this._storeTree.set(store, name)
      this._storeNameTree.set(name, store)
    } else {
      this._storeTree.set(store, true)
    }
    if (this._parent) {
      store.registerParent(this._parent)
    }
  }

  unRegisterStore(store: Store<any, any> | string | number | symbol, callback?: (store) => any): void {
    if (typeof store !== 'object') {
      const savedStore = this._storeNameTree.get(store)
      if (savedStore) {
        this._storeTree.delete(savedStore)
        this._storeNameTree.delete(store)
        callback && callback(savedStore)
      }
      return
    }

    const name = this._storeTree.get(store)

    if (typeof name === 'string') {
      this._storeNameTree.delete(name)
    }

    if (name === true) {
      this._storeTree.delete(store)
    }

    if (this._parent) {
      store.unRegisterParent(this._parent)
    }
  }

  private _registerStores(storeTree: S) {
    Object.keys(storeTree).forEach((key) => {
      this.registerStore(storeTree[key], key)
    })
  }
}
