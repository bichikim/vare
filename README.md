# Vare

Vue Share State for a vue component

Prerelease version!

This Vare works fine, however there may be some unknown bugs.
(Unit tests have not been completed yet.)

## What is this?

Vare works like Vuex.

However, this is less painful to create a Store than Vuex.

## State

```typescript
import {createStore} from './src/index'
import {defineComponent, computed, h} from 'vue'

const store = createStore({
  foo: 'foo',
})

// state like Vuex state
const state = store.state

// using state in component
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

// using state in component
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

// using state in component
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
store.subscribe(mySubmySubscribe)

// unsubscribe
store.unsubscribe(mySubmySubscribe)

// subscribe action
store.subscribeAction(myActionSubscribe)

// unsubscribe action
store.unsubscribeAction(myActionSubscribe)

```

## Supporting DevTool ?

Yes (WIP)
