import {createStore} from '../src/index'

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

    expect(store.state.foo).toBe('foo')
    expect(store.state.bar).toBe('bar')
    setFoo('FOO')
    expect(store.state.foo).toBe('FOO')
    setBar('BAR')
    expect(store.state.bar).toBe('BAR')
  })
})
