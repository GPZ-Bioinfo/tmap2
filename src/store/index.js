import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false, // 初始化存的值
    graphName: '',
    users: JSON.parse(localStorage.getItem('users')) || {
      token: '',
      userName: ''
    }
  },
  mutations: {
    navCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    getParam(state, payload) {
      state.user = payload
    },
    removeToken(state) {
      state.token = null // 删除vuex的token
    }
  },
  actions: {},
  modules: {}
})
