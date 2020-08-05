# Vare

Vue Share State for a vue component

## What is this?

This is working same as Vuex

But this is less painful creating a Store then Vuex

## Mutation

```typescript
import {createStore} from './src/index'

const store = createStore({
  foo: 'foo',
})

// state like Vuex state
const state = store.state

// mutation like Vuex Mutation
const setFoo = store.mutation((name: string) => (state.foo = name))

// 'foo'
console.log(state.foo)

setFoo('bar')

// 'bar'
console.log(state.foo)

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

// 'foo'
console.log(state.foo)

updateFoo('bar').then(() => { 
  // 'bar'
  console.log(state.foo)
})

```

## Subscribe

```typescript

```

## Supporting DevTool ?

Yes
