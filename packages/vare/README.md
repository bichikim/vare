# Vare

Vue (Vue 3.x) Share State for a vue component

This is a Prerelease version!

This Vare works well, but there may be some unknown bugs.

## What is this?

Vare works like Vuex.

However, this is less painful to create a Store than Vuex.

## Use Vare with Vue (Vue 3.0 or Vue 2 with @vue/composition-api) 

```typescript

import {state} from './src/index'
import {defineComponent, h} from 'vue'

export const myState = state({
  name: 'foo',
})

export const FooComponent = defineComponent(() => {
  const name = computed(() => (myState.name))
  return () => {
    return h('span', name.value)
  }
})

```

## State

```typescript
import {state} from './src/index'
import {defineComponent, computed, h} from 'vue'

const myState = state({
  name: 'foo',
})

// using state in a components
export const FooComponent = defineComponent(() => {
  const name = computed(() => (myState.name))
  return () => {
    return h('span', name.value)
  }
})


```

## Mutation

```typescript
import {state, mutate} from './src/index'
import {defineComponent, h} from 'vue'


const myState = state({
  name: 'foo',
})

// mutation like Vuex Mutation
const setName = mutate((name: string) => {
  myState.name = name
})

// using state in a components
export const FooComponent = defineComponent(() => {
  const name = computed(() => (state.name))
  return () => {
    return h('div', [
      h('span', name.value),
      h('button', {onclick: () => setName('bar')}, 'click')
    ])
  }
})

```

## Action

store/profile.ts
```typescript
import {state, mutate, act} from './src/index'
import {h} from 'vue'

const myState = state({
  name: 'foo',
})

// mutation like Vuex Mutation
export const setName = mutate((name: string) => {
  myState.name = name
})

// action like Vuex Action
export const requestName = act((name: string) => {
  return Promise.resolve().then(() => {
    setName(name)
  })
})

export const FooComponent = defineComponent(() => {
  const name = computed(() => (state.name))

  return () => {
    return h('div', [
      h('span', name.value),
      h('button', {onclick: () => requestName('bar')}, 'click')
    ])
  }
})
```

## Compute (Getter)

store/profile.ts
```typescript
import {state, compute, mutate} from './src/index'
import {Ref, h, defineComponent, computed, ref} from 'vue'

const myState = state({
  name: 'foo',
})

// mutation like Vuex Mutation
export const setName = mutate((name: string) => {
  myState.name = name
})

export const getDecoName = compute(() => (`~~${myState.name}~~`))

export const getCustomDecoName = compute((deco: string) => `${deco}${myState.name}${deco}`)

export const getReactiveCustomDecoName = compute((deco: Ref<string>) => {
  return `${deco.value}${myState.name}${deco.value}`
})

export const FooComponent = defineComponent(() => {
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
import {state, mutate, act, subscribe, unsubscribe} from './src/index'
import {h} from 'vue'

const myState = state({
  name: 'foo',
})

// mutation like Vuex Mutation
export const setName = mutate((name: string) => {
  myState.name = name
})

// action like Vuex Action
export const requestName = act((name: string) => {
  return Promise.resolve().then(() => {
    setName(name)
  })
})

export const getDecoName = compute(() => (`~~${myState.name}~~`))()

const hook = () => {
  // any
}

subscribe(myState, hook)

subscribe(setName, hook)

subscribe(requestName, hook)

subscribe(getDecoName, hook)

unsubscribe(myState, hook)
unsubscribe(setName, hook)
unsubscribe(requestName, hook)
unsubscribe(getDecoName, hook)

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
      h(BarComponent)
    )
  )
}

// ....

const _state = atom({
  key: '...',
  default: {name: 'foo'}
})

const foo = selector({
  key: '...',
  get: ({get}) => {
    return get(_state).name
  },
  set: ({set, get}, name) => {
    set(_state, {
      ...get(_state),
      name,
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

const myState = state({
  name: 'foo',
})


const getName = compute(() => myState.name)

const setName = mutate((name: string) => {
  state.foo = name
})

const App = defineComponent(() => {
  return () => h('div', [
    h(FooComponent),
    h(BarComponent)
  ])
})

const FooComponent = defineComponent(() => {
  const name = getName()
  
  return () => (
    h('div', name.value)
  )
})

const BarComponent = defineComponent(() => {
  return () => {
    h('div', {onclick: () => setName('bar')})
  }
})

```

### Immer 

```typescript
const myState = {
  foo: 'foo'
}

produce(myState, (draft) => {
  draft.foo = 'bar'
})

```

In the Vare way
```typescript
const myState = state({
  foo: 'foo',
})

myState.foo = 'bar'
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
    h('div', [
      h('div', store.state.count),
      h('a', {onClick: () => store.commit('increment')}),
    ])
  )
})
```

In the Vare way
```typescript
// no need to setup

const myState = state({
  count: 0,
})

const increment = mutate(() => {
  myState.count++
})

const FooComponent = defineComponent(() => {
  const count = computed(() => (myState.count))

  return () => (
    h('div', [
      h('div', count.value),
      h('a', {onClick: increment}),
    ])
  )
})
```

## Create the pack in easy way (WIP)


## Supporting Vue DevTool ?

Yes! 

- state (DONE) \
![state-devtool](./media/state-devtool.png)
- computation (WIP)
- mutation (WIP)
- action (WIP)
