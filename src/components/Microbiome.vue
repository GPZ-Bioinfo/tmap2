<template>
  <div>
    <div>
      <label for="intervalInput">横坐标等分数量：</label>
      <input id="intervalInput" type="number" v-model="interval" @input="updateChart" placeholder="输入横坐标等分数量" min="1" pattern="\d+" />
    </div>
    <div id="chartBar" style="width: 370px; height: 360px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import * as d3 from 'd3'
export default {
  name: 'EChartsWithInput',
  data() {
    return {
      chart: null,
      interval: 10, // 默认横坐标等分数量
      xData: [],
      yData: []
    }
  },
  mounted() {
    // 初始化ECharts实例
    this.chart = echarts.init(document.getElementById('chartBar'))
    // 初始化图表
    this.updateChart()
  },
  methods: {
    updateChart() {
      // 生成横坐标数据
      this.xData = this.generateXData()

      // 生成随机的纵坐标数据，确保与横坐标等分数量相匹配
      this.yData = this.generateYData()
      // 配置ECharts
      const options = {
        xAxis: {
          type: 'category',
          data: this.xData,
          axisLabel: {
            interval: Math.ceil(this.xData.length / this.interval)
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: this.yData.map((value, index) => ({
              value,
              itemStyle: {
                color: this.generateGradientColor(index)
              }
            }))
          }
        ]
      }

      // 使用配置项设置图表
      this.chart.setOption(options)
    },
    generateXData() {
      const max = 24
      const intervalValue = this.interval

      const intervalCount = Math.ceil(max / intervalValue)

      return Array.from({ length: intervalCount }, (_, index) => (index + 0.5) * intervalValue)
    },
    generateYData() {
      // 生成随机的纵坐标数据，确保与横坐标等分数量相匹配
      return Array.from({ length: this.interval }, () => Math.random() * 100)
    },
    generateGradientColor(index) {
      // 使用D3.js生成渐变颜色，并反转颜色顺序
      const colorScale = d3
        .scaleSequential()
        .domain([this.interval - 1, 0])
        .interpolator(d3.interpolateViridis) // 使用 Viridis 色带
      return colorScale(index)
    }
  },
  watch: {
    interval: 'updateChart' // Watch for changes in the interval and update the chart
  }
}
</script>

<style>
/* Add any additional styles if needed */
</style>
