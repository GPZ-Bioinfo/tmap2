import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { vuetify, i18n } from '@/plugins/vuetify'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
export const bus = new Vue()
new Vue({
  router,
  vuetify,
  i18n,
  el: '#app',
  render: (h) => h(App)
}).$mount('#app')
