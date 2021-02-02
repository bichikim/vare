import {createStore} from 'vare'
import {Ref} from 'vue'

export const store = createStore({
  name: 'foo',
  deep: {
    name: 'foo',
  },
})

export const state = store.state

const fakeRequest = (name: string) => new Promise<string>((resolve) => {
  setTimeout(() => resolve(name), 1000)
})

export const setName = store.mutation((state, name: string) => {
  state.name = name
})

export const getDecoName = store.compute((state) => {
  return `~~${state.name}~~`
})

export const getCustomDecoName = store.compute((state, deco: Ref<string>) => {
  return `${deco.value}${state.name}${deco.value}`
})

export const setDeepName = store.mutation((state, name: string) => {
  state.deep.name = name
})

// async action
export const updateName = store.action(async (name: string) => {
  const result = await fakeRequest(name)
  setName(result)
})
