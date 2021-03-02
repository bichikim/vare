import {createStore} from '../src/store'
import {spy} from 'sinon'

describe('store subscribe', function test() {
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
    expect(store.state.foo).toBe('foo')
    setFoo('bar')
    expect(store.state.foo).toBe('bar')
    const subscribeCall = subscribe.getCall(0)
    expect(subscribeCall).not.toBe(null)
    expect(subscribeCall.args[0]).toBe('setFoo')
    expect(subscribeCall.args[1]).toEqual(['bar'])
  })
  it('should call all subscribe functions after executing a mutation', async function test() {
    const store = createStore({
      foo: 'foo',
      bar: 'bar',
    })
    const _setFoo = (state, name: string) => (state.foo = name)
    const _setBar = (state, name: number) => (state.bar = name)

    const {setBar, setFoo} = store.mutations({
      setFoo: _setFoo,
      setBar: _setBar,
    })
    const actFoo = store.action((name: string) => name)
    const subscribe = spy((...args: any[]) => (args))
    const subscribe2 = spy((...args: any[]) => (args))
    store.subscribe(subscribe)
    store.subscribe(subscribe2, 'action')
    expect(store.state.foo).toBe('foo')
    setFoo('FOO')
    expect(store.state.foo).toBe('FOO')
    const subscribeCall0 = subscribe.getCall(0)
    expect(subscribeCall0.args[0]).toBe('setFoo')
    expect(subscribeCall0.args[1]).toEqual(['FOO'])
    setBar('BAR')
    expect(store.state.bar).toBe('BAR')
    const subscribeCall1 = subscribe.getCall(1)
    expect(subscribeCall1.args[0]).toBe('setBar')
    expect(subscribeCall1.args[1]).toEqual(['BAR'])
    await actFoo('ACT')
    const subscribeCall2 = subscribe2.getCall(0)
    expect(subscribeCall2.args[0]).toBe('unknown 2')
    expect(subscribeCall2.args[1]).toEqual(['ACT'])
  })
})
