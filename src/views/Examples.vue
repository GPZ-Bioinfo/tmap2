<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Dashboard" style="color: #000"> </el-page-header>
      <div class="humberger"><el-button class="el-icon-s-fold" style="font-size: 20px; color: #000" @click="toggleMenu" type="text"></el-button></div>
    </el-header>
    <el-container>
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" :collapse="menuCollapse">
        <el-submenu index="1">
          <template slot="title">
            <i class="iconfont icon-yuanzizhibiao-guanlianguanxi"></i>
            <span> Features</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">ranking</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="iconfont icon-groups"></i>
            <span> Groups</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">Groups1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="iconfont icon-yuanzinenglipeizhi"></i>
            <span> Topological Models</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">ForceBased</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="iconfont icon-tandem-full"></i>
            <span> Comparisons</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">Comparisons1</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="iconfont icon-chart"></i>
            <span> Charts</span>
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
    return {}
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
      let graphName = JSON.parse(localStorage.getItem('graphName'))
      if (key === '1-1') {
        this.$router.push(`/project_id=${graphName}/Features`)
      }
      if (key === '2-1') {
        this.$router.push(`/project_id=${graphName}/Groups1`)
      }
      if (key === '3-1') {
        this.$router.push(`/project_id=${graphName}/ForceBased`)
      }
      if (key === '4-1') {
        this.$router.push(`/project_id=${graphName}/Comparisons1`)
      }
      if (key === '5-1') {
        this.$router.push(`/project_id=${graphName}/Charts1`)
      }
    },
    goBack() {
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
