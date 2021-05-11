import {Ref, UnwrapRef} from 'vue-demi'

export type MayRef<Value> = Ref<Value> | Value

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>
