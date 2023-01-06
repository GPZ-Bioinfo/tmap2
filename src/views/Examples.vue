<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app width="280">
      <v-divider></v-divider>
      <v-list dense>
        <v-list-group v-for="(item, key) in items" :key="key" v-model="item.active" :append-icon="item.appendIcon" @click="itemClick(item, key)">
          <template v-slot:activator>
            <v-list-item-icon style="color: #000">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content style="color: #000">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item-group v-if="item.children" style="color: #000" v-model="subItemActive">
            <v-list-item v-for="(subItem, k) in item.children" :key="k" @click="subItemClick(subItem, k)">
              <v-list-item-icon></v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark :dense="denseFlag">
      <el-page-header @back="goDashboard" title="Dashboard" style="color: #000" v-if="Dashboard_visible"> </el-page-header>
      <el-page-header @back="goBack" title="Home" style="color: #000" v-if="Home_visible"> </el-page-header>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <v-toolbar-title style="width: 300px" class="pl-4 ml-0">
        <span class="hidden-sm-and-down" style="color: #000">Tmap</span>
      </v-toolbar-title> -->

      <v-spacer />

      <!-- <v-tooltip v-if="!fullScreen" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="requestFullscreen" v-bind="attrs" v-on="on">
            <v-icon>mdi-fullscreen</v-icon>
          </v-btn>
        </template>
        <span>Full Screen</span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="exitFullScreen" v-bind="attrs" v-on="on">
            <v-icon>mdi-fullscreen-exit</v-icon>
          </v-btn>
        </template>
        <span>Exit Full Screen</span>
      </v-tooltip> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-fab-transition>
      <v-btn v-if="!hidden" color="primary" dark fixed bottom right fab @click="scrollTop">
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-snackbar :timeout="3000" v-model="snackbar" bottom :color="$vuetify.theme.themes.light.warning" outlined>NO Match! </v-snackbar>
  </v-app>
</template>

<script>
import packageJson from '../../package.json'
export default {
  data: () => ({
    snackbar: false,
    version: '',
    fullScreen: false,
    hidden: true,
    Dashboard_visible: false,
    Home_visible: true,
    dark: false,
    drawer: null,
    itemActive: 0,
    subItemActive: 0,
    selectedItem: 0,
    denseFlag: true,
    marginTop: 0,
    searchText: ''
  }),
  computed: {
    items: function () {
      return [
        {
          icon: 'mdi-view-column',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title1.value'),
          children: [{ title: this.$vuetify.lang.t('$vuetify.sidebar.title1.children.title1.value'), path: '/examples/Column' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-view-sequential ',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title2.value'),
          children: [{ title: this.$vuetify.lang.t('$vuetify.sidebar.title2.children.title1.value'), path: '/examples/Groups1' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-vector-circle',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title3.value'),
          children: [{ title: this.$vuetify.lang.t('$vuetify.sidebar.title3.children.title1.value'), path: '/examples/forcebasedI' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-chart-gantt ',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title4.value'),
          children: [{ title: this.$vuetify.lang.t('$vuetify.sidebar.title4.children.title1.value'), path: '/examples/Comparisons1' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-chart-bar ',
          title: this.$vuetify.lang.t('$vuetify.sidebar.title5.value'),
          children: [{ title: this.$vuetify.lang.t('$vuetify.sidebar.title5.children.title1.value'), path: '/examples/Charts1' }],
          appendIcon: 'mdi-chevron-down'
        }
      ]
    }
  },
  created() {
    this.$vuetify.theme.dark = false
    this.version = packageJson.version
    if (localStorage.getItem('themeDark') && localStorage.getItem('themeDark') === 'true') {
      this.$vuetify.theme.dark = true
      this.dark = true
    }
    if (this.$route.path === '/examples') {
      // default route path
      this.$router.push('/examples/dashboard').catch((err) => {}) // eslint-disable-line
    } else {
      this.$router.push(this.$route.path).catch((err) => {}) // eslint-disable-line
      const path = this.$route.path
      this.items.forEach((item, key) => {
        if (item.path === path) {
          this.itemActive = key
        } else {
          if (item.children && item.children.length > 0) {
            item.children.forEach((v, k) => {
              if (v.path === path) {
                sessionStorage.setItem('itemActive', key)
                sessionStorage.setItem('subItemActive', k)
              }
            })
          }
        }
      })

      if (sessionStorage.getItem('itemActive')) {
        this.items[0].active = false
        this.items[Number(sessionStorage.getItem('itemActive'))]['active'] = true
      }

      if (sessionStorage.getItem('subItemActive')) {
        this.subItemActive = Number(sessionStorage.getItem('subItemActive'))
      }
    }
  },
  mounted() {
    if (sessionStorage.getItem('i18nLocale') && sessionStorage.getItem('i18nLocale') === 'zh') {
      this.selectedItem = 1
    }
    document.addEventListener('fullscreenchange', () => {})

    window.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop
      if (scrollTop > 100) {
        this.hidden = false
      } else {
        this.hidden = true
      }
    })

    // -- Watch Material Design Breakpoints --
    // https://vuetifyjs.com/en/features/breakpoints/#breakpoint-service
    const self = this
    if (self.$vuetify.breakpoint.name === 'xl') {
      self.denseFlag = false
    }
    this.$watch(
      function () {
        return self.$vuetify.breakpoint.name
      },
      function (newVal, oldVal) {
        if (newVal === 'xl') {
          self.denseFlag = false
        } else {
          self.denseFlag = true
        }
      }
    )
    // -- end --
  },
  beforeDestroy() {
    sessionStorage.removeItem('subItemActive')
    sessionStorage.removeItem('itemActive')
  },
  methods: {
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    requestFullscreen() {
      this.fullScreen = true
      const docElm = document.documentElement
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
    },
    exitFullScreen() {
      this.fullScreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    },

    itemClick(item, key) {
      this.subItemActive = null
      sessionStorage.setItem('itemActive', key)
      console.dir(item)
      if (!item.children) {
        this.$router.push(item.path).catch((err) => {}) // eslint-disable-line
      }
    },
    subItemClick(item, key) {
      this.Dashboard_visible = true
      this.Home_visible = false
      sessionStorage.setItem('subItemActive', key)
      this.$router.push(item.path).catch((err) => {}) // eslint-disable-line
    },

    goDashboard() {
      this.Dashboard_visible = false
      this.Home_visible = true
      this.$router.push('/examples/dashboard').catch((err) => {}) // eslint-disable-line
    },
    goBack() {
      this.Dashboard_visible = false
      this.Home_visible = true
      this.$router.push('/Home').catch((err) => {}) // eslint-disable-line
    }
  }
}
</script>
<style scoped>
.img-container {
  display: flex;
  padding: 20px;
  width: 280px;
  height: 140px;
}
.logo-img {
  width: 45%;
  object-fit: contain;
  margin: 0 5px;
}
.img-d3-padding {
  padding: 4px !important;
}
</style>
