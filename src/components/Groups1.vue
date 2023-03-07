<template>
  <div ref="chart"></div>
</template>

<script>
import * as d3 from 'd3'

export default {
  data() {
    return {
      data: [10, 20, 30, 40, 50],
      width: 500,
      height: 300,
      margin: { top: 20, right: 20, bottom: 30, left: 40 }
    }
  },

  mounted() {
    // 创建SVG元素
    const svg = d3
      .select(this.$refs.chart)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    // 创建比例尺
    const xScale = d3
      .scaleBand()
      .range([0, this.width])
      .domain(this.data.map((d, i) => i))
      .padding(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([this.height, 0])

    // 创建条形
    svg
      .selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => this.height - yScale(d))

    // 创建x轴和y轴
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${this.height})`).call(xAxis)

    svg.append('g').attr('class', 'y-axis').call(yAxis)
  }
}
</script>

<style scoped>
.bar {
  fill: steelblue;
}
</style>
