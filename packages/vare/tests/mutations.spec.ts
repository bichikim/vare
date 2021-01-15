import {createStore} from '@/index'

describe('store mutations', function test() {
  it('should mutate foo state', function test() {
    const store = createStore({
      foo: 'foo',
      bar: 'bar',
    })

    const {setFoo, setBar} = store.mutations({
      setFoo(state, name) {
        state.foo = name
      },
      setBar(state, name) {
        state.bar = name
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
