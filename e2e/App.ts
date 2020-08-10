import {h, defineComponent, computed, Fragment} from 'vue'
import barState, {updateBar} from './store/bar'

export default defineComponent(() => {
  const bar = computed(() => barState.bar)
  return () => {
    h('div',
      h('div',
        h(Fragment,
          [
            h('span', 'bar:'),
            h('span', bar.value),
            h('button', {onclick: () => (updateBar(bar.value + '1'))}, 'click'),
          ],
        ),
      ),
    )
  }
})
