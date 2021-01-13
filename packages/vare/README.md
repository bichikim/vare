# Vare

Vue (Vue 3.x) Share State for a vue component

Prerelease version!

This Vare works fine, however there may be some unknown bugs.
(Unit tests have not been completed yet.)

## What is this?

Vare works like Vuex.

However, this is less painful to create a Store than Vuex.

## Use Vare with Vue (Vue 3.0)

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
const setFoo = store.mutation((name: string) => (state.foo = name))

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

```typescript
import {createStore} from './src/index'


const store = createStore({
  foo: 'foo',
})

// state like Vuex state
const state = store.state

// mutation like Vuex Mutation
const setFoo = store.mutation((name: string) => (state.foo = name))

// mock api request
const request = (name: string) => (Promise.resolve(name))

// action like Vuex Action
const updateFoo = store.action(async (name) => {
  const result = await request(name)
  setFoo(result)
})

// using state in a components
export const FooComponent = defineComponent((props) => {
  const foo = computed(() => (state.name))
  return () => {
    return h('div', 
      h(Fragment, [
        h('span', foo.value),
        h('button', {onclick: () => updateFoo('bar')}, 'click')
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

## Mutations & actions
```typescript
import {createStore, Fragment} from './src/index'

const store = createStore({
  foo: 'foo',
  bar: 'bar',
})

// state like Vuex state
const state = store.state

// mutation like Vuex Mutation
const {setFoo, setBar} = store.mutations({
  setFoo(name) {
    state.foo = name
  },
  setBar(name) {
    state.bar = name
  }
})

const {actFoo, actBar} = store.actions({
  actFoo(name) {
    setFoo(name)
  },
  actBar(name) {
    setBar(name)
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
