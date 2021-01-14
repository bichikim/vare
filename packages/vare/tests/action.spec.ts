import {createStore} from 'vare'

describe('store action', function test() {
  it('should act getfoo', async function test() {
    const store = createStore({
      foo: 'foo',
    })
    const fakeRequest = (name) => (Promise.resolve(name))
    const setFoo = store.mutation((state, name: string) => (state.foo = name))
    expect(store.state.foo).to.equal('foo')
    const getFoo = store.action(async (name: string) => {
      const result = await fakeRequest(name)
      setFoo(result)
    })
    await getFoo('FOO')
    expect(store.state.foo).to.equal('FOO')
  })
})
