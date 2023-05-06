<template>
  <div>
    <div class="components">
      <!-- 全屏控件 -->
      <el-button class="buttonStyle" @click="requestFullscreen" v-if="fullScreen"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="全屏">
          <v-icon>mdi-fullscreen</v-icon>
        </el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="exitFullScreen" v-if="!fullScreen"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消全屏"> <v-icon>mdi-fullscreen-exit</v-icon></el-tooltip></el-button
      >
      <!-- 暂停控件 -->
      <el-button class="buttonStyle" v-if="buttonStop" @click="forceStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="暂停"><v-icon>mdi-pause</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" v-if="!buttonStop" @click="forceStart"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="开始"><v-icon>mdi-play</v-icon></el-tooltip></el-button
      >
      <!-- 高亮邻居 -->
      <el-button class="buttonStyle" @click="highLight" v-if="LightStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="高亮邻居"><v-icon>mdi-auto-fix</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="LightCancel" v-if="!LightStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消高亮"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >
      <!-- 框选控件 -->
      <el-button class="buttonStyle" @click="brushSelect" v-if="brushStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="框选"><v-icon>mdi-crop-square</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="brushCancel" v-if="!brushStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消框选"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >
      <!-- 多选按钮 -->
      <el-button class="buttonStyle" @click="MultiSelect" v-if="SelectStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="多选"><v-icon>mdi-selection-search</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="SelectCancel" v-if="!SelectStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消多选"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >

      <!-- 直方图控件 -->
      <el-button class="buttonStyle" @click="ChartBarNone" v-if="histogramExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="直方图"><v-icon>mdi-chart-histogram</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="theChartBar" v-if="!histogramExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="显示直方图"><v-icon>mdi-reply</v-icon></el-tooltip></el-button
      >
      <!-- 修改控件 -->
      <el-button class="buttonStyle" @click="NodesEditBoardClose" v-if="NodesEditBoardExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="节点编辑"><v-icon>mdi-pencil-minus</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="nodeEdit" v-if="!NodesEditBoardExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="显示编辑板"><v-icon>mdi-reply</v-icon></el-tooltip></el-button
      >
      <!-- 画板控件 -->
      <el-button class="buttonStyle" @click="colorBoardClose" v-if="colorBoardExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="调色板"><v-icon>mdi-palette</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="ColorSelect" v-if="!colorBoardExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="显示调色板"><v-icon>mdi-reply</v-icon></el-tooltip></el-button
      >
      <!-- 下载控件 -->
      <el-button class="buttonStyle" @click="screenShot"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="图片导出"><v-icon>mdi-download</v-icon></el-tooltip></el-button
      >
    </div>
    <!-- 点线数量 -->
    <div class="CountBoard">
      nodes:<span class="CountNumber">{{ nodesCount }}</span
      >,links:<span class="CountNumber">{{ linksCount }}</span>
    </div>
    <!-- 直方图 -->
    <el-button v-if="histogramExit" style="position: absolute; left: 0px; top: 470px; z-index: 10" type="info" size="small" round @click="ChartBarNone">收起</el-button>
    <el-button v-if="!histogramExit" style="position: absolute; left: 0px; top: 470px; z-index: 10" type="info" size="small" round @click="theChartBar">弹出</el-button>
    <div id="chartBar" style="width: 500px; height: 450px"></div>
    <!-- 数据面板 -->
    <el-card class="dataBoard" v-if="boardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Selected</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="boardClose">❌</el-button>
      </div>
      <div v-for="(item, index) in nodesData" :key="index" class="dataCard">
        {{ index + 1 + '、 ' + item }}
      </div>
    </el-card>
    <!-- 取色板 -->
    <el-card class="colorBoard" v-if="colorBoardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Color Cast</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="colorBoardClose">❌</el-button>
      </div>
      <h3 style="text-align: center">Please select a data column below</h3>
      <v-select label="Degree" :items="['Degree']"></v-select>
      <div style="text-align: center">
        <el-radio-group v-model="radio" style="margin-top: 10px">
          <el-radio :label="3">Sequential</el-radio>
          <el-radio :label="6">Qualitative</el-radio>
          <el-radio :label="9">Diverging</el-radio>
        </el-radio-group>
      </div>
      <!-- 色带 -->
      <div class="color-strip-container">
        <div class="color-strip" @click="colorBarChange1">
          <div class="color-block" v-for="(color, index) in colorList1" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
        <div class="color-strip" @click="colorBarChange2">
          <div class="color-block" v-for="(color, index) in colorList2" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
        <div class="color-strip" @click="colorBarChange3">
          <div class="color-block" v-for="(color, index) in colorList3" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
        <div class="color-strip" @click="colorBarChange4">
          <div class="color-block" v-for="(color, index) in BarColorList" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
      </div>
      <div class="colorBoardButton">
        <el-button @click="colorBarCancel">Cancel</el-button>
        <el-button>Reset</el-button>
        <el-button @click="dataGet">Preview</el-button>
        <el-button>Apply Color Palette</el-button>
      </div>
    </el-card>
    <!-- 节点编辑面板 -->
    <el-card class="NodesEditBoard" v-if="NodesEditBoardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Nodes Edit</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="NodesEditBoardClose">❌</el-button>
      </div>
      <!-- 搜索框部分关键字检索 -->
      <div>
        <el-autocomplete v-model="state1" :fetch-suggestions="querySearch" placeholder="请输入关键字" :suffix-icon="icon" clearable style="width: 500px" @select="handleSelect"> </el-autocomplete>
      </div>
      <!-- 大类小类选择器 -->
      <div class="block">
        <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange" placeholder="大类信息"></el-cascader>
      </div>
      <div>
        <div>
          <span>max:</span>
          <el-input v-model="max" placeholder="输入最大值" />
        </div>
        <div>
          <span>min:</span>
          <el-input v-model="min" placeholder="输入最小值" />
        </div>
        <el-button @click="nodeFilter">Edit</el-button>
      </div>

      <div>
        <el-button @click="nodeReset">Reset</el-button>
      </div>
      <div class="sliderBox">
        <el-slider v-model="valueTooltip" class="sliderTooltip" @change="forceChange"></el-slider>
        <span>{{ valueTooltip }}</span>
      </div>
    </el-card>
    <!-- d3画布 -->

    <svg id="viz"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
