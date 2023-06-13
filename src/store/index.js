import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: false // 初始化存的值
  },
  mutations: {
    navCollapse(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {},
  modules: {}
})
