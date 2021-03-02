
export function * uidGen() {
  let uid = 0
  while (true) {
    yield uid += 1
  }
}

export const uid = uidGen()

export const getUid = () => uid.next().value

export const getUnknownName = (): string => {
  return `unknown ${getUid()}`
}
