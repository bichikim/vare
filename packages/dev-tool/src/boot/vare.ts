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
})

export default boot(({app}) => {
  startDevtool(app, {foo, bar})
})
