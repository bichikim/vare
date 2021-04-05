import {boot} from 'quasar/wrappers'
import {startDevtool, state, mutate} from 'vare'

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

export default boot(({app}) => {
  if (process.env.NODE_ENV === 'development') {
    startDevtool(app, {foo, bar})
  }
})
