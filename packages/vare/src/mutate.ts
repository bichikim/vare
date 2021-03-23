import {fireSubscribe, SUBSCRIPTIONS, SubscribeHook} from './subscribe'
import {AnyFunction} from './types'

export type MutationRecipe<Args extends any[], Return> = (...args: Args) => Return

export const MUTATION_IDENTIFIER = Symbol('mutate')

/**
 * the mutation return type
 */
export type Mutation<Args extends any[], Return = any> = (...args: Args) => Return & {
  /**
   * Identifier
   */
  [MUTATION_IDENTIFIER]: boolean

  /**
   * subscriptions
   */
  [SUBSCRIPTIONS]: Set<SubscribeHook<Args>>
}

export const isMutation = (item?: AnyFunction): item is Mutation<any[]> => {
  return Boolean(item?.[MUTATION_IDENTIFIER])
}

/**
 * create new mutation
 * @param recipe
 */
export const mutate = <Args extends any[], Return>(
  recipe: MutationRecipe<Args, Return>,
): Mutation<Args> => {
  const self = (...args: Args): Return => {
    fireSubscribe(self, ...args)
    return recipe(...args)
  }

  /**
   * Add additional values
   */
  return Object.assign(self, {
    [MUTATION_IDENTIFIER]: true,
    [SUBSCRIPTIONS]: new Set(),
  })
}
