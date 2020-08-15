import {createStore} from 'vare'
import {spy} from 'sinon'

describe('mutations', function test() {
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
    expect(store.state.foo).to.equal('BAR')
  })
  it('should execute subscribe after executing a mutation', function test() {
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