import { elements } from './static/fgfp_graph_SAFE_dat.json'
import axios from 'axios'

export default {
  name: 'ForceBasedLabelPlacementI',
  data: () => ({
    max: '',
    min: '',
    graph: '',
    valueTooltip: 10,
    fullScreen: true,
    width: window.innerWidth,
    height: window.innerHeight,
    container: null,
    graphLayout: null,
    graphTrans: null,
    buttonStop: true,
    brushStop: true,
    nodesCount: 0,
    linksCount: 0,
    svg: null,
    node: null,
    link: null,
    boardExit: false,
    nodesData: [],
    nodesDataId: [],
    SelectStop: true,
    labelNode: null,
    graphLinks: null,
    LightStop: true,
    multiple: 10,
    brush: null,
    graphNodes: null,
    labelLayout: null,
    histogramExit: true,
    colorBoardExit: true,
    radio: 3,
    colorList1: ['#eff3ff', '#bcd7e8', '#68add8', '#2b81c0', '#064e9e'],
    colorList2: ['#edf9fc', '#b1e3e3', '#62c3a4', '#25a35c', '#006e29'],
    colorList3: ['#ffeede', '#febf80', '#ff8d2e', '#e95406', '#a83500'],
    BarColorList: ['#b2392d', '#f09e30', '#7cf728', '#25a8b6', '#244e96'],
    option: null,
    icon: 'el-icon-search',
    NodesEditBoardExit: true,
    dataList: [],
    value: [],
    state1: '',
    propertyChangeData: '',
    options: [
      {
        label: '人口统计学',
        children: [
          {
            label: '年龄',
            value: '年龄'
          }
        ]
      },
      {
        label: '人口测量学',
        children: [
          {
            label: 'BMI',
            value: 'BMI'
          },
          {
            label: '体重',
            value: '体重'
          },
          {
            label: '身高',
            value: '身高'
          }
        ]
      },
      {
        label: '其他',
        children: [
          {
            label: 'BMQ',
            value: 'BMQ'
          }
        ]
      }
    ]
  }),
  async mounted() {
    this.nodesCount = elements.nodes.length
    this.linksCount = elements.links.length

    this.graph = {
      nodes: elements.nodes,
      links: elements.links
    }
    let graph = this.graph

    let graphLayout = d3
      .forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(this.width / 3, this.height / 2))
      .force('x', d3.forceX(this.width / 3).strength(1))
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
    let graphTrans = d3.zoomTransform(graph.nodes)
    this.graphLayout = graphLayout
    this.graphTrans = graphTrans
    this.graphLinks = graph.links
    this.graphNodes = graph.nodes

    let svg = d3.select('#viz').attr('width', this.width).attr('height', this.height)
    this.svg = svg
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

    let link = container.attr('class', 'links').selectAll('line').data(graph.links).enter().append('line').attr('stroke', 'pink').attr('stroke-width', '1px')

    let node = container
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', function (d) {
        return d.size
      })
      .attr('id', function (d) {
        return d.id
      })
      .attr('Bristol_stool_score', function (d) {
        return d.Bristol_stool_score
      })
      .style('stroke', '#caa455')
      .style('stroke-width', '1px')
      .style('stroke-linecap', 'round')

    // 节点悬浮显示id
    let focusId = null
    node.on('mouseover', idFocus).on('mouseout', idUnFocus)
    function idFocus(d) {
      focusId = container
        .append('text')
        .text(d.id)
        .attr('x', d.x + 8)
        .attr('y', d.y - 10)
        .style('font-family', 'Arial')
        .style('font-size', 20)
        .style('pointer-events', 'none')
    }
    function idUnFocus(d) {
      focusId.remove()
    }

    this.node = node
    this.link = link
    function ticked() {
      node.call(updateNode)
      link.call(updateLink)
    }

    function fixna(x) {
      if (isFinite(x)) return x
      return 0
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
    const drag = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
    node.call(drag)
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

    // 图表
    const _this = this
    _this.nodesCount = elements.nodes.length
    _this.linksCount = elements.links.length
    const num1 = []
    const num2 = []
    const num3 = []
    const num4 = []
    const num5 = []
    this.node.attr('fill', function (d) {
      d.id = Number(d.id)
      if (d.id < 70) {
        num1.push(d.id)
        return '#b2392d'
      } else if (d.id >= 70 && d.id < 200) {
        num2.push(d.id)
        return '#f09e30'
      } else if (d.id >= 200 && d.id < 360) {
        num3.push(d.id)
        return '#7cf728'
      } else if (d.id >= 360 && d.id < 500) {
        num4.push(d.id)
        return '#27b7c7'
      } else {
        num5.push(d.id)
        return '#244e96'
      }
    })
    const myChart = echarts.init(document.getElementById('chartBar'))
    const option = {
      grid: {
        left: '3%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        name: 'id',
        nameGap: 25,
        nameLocation: 'middle',
        nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
        data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
      },
      yAxis: {
        name: '节点数量',
        nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      series: [
        {
          type: 'bar',
          // data: [1, 2, 3, 4, 5, 6, 7, 8],
          data: [num1.length, num2.length, num3.length, num4.length, num5.length],
          label: {
            show: true,
            position: 'top'
          },
          itemStyle: {
            normal: {
              color: function (params) {
                const colorList = _this.BarColorList
                if (params.dataIndex >= colorList.length) {
                  params.dataIndex = params.dataIndex - colorList.length
                }
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    }
    myChart.setOption(option)
    document.getElementById('chartBar').style.display = 'block'
    this.dataList = this.loadAll()
  },
  methods: {
    // 全屏
    requestFullscreen() {
      this.fullScreen = false
      const docElm = document.documentElement
      docElm.requestFullscreen()
    },
    // 取消全屏
    exitFullScreen() {
      this.fullScreen = true
      document.exitFullscreen()
    },
    // 暂停
    forceStop() {
      this.graphLayout.stop()
      this.buttonStop = false
    },
    // 开始
    forceStart() {
      this.graphLayout.restart()
      this.buttonStop = true
    },
    // 高亮
    highLight() {
      this.LightStop = false
      const _this = this
      this.node.on('mouseover', focus).on('mouseout', unfocus)
      let adjList = []

      this.graphLinks.forEach(function (d) {
        adjList[d.source.index + '-' + d.target.index] = true
        adjList[d.target.index + '-' + d.source.index] = true
      })
      function neigh(a, b) {
        return a === b || adjList[a + '-' + b]
      }
      function focus(d) {
        // console.log(d) // eslint-disable-line
        let index = d3.select(d3.event.target).datum().index
        _this.node.style('opacity', function (o) {
          return neigh(index, o.index) ? 1 : 0.1
        })
        _this.link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.1
        })
      }

      function unfocus() {
        _this.node.style('opacity', 1)
        _this.link.style('opacity', 1)
      }
    },
    // 取消高亮
    LightCancel() {
      this.LightStop = true
      let focusId = null
      const _this = this
      _this.node.on('mouseover', idFocus).on('mouseout', idUnFocus)
      function idFocus(d) {
        focusId = _this.container
          .append('text')
          .text(d.id)
          .attr('x', d.x + 8)
          .attr('y', d.y - 10)
          .style('font-family', 'Arial')
          .style('font-size', 20)
          .style('pointer-events', 'none')
      }
      function idUnFocus(d) {
        focusId.remove()
      }
    },
    // 框选
    brushSelect() {
      this.brushStop = false
      this.boardExit = true
      const _this = this
      _this.node.style('opacity', 0.4)

      const brush = d3.brush().on('brush', function () {
        const selection = d3.brushSelection(this)
        // 框选高亮
        //   //  selection获得两个数组，每个数组是包含两个数字的数组，第一个是包含框的起始点的x坐标和y坐标，
        //   //   第二个是框结束点的x、y坐标，利用node的x、y坐标在和框的x、y进行大小对比，得出框内的node和edge
        //   //  再改变选中的点线的样式就行
        let x = d3.scaleLinear()
        let y = d3.scaleLinear()
        // _this.node.attr('transform', (d) => `translate(${x(d.x)},${y(d.y)})`)

        if (selection) {
          const [[x3, y3], [x4, y4]] = selection
          let brushNode = _this.node.filter((d) => x3 <= x(d.x) && x(d.x) < x4 && y3 <= y(d.y) && y(d.y) < y4)
          brushNode.style('opacity', 1)
          if (brushNode.nodes()[0]) {
            brushNode.each(function () {
              const nodeDataId = d3.select(this).attr('id')
              if (_this.propertyChangeData === '年龄') {
                const nodeDataBri = d3.select(this).attr('Bristol_stool_score')
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , ' + '"Bristol_stool_score":' + nodeDataBri)
                }
              } else {
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesData.unshift('"id":' + nodeDataId)
                }
              }
            })
          }

          _this.link
            .style('opacity', 0.3)
            .filter(
              (d) => x3 <= x(d.source.x) && x(d.source.x) < x4 && y3 <= y(d.source.y) && y(d.source.y) < y4 && x3 <= x(d.target.x) && x(d.target.x) < x4 && y3 <= y(d.target.y) && y(d.target.y) < y4
            )
            .style('opacity', 1)
        }
      })
      _this.container.call(brush)
      this.brush = brush
    },
    // 取消框选
    brushCancel() {
      this.node.style('opacity', 1)
      this.boardExit = false
      this.nodesData = []
      this.nodesDataId = []
      this.container.call(this.brush.move, null)
      this.container.on('.brush', null)
      document.querySelector('#viz > g > rect.overlay').remove()
      document.querySelector('#viz > g > rect.selection').remove()
      document.querySelector('#viz > g > rect.handle.handle--n').remove()
      document.querySelector('#viz > g > rect.handle.handle--w').remove()
      document.querySelector('#viz > g > rect.handle.handle--e').remove()
      document.querySelector('#viz > g > rect.handle.handle--s').remove()
      document.querySelector('#viz > g > rect.handle.handle--se').remove()
      document.querySelector('#viz > g > rect.handle.handle--nw').remove()
      document.querySelector('#viz > g > rect.handle.handle--ne').remove()
      document.querySelector('#viz > g > rect.handle.handle--sw').remove()
      this.container.attr('fill', '')
      this.brushStop = true
      this.link.style('opacity', 1)
      // 节点悬浮显示id
      let focusId = null
      const _this = this
      _this.node.on('mouseover', idFocus).on('mouseout', idUnFocus)
      function idFocus(d) {
        focusId = _this.container
          .append('text')
          .text(d.id)
          .attr('x', d.x + 8)
          .attr('y', d.y - 10)
          .style('font-family', 'Arial')
          .style('font-size', 20)
          .style('pointer-events', 'none')
      }
      function idUnFocus(d) {
        focusId.remove()
      }
      // this.boardClose()
    },
    // 多选
    MultiSelect() {
      this.SelectStop = false
      const _this = this
      this.boardExit = true
      this.node.style('opacity', 0.4)
      this.link.style('opacity', 0.4)
      this.node.on('click', function (event) {
        d3.select(this).style('opacity', 1)
        // d3.select(this).style('fill', '#caa455')
        const nodeDataId = d3.select(this).attr('id')
        if (_this.propertyChangeData === '年龄') {
          const nodeDataBri = d3.select(this).attr('Bristol_stool_score')
          if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
            _this.nodesDataId.unshift(nodeDataId)
            _this.nodesData.unshift('"id":' + nodeDataId + ' , ' + '"Bristol_stool_score":' + nodeDataBri)
          }
        } else {
          if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
            _this.nodesDataId.unshift(nodeDataId)
            _this.nodesData.unshift('"id":' + nodeDataId)
          }
        }
      })
    },
    // 取消多选
    SelectCancel() {
      this.SelectStop = true
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
      this.node.on('click', '')
      this.boardExit = false
      this.nodesData = []
      this.nodesDataId = []
      // this.boardClose()
    },
    // 数据面板关闭
    boardClose() {
      const _this = this
      if (!this.brushStop) {
        _this.brushCancel()
      }
      if (!this.SelectStop) {
        _this.SelectCancel()
      }
    },
    // 调色板关闭
    colorBoardClose() {
      this.colorBoardExit = false
    },
    // 图片导出
    screenShot() {
      const svg = this.svg.node()
      const xml = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      canvas.width = this.width
      canvas.height = this.height
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'export.png'
        link.href = url
        link.click()
      }
      img.onerror = function () {
        console.error('Error loading image')
        console.log('img', img.src)
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)))
      console.log('img', img.src)
    },
    // 直方图
    theChartBar() {
      document.getElementById('chartBar').style.display = 'block'
      this.histogramExit = true
    },
    // 直方图关闭
    ChartBarNone() {
      this.histogramExit = false
      document.getElementById('chartBar').style.display = 'none'
    },
    // 调色板
    selectColor(color) {
      this.$emit('select', color)
    },
    ColorSelect() {
      this.colorBoardExit = true
    },
    // 蓝色色带点击事件
    colorBarChange1() {
      const _this = this
      if (_this.propertyChangeData === '年龄') {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          if (d.Bristol_stool_score < '0.01') {
            num1.push(d.Bristol_stool_score)
            return '#eff3ff'
          } else if (d.Bristol_stool_score >= '0.01' && d.Bristol_stool_score < '0.05') {
            num2.push(d.Bristol_stool_score)
            return '#bcd7e8'
          } else if (d.Bristol_stool_score >= '0.05' && d.Bristol_stool_score < '0.1') {
            num3.push(d.Bristol_stool_score)
            return '#68add8'
          } else if (d.Bristol_stool_score >= '0.1' && d.Bristol_stool_score < '0.5') {
            num4.push(d.Bristol_stool_score)
            return '#2b81c0'
          } else {
            num5.push(d.Bristol_stool_score)
            return '#064e9e'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))

        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'Bristol_stool_score',
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList1
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      } else {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          d.id = Number(d.id)
          if (d.id < 70) {
            num1.push(d.id)
            return '#eff3ff'
          } else if (d.id >= 70 && d.id < 200) {
            num2.push(d.id)
            return '#bcd7e8'
          } else if (d.id >= 200 && d.id < 360) {
            num3.push(d.id)
            return '#68add8'
          } else if (d.id >= 360 && d.id < 500) {
            num4.push(d.id)
            return '#2b81c0'
          } else {
            num5.push(d.id)
            return '#064e9e'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))
        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'id',
            nameGap: 25,
            nameLocation: 'middle',
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList1
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      }
    },
    // 绿色色带点击事件
    colorBarChange2() {
      const _this = this
      if (_this.propertyChangeData === '年龄') {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          if (d.Bristol_stool_score < '0.01') {
            num1.push(d.Bristol_stool_score)
            return '#edf9fc'
          } else if (d.Bristol_stool_score >= '0.01' && d.Bristol_stool_score < '0.05') {
            num2.push(d.Bristol_stool_score)
            return '#b1e3e3'
          } else if (d.Bristol_stool_score >= '0.05' && d.Bristol_stool_score < '0.1') {
            num3.push(d.Bristol_stool_score)
            return '#62c3a4'
          } else if (d.Bristol_stool_score >= '0.1' && d.Bristol_stool_score < '0.5') {
            num4.push(d.Bristol_stool_score)
            return '#25a35c'
          } else {
            num5.push(d.Bristol_stool_score)
            return '#006e29'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))

        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'Bristol_stool_score',
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList2
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      } else {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          d.id = Number(d.id)
          if (d.id < 70) {
            num1.push(d.id)
            return '#edf9fc'
          } else if (d.id >= 70 && d.id < 200) {
            num2.push(d.id)
            return '#b1e3e3'
          } else if (d.id >= 200 && d.id < 360) {
            num3.push(d.id)
            return '#62c3a4'
          } else if (d.id >= 360 && d.id < 500) {
            num4.push(d.id)
            return '#25a35c'
          } else {
            num5.push(d.id)
            return '#006e29'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))
        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'id',
            nameGap: 25,
            nameLocation: 'middle',
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList2
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      }
    },
    // 橙色色带点击事件
    colorBarChange3() {
      const _this = this
      if (_this.propertyChangeData === '年龄') {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          if (d.Bristol_stool_score < '0.01') {
            num1.push(d.Bristol_stool_score)
            return '#ffeede'
          } else if (d.Bristol_stool_score >= '0.01' && d.Bristol_stool_score < '0.05') {
            num2.push(d.Bristol_stool_score)
            return '#febf80'
          } else if (d.Bristol_stool_score >= '0.05' && d.Bristol_stool_score < '0.1') {
            num3.push(d.Bristol_stool_score)
            return '#ff8d2e'
          } else if (d.Bristol_stool_score >= '0.1' && d.Bristol_stool_score < '0.5') {
            num4.push(d.Bristol_stool_score)
            return '#e95406'
          } else {
            num5.push(d.Bristol_stool_score)
            return '#a83500'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))

        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'Bristol_stool_score',
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList3
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      } else {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          d.id = Number(d.id)
          if (d.id < 70) {
            num1.push(d.id)
            return '#ffeede'
          } else if (d.id >= 70 && d.id < 200) {
            num2.push(d.id)
            return '#febf80'
          } else if (d.id >= 200 && d.id < 360) {
            num3.push(d.id)
            return '#ff8d2e'
          } else if (d.id >= 360 && d.id < 500) {
            num4.push(d.id)
            return '#e95406'
          } else {
            num5.push(d.id)
            return '#a83500'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))
        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'id',
            nameGap: 25,
            nameLocation: 'middle',
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.colorList3
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      }
    },
    // 彩色色带点击事件
    colorBarChange4() {
      const _this = this
      if (_this.propertyChangeData === '年龄') {
        this.propertyChange()
      } else {
        const _this = this
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          d.id = Number(d.id)
          if (d.id < 70) {
            num1.push(d.id)
            return '#b2392d'
          } else if (d.id >= 70 && d.id < 200) {
            num2.push(d.id)
            return '#f09e30'
          } else if (d.id >= 200 && d.id < 360) {
            num3.push(d.id)
            return '#7cf728'
          } else if (d.id >= 360 && d.id < 500) {
            num4.push(d.id)
            return '#27b7c7'
          } else {
            num5.push(d.id)
            return '#244e96'
          }
        })
        const myChart = echarts.init(document.getElementById('chartBar'))
        const option = {
          grid: {
            left: '3%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            name: 'id',
            nameGap: 25,
            nameLocation: 'middle',
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
          },
          yAxis: {
            name: '节点数量',
            nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
          },
          series: [
            {
              type: 'bar',
              // data: [1, 2, 3, 4, 5, 6, 7, 8],
              data: [num1.length, num2.length, num3.length, num4.length, num5.length],
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorList = _this.BarColorList
                    if (params.dataIndex >= colorList.length) {
                      params.dataIndex = params.dataIndex - colorList.length
                    }
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      }
    },
    // 色带还原
    colorBarCancel() {
      this.value = ''
      this.state1 = ''
      this.propertyChangeData = ''
      const _this = this
      const num1 = []
      const num2 = []
      const num3 = []
      const num4 = []
      const num5 = []
      this.node.attr('fill', function (d) {
        d.id = Number(d.id)
        if (d.id < 70) {
          num1.push(d.id)
          return '#b2392d'
        } else if (d.id >= 70 && d.id < 200) {
          num2.push(d.id)
          return '#f09e30'
        } else if (d.id >= 200 && d.id < 360) {
          num3.push(d.id)
          return '#7cf728'
        } else if (d.id >= 360 && d.id < 500) {
          num4.push(d.id)
          return '#27b7c7'
        } else {
          num5.push(d.id)
          return '#244e96'
        }
      })
      const myChart = echarts.init(document.getElementById('chartBar'))
      const option = {
        grid: {
          left: '3%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          name: 'id',
          nameGap: 25,
          nameLocation: 'middle',
          nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
          data: ['(0,70)', '(70,200)', '(200,360)', '(360,500)', '(500,+∞)']
        },
        yAxis: {
          name: '节点数量',
          nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        series: [
          {
            type: 'bar',
            // data: [1, 2, 3, 4, 5, 6, 7, 8],
            data: [num1.length, num2.length, num3.length, num4.length, num5.length],
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  const colorList = _this.BarColorList
                  if (params.dataIndex >= colorList.length) {
                    params.dataIndex = params.dataIndex - colorList.length
                  }
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    // 节点编辑面板显示
    nodeEdit() {
      this.NodesEditBoardExit = true
    },
    // 节点按id编辑显示(设置透明度)
    nodeFilter() {
      let maxData = this.max !== '' ? Number(this.max) : 10000
      let minData = Number(this.min)
      const _this = this
      if (maxData >= minData) {
        this.node.style('opacity', 0)
        this.link.style('opacity', 0)
        if (_this.propertyChangeData === '年龄') {
          let nodeLimit = this.node.filter((d) => d.Bristol_stool_score <= maxData && d.Bristol_stool_score >= minData)
          nodeLimit.style('opacity', 1)
          let nodeLimitId = nodeLimit.data().map((d) => d.id)
          let linkLimit = this.link.filter((d) => nodeLimitId.includes(d.source.index) && nodeLimitId.includes(d.target.index))
          linkLimit.style('opacity', 1)
          this.nodesCount = nodeLimit._groups[0].length
          this.linksCount = linkLimit._groups[0].length
          this.node
            .on('mouseover', function () {
              ''
            })
            .on('mouseout', '')
          nodeLimit.on('mouseover', idFocus).on('mouseout', idUnFocus)
        } else {
          let nodeLimit = this.node.filter((d) => d.id <= maxData && d.id >= minData)
          nodeLimit.style('opacity', 1)
          let linkLimit = this.link.filter((d) => d.source.index <= maxData && d.source.index >= minData && d.target.index <= maxData && d.target.index >= minData)
          linkLimit.style('opacity', 1)
          this.nodesCount = nodeLimit._groups[0].length
          this.linksCount = linkLimit._groups[0].length
          this.node
            .on('mouseover', function () {
              ''
            })
            .on('mouseout', '')
          nodeLimit.on('mouseover', idFocus).on('mouseout', idUnFocus)
        }
      }
      // 节点悬浮显示id
      let focusId = null
      function idFocus(d) {
        focusId = _this.container
          .append('text')
          .text(d.id)
          .attr('x', d.x + 8)
          .attr('y', d.y - 10)
          .style('font-family', 'Arial')
          .style('font-size', 20)
          .style('pointer-events', 'none')
      }
      function idUnFocus(d) {
        focusId.remove()
      }
    },
    // 节点编辑恢复
    nodeReset() {
      this.max = ''
      this.min = ''
      this.nodesCount = elements.nodes.length
      this.linksCount = elements.links.length
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
      // 节点悬浮显示id
      let focusId = null
      const _this = this
      _this.node.on('mouseover', idFocus).on('mouseout', idUnFocus)
      function idFocus(d) {
        focusId = _this.container
          .append('text')
          .text(d.id)
          .attr('x', d.x + 8)
          .attr('y', d.y - 10)
          .style('font-family', 'Arial')
          .style('font-size', 20)
          .style('pointer-events', 'none')
      }
      function idUnFocus(d) {
        focusId.remove()
      }
    },
    // // 节点按id编辑显示(直接移除)
    // nodeFilter() {
    //   this.originNodes = this.node
    //   this.node.filter((d) => d.id >= 10).remove()
    //   this.node = this.node.filter((d) => d.id < 10)
    //   this.originLinks = this.link
    //   this.link.filter((o) => o.source.index >= 10 || o.target.index >= 10).remove()
    //   this.link = this.link.filter((o) => o.source.index < 10 && o.target.index < 10)
    // },
    // // 节点编辑恢复
    // nodeReset() {
    //   this.node = this.originNodes
    //   this.link = this.originLinks
    // },
    // 节点编辑面板关闭
    NodesEditBoardClose() {
      this.NodesEditBoardExit = false
    },
    // 节点编辑面板的搜索框
    querySearch(queryString, cb) {
      const dataList = this.dataList
      const results = queryString ? dataList.filter(this.createFilter(queryString)) : dataList

      // 调用 callback 返回建议列表
      cb(results)
    },
    createFilter(queryString) {
      return (data) => {
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 节点编辑面板的下拉框
    handleChange(value) {
      const filteredArr = []
      for (let index = 0; index < value.length; index++) {
        if (value[index]) {
          filteredArr.push(value[index])
        }
      }
      let categoryData = filteredArr[0]
      console.log(categoryData)
      if (categoryData === '年龄') {
        this.propertyChange()
        this.propertyChangeData = '年龄'
      } else if (categoryData === 'BMQ') {
        this.propertyChange()
        this.propertyChangeData = 'BMQ'
      } else {
        this.propertyChange()
        this.propertyChangeData = '非年龄'
      }
    },
    // 搜索点击下拉框数据
    handleSelect(item) {
      console.log(item.value)
      // 切换年龄才会改变节点数据，其他暂时是恢复原来的数据
      if (item.value === '年龄') {
        this.propertyChange()
        this.propertyChangeData = '年龄'
      } else if (item.value === 'BMQ') {
        this.propertyChange()
        this.propertyChangeData = 'BMQ'
      } else {
        this.propertyChange()
        this.propertyChangeData = '非年龄'
      }
    },

    // 搜索下拉数据显示
    loadAll() {
      return [{ value: '年龄' }, { value: 'BMI' }, { value: '体重' }, { value: '身高' }, { value: 'BMQ' }]
    },
    // 根据变量名切换数值
    propertyChange() {
      const num1 = []
      const num2 = []
      const num3 = []
      const num4 = []
      const num5 = []
      this.node.attr('fill', function (d) {
        if (d.Bristol_stool_score < '0.01') {
          num1.push(d.Bristol_stool_score)
          return '#b2392d'
        } else if (d.Bristol_stool_score >= '0.01' && d.Bristol_stool_score < '0.05') {
          num2.push(d.Bristol_stool_score)
          return '#f09e30'
        } else if (d.Bristol_stool_score >= '0.05' && d.Bristol_stool_score < '0.1') {
          num3.push(d.Bristol_stool_score)
          return '#7cf728'
        } else if (d.Bristol_stool_score >= '0.1' && d.Bristol_stool_score < '0.5') {
          num4.push(d.Bristol_stool_score)
          return '#25a8b6'
        } else {
          num5.push(d.Bristol_stool_score)
          return '#244e96'
        }
      })
      const myChart = echarts.init(document.getElementById('chartBar'))
      const _this = this

      const option = {
        grid: {
          left: '3%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          name: 'Bristol_stool_score',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
          data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
        },
        yAxis: {
          name: '节点数量',
          nameTextStyle: { fontSize: 16, fontWeight: 'bold' }
        },
        series: [
          {
            type: 'bar',
            // data: [1, 2, 3, 4, 5, 6, 7, 8],
            data: [num1.length, num2.length, num3.length, num4.length, num5.length],
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  const colorList = _this.BarColorList
                  if (params.dataIndex >= colorList.length) {
                    params.dataIndex = params.dataIndex - colorList.length
                  }
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    forceChange() {
      this.graphLayout.force('charge', d3.forceManyBody().strength(-this.valueTooltip * 40))
    },
    dataGet() {
      axios.get()
    }
  }
}
</script>
<style lang="scss">
.color-strip-container {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.color-strip {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 10px;
  margin-top: 20px;
}

.color-block {
  width: 30px;
  height: 30px;
  display: inline-block;
  cursor: pointer;
}

.components {
  position: absolute;
  z-index: 5;
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
.el-button + .el-button,
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}
.CountBoard {
  font-size: 20px;
  color: rgb(118, 115, 115);
  margin-left: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 5;
}
.CountNumber {
  font-size: 22px;
  color: #000;
}
#chartBar {
  // margin-left: 100px;
  margin-top: 500px;
  position: absolute;
  z-index: 10;
}
.dataCard {
  font-size: 16px;
  margin-bottom: 18px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}

.dataBoard {
  height: 90vh;
  width: 400px;
  right: 60px;
  position: absolute;
  z-index: 120;
  overflow: auto;
}
.NodesEditBoard {
  top: 10px;
  height: 450px;
  width: 550px;
  right: 0;
  position: absolute;
  z-index: 16;
  overflow: auto;
}
.colorBoard {
  height: 450px;
  width: 550px;
  right: 0;
  top: 470px;
  position: absolute;
  z-index: 15;
  overflow: auto;
}
.el-radio {
  font-size: 20px;
}
.colorBoardButton {
  margin-top: 10px;
  display: flex;

  justify-content: space-between;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.sliderTooltip {
  width: 450px;
}
.sliderBox {
  display: flex;
  justify-content: space-between;
}
</style>
