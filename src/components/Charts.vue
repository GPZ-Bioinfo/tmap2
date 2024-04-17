<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      chartData: [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 30 },
        { name: 'D', value: 40 },
        { name: 'E', value: 50 }
      ],
      chartInstance: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart)
      const _this = this
      const option = {
        xAxis: {
          type: 'category',
          data: this.chartData.map((item) => item.name)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: this.chartData.map((item) => item.value)
          }
        ]
      }

      this.chartInstance.setOption(option)

      // 监听柱状图点击事件
      this.chartInstance.on('click', (params) => {
        const dataIndex = params.dataIndex
        console.log('dataIndex', dataIndex)
        // 取消之前的高亮
        this.chartInstance.dispatchAction({
          type: 'downplay',
          seriesIndex: 0
        })
        _this.chartInstance.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: dataIndex
        })
      })
    }
  }
}
</script>

<style>
/* 可以在这里定义样式 */
</style>
