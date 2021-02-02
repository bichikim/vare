export const withCombineProps = <A extends Record<string, any>, B extends Record<string, any>, R>(
  originalFunction: (props: A & B) => R,
  additionalProps: B): ((props: A) => R) => {
  return (props: A) => {
    return originalFunction({...additionalProps, ...props})
  }
}
