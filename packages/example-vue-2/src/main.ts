import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {router} from './router'

Vue.use(VueRouter)

const app = new Vue({
  render: (h) => h(App),
  router,
})

app.$mount('#app')
