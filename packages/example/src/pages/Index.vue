<template>
  <q-page class="column items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <div>{{ fooName }}</div>
    <div>{{ fooArrayOne }}</div>
    <div>{{ fooDeepBar }}</div>
    <button @click="updateName(fooName + '!')">update</button>
    <button @click="setDeepBar(fooDeepBar + '!')">set deep bar</button>
  </q-page>
</template>

<script lang="ts">
import {Todo, Meta} from 'components/models'
import ExampleComponent from 'components/CompositionComponent.vue'
import {defineComponent, ref, computed} from 'vue'
import {foo, updateName, setDeepBar} from 'src/boot/vare'

export default defineComponent({
  name: 'PageIndex',
  components: {ExampleComponent},
  setup() {
    const fooName = computed(() => foo.name)
    const fooArrayOne = computed(() => foo.array[0])
    const fooDeepBar = computed(() => foo.deep.bar)
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1',
      },
      {
        id: 2,
        content: 'ct2',
      },
      {
        id: 3,
        content: 'ct3',
      },
      {
        id: 4,
        content: 'ct4',
      },
      {
        id: 5,
        content: 'ct5',
      },
    ])
    const meta = ref<Meta>({
      totalCount: 1200,
    })
    return {todos, meta, fooName, fooArrayOne, fooDeepBar, updateName, setDeepBar}
  },
})
</script>
