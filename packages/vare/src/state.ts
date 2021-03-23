import {AnyObject, UnwrapNestedRefs} from '@/types'
import {reactive} from 'vue-demi'

export type State<State> = UnwrapNestedRefs<State>

/**
 * state is the vue reactive
 * @param initState
 */
export const state = <State extends AnyObject>(initState: State) => {
  return reactive<State>(initState)
}
