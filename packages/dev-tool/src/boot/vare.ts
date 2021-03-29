import {boot} from 'quasar/wrappers'
import {startDevtool, state} from 'vare'

export const foo = state({
  name: 'foo',
  deep: {
    bar: 'bar',
  },
  array: ['foo'],
})

export const bar = state({
  name: 'bar',
  deep: {
    bar: 'bar',
  },
  foo,
})

export default boot(({app}) => {
  if (process.env.NODE_ENV !== 'development') {
    startDevtool(app, {foo, bar})
  }
})
