<template>
  <div class="color-strip-container">
    <div class="color-strip">
      <div class="color-block" v-for="(color, index) in colorList1" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
    </div>
    <div class="color-strip">
      <div class="color-block" v-for="(color, index) in colorList2" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
    </div>
    <div class="color-strip">
      <div class="color-block" v-for="(color, index) in colorList3" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
    </div>
    <div class="color-strip">
      <div class="color-block" v-for="(color, index) in colorList4" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colorList1: ['#eff3ff', '#bcd7e8', '#68add8', '#2b81c0', '#064e9e'],
      colorList2: ['#edf9fc', '#b1e3e3', '#62c3a4', '#25a35c', '#006e29'],
      colorList3: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      colorList4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']
    }
  },
  methods: {
    selectColor(color) {
      this.$emit('select', color)
    }
  }
}
</script>

<style scoped>
.color-strip-container {
  display: flex;
  height: 100%;
}

.color-strip {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 10px;
}

.color-block {
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}
</style>
