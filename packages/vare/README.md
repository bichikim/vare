# Vare

Vue (Vue 3.x) Share State for a vue component

This is a Prerelease version!

This Vare works fine, however there are maybe some unknown bugs.
(Unit tests have not been completed yet.)

## What is this?

Vare works like Vuex.

However, this is less painful to create a Store than Vuex.

## Use Vare with Vue (Vue 3.0 or Vue 2 with @vue/composition-api) 

```typescript

import {createStore} from 'vare'

export const store = createStore({
  name: 'foo',
})

export const FooComponent = defineComponent((props) => {
  const foo = computed(() => (state.name))
  return () => {
    return h('span', foo.value)
  }
})

```

## State

```typescript
import {createStore} from './src/index'
import {defineComponent, computed, h} from 'vue'

const store = createStore({
  foo: 'foo',
})

// state like Vuex state
const state = store.state

// using state in a components
export const FooComponent = defineComponent((props) => {
  const foo = computed(() => (state.name))
  return () => {
    return h('span', foo.value)
  }
})


```

## Mutation

```typescript
import {createStore, Fragment} from './src/index'


const store = createStore({
  foo: 'foo',
})

// state like Vuex state
const state = store.state

// mutation like Vuex Mutation
const setFoo = store.mutation((state, name: string) => (state.foo = name))

// using state in a components
export const FooComponent = defineComponent((props) => {
  const foo = computed(() => (state.name))
  return () => {
    return h('div', 
      h(Fragment, [
        h('span', foo.value),
        h('button', {onclick: () => setFoo('bar')}, 'click')
      ])
    )
  }
})

```

## Action

store/profile.ts
```typescript
import {createStore} from './src/index'

const profile = createStore({
  name: 'foo',
})

// state like Vuex state
export default profile.state

// mutation like Vuex Mutation
export const setName = profile.mutation((state, name: string) => (state.foo = name))

// mock api request
const request = (name: string) => (Promise.resolve(name))

// action like Vuex Action
export const updateName = profile.action(async (name) => {
  const result = await request(name)
  setFoo(result)
})

```
views/Profile.ts
```typescript
import profile, {updateName} from 'store/profile'
import {h, defineComponent, computed, ref} from 'vue'

// using state in a components
export const Profile = defineComponent((props) => {
  const name = computed(() => (profile.name))
  
  return () => {
    return h('div',
      h(Fragment, [
        h('span', name.value),
        h('button', {onclick: () => updateName('bar')}, 'click')
      ])
    )
  }
})

```

## Compute (Getter)

store/profile.ts
```typescript
import {createStore} from './src/index'
import {Ref} from 'vue'

const profile = createStore({
  name: 'foo',
})

// state like Vuex state
export default profile.state

// mutation like Vuex Mutation
export const setName = profile.mutation((state, name: string) => (state.foo = name))

export const getDecoName = profile.compute((state) => (`~~${state.foo}~~`))

export const getCustomDecoName = profile.compute((state, deco: string) => `${deco}${state.foo}${deco}`)

export const getReactiveCustomDecoName = profile.compute((state, deco: Ref<string>) => {
  return `${deco.value}${state.name}${deco.value}`
})
```

views/Profile.ts
```typescript
import profile, {getDecoName, getCustomDecoName, getReactiveCustomDecoName, setName} from 'store/profile'
import {h, defineComponent, computed, ref} from 'vue'

// using state in a components
export const Profile = defineComponent((props) => {
  const decoName = getDecoName()
  const customDecoName = getCustomDecoName('++')
  const customDeco = ref('--')
  const customReactiveDecoName = getReactiveCustomDecoName(customDeco)

  function handleInput(event) {
    customDeco.value = event.target.value
  }
  
  return () => {
    return h('div',
      h(Fragment, [
        h('span', decoName.value), // ~~foo~~
        h('span', customDecoName.value), // ++foo++
        h('input', {onInput: handleInput, value: customDeco.value}), // --foo--
        h('button', {onclick: () => setName('bar')}, 'click')
      ])
    )
  }
})
```

## Subscribe

