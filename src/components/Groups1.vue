<template>
  <div>
    <svg ref="chart"></svg>
    <button @click="animateSelection">Animate Selection</button>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  data() {
    return {
      data: [
        { month: 'January', value: 10 },
        { month: 'February', value: 20 },
        { month: 'March', value: 15 },
        { month: 'April', value: 25 },
        { month: 'May', value: 30 },
        { month: 'June', value: 18 },
        { month: 'July', value: 22 },
        { month: 'August', value: 12 },
        { month: 'September', value: 28 },
        { month: 'October', value: 14 },
        { month: 'November', value: 24 },
        { month: 'December', value: 16 }
      ],
      selectionRect: null
    }
  },
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      const margin = { top: 20, right: 20, bottom: 50, left: 50 }
      const width = 600 - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom

      const svg = d3
        .select(this.$refs.chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const xScale = d3
        .scaleBand()
        .domain(this.data.map((d) => d.month))
        .range([0, width])
        .padding(0.1)

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.data, (d) => d.value)])
        .range([height, 0])

      svg
        .selectAll('rect')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.month))
        .attr('y', (d) => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d.value))
        .attr('fill', 'steelblue')

      const drag = d3.drag().on('start', this.dragStart).on('drag', this.dragging).on('end', this.dragEnd)

      svg.call(drag)
    },
    dragStart() {
      if (this.selectionRect) {
        this.selectionRect.remove()
      }

      const [x, y] = d3.mouse(this.$refs.chart)
      this.selectionRect = d3.select(this.$refs.chart).append('rect').attr('class', 'selection').attr('x', x).attr('y', y).attr('width', 0).attr('height', 0)
    },
    dragging() {
      const [x1, y1] = d3.mouse(this.$refs.chart)
      const [x0, y0] = [this.selectionRect.attr('x'), this.selectionRect.attr('y')]

      this.selectionRect
        .attr('x', Math.min(x0, x1))
        .attr('y', Math.min(y0, y1))
        .attr('width', Math.abs(x1 - x0))
        .attr('height', Math.abs(y1 - y0))
    },
    dragEnd() {
      const selectedMonths = []

      const bars = d3.selectAll('rect')

      bars.each((d, i, nodes) => {
        const bar = d3.select(nodes[i])
        const xBar = +bar.attr('x')
        const yBar = +bar.attr('y')

        if (
          xBar >= +this.selectionRect.attr('x') &&
          xBar + +bar.attr('width') <= +this.selectionRect.attr('x') + +this.selectionRect.attr('width') &&
          yBar >= +this.selectionRect.attr('y') &&
          yBar + +this.selectionRect.attr('height') <= +this.selectionRect.attr('y') + +this.selectionRect.attr('height')
        ) {
          selectedMonths.push(d.month)
        }
      })

      console.log('Selected Months:', selectedMonths)

      this.selectionRect.remove()
    },
    animateSelection() {
      const chartWidth = +d3.select(this.$refs.chart).attr('width')
      this.selectionRect
        .transition()
        .duration(5000)
        .attr('x', chartWidth - +this.selectionRect.attr('width'))
        .on('end', () => {
          // Do something after the animation is complete
        })
    }
  }
}
</script>

<style>
rect.selection {
  fill: gray;
  fill-opacity: 0.5;
  stroke: black;
  stroke-width: 2;
}
</style>
