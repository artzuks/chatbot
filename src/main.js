import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Chat from 'vue-beautiful-chat'
import router from './router'

Vue.use(Chat)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
