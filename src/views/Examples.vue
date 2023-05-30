<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Home" style="color: #000" v-if="Home_visible"> </el-page-header>
      <div class="humberger"><el-button class="el-icon-s-fold" style="font-size: 20px; color: #000" @click="toggleMenu" type="text"></el-button></div>
    </el-header>
    <el-container>
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" :collapse="isCollapse">
        <el-submenu index="1">
          <template slot="title">
            <v-icon>mdi-view-column</v-icon>
            <span>Microbiome Features</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">Meta</el-menu-item>
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
      isCollapse: false, // 控制侧边菜单栏的显示状态
      Home_visible: true
    }
  },
  mounted() {
    this.$vuetify.theme.dark = false
  },
  methods: {
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    handleSelect(key, keyPath) {
      if (key === '1-1') {
        this.$router.push('/examples/Microbiome')
      }
      if (key === '2-1') {
        this.$router.push('/examples/Groups1')
      }
      if (key === '3-1') {
        this.$router.push('/examples/ForceBased')
      }
      if (key === '4-1') {
        this.$router.push('/examples/Comparisons1')
      }
      if (key === '5-1') {
        this.$router.push('/examples/Charts1')
      }
    },
    goBack() {
      this.Home_visible = true
      this.$router.push('/Home').catch((err) => {}) // eslint-disable-line
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
.el-aside {
  width: 280px;
  background-color: #f5f7fa;
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
