import {AllKinds, getDescription, getName, getIdentifier, getRelates} from '@/utils'
import {CustomInspectorState} from '@vue/devtools-api'

export const genNoneStateInfo = (target: AllKinds): CustomInspectorState => {
  const relate = getRelates(target)
  const type = getIdentifier(target) ?? 'unknown'
  const raw = target?.toString() ?? 'empty'
  const description = getDescription(target)
  const name = getName(target) ?? 'unknwon'

  const result: CustomInspectorState = {
    info: [
      {
        key: 'name',
        value: {
          _custom: {
            display: name,
          },
        },
        editable: false,
      },
      {
        key: 'type',
        value: {
          _custom: {
            display: type,
          },
        },
        editable: false,
      },

    ],
  }

  if (description) {
    result.info.push({
      key: 'description',
      value: {
        _custom: {
          display: description ?? 'none',
          type: 'function',
          tooltip: raw,
        },
      },
      editable: false,
      raw,
    })
  }

  if (relate && relate.size > 0) {
    result.relation = []

    relate.forEach((state) => {
      const name = getName(state) ?? 'unknown'
      result.relation.push({
        key: name,
        editable: false,
        value: {
          _custom: {
            display: 'state',
          },
        },
      })
    })
  }

  return result
}