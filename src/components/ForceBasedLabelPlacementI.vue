<template>
  <div>
    <div class="components">
      <!-- 全屏控件 -->
      <el-button class="fullscreen">
        <v-tooltip v-if="!fullScreen" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="requestFullscreen" v-bind="attrs" v-on="on" large>
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
          </template>
          <span>Full Screen</span>
        </v-tooltip>
        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="exitFullScreen" v-bind="attrs" v-on="on" large>
              <v-icon>mdi-fullscreen-exit</v-icon>
            </v-btn>
          </template>
          <span>Exit Full Screen</span>
        </v-tooltip>
      </el-button>
      <!-- 框选控件 -->
      <el-button class="buttonStyle" @click="brushSelect"><v-icon>mdi-crop-square</v-icon></el-button>
      <!-- 暂停控件 -->
      <el-button class="buttonStyle" v-if="buttonStop" @click="forceStop"><v-icon>mdi-pause</v-icon></el-button>
      <el-button class="buttonStyle" v-if="!buttonStop" @click="forceStart"><v-icon>mdi-play</v-icon></el-button>
      <!-- 画板控件 -->
      <el-button class="buttonStyle" @click="ColorSelect"><v-icon>mdi-palette</v-icon></el-button>
      <!-- 下载控件 -->
      <el-button class="buttonStyle" @click="screenShot"><v-icon>mdi-download</v-icon></el-button>
      <!-- 点线数量 -->
      <div class="CountBoard">
        nodes:<span class="Countnumber">{{ nodesCount }}</span
        >,links:<span class="Countnumber">{{ linksCount }}</span>
      </div>
    </div>
    <!-- d3画布 -->
    <span ref="box" style="background-color: #fff">
      <svg id="viz" class="container-border"></svg>
    </span>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { elements } from './static/gra.json'

