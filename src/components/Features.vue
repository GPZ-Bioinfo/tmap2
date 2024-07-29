<template>
  <div class="main">
    <div id="topBar">
      <label for="intervalInput2" style="font-weight: bold; font-size: 14px">top features: </label>
      <input
        id="intervalInput2"
        type="number"
        v-model="interval"
        @input="updateChart"
        min="1"
        pattern="\d+"
        style="margin-top: 1px; border: 1px solid rgb(108, 98, 98); width: 47px; appearance: textfield"
      />
      <div class="topReset" @click="ResetTop()">
        <button class="el-icon-refresh-right">Reset</button>
      </div>
      <!-- 搜索框部分关键字检索 -->
      <div class="querySearch">
        <el-autocomplete v-model="state1" :fetch-suggestions="querySearch" placeholder="Please enter keywords to search" clearable style="width: 250px" @select="handleSelect">
          <template slot="default" slot-scope="{ item }">
            <div class="searchtext">
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
        <div class="topReset" @click="SearchCancel()">
          <button class="el-icon-refresh-right">Cancel</button>
        </div>
      </div>
    </div>
    <div class="button-container">
      <div class="category-button" @click="toggleBarsAll()">
        <div class="color-box" :style="{ backgroundColor: '#c8d0d4' }"></div>
        <button>All</button>
      </div>
      <div v-for="category in categories" :key="category" class="category-button" @click="toggleBarsByCategory(category)">
        <div
          class="color-box"
          :style="{
            backgroundColor: colorPalette[categories.indexOf(category) % colorPalette.length]
          }"
        ></div>
        <button>{{ category }}</button>
      </div>
    </div>
    <div class="row">
      <div class="nodechart">
        <div id="chartBary" style="width: 58vw; height: 40vh"></div>
        <div>
          <svg id="viy"></svg>
        </div>
      </div>

      <div class="summarycard">
        <el-card>
          <h2>Nodes</h2>
          <h3>Selected node:</h3>
          <div class="summaryText">{{ histogramParams }}</div>
          <h3>Enriched SAFE score:</h3>
          <div class="summaryText">{{ selectedValue }}</div>
          <h3>number of enriched nodes on TDA network:</h3>
          <div class="summaryText">{{ enrichNodes }}</div>
          <h3>number of enriched samples on TDA network:</h3>
          <div class="summaryText">{{ enrichSample }}</div>
          <h3>Co-enrichment neighbors:</h3>
          <div class="summaryText" v-for="(item, index) in neighNode" :key="index">
            {{ item }}
          </div>
          <div class="popup-content" @click="exploreMap">-> explore on TDA network</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
import { elements as _elements } from './static/feature_overview_coenrich_graph.json'
import { data as _data } from './static/feature_overview_barchart.json'
import { data as _datas } from './static/vars_category.json'
import { elements as _elements2 } from './static/gzfy_valid_genus_r634_c373/feature_overview_coenrich_graph.json'
import { data as _datas2 } from './static/gzfy_valid_genus_r634_c373/vars_category.json'
import { data as _data2 } from './static/gzfy_valid_genus_r634_c373/feature_overview_barchart.json'
import { elements as _elements3 } from './static/gzfy_discv_genus_r1455_c373/feature_overview_coenrich_graph.json'
import { data as _datas3 } from './static/gzfy_discv_genus_r1455_c373/vars_category.json'
import { data as _data3 } from './static/gzfy_discv_genus_r1455_c373/feature_overview_barchart.json'

