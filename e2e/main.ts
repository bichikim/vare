import {createApp} from 'vue'
import App from './App'
import vare, {Vare} from '@/index'

const subVare = new Vare()

createApp(App).use(vare).mount('#app')
createApp(App).use(subVare).mount('#sub-app')