export default {
  name: 'ForceBasedLabelPlacementI',
  data: () => ({
    snackbar: false,
    version: '',
    fullScreen: false,
    hidden: true,
    dialog: false,
    dark: false,
    drawer: null,
    itemActive: 0,
    subItemActive: 0,
    selectedItem: 0,
    denseFlag: true,
    marginTop: 0,
    searchText: '',
    width: 1200,
    height: 700,
    container: null,
    graphLayout: null,
    buttonStop: true,
    nodesCount: 0,
    linksCount: 0
  }),
  async mounted() {
    this.nodesCount = elements.nodes.length
    this.linksCount = elements.edges.length

    let label = {
      nodes: [],
      links: []
    }
    let graph = {
      nodes: [],
      links: []
    }

    for (let index = 0; index < elements.nodes.length; index++) {
      const nodesId = elements.nodes[index].data.id
      const obj1 = { id: nodesId, group: 1 }
      graph.nodes.push(obj1)
    }

    for (let index = 0; index < elements.edges.length; index++) {
      const edgesSource = elements.edges[index].data.source
      const edgesTarget = elements.edges[index].data.target
      const obj2 = {
        source: edgesSource,
        target: edgesTarget,
        value: 4
      }
      graph.links.push(obj2)
    }

    graph.nodes.forEach(function (d, i) {
      label.nodes.push({ node: d })
      label.nodes.push({ node: d })
      label.links.push({
        source: i * 2,
        target: i * 2 + 1
      })
    })

    let labelLayout = d3.forceSimulation(label.nodes).force('charge', d3.forceManyBody().strength(-50)).force('link', d3.forceLink(label.links).distance(0).strength(2))

    let graphLayout = d3
      .forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-3000))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX(this.width / 2).strength(1))
      .force('y', d3.forceY(this.height / 2).strength(1))
      .force(
        'link',
        d3
          .forceLink(graph.links)
          .id(function (d) {
            return d.id
          })
          .distance(50)
          .strength(1)
      )
      .on('tick', ticked)

    let adjlist = []

    graph.links.forEach(function (d) {
      adjlist[d.source.index + '-' + d.target.index] = true
      adjlist[d.target.index + '-' + d.source.index] = true
    })

    function neigh(a, b) {
      return a === b || adjlist[a + '-' + b]
    }
    let svg = d3.select('#viz').attr('width', this.width).attr('height', this.height)
    let container = svg.append('g')

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 4]) // eslint-disable-line
        .on('zoom', function () {
          container.attr('transform', d3.event.transform)
        })
    )
    this.container = container

    let link = container.append('g').attr('class', 'links').selectAll('line').data(graph.links).enter().append('line').attr('stroke', 'red').attr('stroke-width', '1px')

    let node = container.append('g').attr('class', 'nodes').selectAll('g').data(graph.nodes).enter().append('circle').attr('r', 5).attr('fill', 'green')

    node.on('mouseover', focus).on('mouseout', unfocus)

    node.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

    let labelNode = container
      .append('g')
      .attr('class', 'labelNodes')
      .selectAll('text')
      .data(label.nodes)
      .enter()
      .append('text')
      .text(function (d, i) {
        return i % 2 === 0 ? '' : d.node.id
      })
      .style('fill', 'blue')
      .style('font-family', 'Arial')
      .style('font-size', 12)
      .style('pointer-events', 'none') // to prevent mouseover/drag capture

    node.on('mouseover', focus).on('mouseout', unfocus)

    function ticked() {
      node.call(updateNode)
      link.call(updateLink)

      labelLayout.alphaTarget(0.3).restart()
      labelNode.each(function (d, i) {
        if (i % 2 === 0) {
          d.x = d.node.x
          d.y = d.node.y
        } else {
          let b = this.getBBox()

          let diffX = d.x - d.node.x
          let diffY = d.y - d.node.y

          let dist = Math.sqrt(diffX * diffX + diffY * diffY)

          let shiftX = (b.width * (diffX - dist)) / (dist * 2)
          shiftX = Math.max(-b.width, Math.min(0, shiftX))
          let shiftY = 16
          this.setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')')
        }
      })
      labelNode.call(updateNode)
    }

    function fixna(x) {
      if (isFinite(x)) return x
      return 0
    }

    function focus(d) {
      // console.log(d) // eslint-disable-line
      let index = d3.select(d3.event.target).datum().index
      node.style('opacity', function (o) {
        return neigh(index, o.index) ? 1 : 0.1
      })
      labelNode.attr('display', function (o) {
        return neigh(index, o.node.index) ? 'block' : 'none'
      })
      link.style('opacity', function (o) {
        return o.source.index === index || o.target.index === index ? 1 : 0.1
      })
    }

    function unfocus() {
      labelNode.attr('display', 'block')
      node.style('opacity', 1)
      link.style('opacity', 1)
    }

    function updateLink(link) {
      link
        .attr('x1', function (d) {
          return fixna(d.source.x)
        })
        .attr('y1', function (d) {
          return fixna(d.source.y)
        })
        .attr('x2', function (d) {
          return fixna(d.target.x)
        })
        .attr('y2', function (d) {
          return fixna(d.target.y)
        })
    }

    function updateNode(node) {
      node.attr('transform', function (d) {
        return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
      })
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation()
      if (!d3.event.active) graphLayout.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) graphLayout.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    this.graphLayout = graphLayout
  },
  methods: {
    brushSelect() {
      const _this = this
      _this.container.call(
        d3.brush().on('brush', function () {
          const selection = d3.brushSelection(this)
          console.log('selection', selection)
          _this.selectPointsInArea(selection)
          // const [[x0, y0], [x1, y1]] = selection
          // const nodeSelection = _this.graphLayout.find(625, 223, 1000)
          // console.log('nodeSelection', nodeSelection)
        })
      )
    },
    selectPointsInArea(selection) {
      // const [[x0, y0], [x1, y1]] = selection
      // this.graphLayout.filter((d) => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1)
    },
    // const _this = this
    // document.getElementById('viz').style.display = 'block'
    // _this.brushDom = d3.select('#viz').append('g').attr('id', 'brush')
    // _this.brushDom.call(
    //   d3.brush().on('brush', function () {
    //     const selection = d3.brushSelection(this)
    //     _this.selectPointsInArea(selection)
    //     _this.cancelBrush()
    //   })
    // )

    // brushed(){
    //   const selection = d3.brushSelection(this)
    //   this.selectPointsInArea(selection)
    // },
    // // 取消框选
    // // cancelBrush() {
    // //   this.brushDom.call(
    // //     d3
    // //       .brush()
    // //       .on('end', null)
    // //       .extent([
    // //         [0, 0],
    // //         [0, 0]
    // //       ])
    // //   )

    //   // d3.select('#viz').selectAll('*').remove()
    //   // this.brushDom.attr('fill', false).attr('pointer-events', false).attr('style', false)
    //   //   // document.getElementById('viz').style.display = 'none'
    //   //  this.brushDom = null
    // },
    // 框选高亮
    // selectPointsInArea(selection) {
    //   console.log('selection', selection)

    //   // if (selection) {
    //   //   const [[x0, y0], [x1, y1]] = selection
    //   //   this.nodes[i].filter((d) => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1).style('fill', 'steelblue')
    //   // }
    //   //  selection获得两个数组，每个数组是包含两个数字的数组，第一个是包含框的起始点的x坐标和y坐标，
    //   //   第二个是框结束点的x、y坐标，利用node的x、y坐标在和框的x、y进行大小对比，得出框内的node和edge
    //   //  再改变选中的点线的样式就行
    //   //   const dot = this.svg.append("g")
    //   //   .attr("fill", "none")
    //   //   .attr("stroke", "steelblue")
    //   //   .attr("stroke-width", 1.5)
    //   // .selectAll("circle")
    //   // .data(data)
    //   // .join("circle")
    //   //   .attr("transform", d => `translate(${x(d.x)},${y(d.y)})`)
    //   //   .attr("r", 3);
    //   // if (selection) {
    //   //   const [[x0, y0], [x1, y1]] = selection
    //   //   for (let index = 0; index < array.length; index++) {
    //   //     const element = array[index];

    //   //   }
    //   //   this.nodes[i].filter((d) => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1).style('fill', 'steelblue')
    //   // }
    // },
    forceStop() {
      this.graphLayout.stop()
      this.buttonStop = false
    },
    forceStart() {
      this.graphLayout.restart()
      this.buttonStop = true
    },
    ColorSelect() {
      console.log('ColorSelect', 1)
    },
    download() {
      console.log('download', 2)
    },
    requestFullscreen() {
      this.fullScreen = true
      const docElm = document.documentElement
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
    },
    exitFullScreen() {
      this.fullScreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    },
    screenShot() {
      console.log('screenShot', 3)
    }
    // screenShot (name, bgColor, toSVG, svgAllCss) {
    //   let exportFunc
    //   let args = []
    //   if (this.canvas) {
    //     toSVG = false
    //     exportFunc = this.$refs.canvas.canvasScreenShot
    //     args = [bgColor]
    //   } else {
    //     exportFunc = this.$refs.svg.svgScreenShot
    //     args = [toSVG, bgColor, svgAllCss]
    //   }
    //   if (toSVG) name = name || 'export.svg'

    //   exportFunc((err, url) => {
    //     if (!err) {
    //       if (!toSVG) saveImage.save(url, name)
    //       else saveImage.download(url, name)
    //     }
    //     this.$emit('screen-shot', err)
    //   }, ...args)
    // }
  }
}
</script>
<style>
/* .links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: black;
  stroke-width: 0px;
} */
.container-border {
  position: absolute;
}
.components {
  display: flex;
  position: relative;
  /* top: 100;
  left: 0; */
}
.el-icon-crop {
  font-size: 20px;
}
.el-icon-caret-right,
.el-icon-video-pause {
  font-size: 20px;
}
.fullscreen {
  padding: 0;
}
.buttonStyle {
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.CountBoard {
  font-size: 20px;
  color: rgb(118, 115, 115);
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Countnumber {
  font-size: 22px;
  color: #000;
}
</style>
