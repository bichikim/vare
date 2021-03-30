export const isSSR = () => {
  return typeof window === 'undefined'
}
