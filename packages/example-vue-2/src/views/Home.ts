import {defineComponent, h} from '@vue/composition-api'

export default defineComponent({
  setup() {
    return () => {
      return h('div', 'vare example')
    }
  },
})
