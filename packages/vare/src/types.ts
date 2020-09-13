/* eslint-disable @typescript-eslint/ban-types */
import {Ref, UnwrapRef} from 'vue'

export type Constructor<T = {}> = new (...args: any[]) => T
export type AnyFunc = (...args: any[]) => any
export type Name = string | number | symbol
export type AnyObject<T = any> = Record<Name, T>
export type PromiseAnyFunc = (...args: any[]) => PromiseLike<any> | any
export type State<S> = S extends Ref ? S : UnwrapRef<S>
