import {createStore} from '@/index'

interface State {
  bar: string
  open: boolean
}

const store = createStore<State>({
  bar: 'bar',
  open: false,
})

const state = store.state

const resolveMock = (name: string): Promise<string> => {
  return Promise.resolve(name)
}

const {setBar, setOpen} = store.mutations({
  setBar(name: string) {
    state.bar = name
  },
  setOpen(flag: boolean) {
    state.open = flag
  },
})

const {updateBar} = store.actions({
  async updateBar(name: string) {
    const result = await resolveMock(name)
    setBar(result)
    setOpen(true)
  },
})

export {setBar, setOpen, updateBar}

export default state
