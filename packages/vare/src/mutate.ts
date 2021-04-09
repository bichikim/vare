import {relateState, State} from './state'
import {SubscribeMember, WATCH_FLAG} from './subscribe'
import {createUuid, getType, beVareMember} from './utils'
import {ref} from 'vue-demi'

const mutationUuid = createUuid('unknown')

export type MutationRecipe<Args extends any[], Return> = (...args: Args) => Return
export type RelatedMutationRecipe<State, Args extends any[], Return> = (state: State, ...args: Args) => Return

export type MutationIdentifierName = 'mutation'

export type MutationMember<Args extends any[]> = SubscribeMember<Args>

export const mutationName: MutationIdentifierName = 'mutation'

/**
 * the mutation return type
 */
export type Mutation<Args extends any[], Return = any> = ((...args: Args) => Return) & MutationMember<Args>

export const isMutation = (value?: any): value is Mutation<any[]> => {
  return getType(value) === mutationName
}

const getMutatePrams = (unknown?, mayRecipe?: any, name?: string) => {
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
    _name = mutationUuid()
  }
  return {
    name: _name,
    recipe,
    state,
  }
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
  const {state, recipe, name: _name} = getMutatePrams(unknown, mayRecipe, name)
  const flag = ref<any[] | null>(null)

  // create executor
  const self: any = (...args: any[]): any => {
    const newArgs = state ? [state, ...args] : args

    flag.value = args
    return recipe(...newArgs)
  }

  const member = beVareMember<Mutation<any>>(self, mutationName, _name)

  /**
   * Add additional values
   */
  const result = Object.assign(member, {
    [WATCH_FLAG]: flag,
  })

  // register mutation to state
  if (state) {
    relateState(state, result)
  }

  return result
}
