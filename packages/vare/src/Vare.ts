/* eslint-disable @typescript-eslint/ban-types */
import {Store} from './Store'
import {StoreSubscribes} from './StoreSubscribes'
import {App} from 'vue'

type PluginsFunc = (vare: Vare) => any

export interface VareOptions {
  plugins?: PluginsFunc[]
}

export class Vare extends StoreSubscribes {
  _storeTree: Map<Store<any> | string, Store<any>> = new Map()

  constructor(options: VareOptions = {}) {
    super()
    const {plugins = []} = options
    this._setPlugins(plugins)
  }

  setStore<T>(storeInstance: Store<T>, name?: string): void {
    if (name) {
      this._storeTree.set(name, storeInstance)
    } else {
      this._storeTree.set(storeInstance, storeInstance)
    }

    this._linkSubscribe(storeInstance)
  }

  install(app: App): any {
    app.config.globalProperties.$vare = this
  }

  private _mutationSubscribe(name: string, args: any[], original: Function, wrapped: Function) {
    this._triggerSubscribe('mutation', name, args, original, wrapped)
  }

  private _initSubscribe(name: string, args: any[], original: Function, wrapped: Function) {
    this._triggerSubscribe('init', name, args, original, wrapped)
  }

  private _actionSubscribe(name: string, args: any[], original: Function, wrapped: Function) {
    this._triggerSubscribe('action', name, args, original, wrapped)
  }

  private _linkSubscribe<T>(storeInstance: Store<T>) {
    storeInstance.subscribe(this._initSubscribe, 'init')
    storeInstance.subscribe(this._mutationSubscribe, 'mutation')
    storeInstance.subscribe(this._actionSubscribe, 'action')
  }

  private _unlinkSubscribe<T>(storeInstance: Store<T>) {
    storeInstance.unsubscribe(this._initSubscribe, 'init')
    storeInstance.unsubscribe(this._mutationSubscribe, 'mutation')
    storeInstance.unsubscribe(this._actionSubscribe, 'action')
  }

  private _setPlugins(plugins: PluginsFunc[]): void {
    plugins.forEach((plugin) => {
      plugin(this)
    })
  }
}

export const createVare = (options?: VareOptions) => (new Vare(options))
