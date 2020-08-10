import {createStore} from '@/index'

interface Log {
  name: string
  args: any[]
}

interface State {
  foo: string
  log: Log[]
}

const store = createStore<State>({
  foo: 'foo',
  log: [],
})

const state = store.state

const resolveMock = (name: string): Promise<string> => {
  return Promise.resolve(name)
}

export const setFoo = store.mutation((name: string) => {
  state.foo = name
}, 'setFoo')

export const updateFoo = store.action(async (name: string) => {
  const result = await resolveMock(name)
  setFoo(result)
}, 'updateFoo')

store.subscribe((name, args) => {
  state.log.push({name, args})
})
