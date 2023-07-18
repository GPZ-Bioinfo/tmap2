import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vuetify } from '@/plugins/vuetify'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
export const bus = new Vue()
new Vue({
  router,
  store,
  vuetify,
  el: '#app',
  render: (h) => h(App)
}).$mount('#app')
