import {AllKinds, VareMember} from '@/utils'

export const createInfoMap = () => {
  const infoMap = new WeakMap<AllKinds, VareMember>()

  return {
    set: (target: AllKinds, info: VareMember) => {
      infoMap.set(target, info)
    },
    get: (target: AllKinds): VareMember | undefined => {
      return infoMap.get(target)
    },
  }
}

export const info = createInfoMap()
