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

    expect(memoFoo().value).to.equal('foo~')

    expect(memoFoo().value).to.equal('foo~')

    store.state.foo = 'bar'

    expect(memoFoo().value).to.equal('bar~')
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

    expect(memoFoo().value).to.equal('foo~')
    expect(memoFoo2().value).to.equal('foo!')
  })

  it('should return data with arg', function test() {
    const store = createStore({
      foo: 'foo',
    })

    const doMemo = spy((state, add) => {
      return state.foo + add
    })

    const memoFoo = store.compute(doMemo)

    expect(memoFoo('~').value).to.equal('foo~')
    expect(memoFoo('!').value).to.equal('foo!')
  })
})
