import {mutate, isMutation} from '@/mutate'
import {state} from '@/state'

const foo = state({
  name: 'foo',
})

const changeFooName = mutate((name: string) => {
  foo.name = name
})

describe('mutate', function test() {
  it('should be mutation', function test() {
    expect(isMutation(changeFooName)).toBe(true)
  })

  it('should mutate state', function test() {
    changeFooName('FOO')

    expect(foo.name).toBe('FOO')
  })
})
