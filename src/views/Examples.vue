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

      <v-spacer />
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
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
    Dashboard_visible: false,
    Home_visible: true,
    dark: false,
    drawer: null,
    itemActive: 0,
    subItemActive: 0,
    selectedItem: 0,
    denseFlag: true,
    marginTop: 0,
    searchText: '',
    messages: ''
  }),
  computed: {
    items: function () {
      return [
        {
          icon: 'mdi-view-column',
          title: this.messages.$vuetify.sidebar.title1.value,
          children: [{ title: this.messages.$vuetify.sidebar.title1.children.title1.value, path: '/examples/Microbiome' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-view-sequential ',
          title: this.messages.$vuetify.sidebar.title2.value,
          children: [{ title: this.messages.$vuetify.sidebar.title2.children.title1.value, path: '/examples/Groups1' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-vector-circle',
          title: this.messages.$vuetify.sidebar.title3.value,
          children: [
            // { title: this.messages.$vuetify.sidebar.title3.children.title1.value, path: '/examples/forcebased' },
            { title: this.messages.$vuetify.sidebar.title3.children.title.value, path: '/examples/ForceBased' }
          ],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-chart-gantt ',
          title: this.messages.$vuetify.sidebar.title4.value,
          children: [{ title: this.messages.$vuetify.sidebar.title4.children.title1.value, path: '/examples/Comparisons1' }],
          appendIcon: 'mdi-chevron-down'
        },
        {
          icon: 'mdi-chart-bar ',
          title: this.messages.$vuetify.sidebar.title5.value,
          children: [{ title: this.messages.$vuetify.sidebar.title5.children.title1.value, path: '/examples/Charts1' }],
          appendIcon: 'mdi-chevron-down'
        }
      ]
    }
  },
  created() {
    this.$vuetify.theme.dark = false
    this.version = packageJson.version
    this.messages = {
      $vuetify: {
        sidebar: {
          title1: {
            value: 'Microbiome Features',
            children: {
              title1: {
                value: 'Meta'
              }
            }
          },
          title2: {
            value: 'Groups',
            children: {
              title1: {
                value: 'Groups1'
              }
            }
          },
          title3: {
            value: 'Topological Models',
            children: {
              // title1: {
              //   value: 'ForceBased'
              // },
              title: {
                value: 'ForceBased'
              }
            }
          },
          title4: {
            value: 'Comparisons',
            children: {
              title1: {
                value: 'Comparisons1'
              }
            }
          },
          title5: {
            value: 'Charts',
            children: {
              title1: {
                value: 'Charts1'
              }
            }
          }
        }
      }
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
