import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { vuetify } from '@/plugins/vuetify'
import VueParticles from 'vue-particles'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
const httpLink = createHttpLink({
  uri: 'http://10.10.1.64:8889/graphql'
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})
Vue.use(VueApollo)
Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(ElementUI)
export const bus = new Vue()
new Vue({
  router,
  vuetify,
  el: '#app',
  apolloProvider,
  render: (h) => h(App)
}).$mount('#app')
