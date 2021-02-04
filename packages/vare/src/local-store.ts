import {createStore, Store, InitStateFunction} from './store'
import {provide, inject} from 'vue-demi'

export const createProvider = <S>(initState: InitStateFunction<S> | S) => {
  const id = Symbol('local-store')
  return {
    id,
    creator: () => provide(id, createStore(initState)),
  }
}

export const createInjector = <S>(id: symbol): Store<S> => {
  const result = inject<Store<S>>(id)
  if (!result) {
    throw new Error('need provider')
  }
  return result
}

export const createLocalStore = <S>(initState: InitStateFunction<S> | S) => {
  const {id, creator} = createProvider(initState)

  return {
    injectStore: () => createInjector<S>(id),
    injectState: () => createInjector<S>(id).state,
    provideStore: () => creator(),
  }
}
