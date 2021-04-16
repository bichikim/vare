import {setName, getName, getPlayground, setPlayground, getDescription, describe as setDescription, drop} from '@/utils'
import {state} from '@/state'
import {compute} from '@/compute'

const setup = () => {
  const foo = state({
    name: 'foo',
  }, 'foo')

  const getName = compute(() => foo.name, 'getName')

  return {foo, getName}
}

describe('utils', () => {
  it('should set & get a name', () => {
    process.env.NODE_ENV = 'development'
    const {foo} = setup()

    expect(getName(foo)).toBe('foo')
    setName(foo, 'bar')
    expect(getName(foo)).toBe('bar')
  })

  it('should get & set playground', () => {
    process.env.NODE_ENV = 'development'
    const {getName} = setup()
    expect(getPlayground(getName)).toBe(undefined)
    setPlayground(getName, {
      args: ['foo'],
    })
    expect(getPlayground(getName)).toEqual({
      args: ['foo'],
    })
  })

  it('should get & set description', () => {
    process.env.NODE_ENV = 'development'
    const {getName} = setup()
    expect(getDescription(getName)).toBe(undefined)
    setDescription(getName, 'foo-bar')
    expect(getDescription(getName)).toBe('foo-bar')
  })

  it('should return an array without first item from an original array & should not remove any items in the original array', () => {
    const array = ['foo', 'bar', 'john']
    expect(drop(array)).toEqual(['bar', 'john'])
    expect(array).toEqual(['foo', 'bar', 'john'])
  })
})
