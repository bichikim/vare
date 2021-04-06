import {State, getStateRelates} from '@/state'
import {Mutation, mutationName} from '@/mutate'
import {actionName, Action} from '@/act'
import {computationName, Computation, getComputationType} from '@/compute'
import {getType, getName, AllKinds} from '@/utils'

export const getRelation = (state: State<any>) => {
  const relates = getStateRelates(state)
  const mutations: Mutation<any>[] = []
  const computations: Computation<any, any>[] = []
  const actions: Action<any>[] = []

  relates.forEach((item) => {
    switch (getType(item)) {
      case mutationName:
        mutations.push(item)
        break
      case actionName:
        actions.push(item)
        break
      case computationName:
        computations.push(item)
    }
  })

  return {
    mutations,
    computations,
    actions,
  }
}

const textBackgroundColors = {
  unknown: 0xFF0000,
  mutation: 0xFF984F,
  action: 0x73abfe,
  computation: 0x42b983,
  tip: 0xf8f8f8,
}

export const genInspectorTree = (states: Record<string, State<any>>) => {
  const relationMap = new Map<string, AllKinds>()
  const nodes = Object.keys(states).map((key) => {
    const state = states[key]
    const children: any[] = []

    const relates = getStateRelates(state)

    relates.forEach((item) => {
      const type = getType(item) ?? 'unknown'

      const name = getName(item)

      const id = `${key}/mutation/${name}`

      relationMap.set(id, item)

      const tags = [
        {
          label: type,
          textColor: 0x000000,
          backgroundColor: textBackgroundColors[type],
        },
      ]

      if (type === 'computation') {
        const computeType = getComputationType(item)
        if (computeType === 'getter') {
          tags.push({
            label: 'get',
            textColor: 0x000000,
            backgroundColor: textBackgroundColors.tip,
          })
        }

        if (computeType === 'getter & setter') {
          tags.push(
            {
              label: 'get',
              textColor: 0x000000,
              backgroundColor: textBackgroundColors.tip,
            },
            {
              label: 'set',
              textColor: 0x000000,
              backgroundColor: textBackgroundColors.tip,
            },
          )
        }
      }

      children.push({
        id,
        label: name,
        tags,
      })
    })

    return {
      id: key,
      label: key,
      children,
    }
  })

  return {
    relationMap,
    nodes,
  }
}
