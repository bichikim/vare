import {createStore} from 'vare'
import {spy} from 'sinon'

describe('store mutation', function test() {
  it('should call a subscribe function after executing a mutation', function test() {
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
  it('should call all subscribe functions after executing a mutation', function test() {
    const store = createStore({
      foo: 'foo',
      bar: 'bar',
    })
    const _setFoo = (name: string) => (store.state.foo = name)
    const _setBar = (name: string) => (store.state.bar = name)
    const {setBar, setFoo} = store.mutations({
      setFoo: _setFoo,
      setBar: _setBar,
    })
    const subscribe = spy((...args: any[]) => (args))
    store.subscribe(subscribe)
    expect(store.state.foo).to.equal('foo')
    setFoo('FOO')
    expect(store.state.foo).to.equal('FOO')
    const subscribeCall0 = subscribe.getCall(0)
    expect(subscribeCall0.args).to.deep.equal([
      'setFoo',
      ['FOO'],
      _setFoo,
      setFoo,
    ])
    setBar('BAR')
    expect(store.state.bar).to.equal('BAR')
    const subscribeCall1 = subscribe.getCall(1)
    expect(subscribeCall1.args).to.deep.equal([
      'setBar',
      ['bAR'],
      _setBar,
      setBar,
    ])
  })
})
