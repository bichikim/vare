import {createApp} from 'vue'
import App from './App'
import {Vare} from 'vare'
const vare = new Vare()
const subVare = new Vare()

createApp(App).use(vare).mount('#app')
createApp(App).use(subVare).mount('#sub-app')
