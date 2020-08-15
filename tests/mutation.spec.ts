import {createStore} from 'vare'
import {spy} from 'sinon'

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
  it('should execute subscribe after executing a mutation', function test() {
    const store = createStore({
      foo: 'foo',
    }, {name: 'foo'})
    const _setFoo = (name: string) => (store.state.foo = name)
    const setFoo = store.mutation(_setFoo, 'setFoo')
    const subscribe = spy((...args: any[]) => (args))
    store.subscribe(subscribe)
    expect(store.state.foo).to.equal('foo')
    setFoo('bar')
    expect(store.state.foo).to.equal('bar')
    const subscribeCall = subscribe.getCall(0)
    expect(subscribeCall.args).to.deep.equal([
      'setFoo',
      ['bar'],
      _setFoo,
      setFoo,
    ])
  })
})
