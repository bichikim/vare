import {relateState, State, NAME} from './state'
import {fireSubscribe, SubscribeHook, SUBSCRIPTIONS} from './subscribe'
import {AnyFunction} from './types'
import {createUuid} from './utils'

const mutationUuid = createUuid()

export type MutationRecipe<Args extends any[], Return> = (...args: Args) => Return
export type RelatedMutationRecipe<State, Args extends any[], Return> = (state: State, ...args: Args) => Return

export const MUTATION_IDENTIFIER = Symbol('mutate')

export interface MutationMember<Args extends any[]> {
  /**
   * Identifier
   */
  [MUTATION_IDENTIFIER]: boolean

  /**
   * subscriptions
   */
  [SUBSCRIPTIONS]: Set<SubscribeHook<Args>>

  [NAME]: string
}

/**
 * the mutation return type
 */
export type Mutation<Args extends any[], Return = any> = (...args: Args) => Return & MutationMember<Args>

export const isMutation = (item?: AnyFunction): item is Mutation<any[]> => {
  return Boolean(item?.[MUTATION_IDENTIFIER])
}

/**
 * create new mutation
 */
export function mutate<S extends State<any>, Args extends any[], Return = any>(
  state: S,
  recipe: RelatedMutationRecipe<S, Args, Return>,
  name?: string
): Mutation<Args>
export function mutate<Args extends any[], Return = any>(
  recipe: MutationRecipe<Args, Return>,
  name?: string
): Mutation<Args>
export function mutate(unknown, mayRecipe?: any, name?: string): Mutation<any> {
  let recipe
  let state
  let _name
  if (typeof mayRecipe === 'function') {
    state = unknown
    recipe = mayRecipe
    _name = name
  } else {
    recipe = unknown
    _name = name
  }

  if (!_name) {
    _name = `unknown-${mutationUuid()}`
  }

  // create executor
  const self = (...args: any[]): any => {
    fireSubscribe(self, ...args)
    if (state) {
      return recipe(state, ...args)
    }
    return recipe(...args)
  }

  /**
   * Add additional values
   */
  const result = Object.assign(self, {
    [MUTATION_IDENTIFIER]: true,
    [SUBSCRIPTIONS]: new Set(),
    [NAME]: _name,
  })

  // register mutation to state
  if (state) {
    relateState(state, result)
  }

  return result
}
