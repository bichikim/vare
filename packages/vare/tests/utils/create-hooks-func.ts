import {withHooksFunc} from '@/utils/create-hooks-func'
import {spy} from 'sinon'

describe('create-hooks-func', function test() {
  it('should trap out', function test() {
    const original = (value: number) => value + 1
    const trappedFunc = withHooksFunc(original, {
      trap: (value) => value > 5,
    })

    expect(trappedFunc(5)).to.equal(6)
    expect(trappedFunc(6)).to.deep.equal([6])
  })
  it('should run beforeFunc', function test() {
    const original = (value: number) => value + 1
    const trappedFunc = withHooksFunc(original, {
      // todo
      // before: () => ,
    })
  })
})
