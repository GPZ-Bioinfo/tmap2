import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vuetify } from '@/plugins/vuetify'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import '../src/icon/iconfont.css'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
})
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export const bus = new Vue()
new Vue({
  router,
  store,
  vuetify,
  el: '#app',
  apolloProvider,
  render: (h) => h(App)
}).$mount('#app')
