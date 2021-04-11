import {boot} from 'quasar/wrappers'
import {state, mutate, compute, act, startDevtool, subscribe, describe} from 'vare'
import {ref, Ref} from 'vue'

type MayRef<T> = T | Ref<T>

export const foo = state({
  name: 'foo',
  deep: {
    bar: 'bar',
  },
  array: ['foo'],
})

export const setDeepBar = mutate(foo, (state, value: string) => {
  state.deep.bar = value
}, 'setDeepBar')

export const bar = state({
  name: 'bar',
  deep: {
    bar: 'bar',
  },
  foo,
})

export const setNames = mutate([foo, bar], ([foo, bar], value: string) => {
  foo.name = value
  bar.name = value
}, 'setNames')

export const getDeepBarDeco = compute(foo, (foo, deco: MayRef<string>) => {
  const decoRef = ref(deco)
  return `${decoRef.value}${foo.deep.bar}${decoRef.value}`
}, 'getDeepBarDeco')

export const deepBar = compute(foo, {
  get: (foo) => {
    return foo.deep.bar
  },
  set: (foo, value: string) => {
    foo.deep.bar = value
  },
}, 'deepBar')

export const updateName = act((name: string) => {
  return Promise.resolve().then(() => setNames(name))
})

subscribe(updateName, (info) => {
  console.log(info)
})

export default boot(({app}) => {
  if (process.env.NODE_ENV === 'development') {
    describe(setNames, 'set foo & bar names')
    startDevtool(app as any, {foo, bar})
  }
})
