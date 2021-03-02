import {createStore} from '../src/index'

describe('store action', function test() {
  it('should act getFoo', async function test() {
    const store = createStore({
      foo: 'foo',
    })
    const fakeRequest = (name) => (Promise.resolve(name))
    const setFoo = store.mutation((state, name: string) => (state.foo = name))
    expect(store.state.foo).toBe('foo')
    const getFoo = store.action(async (name: string) => {
      const result = await fakeRequest(name)
      setFoo(result)
    })
    await getFoo('FOO')
    expect(store.state.foo).toBe('FOO')
  })
})
