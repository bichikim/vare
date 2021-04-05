import {State, getStateRelates, NAME} from '@/state'
import {isMutation} from '@/mutate'

export const genInspectorTree = (states: Record<string, State<any>>) => {
  return Object.keys(states).map((key) => {
    const state = states[key]
    const children: any[] = []

    const relates = getStateRelates(state)

    relates.forEach((item) => {
      let type = 'unknown'

      if (isMutation(item)) {
        type = 'mutation'
      }

      const name = item?.[NAME]

      children.push({
        id: `${key}/mutation/${name}`,
        label: name,
        tags: [
          {
            label: type,
            textColor: 0x000000,
            backgroundColor: 0xFF984F,
          },
        ],
      })
    })

    return {
      id: key,
      label: key,
      children,
    }
  })
}
