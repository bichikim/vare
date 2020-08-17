import {createStore} from 'vare'

describe('store mutation', function test() {
  it('should mutate foo state', function test() {
    const store = createStore({
      foo: 'foo',
    }, {name: 'foo'})
    const setFoo = store.mutation((name: string) => (store.state.foo = name))
    expect(store.state.foo).to.equal('foo')
    setFoo('bar')
    expect(store.state.foo).to.equal('bar')
  })
})