```typescript
import {createStore} from './src/index'


const store = createStore({
  foo: 'foo',
})

const mySubscribe = (...args) => {console.log(...args)}
const myActionSubscribe = (...args) => {console.log(...args)}

// subscribe mutation
store.subscribe(mySubscribe)

// unsubscribe
store.unsubscribe(mySubscribe)

// subscribe action
store.subscribe(myActionSubscribe, 'action')

// unsubscribe action
store.unsubscribe(myActionSubscribe, 'action')

```

## Mutations, Actions, Computes
```typescript
import {createStore, Fragment} from './src/index'

const store = createStore({
  foo: 'foo',
  bar: 'bar',
})

// state like Vuex state
const state = store.state

// mutations
const {setFoo, setBar} = store.mutations({
  setFoo(state, name) {
    state.foo = name
  },
  setBar(state, name) {
    state.bar = name
  }
})

// actions
const {actFoo, actBar} = store.actions({
  actFoo(name) {
    setFoo(name)
  },
  actBar(name) {
    setBar(name)
  }
})

// computes
const {getDecoFoo, getDecoBar} = store.actions({
  getDecoFoo(state) {
    return `~~${state.foo}~~`
  },
  getDecoBar(state) {
    return `~~${state.bar}~~`
  }
})

// using state in a components
export const FooComponent = defineComponent((props) => {
  const foo = computed(() => (state.name))
  return () => {
    return h('div', 
      h(Fragment, [
        h('span', foo.value),
        h('button', {onclick: () => actFoo('bar')}, 'click')
      ])
    )
  }
})

```

## Why 

Share state wherever you want

Recoil x Vuex x Immer

### Recoil


```typescript
function App() {
  return (
    h(RecoilRoot, null,
      h(FooComponent),
    )
  )
}

// ....

const _state = atom({
  key: '...',
  default: {foo: 'foo'}
})

const foo = selector({
  key: '...',
  get: ({get}) => {
    return get(_state).foo
  },
  set: ({set, get}, name) => {
    set(_state, {
      ...get(_state),
      foo: name,
    })
  }
})

function FooComponent() {
  const state = useRecoilValue(_state)
  
  return (
    h('div', null, state.foo)
  )
}

function BarComponent() {
  const setState = useSetRecoilState(foo)

  return (
    h('div', {onClick: () => setState('bar')})
  )
}

```
In the vare way
```typescript
// no need a context

const store = createStore({
  foo: 'foo',
})

const setFoo = store.mutation((state, name) => {
  state.foo = name
})

const App = defineComponent(() => {
  return () => h(FooComponent)
})

const FooComponent = defineComponent(() => {
  const foo = computed(() => (store.state.foo))
  
  return () => (
    h('div', foo)
  )
})

const BarComponent = defineComponent(() => {
  return () => {
    h('div', {onclick: () => setFoo('bar')})
  }
})

```

### Immer 

```typescript
const state = {
  foo: 'foo'
}

produce(state, (draft) => {
  draft.foo = 'bar'
})

```

In the Vare way
```typescript
const store = createStore({
  foo: 'foo',
})

store.state.foo = 'bar'
```

### Vuex

```typescript
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// need to setup
app.use(store)

const FooComponent = defineComponent(() => {
  const store = useStore()

  return () => (
    h('div', store.state.foo)
  )
})
```

In the Vare way
```typescript
// no need to setup

const store = createStore({
  foo: 'foo',
})

const FooComponent = defineComponent(() => {
  const foo = computed(() => (store.state.foo))

  return () => (
    h('div', foo)
  )
})
```

## Local Store (WIP)

```typescript
const {provideStore, injectStore} = createContextStore()

const FooComponent = defineComponent(() => {
  const store = provideStore({
    foo: 'foo'
  })

  const foo = computed(() => (store.state.foo))

  return () => (
    h('div', () => [
      foo,
      h(BarComponent)
    ])
  )
})

const BarComponent = defineComponent(() => {
  const store = injectStore()
  const foo = computed(() => (store.state.foo))
  return () => (
    h('div', foo)
  )
})
```

## Supporting DevTool ?

Yes (WIP)
