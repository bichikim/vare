import {info} from '@/info'
import {AnyStateGroup, relateState} from '@/state'
import {ComputedRef, WritableComputedRef} from '@vue/reactivity'
import {computed} from 'vue-demi'
import {createUuid, getIdentifier} from './utils'

const computationUuid = createUuid('unknown')

export type ComputationRecipe<Args extends any[] = any, Return = any> = (...args: Args) => Return
export type ComputationStateRecipe<S, Args extends any[] = any, Return = any> = (state: S, ...args: Args) => Return
export type ComputationGetter<Args extends any[], Return> = (...args: Args) => Return
export type ComputationSetter<Args extends any[], Value> = (value: Value, ...args: Args) => any
export type ComputationSetterWithState<S, Args extends any[], Value> = (state: S, value: Value, ...args: Args) => any

export interface ComputationRecipeOptions<Args extends any[] = any, Return = any> {
  get: ComputationGetter<Args, Return>
  set: ComputationSetter<Args, Return>
}

export interface ComputationRecipeOptionsWithState<S, Args extends any[], Return> {
  get: ComputationGetter<[S, ...Args], Return>
  set: ComputationSetterWithState<S, Args, Return>
}

export type ComputationIdentifierName = 'computation'

export const computationName: ComputationIdentifierName = 'computation'

export type ComputationType = 'getter' | 'getter & setter'

export type Computation<Args extends any[], T> = ((...args: Args) => ComputedRef<T>)
export type ComputationWritable<Args extends any[], T> = ((...args: Args) => WritableComputedRef<T>)

export const isComputation = (value?: any): value is Computation<any[], any> | ComputationWritable<any[], any> => {
  return getIdentifier(value) === computationName
}

export const getComputationType = (value: Computation<any, any>): ComputationType | unknown => {
  const valueInfo = info.get(value)
  return valueInfo?.type
}

const isRecipeOption = (value?: any): value is ComputationRecipe<any, any> => {
  return typeof value === 'object' && typeof value.get === 'function' && typeof value.set === 'function'
}

const getComputePrams = (unknown: any, mayRecipe?: any, name?: string) => {
  let state
  let recipe
  let _name

  if (typeof mayRecipe === 'function' || isRecipeOption(mayRecipe)) {
    state = unknown
    recipe = mayRecipe
    _name = name
  } else {
    recipe = unknown
    _name = mayRecipe
  }

  if (!_name) {
    _name = computationUuid()
  }

  return {
    state,
    recipe,
    name: _name,
  }
}

function _compute(unknown: any, mayRecipe?: any, name?: string): any {
  const {state, name: _name, recipe} = getComputePrams(unknown, mayRecipe, name)

  const self = (...args: any[]): any => {
    let computedValue

    const newArgs = state ? [state, ...args] : args

    // ComputationRecipe type
    if (typeof recipe === 'function') {
      computedValue = computed(() => recipe(...newArgs))
    } else {
      // ComputationRecipeOptions type
      computedValue = computed({
        get: () => recipe.get(...newArgs),
        set: (value) => recipe.set(value, ...newArgs),
      })
    }

    return computedValue
  }

  info.set(self, {
    relates: new Set(),
    name: _name,
    identifier: computationName,
    type: typeof recipe === 'function' ? 'getter' : 'getter & setter',
  })

  if (state) {
    relateState(state, self)
  }

  return self
}

function _treeCompute(mayState: any, mayTree?) {
  let tree
  let state
  if (mayTree) {
    tree = mayTree
    state = mayState
  } else {
    tree = mayState
  }

  return Object.keys(tree).reduce((result, name) => {
    const value = tree[name]
    if (state) {
      result[name] = _compute(state, value, name)
    } else {
      result[name] = _compute(value, name)
    }
    return result
  }, {} as Record<any, any>)
}

export type ComputeParameters<T extends ComputationRecipe | ComputationRecipeOptions> = T extends (...args: infer P) => any ? P : (T extends {get: (...args: infer P) => any} ? P : never)
export type ComputeDropParameters<T extends ComputationRecipe | ComputationRecipeOptions, S = any> = T extends (a: S, ...args: infer P) => any ? P : (T extends {get: (a: S, ...args: infer A) => any} ? A : never)

export function compute<Args extends any[], T> (
  recipe: ComputationRecipe<Args, T>,
  name?: string,
): Computation<Args, T>
export function compute<S extends AnyStateGroup, Args extends any[], T> (
  state: S,
  recipe: ComputationRecipe<[S, ...Args], T>,
  name?: string,
): Computation<Args, T>
export function compute<Args extends any[], T> (
  recipe: ComputationRecipeOptions<Args, T>,
  name?: string,
): ComputationWritable<Args, T>
export function compute<S extends AnyStateGroup, Args extends any[], T> (
  state: S,
  recipe: ComputationRecipeOptionsWithState<S, Args, T>,
  name?: string,
): ComputationWritable<Args, T>
export function compute<Key extends string, Func extends ComputationRecipe> (
  tree: Record<Key, Func>,
): Record<Key, (...args: ComputeParameters<Func>) => ComputedRef<ReturnType<Func>>>
export function compute<S extends AnyStateGroup, Key extends string, Func extends ComputationStateRecipe<S>> (
  state: S,
  tree: Record<Key, Func>,
): Record<Key, (...args: ComputeDropParameters<Func>) => ComputedRef<ReturnType<Func>>>
export function compute(unknown: any, mayTree?, name?: string): any {
  if (typeof unknown === 'function' || isRecipeOption(unknown) || typeof mayTree === 'function' || isRecipeOption(mayTree)) {
    return _compute(unknown, mayTree, name)
  }
  return _treeCompute(unknown, mayTree)
}
