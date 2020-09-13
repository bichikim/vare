import {actor} from '@/observer-trigger/actor'

// todo WIP
describe('actor', function test() {
  it('should act async function', async function test() {
    const action = (num) => Promise.resolve('foo' + num)
    const wrapper = (...args) => {
      return actor({
        action, wrapper, state: {}, triggers: {}, args, name: 'foo', namespace: 'bar', type: 'foo',
      })
    }
  })
})
