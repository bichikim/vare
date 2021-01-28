import {h, defineComponent, computed, ref} from 'vue'
import {state, setName, getDecoName, setDeepName, updateName, getCustomDecoName} from '../store'

export default defineComponent({
  setup: () => {
    const name = computed(() => (state.name))
    const decoName = getDecoName()
    const customDeco = ref('++')
    const customDecoName = getCustomDecoName(customDeco)
    const deepName = computed(() => (state.deep.name))

    function handleClick() {
      setName(name.value + '1')
    }

    function handleDeepClick() {
      setDeepName(deepName.value + '1')
    }

    function handleUpClick() {
      updateName(name.value + 'u')
    }

    function handleInput(event) {
      customDeco.value = event.target.value
    }

    return () => {
      return h('div', [
        h('div', [
          h('span', 'name: '),
          h('span', name.value),
        ]),
        h('div', [
          h('span', 'deco-name: '),
          h('span', decoName.value),
        ]),
        h('div', [
          h('span', 'custom-deco-name: '),
          h('span', customDecoName.value),
        ]),
        h('div', [
          h('span', 'deep-name'),
          h('span', deepName.value),
        ]),
        h('input', {onInput: handleInput, value: customDeco.value}),
        h('button', {onclick: handleClick}, 'add'),
        h('button', {onclick: handleDeepClick}, 'deep-add'),
        h('button', {onclick: handleUpClick}, 'update-add'),
      ])
    }
  },
})
