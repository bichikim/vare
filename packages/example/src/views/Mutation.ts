import {h, defineComponent, computed} from 'vue'
import {state, setName} from '../store'

export default defineComponent({
  setup: () => {
    const name = computed(() => (state.name))
    function handleClick() {
      setName(name.value + '1')
    }

    return () => {
      return h('div', [
        h('span', name.value),
        h('button', {onclick: handleClick}, 'add'),
      ])
    }
  },
})
