<template>
  <div>
    <div ref="echarts" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import { data } from './static/feature_overview_barchart.json'
import * as echarts from 'echarts'

export default {
  data() {
    return {
      chartData: data,
      chart: null
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.echarts)
    this.renderChart()
  },
  methods: {
    renderChart() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          data: this.chartData.map((item) => item.variable)
        },
        xAxis: {
          type: 'category',
          data: this.chartData.map((item) => item.variable)
        },
        yAxis: {
          type: 'value'
        },
        series: this.chartData.map((item) => ({
          name: item.variable,
          type: 'bar',
          data: [item.enrich_score]
        }))
      }
      this.chart.setOption(option)
    },
    handleLegendClick() {
      this.renderChart()
    }
  }
}
</script>

<style>
/* Add your custom styles here */
</style>