export default {
  data() {
    return {
      graph: '',
      nodesCount2: 0,
      state1: '',
      container: null,
      graphLayout: null,
      graphTrans: null,
      svg: null,
      node: null,
      link: null,
      width: 900,
      height: 500,
      graphNodes: null,
      graphLinks: null,
      linkingNode: [],
      chartBar: null, // ECharts 实例
      xAxisData: '',
      yAxisData: '',
      histogramParams: 'null',
      selectedValue: 'null',
      enrichNodes: 'null',
      enrichSample: 'null',
      categories: [],
      barHidden: false,
      interval: 0,
      data: null,
      datas: null,
      nodeindex: null,
      elements: null,
      variablesValue: null,
      selectedCategory: null, // 记录当前选中的 category
      dataList: [],
      neighNode: [],
      colorPalette: ['#2E86C1', '#52BE80', '#F4D03F', '#E74C3C', '#AF7AC5', '#5DADE2', '#48C9B0', '#F1948A'] // 色带
    }
  },
  mounted() {
    const _this = this
    let graphName = JSON.parse(localStorage.getItem('graphName'))
    if (graphName === 'discv_genus_r1455_c373') {
      this.data = _data3
      this.datas = _datas3
      this.elements = _elements3
    } else if (graphName === 'valid_genus_r634_c373') {
      this.data = _data2
      this.datas = _datas2
      this.elements = _elements2
    } else {
      this.data = _data
      this.datas = _datas
      this.elements = _elements
    }
    const data = this.data
    const datas = this.datas
    const elements = this.elements

    data.sort((a, b) => b.enrich_score - a.enrich_score) // 根据 enrich_score 由大到小排序

    this.xAxisData = data.map((item) => item.variable) // 提取 variable 字段作为 x 轴数据
    const xAxisData = [...this.xAxisData]
    this.yAxisData = data.map((item) => item.enrich_score) // 提取 enrich_score 字段作为 y 轴数据
    const yAxisData = [...this.yAxisData]

    // 获取所有类别
    this.categories = [...new Set(datas.map((item) => item.category))]
    // 生成一个很长的色带
    const colorPalette = ['#2E86C1', '#52BE80', '#F4D03F', '#E74C3C', '#AF7AC5', '#5DADE2', '#48C9B0', '#F1948A']
    // 创建一个映射关系，将 variable 映射到 category
    const variableToCategoryMap = {}
    datas.forEach((item) => {
      variableToCategoryMap[item.variable] = item.category
    })
    // 创建一个映射关系，将类别映射到颜色
    const colorMap = {}
    this.categories.forEach((category, index) => {
      colorMap[category] = colorPalette[index % colorPalette.length]
    })

    this.chartBar = echarts.init(document.getElementById('chartBary'))
    const option = {
      grid: {
        top: '15%'
      },
      tooltip: {
        trigger: 'axis' // 触发类型：坐标轴触发
      },
      toolbox: {
        feature: {
          dataZoom: {}
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          interval: 0,
          formatter: function (value, index) {
            // 只显示第一个和最后一个标签
            var data = option.xAxis.data

            if (index === 0 || index === data.length - 1 || index === parseInt(data.length / 2)) {
              return value
            } else {
              return ''
            }
          }
        },
        axisTick: {
          show: false // 隐藏刻度线
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: yAxisData, // 柱状图数据，根据 interval 显示前几个柱子,

          itemStyle: {
            color: (params) => {
              const categoryIndex = this.categories.indexOf(datas.find((item) => item.variable === params.name).category)
              return colorPalette[categoryIndex % colorPalette.length]
            } // 根据类别设置颜色
          }
        }
      ]
    }
    this.chartBar.setOption(option)

    let lastClickedBar = null // 记录上次点击的柱子名称
    // 直方图点击柱子显示 svg 节点
    this.chartBar.on('click', function (params) {
      const currentBar = params.name // 获取当前点击的柱子名称
      node.filter((d) => d.id === currentBar).dispatch('click')
    })

    // 网络图

    this.graph = {
      nodes: elements.nodes,
      links: elements.links
    }
    this.nodesCount2 = this.xAxisData.length
    if (this.nodesCount2) {
      this.interval = this.nodesCount2
    }

    let graph = this.graph

    let graphLayout = d3
      .forceSimulation(graph.nodes)
      .alphaMin(0.000001)
      .alphaDecay(0.0183)
      .velocityDecay(0.2)
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
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

    let svg = d3.select('#viy')
    this.svg = svg
    // 初始化 SVG 大小
    this.resize()
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.resize)
    let container = svg.append('g')
    this.container = container
    // 定义缩放行为
    let zoom = d3.zoom().on('zoom', zooming)
    // 应用缩放行为到SVG
    this.svg.call(zoom)
    // 获取SVG的中心点
    let svgWidth = +this.svg.attr('width')
    let svgHeight = +this.svg.attr('height')
    let centerX = svgWidth / 2
    let centerY = svgHeight / 1.8

    // 设置初始变换，包含缩放比例 k=0.4 和平移到中心位置
    let initialScale = 0.4
    let initialTransform = d3.zoomIdentity.translate(centerX, centerY).scale(initialScale).translate(-centerX, -centerY)
    // 应用初始变换并同步更新zoom行为的内部状态
    this.svg.call(zoom.transform, initialTransform)
    function zooming() {
      _this.currentScale = d3.event.transform.k
      container.attr('transform', d3.event.transform)
    }

    let link = container
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke', 'pink')
      .attr('stroke-width', function (d) {
        return d.value * 5
      })

    let node = container
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('id', function (d) {
        return d.id
      })
      .attr('r', function (d) {
        return d.degree * 2
      })
      .attr('fill', (d) => colorMap[variableToCategoryMap[d.id]])
      .style('stroke', '#caa455')
      .style('stroke-width', '1px')
      .style('stroke-linecap', 'round')

    // 节点悬浮显示id
    let focusId = null
    node.on('mouseover', idFocus).on('mouseout', idUnFocus)
    function idFocus(d) {
      container.selectAll('text').style('opacity', 0.2)
      focusId = container
        .append('text')
        .text(d.id)
        .attr('x', d.x + 8)
        .attr('y', d.y - 10)
        .style('font-family', 'Arial')
        .style('font-size', 15)
        .style('pointer-events', 'none')
    }
    function idUnFocus(d) {
      container.selectAll('text').style('opacity', 1)
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
      if (!d3.event.active) graphLayout.alphaTarget(0.6).restart()
      d.fx = d.x
      d.fy = d.y
      // 清除标签
      container.selectAll('text').remove()
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) graphLayout.alphaTarget(0)
      d.fx = null
      d.fy = null
      if (_this.nodeindex === d.index) {
        let index = d.index
        _this.graphLayout.stop()
        node
          .filter((d) => neigh(index, d.index))
          .each(function (d) {
            container
              .append('text')
              .text(d.id)
              .attr('x', d.x + 8)
              .attr('y', d.y - 10)
              .style('font-family', 'Arial')
              .style('font-size', 13)
              .style('pointer-events', 'none')
          })
      }
    }
    node.on('click', clickSelect)
    let adjList = []
    graph.links.forEach(function (d) {
      adjList[d.source.index + '-' + d.target.index] = true
      adjList[d.target.index + '-' + d.source.index] = true
    })
    function neigh(a, b) {
      return a === b || adjList[a + '-' + b]
    }
    function clickSelect(event) {
      // 直方图点击柱子显示 svg 节点
      const currentBar = d3.select(this).attr('id') // 获取当前点击的节点名称
      if (lastClickedBar === currentBar) {
        // 如果两次点击的是同一个节点，则恢复所有节点的透明度为 1
        // 其他柱子恢复
        _this.toggleBarsAll()
        _this.neighNode = []
        lastClickedBar = null // 清除上次点击的柱子名称
        // 清除标签
        container.selectAll('text').remove()
      } else {
        // 清除标签
        container.selectAll('text').remove()
        _this.neighNode = []
        _this.toggleBarsAll()
        _this.histogramParams = currentBar
        _this.selectedValue = _this.data.find((item) => item.variable === _this.histogramParams).enrich_score
        option.series[0].data = _this.yAxisData.slice(0, this.interval)
        option.xAxis.data = _this.xAxisData.slice(0, this.interval)
        // 使用 dispatchAction 触发 toolbox 中的 restore 功能
        _this.chartBar.dispatchAction({
          type: 'restore'
        })
        // 如果点击的是不同节点，则显示被点击的节点的透明度为 1，其他节点的透明度为 0.4
        // 高亮邻居
        _this.nodeindex = d3.select(d3.event.target).datum().index
        let index = _this.nodeindex

        node.style('opacity', function (d) {
          if (neigh(index, d.index)) {
            var dataIndex = option.xAxis.data.indexOf(d.id) // 获取点击的柱子的索引
            _this.linkingNode.push(dataIndex)
          }
          return neigh(index, d.index) ? 1 : 0.4
        })
        // 存起相邻的节点的id到数组里
        node
          .filter((d) => neigh(index, d.index))
          .each(function (d) {
            if (d.id !== currentBar) {
              _this.neighNode.push(d.id)
            }
          })
        _this.enrichNodes = _this.neighNode.length + 1
        let newNeighNode = [...new Set(_this.neighNode)]
        newNeighNode.push(currentBar)
        let filteredNode = datas.filter((item) => newNeighNode.includes(item.variable))
        _this.enrichSample = [...new Set(filteredNode.map((item) => item.category))].length

        //  给选中节点和相邻节点加上标签
        _this.graphLayout.stop()
        node
          .filter((d) => neigh(index, d.index))
          .each(function (d) {
            container
              .append('text')
              .text(d.id)
              .attr('x', d.x + 8)
              .attr('y', d.y - 10)
              .style('font-family', 'Arial')
              .style('font-size', 13)
              .style('pointer-events', 'none')
          })

        link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.4
        })
        // 选中节点加粗边框
        node.style('stroke', (d) => (d.id === currentBar ? 'black' : '#caa455'))
        node.style('stroke-width', (d) => (d.id === currentBar ? '2px' : '1px'))

        // 其他柱子消失

        // 更新图表
        setTimeout(() => {
          const option = _this.chartBar.getOption()
          option.xAxis[0].data = option.xAxis[0].data.filter((_, index) => {
            return _this.linkingNode.includes(index)
          })
          option.series[0].data = option.series[0].data.filter((_, index) => {
            return _this.linkingNode.includes(index)
          })
          option.xAxis[0].axisLabel.formatter = function (value) {
            // 假设每8个字符换行
            let formattedValue = ''
            for (let i = 0; i < value.length; i += 8) {
              formattedValue += value.substr(i, 8) + '\n'
            }
            return formattedValue.trim()
          }
          _this.chartBar.setOption(option)
          lastClickedBar = currentBar // 更新上次点击的柱子名称
        }, 500)
      }
    }
    this.dataList = this.loadAll()
    const isparams = JSON.parse(localStorage.getItem('paramsMap'))
    if (isparams) {
      let node = d3.select(`#${isparams}`)
      setTimeout(() => {
        node.dispatch('click')
      }, 1000)
    }
  },
  beforeDestroy() {
    // 在组件销毁前移除窗口大小变化事件监听
  },
  watch: {
    interval: 'updateChart' // 监听 interval 的变化，调用 updateChart 方法更新图表
  },
  methods: {
    resize() {
      // 获取新的窗口宽度和高度
      this.width = window.innerWidth * 0.55
      this.height = window.innerHeight * 1.2

      // 设置 SVG 的宽度和高度
      this.svg.attr('width', this.width).attr('height', this.height)
      this.chartBar.resize()
    },
    ResetTop() {
      this.interval = this.nodesCount2
    },
    // 选择器还原
    SearchCancel() {
      this.state1 = ''
      this.toggleBarsAll()
    },
    querySearch(queryString, cb) {
      const dataList = this.dataList
      const results = queryString ? dataList.filter(this.createFilter(queryString)) : dataList
      // 调用 callback 返回建议列表
      cb(results)
    },
    createFilter(queryString) {
      return (data) => {
        // 将搜索字符串和数据值都转换为小写进行比较
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }
    },
    // 搜索点击下拉框数据
    handleSelect(itemvalue) {
      let node = d3.select(`#${itemvalue.value}`)
      node.dispatch('click')
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
    // 更新图表
    updateChart() {
      const option = this.chartBar.getOption()
      option.xAxis[0].data = this.xAxisData.slice(0, this.interval)
      this.chartBar.setOption(option)
    },
    // 获取特定类别的变量
    getVariablesByCategory(category) {
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
      const filteredData = datas.filter((item) => item.category === category)
      return filteredData.map((item) => item.variable)
    },
    // 显示全部柱子
    toggleBarsAll() {
      const option = this.chartBar.getOption()
      option.xAxis[0].axisLabel.formatter = function (value, index) {
        // 只显示第一个和最后一个标签
        var data = option.xAxis[0].data
        if (index === 0 || index === data.length - 1 || index === parseInt(data.length / 2)) {
          return value
        } else {
          return ''
        }
      }
      option.series[0].data = this.yAxisData.slice(0, this.interval)
      option.xAxis[0].data = this.xAxisData.slice(0, this.interval)
      this.chartBar.setOption(option)
      this.linkingNode = []
      this.neighNode = []
      this.histogramParams = 'null'
      this.selectedValue = 'null'
      this.enrichNodes = 'null'
      this.enrichSample = 'null'
      this.nodeindex = null
      localStorage.removeItem('paramsMap')
      this.node.style('opacity', 1)
      this.node.style('stroke', '#caa455')
      this.node.style('stroke-width', '1px')
      this.link.style('opacity', 1)
      // 清除标签
      this.container.selectAll('text').remove()
    },
    // 匹配当前类别的柱子
    toggleBarsByCategory(category) {
      // 先恢复所有柱子
      this.toggleBarsAll()
      const option = this.chartBar.getOption()
      const variables = this.getVariablesByCategory(category)
      this.variablesValue = variables
      // 获取符合类别的柱子的下标数组
      let indexes = variables.map((element) => option.xAxis[0].data.indexOf(element))
      // 对纵坐标的数据也进行匹配过滤
      option.series[0].data = option.series[0].data.filter((_, index) => indexes.includes(index))
      // 对于所有类别，只显示匹配当前类别的柱子,对横坐标过滤
      option.xAxis[0].data = variables
      // 只显示第一个和最后一个标签
      option.xAxis[0].axisLabel.formatter = function (value, index) {
        var data = option.xAxis[0].data
        if (index === 0 || index === data.length - 1 || index === parseInt(data.length / 2)) {
          return value
        } else {
          return ''
        }
      }
      this.chartBar.setOption(option)
    },
    exploreMap() {
      // 添加 Map 按钮的点击事件逻辑
      this.$router.push({ name: 'ForceBased', params: { value: this.histogramParams } })
      localStorage.removeItem('paramsMap')
      localStorage.setItem('paramsMap', JSON.stringify(this.histogramParams))
    }
  }
}
</script>

