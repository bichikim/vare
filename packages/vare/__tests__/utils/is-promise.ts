import {isPromise} from '@/utils'

describe('is-promise', function test() {
  it('should check promise', function test() {
    expect(isPromise(Promise.resolve())).to.equal(true)
    expect(isPromise({foo: 'foo'})).to.equal(false)
    expect(isPromise('bar')).to.equal(false)
  })
})
