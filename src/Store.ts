/* eslint-disable @typescript-eslint/ban-types */
import {reactive, Ref, UnwrapRef} from '@vue/reactivity'
import {_triggerDevToolAction, _triggerDevToolMutation} from './devtool'
import {StoreSubscribes, ClearType} from './StoreSubscribes'
import {Vare} from './Vare'

export type AnyFunc = (...args: any[]) => any

export type ActionFunc = (...args: any[]) => PromiseLike<any> | any
export type AnyObject = Record<string | number | symbol, any>
export type State<T> = T extends Ref ? T : UnwrapRef<T>

export interface RegisterOptions {
  /**
   * @default 'unknown'
   */
  name?: string
  /**
   * @default true
   */
  vare?: Vare
}

export type StoreClearType = 'state' | ClearType

export class Store<T extends AnyObject> extends StoreSubscribes {
  private readonly _name: string
  private readonly _originalState: T

  private _state: State<T>

  get state(): State<T> {
    return this._state
  }

  constructor(state: T, options: RegisterOptions = {}) {
    super()
    const {vare, name} = options
    this._originalState = {...state}
    this._initState()
    this._name = typeof name === 'undefined' ? 'unknown' : name
    if (vare) {
      vare.setStore(this, name)
    }
  }

  /**
   * define mutation functions
   * @param mutationTree
   */
  defineMutations<T extends Record<string, any>>(mutationTree: T): T {
    return this.mutations(mutationTree)
  }

  /**
   * define mutation functions
   * @param mutationTree functions in an object
   */
  mutations<T extends Record<string, AnyFunc>>(mutationTree: T): T {
    return (
      Object.keys(mutationTree).reduce((tree: Record<string, any>, key) => {
        const value = mutationTree[key]
        tree[key] = this.mutation(value, key)
        return tree
      }, {})
    ) as any
  }

  /**
   * define a mutation function
   * @param mutation
   * @param name
   */
  defineMutation<T extends AnyFunc>(mutation: T, name?: string): T {
    return this.mutation(mutation, name)
  }

  /**
   * define a mutation function
   * @param mutation
   * @param name mutation name useful for debugging
   */
  mutation<T extends AnyFunc>(mutation: T, name: string = 'unknown'): T {
    const func = (...args: any[]) => {
      this._triggerSubscribe('mutation', name, args, mutation, func)
      const result = mutation(...args)
      _triggerDevToolMutation(this._name, name, args, this._state)
      return result
    }
    return func as any
  }

  defineActions<T extends Record<string, any>>(actionTree: T): T {
    return this.actions(actionTree)
  }

  getter<T>(getter: (state) => T): () => T {
    return () => {
      return getter(this.state)
    }
  }

  actions<T extends Record<string, ActionFunc>>(actionTree: T): T {
    return (
      Object.keys(actionTree).reduce((tree: Record<string, any>, key) => {
        const value = actionTree[key]
        tree[key] = this.action(value, key)
        return tree
      }, {})
    ) as any
  }

  defineAction<T extends ActionFunc>(action: T, name?: string): T {
    return this.action(action, name)
  }

  action<T extends ActionFunc>(action: T, name: string = 'unknown'): T {
    const func = async (...args: any[]) => {
      this._triggerSubscribe('action', name, args, action, func)
      const result = await action(...args)
      _triggerDevToolAction(this._name, name, args, this._state)
      return result
    }

    return func as any
  }

  clear(type: StoreClearType): void {
    switch (type) {
      case 'state':
        this._initState()
        return
      default:
        super.clear(type)
    }
  }

  protected _initState(): void {
    this._state = reactive(this._originalState)
    this._triggerSubscribe('init',
      this._name,
      [this._originalState],
      this.constructor,
      this.constructor,
    )
  }
}

export const createStore = <T>(state: T, options?: RegisterOptions): Store<T> => (new Store<T>(state, options))