<style scoped>
.main {
  overflow-y: scroll;
}
#topBar {
  margin-left: 10vh;
  margin-top: 1vh;
  height: 30px;
}
.topReset {
  width: 70px;
  margin-left: 30px;
  display: inline;
}
.querySearch {
  display: inline;
  margin-left: 60px;
}
.row {
  display: flex;
}
.button-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px; /* 设置按钮之间的间隔 */
  align-items: center;
  margin-top: 3vh;
  margin-left: 5vh;
}

.category-button {
  display: flex;
  align-items: center;
}

.color-box {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border: 1px solid #ccc;
}

.category-button button {
  cursor: pointer;
  height: 15px;
  font-size: 13px;
}

.nodechart {
  width: 60vw;
  margin-top: 3vh;
  overflow: hidden;
}

.summarycard {
  width: 20vw;
  margin-top: 3vh;
}

h3 {
  margin-top: 0.4vh;
}
.popup-content {
  cursor: pointer;
  font-size: 18px;
  color: blue; /* 设置字体颜色为蓝色 */
  text-decoration: underline; /* 添加下划线 */
}

/* 定义悬停工具提示样式 */
.searchtext {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  white-space: normal; /* 允许文本换行 */
  overflow-wrap: break-word; /* 换行时断开单词 */
}
.summaryText {
  font-size: 15px;
  border-bottom: 1px dotted black;
  white-space: normal; /* 允许文本换行 */
  overflow-wrap: break-word; /* 换行时断开单词 */
}
</style>
