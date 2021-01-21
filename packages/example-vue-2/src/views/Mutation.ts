import {defineComponent, computed} from '@vue/composition-api'
import {state, setName} from '../store'

export default defineComponent({
  template: `
    <div>
      <span>{{ name }}</span>
      <button @click="handleClick">add</button>
    </div>
  `,
  setup: () => {
    const name = computed(() => (state.name))
    function handleClick() {
      setName(name.value + '1')
    }

    return {
      name,
      handleClick,
    }
  },
})
