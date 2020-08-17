import {createApp} from 'vue'
import App from './App.vue'
import {createVare} from 'vare'
import router from './router'

const vare = createVare()

createApp(App)
  .use(router)
  .use(vare)
  .mount('#app')
