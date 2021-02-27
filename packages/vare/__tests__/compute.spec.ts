import {createStore} from '../src/index'
import {spy} from 'sinon'

describe('store compute', function test() {
  it('should return memo data', function test() {
    const store = createStore({
      foo: 'foo',
    })

    const doMemo = spy((state) => {
      return state.foo + '~'
    })

    const memoFoo = store.compute(doMemo)

    expect(memoFoo().value).toBe('foo~')

    expect(memoFoo().value).toBe('foo~')

    store.state.foo = 'bar'

    expect(memoFoo().value).toBe('bar~')
  })
  it('should create many memo', function test() {
    const store = createStore({
      foo: 'foo',
    })

    const doMemo = spy((state) => {
      return state.foo + '~'
    })
    const doMemo2 = spy((state) => {
      return state.foo + '!'
    })

    const {memoFoo, memoFoo2} = store.computes({
      memoFoo: doMemo,
      memoFoo2: doMemo2,
    })

    expect(memoFoo().value).toBe('foo~')
    expect(memoFoo2().value).toBe('foo!')
  })

  it('should return data with arg', function test() {
    const store = createStore({
      foo: 'foo',
    })

    const doMemo = spy((state, add) => {
      return state.foo + add
    })

    const memoFoo = store.compute(doMemo)

    expect(memoFoo('~').value).toBe('foo~')
    expect(memoFoo('!').value).toBe('foo!')
  })
})
