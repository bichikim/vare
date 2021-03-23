import {ComputedRef, WritableComputedRef} from '@vue/reactivity'
import {computed} from 'vue-demi'
import {AnyFunction} from './types'

export type ComputationName = 'compute'

export type ComputationRecipe<Args extends any[], Return> = (...args: Args) => Return

export type ComputationGetter<Args extends any[], Return> = (...args: Args) => Return
export type ComputationSetter<Args extends any[], Value> = (value: Value, ...args: Args) => any

export interface ComputationRecipeOptions<Args extends any[], Return> {
  get: ComputationGetter<Args, Return>
  set: ComputationSetter<Args, Return>
}

export const COMPUTATION_IDENTIFIER = Symbol('compute')

export interface DefaultComputation<T> {
  [COMPUTATION_IDENTIFIER]: boolean
}

export type Computation<Args extends any[], T> = (...args: Args) => ComputedRef<T> & DefaultComputation<T>
export type ComputationWritable<Args extends any[], T> = (...args: Args) => WritableComputedRef<T> & DefaultComputation<T>

export const isComputation = (item?: AnyFunction): item is Computation<any[], any> | ComputationWritable<any[], any> => {
  return Boolean(item?.[COMPUTATION_IDENTIFIER])
}

export function compute<Args extends any[], T>(recipe: ComputationRecipe<Args, T>): Computation<Args, T>
export function compute<Args extends any[], T>(recipe: ComputationRecipeOptions<Args, T>): ComputationWritable<Args, T>
export function compute(recipe) {
  const self = (...args: any[]): any => {
    let computedValue

    // ComputationRecipe type
    if (typeof recipe === 'function') {
      computedValue = computed(() => recipe(...args))
    } else {
      // ComputationRecipeOptions type
      computedValue = computed({
        get: () => recipe.get(...args),
        set: (value) => recipe.set(value, ...args),
      })
    }

    return computedValue
  }

  // mark ComputationIdentifier
  return Object.assign(self, {
    [COMPUTATION_IDENTIFIER]: true,
  })
}
