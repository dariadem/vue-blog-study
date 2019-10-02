import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// set axios instance as globally available option
import { http } from './assets/utils/axios'
Vue.prototype.$http = http


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
