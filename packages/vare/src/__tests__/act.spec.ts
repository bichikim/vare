import {act, isAction} from '@/act'
import {mutate} from '@/mutate'
import {state} from '@/state'

const foo = state({
  name: 'foo',
})

const changeFooName = mutate((name: string) => {
  foo.name = name
})

const requestFooName = act((name: string) => {
  return Promise.resolve().then(() => {
    changeFooName(name)
  })
})

describe('act', function test() {
  it('should be action', function test() {
    expect(isAction(requestFooName)).toBe(true)
  })

  it('should act request', async function test() {
    await requestFooName('FOO')

    expect(foo.name).toBe('FOO')
  })
})
