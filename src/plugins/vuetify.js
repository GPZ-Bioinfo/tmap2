// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/styles/main.css' // 引入本地样式文件
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const opts = {
  theme: {
    dark: false,
    icons: {
      iconfont: 'mdi' // 使用 Material Design Icons
    },
    themes: {
      light: {
        primary: '#c8d0d4',
        secondary: '#54a8ff',
        accent: '#9c27b0',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#4caf50'
      },
      dark: {
        primary: colors.blue.darken1
      }
    }
  }
}

const vuetify = new Vuetify(opts)
export { vuetify }
