// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import colors from 'vuetify/lib/util/colors'
import VueI18n from 'vue-i18n'

Vue.use(Vuetify)
Vue.use(VueI18n)

const messages = {
  en: {
    $vuetify: {
      examplesButton: 'Examples',
      sidebar: {
        titleIntroduction: {
          value: 'Introduction'
        },
        title1: {
          value: 'Force1',
          children: {
            title1: {
              value: 'ForceBased'
            }
          }
        }
      }
    }
  }
}

let i18nLocale = 'en'

if (sessionStorage.getItem('i18nLocale')) {
  i18nLocale = sessionStorage.getItem('i18nLocale')
}

const i18n = new VueI18n({
  locale: i18nLocale,
  messages
})

const opts = {
  theme: {
    dark: false,
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
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
}

const vuetify = new Vuetify(opts)
export { vuetify, i18n }
