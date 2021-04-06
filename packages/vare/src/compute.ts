import {ComputedRef, WritableComputedRef} from '@vue/reactivity'
import {computed} from 'vue-demi'
import {getType, VareMember, beVareMember, createUuid} from './utils'
import {relateState} from '@/state'

const computationUuid = createUuid('unknown')

export type ComputationRecipe<Args extends any[], Return> = (...args: Args) => Return

export type ComputationGetter<Args extends any[], Return> = (...args: Args) => Return
export type ComputationSetter<Args extends any[], Value> = (value: Value, ...args: Args) => any
export type ComputationSetterWithState<S, Args extends any[], Value> = (state: S, value: Value, ...args: Args) => any

export interface ComputationRecipeOptions<Args extends any[], Return> {
  get: ComputationGetter<Args, Return>
  set: ComputationSetter<Args, Return>
}

export interface ComputationRecipeOptionsWithState<S, Args extends any[], Return> {
  get: ComputationGetter<[S, ...Args], Return>
  set: ComputationSetterWithState<S, Args, Return>
}

export type ComputationIdentifierName = 'computation'

export const computationName: ComputationIdentifierName = 'computation'

export const COMPUTATION_TYPE = Symbol('computation-type')

export type ComputationType = 'getter' | 'getter & setter'

export interface ComputationMember extends VareMember {
  [COMPUTATION_TYPE]: ComputationType
}

export type Computation<Args extends any[], T> = ((...args: Args) => ComputedRef<T>) & ComputationMember
export type ComputationWritable<Args extends any[], T> = ((...args: Args) => WritableComputedRef<T>) & ComputationMember

export const isComputation = (value?: any): value is Computation<any[], any> | ComputationWritable<any[], any> => {
  return getType(value) === computationName
}

export const getComputationType = (value: Computation<any, any>): ComputationType => {
  return value[COMPUTATION_TYPE]
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

export function compute<Args extends any[], T>(recipe: ComputationRecipe<Args, T>, name?: string): Computation<Args, T>
export function compute<S, Args extends any[], T>(state: S, recipe: ComputationRecipe<[S, ...Args], T>, name?: string): Computation<Args, T>
export function compute<Args extends any[], T>(recipe: ComputationRecipeOptions<Args, T>, name?: string): ComputationWritable<Args, T>
export function compute<S, Args extends any[], T>(state: S, recipe: ComputationRecipeOptionsWithState<S, Args, T>, name?: string): ComputationWritable<Args, T>
export function compute(unknown: any, mayRecipe?: any, name?: string): any {
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

  const member = beVareMember(self, computationName, _name)

  const result = Object.assign(member, {
    [COMPUTATION_TYPE]: typeof recipe === 'function' ? 'getter' : 'getter & setter',
  })

  if (state) {
    relateState(state, result)
  }

  return result
}
