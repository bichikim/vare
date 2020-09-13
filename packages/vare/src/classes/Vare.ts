/* eslint-disable @typescript-eslint/ban-types */

import {App} from 'vue'
import {Subscribe} from './Subscribe'
import {StoreSubscribeNames, StoreSubscribeFunc, storeSubscribeNames, defaultSubscribeName} from './Store'
import {StoreTree} from './StoreTree'

type PluginsFunc<S extends object> = (vare: Vare<S>) => any

export interface VareOptions<S extends object> {
  plugins?: PluginsFunc<S>[]
  stores?: S
}

export class Vare<S extends object> {
  private _storeTree: StoreTree<S>
  private readonly _subscribe: Subscribe<StoreSubscribeFunc<any>, StoreSubscribeNames>

  constructor(options: VareOptions<S> = {}) {
    const {plugins = [], stores} = options
    this._setPlugins(plugins)
    this._subscribe = new Subscribe(storeSubscribeNames, defaultSubscribeName)
    this._storeTree = new StoreTree<S>(stores, this as any)
  }

  subscribe(func: StoreSubscribeFunc<S>, type: StoreSubscribeNames): void {
    return this._subscribe.subscribe(func, type)
  }

  unsubscribe(func: StoreSubscribeFunc<S>, type: StoreSubscribeNames): void {
    return this._subscribe.unsubscribe(func, type)
  }

  get store(): Readonly<S> {
    return this._storeTree.store
  }

  install(app: App): any {
    app.config.globalProperties.$vare = this
  }

  private _setPlugins(plugins: PluginsFunc<S>[]): void {
    plugins.forEach((plugin) => {
      plugin(this)
    })
  }
}

export const createVare = <S extends object>(options?: VareOptions<S>): Vare<S> => {
  return new Vare(options)
}
