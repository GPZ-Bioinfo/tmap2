<template>
  <div class="container">
    <div v-for="(count, index) in divLengths" :key="index" class="bar" :style="{ height: count * 10 + 'px' }"></div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  data() {
    return {
      numbers: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    }
  },
  computed: {
    divLengths() {
      const max = Math.max(...this.numbers)
      const min = Math.min(...this.numbers)
      const m = (max - min) / 10

      const counts = new Array(10).fill(0)

      this.numbers.forEach((num) => {
        for (let i = 1; i <= 10; i++) {
          if (num > i * m && num <= (i + 1) * m) {
            counts[i - 1]++
            break
          }
        }
      })

      return counts
    }
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px; /* Adjust this height as needed */
}

.bar {
  width: 20px;
  background-color: orange;
}
</style>
