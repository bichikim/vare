
// promise
export type MayPromise<Return = any> = Promise<Return> | Return | PromiseLike<Return>

// Args
export type DropArgsOldVer<FunctionWrapper extends (...args: any) => any, S = any> = FunctionWrapper extends (a: S, ...args: infer P) => any ? P : never;
export type DropArgs<A extends any[] = any[]> = [any, ...A]

// function
export type AnyFunction<Args extends any[] = any[], Return = any> = (...args: Args) => Return
export type OneArgAnyFunction<OneArg, Args extends any[] = any[], Return = any> = (one: OneArg, ...args: Args) => Return
export type ReturnMayPromiseFunction<Args extends any[] = any[], Return = any> = (...args: Args) => MayPromise<Return>

// object
export type ObjectKey = string | number | symbol
export type AnyObject<Key extends ObjectKey = ObjectKey, Value = any> = Record<Key, Value>
export type FunctionObject<FuncObject extends AnyObject> = {
  [Props in keyof FuncObject]: (...args: Parameters<FuncObject[Props]>) => ReturnType<FuncObject[Props]>
}
