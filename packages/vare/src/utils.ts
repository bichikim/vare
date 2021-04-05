export const drop = (array: any[]) => {
  const value = [...array]
  value.shift()
  return value
}

export const createUuid = () =>{
  let count = 0
  return () => {
    count += 1
    return count
  }
}
