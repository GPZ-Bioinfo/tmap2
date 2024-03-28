<template>
  <div>
    <div class="components">
      <!-- 全屏控件 -->
      <el-button class="buttonStyle" @click="requestFullscreen" v-if="fullScreen"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="全屏">
          <v-icon>mdi-fullscreen</v-icon>
        </el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="exitFullScreen" v-if="!fullScreen" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消全屏"> <v-icon>mdi-fullscreen-exit</v-icon></el-tooltip></el-button
      >
      <!-- 暂停控件 -->
      <el-button class="buttonStyle" v-if="buttonStop" @click="forceStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="暂停"><v-icon>mdi-pause</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" v-if="!buttonStop" @click="forceStart" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="开始"><v-icon>mdi-play</v-icon></el-tooltip></el-button
      >
      <!-- 高亮邻居 -->
      <el-button class="buttonStyle" @click="highLight" v-if="LightStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="高亮邻居"><v-icon>mdi-auto-fix</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="LightCancel" v-if="!LightStop" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消高亮"><v-icon>mdi-auto-fix</v-icon></el-tooltip></el-button
      >
      <!-- 框选控件 -->
      <el-button class="buttonStyle" @click="brushSelect" v-if="brushStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="框选"><v-icon>mdi-crop-square</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="brushCancel" v-if="!brushStop" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消框选"><v-icon>mdi-crop-square</v-icon></el-tooltip></el-button
      >
      <!-- 框选控件2 -->
      <el-button class="buttonStyle" @click="brushSelect2" v-if="brushStop2"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="框选2"><v-icon>mdi-shape-square-plus</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="brushCancel2" v-if="!brushStop2" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消框选"><v-icon>mdi-shape-square-plus</v-icon></el-tooltip></el-button
      >
      <!-- 多选按钮 -->
      <el-button class="buttonStyle" @click="MultiSelect" v-if="SelectStop"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="多选"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="SelectCancel" v-if="!SelectStop" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="取消多选"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >

      <!-- 直方图控件 -->
      <el-button class="buttonStyle" @click="ChartBarNone" v-if="histogramExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="直方图"><v-icon>mdi-chart-histogram</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="theChartBar" v-if="!histogramExit" type="info"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="显示直方图"><v-icon>mdi-chart-histogram</v-icon></el-tooltip></el-button
      >
      <!-- 下载控件 -->
      <el-button class="buttonStyle" @click="screenShot"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="图片导出"><v-icon>mdi-download</v-icon></el-tooltip></el-button
      >
    </div>
    <!-- 点线数量 -->
    <div class="CountBoard">
      nodes:<span class="CountNumber">{{ nodesSelectedCount }}/</span><span class="CountNumber">{{ nodesCount }}</span
      >; links:<span class="CountNumber">{{ linksSelectedCount }}/</span><span class="CountNumber">{{ linksCount }}</span
      >; feature:<span class="CountNumber">{{ featureName }}</span>
    </div>
    <!-- 直方图 -->
    <div id="chartBar" style="width: 370px; height: 360px"></div>
    <!-- 柱子数量-->
    <div id="chartBarx">
      <label for="intervalInput" style="font-weight: bold; font-size: 16px">change the number of bin:</label>
      <input
        id="intervalInput"
        type="number"
        v-model="interval"
        @input="updateChart"
        min="1"
        pattern="\d+"
        style="margin-top: 1px; border: 1px solid rgb(108, 98, 98); width: 60px; appearance: textfield"
      />
    </div>
    <!-- 柱子范围 -->
    <div id="minMaxBox">
      <div class="fromToBox">
        <div class="minAndMax">
          <span>from:</span>
          <input v-model="min" type="number" min="1" pattern="\d+" @input="nodeFilter" style="width: 60px; border: 1px solid rgb(108, 98, 98); height: 25px" />
        </div>
        <div class="minAndMax">
          <span>to:</span>
          <input v-model="max" type="number" min="1" pattern="\d+" @input="nodeFilter" style="width: 60px; border: 1px solid rgb(108, 98, 98); height: 25px" />
        </div>
      </div>
      <div class="minMaxCancel">
        <el-button style="position: absolute; padding: 5px" type="text" @click="nodeReset">✖️</el-button>
      </div>
      <div class="minMaxButton">
        <el-button style="position: absolute; padding-top: 0px; padding-bottom: 10px" type="text" @click="boardOpen"><v-icon>mdi-table-large-plus</v-icon></el-button>
      </div>
    </div>
    <!-- 数据面板 -->
    <el-card class="dataBoard" v-if="boardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Selected</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="boardClose">❌</el-button>
      </div>
      <el-descriptions class="margin-top" :column="3" :size="size" border>
        <el-descriptions-item>
          <template slot="label"> 选中个数 </template>
          {{ nodesData.length }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 总个数 </template>
          {{ nodesCount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 最大值 </template>
          {{ parseFloat(Math.max(...nodesDataScores)).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 最小值 </template>
          {{ parseFloat(Math.min(...nodesDataScores)).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 均值 </template>
          {{ parseFloat(nodesDataScores.reduce((total, str) => total + parseFloat(str), 0) / nodesDataScores.length).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 标准差 </template>
          {{
            parseFloat(
              Math.sqrt(
                nodesDataScores
                  .map((num) => Math.pow(num - parseFloat(nodesDataScores.reduce((total, str) => total + parseInt(str), 0) / nodesDataScores.length).toFixed(2), 2))
                  .reduce((total, num) => total + num) / nodesDataScores.length
              )
            ).toFixed(2)
          }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-for="(item, index) in nodesData" :key="index" class="dataCard">
        {{ index + 1 + '、 ' + item }}
      </div>
    </el-card>
    <!-- 取色板按钮面板 -->
    <div id="colorCastButton">
      <!-- 画板控件 -->
      <el-button @click="ColorSelect" type="text" class="buttonStyle2"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="调色板"><v-icon size="30">mdi-palette</v-icon></el-tooltip></el-button
      >
      <h3>Click it to open the Color Palette</h3>
    </div>
    <!-- 取色板 -->
    <el-card class="colorBoard" v-if="colorBoardExit">
      <h4 style="text-align: center">Color Cast</h4>
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
          <div class="color-block" v-for="(color, index) in colorList0" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
      </div>
      <div class="colorBoardButton">
        <el-button @click="colorBarCancel" size="mini">Cancel</el-button>
        <el-button @click="colorBoardClose" size="mini">Apply Palette</el-button>
      </div>
    </el-card>
    <!-- 节点编辑面板 -->
    <div class="NodesEditBoard" v-if="NodesEditBoardExit">
      <!-- 搜索框部分关键字检索 -->
      <div class="querySearch">
        <el-autocomplete v-model="state1" :fetch-suggestions="querySearch" placeholder="Please enter keywords to search" :suffix-icon="icon" clearable style="width: 250px" @select="handleSelect">
        </el-autocomplete>
        <el-button @click="cascaderCancel">Cancel</el-button>
      </div>
      <el-button @click="HideNodesEditBoard" class="longButton" icon="el-icon-caret-bottom"></el-button>
      <div v-if="NodesEditBoardHide">
        <!-- 大类小类选择器 -->
        <div class="cascader">
          <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange" placeholder="primary selector" style="width: 250px"></el-cascader>
          <el-button @click="cascaderCancel">Cancel</el-button>
        </div>

        <h4 class="sliderBox">Drag the slider to change the layout of the nodes(the value=the node repulsion)</h4>
        <div class="sliderBox">
          <el-slider v-model="valueTooltip" class="sliderTooltip" @change="forceChange"></el-slider>
          <span>{{ valueTooltip }}</span>
        </div>
        <div class="sliderBoxHelp">
          <el-button @click="sliderHelp" type="text" class="buttonStyle2"
            ><el-tooltip placement="right" :delay="{ show: 500 }" :hide-after="2000" content="帮助"><v-icon size="30">mdi-lightbulb-on-outline</v-icon></el-tooltip></el-button
          >
        </div>
        <el-card v-if="sliderHelpExist"><h4>if the effect does not respond,try to drag the node</h4></el-card>
      </div>
    </div>
    <!-- d3画布 -->

    <svg id="viz"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
import { _elements } from './static/topo_model_graph.json'
import { _datas } from './static/feature_overview_metadata_category.json'
import { _data } from './static/topo_model_node_avg_metadata.json'
import { _elements2 } from './static/gzfy_valid_genus_r634_c373/topo_model_graph.json'
import { _datas2 } from './static/gzfy_valid_genus_r634_c373/metadata_category.json'
import { _data2 } from './static/gzfy_valid_genus_r634_c373/topo_model_node_avg_metadata.json'
import { _elements3 } from './static/gzfy_discv_genus_r1455_c373/topo_model_graph.json'
import { _datas3 } from './static/gzfy_discv_genus_r1455_c373/metadata_category.json'
import { _data3 } from './static/gzfy_discv_genus_r1455_c373/topo_model_node_avg_metadata.json'

export default {
  name: 'ForceBasedLabelPlacementI',
  data: () => ({
    max: '',
    min: '',
    graph: '',
    valueTooltip: 20,
    fullScreen: true,
    svg: null,
    width: window.innerWidth,
    height: window.innerHeight,
    container: null,
    graphLayout: null,
    graphTrans: null,
    buttonStop: true,
    brushStop2: true,
    brushStop: true,
    nodesCount: 0,
    linksCount: 0,
    nodesSelectedCount: 0,
    linksSelectedCount: 0,
    featureName: '',
    node: null,
    link: null,
    boardExit: false,
    nodesData: [],
    nodesDataId: [],
    nodesDataScores: [],
    SelectStop: true,
    labelNode: null,
    graphLinks: null,
    LightStop: true,
    multiple: 10,
    brush: null,
    currentScale: 1,
    graphNodes: null,
    labelLayout: null,
    histogramExit: true,
    colorBoardExit: false,
    radio: 3,
    colorList1: ['#eff3ff', '#bcd7e8', '#68add8', '#2b81c0', '#064e9e'],
    colorList2: ['#edf9fc', '#b1e3e3', '#62c3a4', '#25a35c', '#006e29'],
    colorList3: ['#ffeede', '#febf80', '#ff8d2e', '#e95406', '#a83500'],
    colorList0: ['#b2392d', '#f09e30', '#7cf728', '#25a8b6', '#244e96'],
    BarColorList: null,
    option: null,
    icon: 'el-icon-search',
    NodesEditBoardExit: true,
    dataList: [],
    value: [],
    state1: '',
    propertyChangeData: '',
    options: [],
    lastClicked: null,
    sliderHelpExist: false,
    counter: 0,
    counter2: 0,
    NodesEditBoardHide: false,
    scoresValueArray: [],
    interval: 10,
    sizeValueMax: null,
    scoresValueMax: null,
    xData: [],
    yData: [],
    intervalData: [],
    sizeValueArray: [],
    scaleColor: null,
    lightMark: 0
  }),
  mounted() {
    let graphName = JSON.parse(localStorage.getItem('graphName'))
    if (graphName === 'discv_genus_r1455_c373') {
      this.datas = _datas3
      this.elements = _elements3
    } else if (graphName === 'valid_genus_r634_c373') {
      this.datas = _datas2
      this.elements = _elements2
    } else {
      this.datas = _datas
      this.elements = _elements
    }
    const datas = this.datas
    const elements = this.elements

    this.nodesCount = elements.nodes.length
    this.linksCount = elements.links.length
    this.featureName = 'size'
    let graph = {
      nodes: elements.nodes,
      links: elements.links
    }

    this.graph = graph
    const _this = this
    // 选择器的大类小类数据导入
    let categories = [...new Set(datas.map((item) => item.category))]
    this.options = categories.map((category) => {
      let children = datas.filter((item) => item.category === category)
      return {
        label: category,
        children: children.map((item) => ({
          value: item.variable,
          label: item.variable
        }))
      }
    })

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
    // 获取 SVG 元素
    this.svg = d3.select('#viz')
    // 初始化 SVG 大小
    this.resize()
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.resize)
    // 监听缩放事件
    this.svg.call(d3.zoom().on('zoom', this.zoomed))
    let container = this.svg.append('g')
    this.container = container
    let link = container.attr('class', 'links').selectAll('line').data(graph.links).enter().append('line').attr('stroke', 'pink').attr('stroke-width', '1px')
    let node = container
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', function (d) {
        _this.sizeValueArray.unshift(d.size)
        return d.size
      })
      .attr('id', function (d) {
        return d.id
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
    this.sizeValueMax = Math.max(..._this.sizeValueArray)
    const myChart = echarts.init(document.getElementById('chartBar'))
    myChart.on('click', function (params) {
      if (params.dataIndex === _this.lastClicked) {
        _this.lastClicked = null
        _this.max = ''
        _this.min = ''
      } else {
        _this.lastClicked = params.dataIndex
        const clickedIndex = _this.lastClicked
        if (_this.propertyChangeData) {
          const intervalSize = _this.scoresValueMax / _this.interval
          // 根据点击的柱子索引计算对应的最小值和最大值
          _this.min = (clickedIndex * intervalSize).toFixed(4)
          _this.max = ((clickedIndex + 1) * intervalSize).toFixed(4)
        } else {
          const intervalSize = _this.sizeValueMax / _this.interval
          // 根据点击的柱子索引计算对应的最小值和最大值
          _this.min = (clickedIndex * intervalSize).toFixed(1)
          _this.max = ((clickedIndex + 1) * intervalSize).toFixed(1)
        }
      }
      _this.nodeFilter()
    })
    document.getElementById('chartBar').style.display = 'block'

    this.dataList = this.loadAll()
    this.updateChart()
    if (this.$route.params.value) {
      this.value = this.$route.params.value
      this.handleChange(this.value)
      this.HideNodesEditBoard()
    }
  },
  beforeDestroy() {
    // 在组件销毁前移除窗口大小变化事件监听
    window.removeEventListener('resize', this.resize)
  },
  watch: {
    interval: 'updateChart' // Watch for changes in the interval and update the chart
  },
  created() {},

  methods: {
    // 更新 SVG 大小的方法
    resize() {
      // 获取新的窗口宽度和高度
      this.width = window.innerWidth
      this.height = window.innerHeight

      // 设置 SVG 的宽度和高度
      this.svg.attr('width', this.width).attr('height', this.height)
    },
    zoomed() {
      this.currentScale = d3.event.transform.k
      this.container.attr('transform', d3.event.transform)
    },
    // 全屏
    requestFullscreen() {
      this.fullScreen = false
      const docElm = document.documentElement
      docElm.requestFullscreen()
      this.$store.commit('navCollapse')
      document.getElementById('chartBar').style.display = 'none'
      this.NodesEditBoardExit = false
      document.getElementById('colorCastButton').style.display = 'none'
      document.getElementById('minMaxBox').style.display = 'none'
    },
    // 取消全屏
    exitFullScreen() {
      this.fullScreen = true
      document.exitFullscreen()
      this.$store.commit('navCollapse')
      document.getElementById('chartBar').style.display = 'block'
      document.getElementById('colorCastButton').style.display = 'flex'
      document.getElementById('minMaxBox').style.display = 'flex'
      this.NodesEditBoardExit = true
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
      const _this = this
      this.LightStop = false
      this.lightMark = 0
      this.nodesSelectedCount = 0
      if (!this.brushStop) {
        this.brushStop = true
        this.brushCancel()
      }
      if (!this.brushStop2) {
        this.brushStop2 = true
        this.brushCancel2()
      }
      if (!this.SelectStop) {
        this.SelectStop = true
        this.SelectCancel()
      }

      this.node.style('opacity', 0.4)
      this.link.style('opacity', 0.4)
      this.node.on('click', focus)

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
          return neigh(index, o.index) ? 1 : 0.4
        })
        _this.link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.4
        })
      }

      // function unfocus() {
      //   _this.node.style('opacity', 1)
      //   _this.link.style('opacity', 1)
      // }
    },
    // 取消高亮
    LightCancel() {
      this.LightStop = true
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
      this.lightMark = 0
      this.nodesSelectedCount = 0
    },
    boardOpen() {
      if (this.min || this.max) {
        this.boardExit = true
      }
    },
    // 框选
    brushSelect() {
      this.nodesSelectedCount = 0
      this.node.style('opacity', 0.4)
      if (!this.LightStop) {
        this.LightStop = true
        this.LightCancel()
      }
      if (!this.brushStop2) {
        this.brushStop2 = true
        this.brushCancel2()
      }
      if (!this.SelectStop) {
        this.SelectStop = true
        this.SelectCancel()
      }
      this.lightMark = 0
      this.brushStop = false
      const _this = this

      const brush = d3.brush().on('start', brushstarted).on('brush', brushing)
      function brushstarted() {
        _this.boardExit = true
      }
      function brushing() {
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
          _this.node.style('opacity', 0.4)
          _this.nodesData = []
          _this.nodesDataId = []
          _this.nodesDataScores = []
          let brushNode = _this.node.filter((d) => x3 <= x(d.x) && x(d.x) < x4 && y3 <= y(d.y) && y(d.y) < y4)
          brushNode.style('opacity', 1)
          if (brushNode.nodes()[0]) {
            brushNode.each(function () {
              const nodeDataId = d3.select(this).attr('id')
              if (_this.propertyChangeData) {
                const nodeDataScores = d3.select(this).attr(_this.propertyChangeData)
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesDataScores.unshift(nodeDataScores)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataScores)
                  _this.nodesSelectedCount = _this.nodesData.length
                }
              } else {
                const nodeDataScores = d3.select(this).attr('r')
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesDataScores.unshift(nodeDataScores)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + 'size' + '":' + nodeDataScores)
                  _this.nodesSelectedCount = _this.nodesData.length
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
      }
      const scaledExtent = [
        [-this.width / this.currentScale, -this.height / this.currentScale],
        [this.width / this.currentScale, this.height / this.currentScale]
      ]

      brush.extent(scaledExtent)
      _this.container.call(brush)
      this.brush = brush
    },
    // 取消框选
    brushCancel() {
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

      this.node.style('opacity', 1)
      this.nodesData = []
      this.nodesDataId = []
      this.nodesDataScores = []
      this.nodesSelectedCount = 0
      this.boardExit = false
      this.lightMark = 0
    },
    // 框选2
    brushSelect2() {
      if (!this.LightStop) {
        this.LightStop = true
        this.LightCancel()
      }
      if (!this.brushStop) {
        this.brushStop = true
        this.brushCancel()
      }
      if (!this.SelectStop) {
        this.SelectStop = true
        this.SelectCancel()
      }
      if (this.lightMark === 0) {
        this.node.style('opacity', 0.4)
      }
      this.lightMark++
      this.brushStop2 = false
      const _this = this

      const brush = d3.brush().on('start', brushstarted2).on('brush', brushing2)
      function brushstarted2() {
        _this.boardExit = true
      }
      function brushing2() {
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
              if (_this.propertyChangeData) {
                const nodeDataScores = d3.select(this).attr(_this.propertyChangeData)
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesDataScores.unshift(nodeDataScores)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataScores)
                  _this.nodesSelectedCount = _this.nodesData.length
                }
              } else {
                const nodeDataScores = d3.select(this).attr('r')
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesDataScores.unshift(nodeDataScores)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + 'size' + '":' + nodeDataScores)
                  _this.nodesSelectedCount = _this.nodesData.length
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
      }
      const scaledExtent = [
        [-this.width / this.currentScale, -this.height / this.currentScale],
        [this.width / this.currentScale, this.height / this.currentScale]
      ]

      brush.extent(scaledExtent)
      _this.container.call(brush)
      this.brush = brush
    },
    // 取消框选2
    brushCancel2() {
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
      this.brushStop2 = true
      this.link.style('opacity', 1)

      if (this.lightMark === 0) {
        this.node.style('opacity', 1)
        this.nodesData = []
        this.nodesDataId = []
        this.nodesDataScores = []
        this.boardExit = false
      }
    },
    // 多选
    MultiSelect() {
      if (this.lightMark === 0) {
        this.node.style('opacity', 0.4)
      }
      this.lightMark++
      if (!this.LightStop) {
        this.LightStop = true
        this.LightCancel()
      }
      if (!this.brushStop) {
        this.brushStop = true
        this.brushCancel()
      }
      if (!this.brushStop2) {
        this.brushStop2 = true
        this.brushCancel2()
      }
      this.SelectStop = false
      const _this = this
      this.node.on('click', clickSelect)
      function clickSelect(event) {
        _this.boardExit = true
        const nodeDataId = d3.select(this).attr('id')
        const nodeOpacity = Number(d3.select(this).style('opacity'))
        if (nodeOpacity === 0.4) {
          d3.select(this).style('opacity', 1)
          if (_this.propertyChangeData) {
            const nodeDataScores = d3.select(this).attr(_this.propertyChangeData)
            if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
              _this.nodesDataId.unshift(nodeDataId)
              _this.nodesDataScores.unshift(nodeDataScores)
              _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataScores)
              _this.nodesSelectedCount = _this.nodesData.length
            }
          } else {
            const nodeDataScores = d3.select(this).attr('r')
            if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
              _this.nodesDataId.unshift(nodeDataId)
              _this.nodesDataScores.unshift(nodeDataScores)
              _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + 'size' + '":' + nodeDataScores)
              _this.nodesSelectedCount = _this.nodesData.length
            }
          }
        } else {
          d3.select(this).style('opacity', 0.4)
          const nodeIndex = _this.nodesDataId.indexOf(nodeDataId)
          _this.nodesDataId.splice(nodeIndex, 1)
          _this.nodesData.splice(nodeIndex, 1)
          _this.nodesSelectedCount = _this.nodesData.length
        }
      }
    },
    // 取消多选
    SelectCancel() {
      this.SelectStop = true
      this.node.on('click', '')

      if (this.lightMark === 0) {
        this.node.style('opacity', 1)
        this.link.style('opacity', 1)
        this.boardExit = false
        this.nodesData = []
        this.nodesDataId = []
        this.nodesDataScores = []
      }
    },
    // 数据面板关闭
    boardClose() {
      const _this = this
      if (!this.brushStop2) {
        _this.brushCancel2()
      }
      if (!this.brushStop) {
        _this.brushCancel()
      }
      if (!this.SelectStop) {
        _this.SelectCancel()
      }
      this.lightMark = 0
      this.min = ''
      this.max = ''
      this.nodesData = []
      this.nodesSelectedCount = 0
      this.nodesDataId = []
      this.nodesDataScores = []
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
      this.boardExit = false
      // 节点悬浮显示id
      let focusId = null
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
    // 调色板应用且关闭
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
      document.getElementById('chartBarx').style.display = 'block'
      this.histogramExit = true
      document.getElementById('colorCastButton').style.display = 'flex'
      document.getElementById('minMaxBox').style.display = 'flex'
      this.NodesEditBoardExit = true
    },
    // 直方图关闭
    ChartBarNone() {
      this.histogramExit = false
      this.NodesEditBoardExit = false
      document.getElementById('colorCastButton').style.display = 'none'
      document.getElementById('minMaxBox').style.display = 'none'
      document.getElementById('chartBar').style.display = 'none'
      document.getElementById('chartBarx').style.display = 'none'
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
      this.updateColorScale('blue')
      this.updateChart()
    },
    // 绿色色带点击事件
    colorBarChange2() {
      this.updateColorScale('green')
      this.updateChart()
    },
    // 橙色色带点击事件
    colorBarChange3() {
      this.updateColorScale('orange')
      this.updateChart()
    },
    // 彩色色带点击事件
    colorBarChange4() {
      this.scaleColor = ''
      this.updateChart()
    },
    // 色带取消
    colorBarCancel() {
      this.colorBarChange4()
      this.colorBoardClose()
    },
    // 选择器还原
    cascaderCancel() {
      this.value = ''
      this.state1 = ''
      this.propertyChangeData = ''
      this.featureName = 'size'
      this.updateChart()
      this.colorBoardClose()
      this.nodeReset()
    },
    // 节点按id编辑显示(设置透明度)
    nodeFilter() {
      let maxData = this.max !== '' ? Number(this.max) : 10000
      let minData = Number(this.min)
      const _this = this
      _this.nodesData = []
      _this.nodesDataId = []
      _this.nodesDataScores = []

      if (maxData >= minData) {
        this.node.style('opacity', 0.4)
        this.link.style('opacity', 0.4)
        if (_this.propertyChangeData) {
          let nodeLimit = this.node.filter(function (d) {
            const nodeId = Number(d.id)
            let graphName = JSON.parse(localStorage.getItem('graphName'))
            if (graphName === 'discv_genus_r1455_c373') {
              _this.data = _data3
            } else if (graphName === 'valid_genus_r634_c373') {
              _this.data = _data2
            } else {
              _this.data = _data
            }
            const data = _this.data
            let variableData = data[_this.propertyChangeData]
            let item = variableData.find((item) => Number(item.id) === nodeId)
            const scoresNode = item.value
            return scoresNode <= maxData && scoresNode >= minData
          })
          nodeLimit.style('opacity', 1)
          let nodeLimitId = nodeLimit.data().map((d) => d.id)
          let linkLimit = this.link.filter((d) => nodeLimitId.includes(d.source.index) && nodeLimitId.includes(d.target.index))
          linkLimit.style('opacity', 1)
          this.nodesSelectedCount = nodeLimit._groups[0].length
          this.linksSelectedCount = linkLimit._groups[0].length
          this.node
            .on('mouseover', function () {
              ''
            })
            .on('mouseout', '')
          nodeLimit.on('mouseover', idFocus).on('mouseout', idUnFocus)

          if (nodeLimit.nodes()[0]) {
            nodeLimit.each(function () {
              const nodeDataId = d3.select(this).attr('id')

              const nodeDataScores = d3.select(this).attr(_this.propertyChangeData)
              if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                _this.nodesDataId.unshift(nodeDataId)
                _this.nodesDataScores.unshift(nodeDataScores)
                _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataScores)
                _this.nodesSelectedCount = _this.nodesData.length
              }
            })
          }
        } else {
          let nodeLimit = this.node.filter((d) => d.size <= maxData && d.size >= minData)
          nodeLimit.style('opacity', 1)

          this.nodesSelectedCount = nodeLimit._groups[0].length
          this.linksSelectedCount = 0
          this.node
            .on('mouseover', function () {
              ''
            })
            .on('mouseout', '')
          nodeLimit.on('mouseover', idFocus).on('mouseout', idUnFocus)

          if (nodeLimit.nodes()[0]) {
            nodeLimit.each(function () {
              const nodeDataId = d3.select(this).attr('id')

              const nodeDataScores = d3.select(this).attr('r')
              if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                _this.nodesDataId.unshift(nodeDataId)
                _this.nodesDataScores.unshift(nodeDataScores)
                _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + 'size' + '":' + nodeDataScores)
                _this.nodesSelectedCount = _this.nodesData.length
              }
            })
          }
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
      this.nodesSelectedCount = 0
      this.linksSelectedCount = 0
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
      this.state1 = ''
      let categoryData = ''
      this.scoresValueArray = []
      if (Array.isArray(value)) {
        const filteredArr = []
        console.log('value', value)
        for (let index = 0; index < value.length; index++) {
          if (value[index]) {
            filteredArr.push(value[index])
          }
        }
        categoryData = filteredArr[0]
      } else {
        categoryData = value
      }
      console.log(categoryData)
      const _this = this
      this.node.attr(categoryData, function (d) {
        const nodeId = Number(d.id)
        let graphName = JSON.parse(localStorage.getItem('graphName'))
        if (graphName === 'discv_genus_r1455_c373') {
          _this.data = _data3
        } else if (graphName === 'valid_genus_r634_c373') {
          _this.data = _data2
        } else {
          _this.data = _data
        }
        const data = _this.data

        let variableData = data[categoryData]
        let item = variableData.find((item) => Number(item.id) === nodeId)
        const scoresNode = item.value
        _this.scoresValueArray.unshift(scoresNode)
        return scoresNode
      })

      this.scoresValueMax = Math.max(...this.scoresValueArray)
      this.propertyChangeData = categoryData
      this.featureName = this.propertyChangeData
      this.updateChart()
    },
    // 搜索点击下拉框数据
    handleSelect(itemvalue) {
      const _this = this
      this.scoresValueArray = []
      this.value = ''
      console.log('itemvalue.value', itemvalue.value)
      // 处理响应数据
      this.node.attr(itemvalue.value, function (d) {
        const nodeId = Number(d.id)
        let graphName = JSON.parse(localStorage.getItem('graphName'))
        if (graphName === 'discv_genus_r1455_c373') {
          _this.data = _data3
        } else if (graphName === 'valid_genus_r634_c373') {
          _this.data = _data2
        } else {
          _this.data = _data
        }
        const data = _this.data
        let variableData = data[itemvalue.value]
        let item = variableData.find((item) => Number(item.id) === nodeId)
        const scoresNode = item.value
        _this.scoresValueArray.unshift(scoresNode)
        return scoresNode
      })
      this.scoresValueMax = Math.max(...this.scoresValueArray)
      this.propertyChangeData = itemvalue.value
      this.featureName = this.propertyChangeData
      console.log('this.featureName ', this.featureName)
      this.updateChart()
    },
    // 搜索下拉数据显示
    loadAll() {
      const _this = this
      let graphName = JSON.parse(localStorage.getItem('graphName'))
      if (graphName === 'discv_genus_r1455_c373') {
        _this.datas = _datas3
      } else if (graphName === 'valid_genus_r634_c373') {
        _this.datas = _datas2
      } else {
        _this.datas = _datas
      }
      const datas = _this.datas
      const options = datas.map((item) => {
        return { value: item.variable }
      })

      return options
    },
    // 改变节点斥力
    forceChange() {
      this.graphLayout.force('charge', d3.forceManyBody().strength(-this.valueTooltip * 20))
    },
    // 灯泡提示隐藏
    sliderHelp() {
      this.counter++
      if (this.counter % 2 === 1) {
        this.sliderHelpExist = true
      } else {
        this.sliderHelpExist = false
      }
    },
    // 节点编辑面板隐藏
    HideNodesEditBoard() {
      this.counter2++
      if (this.counter2 % 2 === 1) {
        this.NodesEditBoardHide = true
      } else {
        this.NodesEditBoardHide = false
      }
    },
    // 直方图设置
    updateChart() {
      const _this = this
      // 生成横坐标数据
      this.xData = this.generateXData()

      // 根据新的等分数量动态生成随机纵坐标数据
      this.yData = this.generateYData()

      // 生成柱子数量
      this.intervalData = this.generateIntervalData()
      // 配置ECharts
      const option = {
        grid: {
          left: '8%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          name: _this.propertyChangeData ? _this.propertyChangeData : 'size',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
          data: this.xData,
          axisLabel: {
            interval: Math.ceil(_this.xData.length / this.interval),
            showMaxLabel: true
          }
        },
        yAxis: {
          name: 'nodes number',
          nameTextStyle: { fontSize: 16, fontWeight: 'bold' },
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
      const myChart = echarts.init(document.getElementById('chartBar'))
      myChart.setOption(option)
      // 更新节点颜色
      this.updateNodeColor()
    },
    generateXData() {
      const _this = this
      if (_this.propertyChangeData) {
        const max = _this.scoresValueMax

        const intervalCount = this.interval
        return Array.from({ length: intervalCount }, (_, index) => (index * (max / intervalCount)).toFixed(4))
      } else {
        const max = this.sizeValueMax
        const intervalCount = this.interval
        return Array.from({ length: intervalCount }, (_, index) => ((index + 0.5) * (max / intervalCount)).toFixed(1))
      }
    },
    generateYData() {
      const _this = this
      // 初始化纵坐标数据为 0
      const yData = Array.from({ length: this.interval }, () => 0)

      // 遍历节点，统计每个区间的数量
      if (_this.propertyChangeData) {
        this.node.each(function (d) {
          const nodeId = Number(d.id)
          let graphName = JSON.parse(localStorage.getItem('graphName'))
          if (graphName === 'discv_genus_r1455_c373') {
            _this.data = _data3
          } else if (graphName === 'valid_genus_r634_c373') {
            _this.data = _data2
          } else {
            _this.data = _data
          }
          const data = _this.data
          let variableData = data[_this.propertyChangeData]
          let item = variableData.find((item) => Number(item.id) === nodeId)
          const scoresNode = item.value
          const index = _this.findIndexInInterval(scoresNode)
          yData[index]++
        })
      } else {
        this.node.each(function (d) {
          const index = _this.findIndexInInterval(d.size)
          yData[index]++
        })
      }
      return yData
    },
    updateColorScale(color) {
      const _this = this
      // 根据选择的颜色设置新的渐变色带
      switch (color) {
        case 'blue':
          _this.scaleColor = 'blue'
          break
        case 'green':
          _this.scaleColor = 'green'
          break
        case 'orange':
          _this.scaleColor = 'orange'
          break
      }
    },
    generateGradientColor(index) {
      const _this = this
      // 根据选择的颜色设置新的渐变色带
      let colorScale = d3
        .scaleSequential()
        .domain([_this.interval - 1, 0])
        .interpolator(d3.interpolateViridis)
      switch (_this.scaleColor) {
        case 'blue':
          colorScale = d3
            .scaleSequential()
            .domain([0, _this.interval - 1])
            .interpolator(d3.interpolateBlues)
          break
        case 'green':
          colorScale = d3
            .scaleSequential()
            .domain([0, _this.interval - 1])
            .interpolator(d3.interpolateGreens)
          break
        case 'orange':
          colorScale = d3
            .scaleSequential()
            .domain([0, _this.interval - 1])
            .interpolator(d3.interpolateOranges)
          break
      }

      return colorScale(index)
    },
    generateIntervalData() {
      // 生成柱子数量
      return Array.from({ length: this.interval }, (_, index) => ({
        id: index + 1
      }))
    },
    updateNodeColor() {
      // 更新节点颜色
      const _this = this
      if (_this.propertyChangeData) {
        this.node.attr('fill', function (d, i) {
          const nodeId = Number(d.id)
          let graphName = JSON.parse(localStorage.getItem('graphName'))
          if (graphName === 'discv_genus_r1455_c373') {
            _this.data = _data3
          } else if (graphName === 'valid_genus_r634_c373') {
            _this.data = _data2
          } else {
            _this.data = _data
          }
          const data = _this.data
          let variableData = data[_this.propertyChangeData]
          let item = variableData.find((item) => Number(item.id) === nodeId)
          const scoresNode = item.value
          const index = _this.findIndexInInterval(scoresNode)
          return _this.generateGradientColor(index)
        })
      } else {
        this.node.attr('fill', function (d, i) {
          const index = _this.findIndexInInterval(d.size)
          return _this.generateGradientColor(index)
        })
      }
    },
    findIndexInInterval(value) {
      const index = this.xData.findIndex((x, i, arr) => {
        if (i === 0 && value < x) {
          return true // 当 value 小于第一个元素时，返回 true
        } else if (i === arr.length - 1 && value >= x) {
          return true // 当 value 大于等于最后一个元素时，返回 true
        } else {
          return value >= x && value < arr[i + 1] // 在其他情况下，判断 value 是否在当前区间内
        }
      })

      return index >= 0 ? index : 0 // 确保返回的索引不会小于 0
    }
  }
}
</script>
<style>
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
  margin-top: 10px;
}

