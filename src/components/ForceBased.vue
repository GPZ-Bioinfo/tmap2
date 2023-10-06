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
      <!-- 框选控件2 -->
      <el-button class="buttonStyle" @click="brushSelect2" v-if="brushStop2"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="框选2"><v-icon>mdi-shape-square-plus</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="brushCancel2" v-if="!brushStop2"
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
    <div id="chartBar" style="width: 370px; height: 360px"></div>
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
          {{ Math.max(...nodesDataId) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 最小值 </template>
          {{ Math.min(...nodesDataId) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 均值 </template>
          {{ parseFloat(nodesDataId.reduce((total, str) => total + parseInt(str), 0) / nodesDataId.length).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 标准差 </template>
          {{
            parseFloat(
              Math.sqrt(
                nodesDataId
                  .map((num) => Math.pow(num - parseFloat(nodesDataId.reduce((total, str) => total + parseInt(str), 0) / nodesDataId.length).toFixed(2), 2))
                  .reduce((total, num) => total + num) / nodesDataId.length
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
    <div class="colorCastButton" v-if="histogramExit">
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
          <div class="color-block" v-for="(color, index) in BarColorList" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
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
        <div class="minAndMax">
          <div>
            <div class="minAndMax">
              <span>max:</span>
              <el-input v-model="max" placeholder="Enter maximum value" style="width: 200px" />
            </div>
            <div class="minAndMax">
              <span>min:</span>
              <el-input v-model="min" placeholder="Enter minimum value" style="width: 200px" />
            </div>
          </div>
          <div class="minAndMaxButton">
            <el-button @click="nodeFilter">Apply</el-button>
            <el-button @click="nodeReset">Reset</el-button>
          </div>
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
import { elements } from './static/fgfp_graph_SAFE_dat.json'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

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
    brushStop2: true,
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
    colorBoardExit: false,
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
    options: [],
    lastClicked: null,
    sliderHelpExist: false,
    counter: 0,
    counter2: 0,
    NodesEditBoardHide: false,
    graphqlData: null,
    graphqlDataValue: null,
    variablesValue: null,
    scoresValue2: null
  }),
  created() {
    const apolloClient = new ApolloClient({
      uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
    })
    apolloClient
      .query({
        query: gql`
          query {
            variablesCategory {
              category
              variables
            }
            graph {
              elements {
                links {
                  id
                  source
                  target
                }
                nodes {
                  id
                  size
                }
              }
            }
          }
        `
      })
      .then((response) => {
        this.graphqlData = response.data.graph.elements
        this.nodesCount = this.graphqlData.nodes.length
        this.linksCount = this.graphqlData.links.length
        this.graph = {
          nodes: this.graphqlData.nodes,
          links: this.graphqlData.links
        }

        let graph = this.graph

        // 选择器的大类小类数据导入
        this.variablesValue = response.data.variablesCategory
        this.options = this.variablesValue.map((category) => ({
          label: category.category,
          children: category.variables.map((variable) => ({
            label: variable,
            value: variable
          }))
        }))

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

        svg.call(
          d3
            .zoom()
            .scaleExtent([0.1, 4]) // eslint-disable-line
            .on('zoom', function () {
              container.attr('transform', d3.event.transform)
            })
        )
        let container = svg.append('g')
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
        this.histogramOrigin()
        const myChart = echarts.init(document.getElementById('chartBar'))

        myChart.on('click', function (params) {
          if (params.dataIndex === _this.lastClicked) {
            _this.lastClicked = null
            _this.max = ''
            _this.min = ''
          } else {
            _this.lastClicked = params.dataIndex
            if (_this.propertyChangeData) {
              if (_this.lastClicked === 0) {
                _this.max = 0.01
                _this.min = 0
              } else if (_this.lastClicked === 1) {
                _this.max = 0.05
                _this.min = 0.01
              } else if (_this.lastClicked === 2) {
                _this.max = 0.1
                _this.min = 0.05
              } else if (_this.lastClicked === 3) {
                _this.max = 0.5
                _this.min = 0.1
              } else if (_this.lastClicked === 4) {
                _this.max = ''
                _this.min = 0.5
              }
            } else {
              if (_this.lastClicked === 0) {
                _this.max = 69
                _this.min = 0
              } else if (_this.lastClicked === 1) {
                _this.max = 199
                _this.min = 70
              } else if (_this.lastClicked === 2) {
                _this.max = 359
                _this.min = 200
              } else if (_this.lastClicked === 3) {
                _this.max = 499
                _this.min = 360
              } else if (_this.lastClicked === 4) {
                _this.max = ''
                _this.min = 500
              }
            }
          }
          _this.nodeFilter()
        })
        document.getElementById('chartBar').style.display = 'block'

        this.dataList = this.loadAll()
      })
  },

  methods: {
    // 全屏
    requestFullscreen() {
      this.fullScreen = false
      const docElm = document.documentElement
      docElm.requestFullscreen()
      this.$store.commit('navCollapse')
      this.ChartBarNone()
    },
    // 取消全屏
    exitFullScreen() {
      this.fullScreen = true
      document.exitFullscreen()
      this.$store.commit('navCollapse')
      this.theChartBar()
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
    },
    // 框选
    brushSelect() {
      if (!this.SelectStop) {
        this.SelectCancel()
      }
      if (!this.brushStop2) {
        this.brushCancel2()
      }
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
          _this.node.style('opacity', 0.4)
          _this.nodesData = []
          _this.nodesDataId = []
          let brushNode = _this.node.filter((d) => x3 <= x(d.x) && x(d.x) < x4 && y3 <= y(d.y) && y(d.y) < y4)
          brushNode.style('opacity', 1)
          if (brushNode.nodes()[0]) {
            brushNode.each(function () {
              const nodeDataId = d3.select(this).attr('id')
              if (_this.propertyChangeData) {
                const nodeDataAge = d3.select(this).attr(_this.propertyChangeData)
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataAge)
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
      // console.log('nodesData', this.nodesData)
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
    // 框选2
    brushSelect2() {
      if (!this.SelectStop) {
        this.SelectCancel()
      }
      if (!this.brushStop) {
        this.brushCancel()
      }
      this.brushStop2 = false
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
              if (_this.propertyChangeData) {
                const nodeDataAge = d3.select(this).attr(_this.propertyChangeData)
                if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
                  _this.nodesDataId.unshift(nodeDataId)
                  _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataAge)
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
    // 取消框选2
    brushCancel2() {
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
      this.brushStop2 = true
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
      if (!this.brushStop2) {
        this.brushCancel2()
      }
      if (!this.brushStop) {
        this.brushCancel()
      }
      this.SelectStop = false
      const _this = this
      this.boardExit = true
      this.node.style('opacity', 0.4)
      this.link.style('opacity', 0.4)
      this.node.on('click', function (event) {
        const nodeDataId = d3.select(this).attr('id')
        const nodeOpacity = Number(d3.select(this).style('opacity'))
        if (nodeOpacity === 0.4) {
          d3.select(this).style('opacity', 1)
          if (_this.propertyChangeData) {
            const nodeDataAge = d3.select(this).attr(_this.propertyChangeData)
            if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
              _this.nodesDataId.unshift(nodeDataId)
              _this.nodesData.unshift('"id":' + nodeDataId + ' , "' + _this.propertyChangeData + '":' + nodeDataAge)
            }
          } else {
            if (nodeDataId && !_this.nodesDataId.includes(nodeDataId)) {
              _this.nodesDataId.unshift(nodeDataId)
              _this.nodesData.unshift('"id":' + nodeDataId)
            }
          }
        } else {
          d3.select(this).style('opacity', 0.4)
          const nodeIndex = _this.nodesDataId.indexOf(nodeDataId)
          _this.nodesDataId.splice(nodeIndex, 1)
          _this.nodesData.splice(nodeIndex, 1)
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
      if (!this.brushStop2) {
        _this.brushCancel2()
      }
      if (!this.brushStop) {
        _this.brushCancel()
      }
      if (!this.SelectStop) {
        _this.SelectCancel()
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
      this.histogramExit = true
      this.NodesEditBoardExit = true
    },
    // 直方图关闭
    ChartBarNone() {
      this.histogramExit = false
      this.NodesEditBoardExit = false
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
      if (_this.propertyChangeData) {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          const nodeId = Number(d.id)
          const scoresNode = _this.scoresValue2[nodeId].value
          if (scoresNode < '0.01') {
            num1.push(scoresNode)
            return '#eff3ff'
          } else if (scoresNode >= '0.01' && scoresNode < '0.05') {
            num2.push(scoresNode)
            return '#bcd7e8'
          } else if (scoresNode >= '0.05' && scoresNode < '0.1') {
            num3.push(scoresNode)
            return '#68add8'
          } else if (scoresNode >= '0.1' && scoresNode < '0.5') {
            num4.push(scoresNode)
            return '#2b81c0'
          } else {
            num5.push(scoresNode)
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
            name: _this.propertyChangeData,
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: 'Number of nodes',
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
            name: 'Number of nodes',
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
      if (_this.propertyChangeData) {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          const nodeId = Number(d.id)
          const scoresNode = _this.scoresValue2[nodeId].value
          if (scoresNode < '0.01') {
            num1.push(scoresNode)
            return '#edf9fc'
          } else if (scoresNode >= '0.01' && scoresNode < '0.05') {
            num2.push(scoresNode)
            return '#b1e3e3'
          } else if (scoresNode >= '0.05' && scoresNode < '0.1') {
            num3.push(scoresNode)
            return '#62c3a4'
          } else if (scoresNode >= '0.1' && scoresNode < '0.5') {
            num4.push(scoresNode)
            return '#25a35c'
          } else {
            num5.push(scoresNode)
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
            name: _this.propertyChangeData,
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: 'Number of nodes',
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
            name: 'Number of nodes',
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
      if (_this.propertyChangeData) {
        const num1 = []
        const num2 = []
        const num3 = []
        const num4 = []
        const num5 = []
        this.node.attr('fill', function (d) {
          const nodeId = Number(d.id)
          const scoresNode = _this.scoresValue2[nodeId].value
          if (scoresNode < '0.01') {
            num1.push(scoresNode)
            return '#ffeede'
          } else if (scoresNode >= '0.01' && scoresNode < '0.05') {
            num2.push(scoresNode)
            return '#febf80'
          } else if (scoresNode >= '0.05' && scoresNode < '0.1') {
            num3.push(scoresNode)
            return '#ff8d2e'
          } else if (scoresNode >= '0.1' && scoresNode < '0.5') {
            num4.push(scoresNode)
            return '#e95406'
          } else {
            num5.push(scoresNode)
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
            name: _this.propertyChangeData,
            nameLocation: 'middle',
            nameGap: 25,
            nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
            data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
          },
          yAxis: {
            name: 'Number of nodes',
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
            name: 'Number of nodes',
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
      if (_this.propertyChangeData) {
        this.histogramChange(_this.propertyChangeData)
      } else {
        _this.histogramOrigin()
      }
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
      this.histogramOrigin()
      this.colorBoardClose()
      this.nodeReset()
    },
    // 节点按id编辑显示(设置透明度)
    nodeFilter() {
      let maxData = this.max !== '' ? Number(this.max) : 10000
      let minData = Number(this.min)
      const _this = this
      if (maxData >= minData) {
        this.node.style('opacity', 0.4)
        this.link.style('opacity', 0.4)
        if (_this.propertyChangeData) {
          let nodeLimit = this.node.filter((d) => _this.scoresValue2[Number(d.id)].value <= maxData && _this.scoresValue2[Number(d.id)].value >= minData)
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
      const filteredArr = []
      for (let index = 0; index < value.length; index++) {
        if (value[index]) {
          filteredArr.push(value[index])
        }
      }
      let categoryData = filteredArr[0]
      console.log(categoryData)
      const _this = this
      const apolloClient = new ApolloClient({
        uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
      })
      let scoresValue = null

      apolloClient
        .query({
          variables: {
            variable: categoryData
          },
          query: gql`
            query ($variable: String!) {
              scores(column: $variable) {
                value
              }
            }
          `
        })
        .then((response) => {
          // 处理响应数据
          scoresValue = response.data.scores
          console.log(scoresValue)
          _this.node.attr(categoryData, function (d) {
            let scoresValue = response.data.scores
            _this.scoresValue2 = scoresValue
            const nodeId = Number(d.id)
            const scoresNode = scoresValue[nodeId].value
            console.log(scoresNode)
            return scoresNode
          })
          _this.histogramChange(categoryData)
        })
    },
    // 搜索点击下拉框数据
    handleSelect(item) {
      this.value = ''
      console.log('item.value', item.value)
      const _this = this
      const apolloClient = new ApolloClient({
        uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
      })
      let scoresValue = null

      apolloClient
        .query({
          variables: {
            variable: item.value
          },
          query: gql`
            query ($variable: String!) {
              scores(column: $variable) {
                value
              }
            }
          `
        })
        .then((response) => {
          // 处理响应数据
          scoresValue = response.data.scores
          console.log(scoresValue)
          _this.node.attr(item.value, function (d) {
            let scoresValue = response.data.scores
            _this.scoresValue2 = scoresValue
            const nodeId = Number(d.id)
            const scoresNode = scoresValue[nodeId].value
            console.log(scoresNode)
            return scoresNode
          })
          _this.histogramChange(item.value)
        })
    },
    // 原来直方图按id
    histogramOrigin() {
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
          name: 'Number of nodes',
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
    // 直方图改变
    histogramChange(param) {
      const _this = this

      const num1 = []
      const num2 = []
      const num3 = []
      const num4 = []
      const num5 = []

      this.node.attr('fill', function (d) {
        const nodeId = Number(d.id)
        const scoresNode = _this.scoresValue2[nodeId].value
        if (scoresNode < '0.01') {
          num1.push(scoresNode)
          return '#b2392d'
        } else if (scoresNode >= '0.01' && scoresNode < '0.05') {
          num2.push(scoresNode)
          return '#f09e30'
        } else if (scoresNode >= '0.05' && scoresNode < '0.1') {
          num3.push(scoresNode)
          return '#7cf728'
        } else if (scoresNode >= '0.1' && scoresNode < '0.5') {
          num4.push(scoresNode)
          return '#25a8b6'
        } else {
          num5.push(scoresNode)
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
          name: param,
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: { fontSize: 14, fontWeight: 'bold' },
          data: ['(0,0.01)', '(0.01,0.05)', '(0.05,0.1)', '(0.1,0.5)', '(0.5,+∞)']
        },
        yAxis: {
          name: 'Number of nodes',
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
      _this.propertyChangeData = param
    },
    // 搜索下拉数据显示
    loadAll() {
      const options = []
      const _this = this

      _this.variablesValue.forEach((category) => {
        category.variables.forEach((variable) => {
          options.push({
            value: variable
          })
        })
      })

      return options
    },
    // 改变节点斥力
    forceChange() {
      this.graphLayout.force('charge', d3.forceManyBody().strength(-this.valueTooltip * 40))
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
.colorCastButton {
  right: 20px;
  top: 400px;
  z-index: 16;
  position: absolute;
  width: 340px;
  display: flex;
  height: 30px;
}
.NodesEditBoard {
  top: 450px;
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
.minAndMax {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-left: 10px;
}
.querySearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-left: 10px;
}
.minAndMaxButton {
  width: 80px;
  margin-top: 30px;
}
@media screen and (max-width: 1300px) {
  .NodesEditBoard,
  .colorCastButton,
  #chartBar {
    display: none !important;
  }
}
</style>
