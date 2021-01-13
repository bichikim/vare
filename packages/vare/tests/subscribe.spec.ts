import {createStore} from 'vare'
import {spy} from 'sinon'

describe('store mutation', function test() {
  it('should call a subscribe function after executing a mutation', function test() {
    const store = createStore({
      foo: 'foo',
    }, {name: 'foo'})
    const _setFoo = (state, name: string) => (state.foo = name)
    const setFoo = store.mutation(_setFoo, 'setFoo')
    const subscribe = spy((...args: any[]) => {
      return args
    })
    store.subscribe(subscribe)
    expect(store.state.foo).to.equal('foo')
    setFoo('bar')
    expect(store.state.foo).to.equal('bar')
    const subscribeCall = subscribe.getCall(0)
    expect(subscribeCall).not.to.equal(null)
    expect(subscribeCall.args[0]).to.equal('setFoo')
    expect(subscribeCall.args[1]).to.deep.equal(['bar'])
  })
  // it('should call all subscribe functions after executing a mutation',async function test() {
  //   const store = createStore({
  //     foo: 'foo',
  //     bar: 'bar',
  //   })
  //   const _setFoo = (state, name: string) => (state.foo = name)
  //   const _setBar = (state, name: number) => (state.bar = name)
  //   const {setBar, setFoo} = store.mutations({
  //     setFoo: _setFoo,
  //     setBar: _setBar,
  //   })
  //   const actFoo = store.action((name: string) => name)
  //   const subscribe = spy((...args: any[]) => (args))
  //   const subscribe2 = spy((...args: any[]) => (args))
  //   store.subscribe(subscribe)
  //   store.subscribe(subscribe2, 'action')
  //   expect(store.state.foo).to.equal('foo')
  //   setFoo('FOO')
  //   expect(store.state.foo).to.equal('FOO')
  //   const subscribeCall0 = subscribe.getCall(0)
  //   expect(subscribeCall0.args[0]).to.equal('setFoo')
  //   expect(subscribeCall0.args[1]).to.deep.equal(['FOO'])
  //   setBar('BAR')
  //   expect(store.state.bar).to.equal('BAR')
  //   const subscribeCall1 = subscribe.getCall(1)
  //   expect(subscribeCall1.args[0]).to.equal('setBar')
  //   expect(subscribeCall1.args[1]).to.deep.equal(['BAR'])
  //   await actFoo('ACT')
  //   const subscribeCall2 = subscribe2.getCall(0)
  //   expect(subscribeCall2.args[0]).to.equal('unknown')
  //   expect(subscribeCall2.args[1]).to.deep.equal(['ACT'])
  // })
})
