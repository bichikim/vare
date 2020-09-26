import {createApp} from 'vue'
import App from './App.vue'
// import {createVare} from 'vare'
import router from './router'
// import {store} from './store'

// const vare = createVare({
//   plugins: [
//     (vare) => {
//       vare.subscribe(() => (console.log('subscribe in vare plugin')))
//     },
//   ],
//   stores: {
//     main: store,
//   },
// })

createApp(App)
  .use(router)
  // .use(vare)
  .mount('#app')
