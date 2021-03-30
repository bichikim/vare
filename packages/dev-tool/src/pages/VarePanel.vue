<template>
  <q-page>
    <q-tree
        :nodes="vareTree"
        node-key="label"
      />
    <div>{{ count }}?</div>
    <div>{{ foo }}</div>
  </q-page>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useQuasar} from 'quasar'

export default defineComponent({
  setup() {
    const quasar = useQuasar()
    const count = ref(0)
    const foo = ref('')

    // quasar.bex.send('storage.get', {key: 'hello'})
    // quasar.bex.send('tick', {key: 'hello'}).then((data) => {
    //   foo.value = data
    // })
    // quasar.bex.send('tick2', {key: 'hello'})
    quasar.bex.on('change-vare', (event) => {
      count.value += 1
    })

    const vareTree = [
      {
        label: 'foo',
      },
    ]

    return {
      vareTree,
      count,
      foo,
    }
  },
})
</script>

<style scoped>

</style>
