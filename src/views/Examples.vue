<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Dashboard" style="color: #000" v-if="Dashboard_visible"> </el-page-header>
      <div class="humberger"><el-button class="el-icon-s-fold" style="font-size: 20px; color: #000" @click="toggleMenu" type="text"></el-button></div>
    </el-header>
    <el-container>
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" :collapse="menuCollapse">
        <el-submenu index="1">
          <template slot="title">
            <v-icon>mdi-view-column</v-icon>
            <span>Features</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">ranking</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <v-icon>mdi-view-sequential</v-icon>
            <span>Groups</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">Groups1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <v-icon>mdi-vector-circle</v-icon>
            <span>Topological Models</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">ForceBased</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <v-icon>mdi-chart-gantt</v-icon>
            <span>Comparisons</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">Comparisons1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <v-icon>mdi-chart-bar</v-icon>
            <span>Charts</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="5-1">Charts1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Dashboard_visible: true
    }
  },
  mounted() {
    this.$vuetify.theme.dark = false
  },
  computed: {
    menuCollapse() {
      return this.$store.state.isCollapse
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit('navCollapse')
    },
    handleSelect(key, keyPath) {
      if (key === '1-1') {
        this.$router.push('/project_id=genus_r1106_c421/Features')
      }
      if (key === '2-1') {
        this.$router.push('/project_id=genus_r1106_c421/Groups1')
      }
      if (key === '3-1') {
        this.$router.push('/project_id=genus_r1106_c421/ForceBased')
      }
      if (key === '4-1') {
        this.$router.push('/project_id=genus_r1106_c421/Comparisons1')
      }
      if (key === '5-1') {
        this.$router.push('/project_id=genus_r1106_c421/Charts1')
      }
    },
    goBack() {
      // this.$store.commit('removeToken')
      // localStorage.removeItem('users')
      // this.Home_visible = true
      // this.$router.push('/home').catch((err) => {})
      this.Dashboard_visible = false
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style>
.wrapper {
  height: 100%;
}
.el-header {
  height: 60px;
  background-color: #c8d0d4;
  display: flex;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 280px;
  min-height: 400px;
}
.el-submenu {
  margin-left: -20px;
}
.el-main {
  padding: 0px;
}
.el-page-header {
  height: 60px;
  width: 100px;
  justify-content: center;
  align-items: center;
}
.humberger {
  line-height: 60px;
}
</style>
