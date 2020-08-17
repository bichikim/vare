import {createStore} from 'vare'

describe('store mutations', function test() {
  it('should mutate foo state', function test() {
    const store = createStore({
      foo: 'foo',
      bar: 'bar',
    })

    const {setFoo, setBar} = store.mutations({
      setFoo(name) {
        store.state.foo = name
      },
      setBar(name) {
        store.state.bar = name
      },
    })

    expect(store.state.foo).to.equal('foo')
    expect(store.state.bar).to.equal('bar')
    setFoo('FOO')
    expect(store.state.foo).to.equal('FOO')
    setBar('BAR')
    expect(store.state.bar).to.equal('BAR')
  })
})
