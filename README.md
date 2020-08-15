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
import {createApp} from 'vue'
import App from './App'
import {Vare} from 'vare'

const vare = new Vare()

createApp(App).use(vare).mount('#app')
```
Many vue roots
```typescript
import {createApp} from 'vue'
import App from './App'
import {Vare} from 'vare'

const vare = new Vare()
const subVare = new Vare()

createApp(App).use(vare).mount('#app')
createApp(App).use(subVare).mount('#sub-app')

```

With plugins
```typescript
import {createApp} from 'vue'
import App from './App'
import {Vare} from 'vare'

const myPlugins = (vare: Vare) => {
  // vare.subscribe(...)
}

const vare = new Vare({
  plugins: [myPlugins]
})

createApp(App).use(vare).mount('#app')

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

// using state in a component
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

// using state in a component
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

// using state in a component
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

## Vare Subscribe

```typescript
import {createStore, createVare} from './src/index'

const vare = createVare()

const store = createStore({
  foo: 'foo',
}, {name: 'foo', vare})

const mySubscribe = (...args) => {console.log(...args)}

// subscribe mutation
vare.subscribe(mySubscribe)

```

## Mutations
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

// using state in a component
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

## Supporting DevTool ?

Yes (WIP)
