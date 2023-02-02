<!-- <template>
  <div>
    <canvas id="canvas"></canvas>
    <i class="iconfont icon-kuangxuan" @click="brushSelect"></i>
    <svg id="brushContainer" width="100%" height="100%"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { Graph } from '@cosmograph/cosmos'

export default {
  data() {
    return {
      canvas: null,
      brushDom: null
    }
  },
  mounted() {
    this.canvas = document.querySelector('canvas')
    const config = {
      simulation: {
        repulsion: 0.5
      },
      renderLinks: true,
      linkColor: (link) => link.color,
      nodeColor: (node) => node.color,
      events: {
        onClick: (node) => {
          console.log('Clicked node: ', node)
        }
      }
      /* ... */
    }
    const graph = new Graph(canvas, config)
    graph.setData(nodes, links)
  },

  methods: {
    // 框选
    brushSelect() {
      const _this = this
      document.getElementById('brushContainer').style.display = 'block'
      _this.brushDom = d3.select('#brushContainer').append('g').attr('id', 'brush')
      _this.brushDom.call(
        d3
          .brush()
          .on('end', function () {
            const selection = d3.brushSelection(this)
            _this.selectPointsInArea(selection)
            _this.cancelBrush()
          })
          .extent([
            [0, 0],
            [this.canvas.scrollWidth, this.canvas.scrollHeight]
          ])
      )
    },
    // 取消框选
    cancelBrush() {
      this.brushDom.call(
        d3
          .brush()
          .on('.brush', null)
          .extent([
            [0, 0],
            [0, 0]
          ])
      )
      d3.select('#brushContainer').selectAll('*').remove()
      this.brushDom.attr('fill', false).attr('pointer-events', false).attr('style', false)
      document.getElementById('brushContainer').style.display = 'none'
      this.brushDom = null
    },
    // 框选高亮
    selectPointsInArea(selection) {
      this.pause() // 暂停图动画
      this.graph.selectNodesInRange(selection) // cosmograph自带方法（提供框选坐标可以使其节点高亮）
    }
  }
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
#brushContainer {
  position: absolute;
  left: 0;
  top: 0;
  display: none;
}
</style> -->