.color-block {
  width: 23px;
  height: 23px;
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
.buttonStyle2 {
  padding: 0;
  margin-right: 10px;
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
  margin-top: 0px;
  right: -10px;
  position: absolute;
  z-index: 10;
}
#chartBarx {
  margin-top: 0px;
  right: 100px;
  position: absolute;
  z-index: 10;
}
.dataCard {
  font-size: 16px;
  padding-bottom: 9px;
  padding-top: 5px;
  border: 1px solid rgb(243, 234, 234);
}

.dataBoard {
  height: 90vh;
  width: 460px;
  right: 0px;
  position: absolute;
  z-index: 120;
  overflow: auto;
}

#minMaxBox {
  right: 20px;
  top: 402px;
  z-index: 16;
  position: absolute;
  width: 340px;
  display: flex;
  height: 30px;
}
.fromToBox {
  display: flex;
  justify-content: space-between;
  margin-left: 50px;
}
.minAndMax {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-left: 10px;
}
.minMaxCancel {
  margin-bottom: 20px;
  margin-left: 10px;
}
.minMaxButton {
  margin-bottom: 30px;
  margin-left: 40px;
}
#colorCastButton {
  right: 20px;
  top: 430px;
  z-index: 16;
  position: absolute;
  width: 340px;
  display: flex;
  height: 30px;
}
.NodesEditBoard {
  top: 470px;
  height: 500px;
  width: 360px;
  right: 8px;
  position: absolute;
  z-index: 16;
  overflow: auto;
}
.colorBoard {
  height: 220px;
  width: 200px;
  right: 345px;
  top: 220px;
  position: absolute;
  z-index: 15;
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
  margin-left: 20px;
}
.sliderBoxHelp {
  margin-left: 310px;
}
.longButton {
  display: inline-block;
  width: 350px;
  height: 20px;
  padding: 0 20px;
  text-align: center;
  line-height: 20px;
  font-size: 16px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.cascader,
.querySearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-left: 10px;
}

@media screen and (max-width: 1300px) {
  .NodesEditBoard,
  #minMaxBox,
  #colorCastButton,
  #chartBar,
  #chartBarx {
    display: none !important;
  }
}
</style>
