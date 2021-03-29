import {CustomInspectorNode, InspectorNodeTag} from '@vue/devtools-api'

const getLabel = (path: string[]) => path[path.length - 1]
const getId = (path: string[]) => path.join('.')

const getInspectorNode = (path: string[]): Pick<CustomInspectorNode, 'id' | 'label'> => {
  return {
    id: getId(path),
    label: getLabel(path),
  }
}

export const OBJECT_TAG_TEXT_COLOR = 0xFFFFFF
export const OBJECT_TAG_BACKGROUND_COLOR = 0x3eaf7c

const getObjectTag = (target: any): InspectorNodeTag => {
  return {
    label: Array.isArray(target) ? 'array' : typeof target,
    textColor: OBJECT_TAG_TEXT_COLOR,
    backgroundColor: OBJECT_TAG_BACKGROUND_COLOR,
  }
}

export const genInspectorNode = (target: any, path: string[] = []): CustomInspectorNode => {
  const node = getInspectorNode(path)

  if (typeof target === 'object') {
    return {
      ...node,
      tags: [
        getObjectTag(target),
      ],
      children: Object.keys(target).map((key) => {
        return genInspectorNode(target[key], [...path, key])
      }),
    }
  }

  return node
}

export const genInspectorNodeTree = (target: any, name: string): CustomInspectorNode => {
  return genInspectorNode(target, [name])
}
