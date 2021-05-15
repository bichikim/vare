<template>
  <q-page class="column items-start justify-start q-gutter-md">
    <q-card>
      <q-card-section>
        <span class="text-h5">
          foo.name
        </span>
      </q-card-section>
      <q-card-section>
        <span class="text-body1">{{ fooName }}</span>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <span class="text-h5">
          foo.array[0]
        </span>
      </q-card-section>
      <q-card-section>
        <span class="text-body1">{{ fooArrayOne }}</span>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <span class="text-h5">
          foo.deep.bar
        </span>
      </q-card-section>
      <q-card-section>
        <span class="text-body1">{{ fooDeepBar }}</span>
      </q-card-section>
    </q-card>
    <q-btn color="primary" @click="updateName(fooName + '!')">update</q-btn>
    <q-btn color="primary" @click="setDeepBar(fooDeepBar + '!')">set deep bar</q-btn>
  </q-page>
</template>

<script lang="ts">
import {foo, setDeepBar, updateName} from 'src/boot/vare'
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const fooName = computed(() => foo.name)
    const fooArrayOne = computed(() => foo.array[0])
    const fooDeepBar = computed(() => foo.deep.bar)
    return {fooName, fooArrayOne, fooDeepBar, updateName, setDeepBar}
  },
})
</script>
