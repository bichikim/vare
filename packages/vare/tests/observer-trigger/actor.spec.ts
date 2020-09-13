import {observerActor} from 'packages/vare/src/observer-trigger/observer-actor'

// todo WIP
describe('actor', function test() {
  it('should act async function', async function test() {
    const action = (num) => Promise.resolve('foo' + num)
    const wrapper = (...args) => {
      return observerActor({
        action, wrapper, state: {}, triggers: {}, args, name: 'foo', namespace: 'bar', type: 'foo',
      })
    }
  })
})
