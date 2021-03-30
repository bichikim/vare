import {State} from '@/state'

export const genInspectorTree = (states: Record<string, State<any>>) => {
  return Object.keys(states).map((key) => {
    return {
      id: key,
      label: key,
    }
  })
}
