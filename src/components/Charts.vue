<template>
  <div>
    <svg ref="svg">...</svg>
    <div ref="tooltip" class="tooltip" :style="tooltipStyle">{{ tooltipText }}</div>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      tooltipText: '',
      tooltipStyle: {
        position: 'absolute',
        'z-index': 10,
        visibility: 'hidden'
      }
    }
  },
  mounted() {
    const svg = d3.select(this.$refs.svg)
    const tooltip = d3.select(this.$refs.tooltip)

    svg.on('mousemove', () => {
      const [x, y] = d3.mouse(svg.node())
      tooltip.style('left', `${x}px`).style('top', `${y}px`)
    })

    // show/hide tooltip based on mouseover/mouseout events
    svg
      .selectAll('circle')
      .on('mouseover', (d) => {
        this.tooltipText = d.name
        this.tooltipStyle.visibility = 'visible'
      })
      .on('mouseout', () => {
        this.tooltipStyle.visibility = 'hidden'
      })
  }
}
</script>
