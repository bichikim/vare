export const drop = (array: any[]) => {
  const value = [...array]
  value.shift()
  return value
}

export const createUuid = (prefix: string = '') => {
  let count = 0
  return () => {
    count += 1
    return prefix + count
  }
}

export const isSSR = (): boolean => {
  /* istanbul ignore next [no way to test] */
  return typeof window === 'undefined'
}
