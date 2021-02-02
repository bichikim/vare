import {createStore} from '../src/index'

describe('store mutation', function test() {
  it('should mutate foo state', function test() {
    const store = createStore({
      foo: 'foo',
    }, {name: 'foo'})
    const setFoo = store.mutation((state, name: string) => (state.foo = name))
    expect(store.state.foo).to.equal('foo')
    setFoo('bar')
    expect(store.state.foo).to.equal('bar')
  })
})
