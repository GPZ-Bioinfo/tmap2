<template>
  <div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect">
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
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect(key, keyPath) {
      this.$router.push('/examples/Charts1')
    }
  }
}
</script>

<style scoped></style>
