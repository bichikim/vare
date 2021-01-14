import {createStore} from 'vare'

describe('store actions', function test() {
  it('should act getFoo & getBar ', async function test() {
    const store = createStore({
      foo: 'foo',
      bar: 'bar',
    })
    const fakeRequest = (name) => (Promise.resolve(name))
    const {setFoo, setBar} = store.mutations({
      setFoo(state, name: string) {
        state.foo = name
      },
      setBar(state, name: string) {
        state.bar = name
      },
    })

    const {getFoo, getBar} = store.actions({
      async getFoo(name) {
        const result = await fakeRequest(name)
        setFoo(result)
      },
      async getBar(name) {
        const result = await fakeRequest(name)
        setBar(result)
      },
    })

    expect(store.state.foo).to.equal('foo')
    expect(store.state.bar).to.equal('bar')
    await getFoo('FOO')
    expect(store.state.foo).to.equal('FOO')
    await getBar('BAR')
    expect(store.state.bar).to.equal('BAR')
  })
})
