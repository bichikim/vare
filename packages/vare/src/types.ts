/* eslint-disable @typescript-eslint/ban-types */
export type Constructor<T = {}> = new (...args: any[]) => T
export type AnyFunc = (...args: any[]) => any
export type AnyObject = Record<string, any>
export type PromiseAnyFunc = (...args: any[]) => PromiseLike<any> | any
