import {mutate, isMutation} from '@/mutate'
import {state} from '@/state'
import {getName, getRelates} from '@/utils'
process.env.NODE_ENV = 'development'

const setup = () => {
  const foo = state({
    name: 'foo',
    age: 10,
    gender: 'man',
  })

  const changeFooName = mutate((name: string) => {
    foo.name = name
  })

  const relateChangeName = mutate(foo, (foo, name: string) => {
    foo.name = name
  })

  const mutTree = mutate({
    changeAge: (age: number) => {
      foo.age = age
    },
    changeGender: (gender: string) => {
      foo.gender = gender
    },
  })

  const relateMutTree = mutate(foo, {
    changeAge: (foo, age: number) => {
      foo.age = age
    },
    changeGender: (foo, gender: string) => {
      foo.gender = gender
    },
  })

  return {
    foo,
    changeFooName,
    relateChangeName,
    relateMutTree,
    mutTree,
  }
}

describe('mutate', function test() {
  it('should be mutation', function test() {
    const {changeFooName} = setup()
    expect(isMutation(changeFooName)).toBeTruthy()
  })

  it('should mutate state', function test() {
    const {changeFooName, foo} = setup()
    changeFooName('FOO')

    expect(foo.name).toBe('FOO')
  })

  it('should mutate state & has relate', () => {
    const {relateChangeName, foo} = setup()
    relateChangeName('FOO')

    expect(getRelates(relateChangeName)?.has(foo)).toBeTruthy()
    expect(foo.name).toBe('FOO')
  })

  it('should mutate state & have a name be tree 1', function test() {
    const {mutTree, foo} = setup()
    mutTree.changeAge(20)

    expect(getName(mutTree.changeAge)).toBe('changeAge')
    expect(foo.age).toBe(20)
  })

  it('should mutate state & have a name by tree 2', function test() {
    const {mutTree, foo} = setup()
    mutTree.changeGender('woman')
    expect(getName(mutTree.changeGender)).toBe('changeGender')
    expect(foo.gender).toBe('woman')
  })

  it('show mutate state & have a relate by tree 1', function test() {
    const {relateMutTree, foo} = setup()

    relateMutTree.changeAge(20)
    expect(getRelates(relateMutTree.changeAge)?.has(foo)).toBeTruthy()
    expect(foo.age).toBe(20)
  })
})
