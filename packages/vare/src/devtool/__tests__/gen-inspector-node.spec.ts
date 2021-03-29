import {genInspectorNodeTree, OBJECT_TAG_BACKGROUND_COLOR, OBJECT_TAG_TEXT_COLOR} from '../gen-inspector-node'

const tagPart = {
  textColor: OBJECT_TAG_TEXT_COLOR,
  backgroundColor: OBJECT_TAG_BACKGROUND_COLOR,
}

describe('gen-inspector-node', () => {
  it('should return with an object', () => {
    const name = 'foo'
    const result = genInspectorNodeTree({
      foo: 'foo',
    }, name)

    expect(result).toEqual({
      id: name,
      label: name,
      tags: [{
        label: 'object',
        ...tagPart,
      }],
      children: [
        {
          id: 'foo.foo',
          label: 'foo',
        },
      ],
    })
  })

  it('should return with a deep object', () => {
    const name = 'foo'
    const result = genInspectorNodeTree({
      foo: 'foo',
      deep: {
        bar: 'bar',
      },
    }, name)

    expect(result).toEqual({
      id: name,
      label: name,
      tags: [{
        label: 'object',
        ...tagPart,
      }],
      children: [
        {
          id: 'foo.foo',
          label: 'foo',
        },
        {
          id: 'foo.deep',
          label: 'deep',
          tags: [{
            label: 'object',
            ...tagPart,
          }],
          children: [
            {
              id: 'foo.deep.bar',
              label: 'bar',
            },
          ],
        },
      ],
    })
  })

  it('should return with an array', () => {
    const name = 'foo'
    const result = genInspectorNodeTree(['foo'], name)

    expect(result).toEqual({
      id: name,
      label: name,
      tags: [{
        label: 'array',
        ...tagPart,
      }],
      children: [
        {
          id: 'foo.0',
          label: '0',
        },
      ],
    })
  })

  it('should return with a deep array', () => {
    const name = 'foo'
    const result = genInspectorNodeTree(['foo', ['bar']], name)

    expect(result).toEqual({
      id: name,
      label: name,
      tags: [{
        label: 'array',
        ...tagPart,
      }],
      children: [
        {
          id: 'foo.0',
          label: '0',
        },
        {
          id: 'foo.1',
          label: '1',
          tags: [{
            label: 'array',
            ...tagPart,
          }],
          children: [
            {
              id: 'foo.1.0',
              label: '0',
            },
          ],
        },
      ],
    })
  })
})
