import {AnyFunction} from 'src/types'
import {getUnknownName} from 'src/uid'

export type AfterCallHook<Args extends any[], Data = any, Result = any> = (args: Args, result: Result, data?: Data) => any
export type BeforeCallHook<Args extends any[], Data = any> = (args: Args, data?: Data) => any

export interface CallHooksOptions<Args extends any[], Result = any> {
  before?: BeforeCallHook<Args>
  after?: AfterCallHook<Args, Result>
}

export interface ActOptions<
  State,
  Kind extends string,
  Args extends any[],
  Result = any,
  > extends CallHooksOptions<Args, Result>{
  namespace?: string
  kind: Kind
  state: State
}

export const createCallHooks = (options: CallHooksOptions<any[]>) => <A extends any[], R, Data = any>(action: AnyFunction<A, R>, data?: Data): AnyFunction<A, R> => {
  const {before, after} = options
  return (...args: A): R => {
    before?.(args, data)
    const result = action(...args)
    after?.(args, result, data)
    return result
  }
}

export const act = (options: CallHooksOptions<any[], any>) => {
  const callHooks = createCallHooks(options)

  return (wrapper?: AnyFunction) =>
    <AArgs extends any[]>(additionalArgs: AArgs) =>
      <A extends any[], R>(action: AnyFunction<[...AArgs, ...A], R>, name: string = getUnknownName()):
    AnyFunction<A, R> => {
    const wrappedActon = wrapper ? wrapper(action) : action
    const additionalArgsActon = (...args: A) => wrappedActon(...additionalArgs, ...args)
    return callHooks<A, R, string>(additionalArgsActon, name)
  }
}
