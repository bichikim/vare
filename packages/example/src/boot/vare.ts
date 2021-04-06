import {boot} from 'quasar/wrappers'
import {state, mutate, compute, act, startDevtool} from 'vare'
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

setNames.description = 'set foo & bar names'

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

export default boot(({app}) => {
  if (process.env.NODE_ENV === 'development') {
    startDevtool(app, {foo, bar})
  }
})
