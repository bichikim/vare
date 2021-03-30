import {State} from '@/state'
import {StateBase} from '@vue/devtools-api'

export type StateBases = Record<string, Omit<StateBase, 'key'>>

export const createGetStates = (states: Record<string, State<any>>) => {
  let cache: StateBases

  return () => {
    if (cache) {
      return cache
    }

    cache = Object.keys(states).reduce<StateBases>((result, key: string) => {
      const value = states[key]
      result[key] = {
        value,
        editable: true,
        objectType: 'reactive',
      }
      return result
    }, {})

    return cache
  }
}
