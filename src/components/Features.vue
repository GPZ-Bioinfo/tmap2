<template>
  <div>
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
    </div>
    <div class="container">
      <div class="card-content">
        <div id="chartBary" style="width: 900px; height: 200px"></div>
      </div>
      <div class="button-container">
        <!-- 创建按钮和色块 -->
        <div class="category-button" @click="toggleBarsAll()">
          <div class="color-box" :style="{ backgroundColor: '#c8d0d4' }"></div>
          <button>All</button>
        </div>
        <div v-for="category in categories" :key="category" class="category-button" @click="toggleBarsByCategory(category)">
          <div class="color-box" :style="{ backgroundColor: colorPalette[categories.indexOf(category) % colorPalette.length] }"></div>
          <button>{{ category }}</button>
        </div>
      </div>
    </div>

    <!-- 第三行 -->
    <div class="row">
      <div>
        <svg id="viy"></svg>
      </div>
      <div class="module">
        <el-card>
          <h2>Summary</h2>

          <h3>Enriched</h3>
          <h5>Nodes: {{ nodesCount2 }}</h5>
          <h5>Samples: {{ histogramParams }}</h5>
          <h5>Groups: xx</h5>
          <h3>Associated</h3>
          <h5>Taxonomy: xx</h5>
          <h5>Metadata: xx</h5>
          <h3>Explore:</h3>
          <div class="popup-content" @click="exploreData">-> Data</div>
          <div class="popup-content" @click="exploreMap">-> Map</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
import { _elements } from './static/feature_overview_coenrich_graph.json'
import { _data } from './static/feature_overview_barchart.json'
import { _datas } from './static/feature_overview_metadata_category.json'
import { _elements2 } from './static/gzfy_valid_genus_r634_c373/feature_overview_coenrich_graph.json'
import { _datas2 } from './static/gzfy_valid_genus_r634_c373/metadata_category.json'
import { _data2 } from './static/gzfy_valid_genus_r634_c373/feature_overview_barchart.json'
import { _elements3 } from './static/gzfy_discv_genus_r1455_c373/feature_overview_coenrich_graph.json'
import { _datas3 } from './static/gzfy_discv_genus_r1455_c373/metadata_category.json'
import { _data3 } from './static/gzfy_discv_genus_r1455_c373/feature_overview_barchart.json'

export default {
  data() {
    return {
      graph: '',
      nodesCount2: 0,
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
      chartBar: null, // ECharts 实例
      yAxisData: '',
      histogramParams: 'xx',
      categories: [],
      barHidden: false,
      interval: 200,
      data: null,
      datas: null,
      elements: null,
      variablesValue: null,
      selectedCategory: null, // 记录当前选中的 category
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

    const xAxisData = data.map((item) => item.variable) // 提取 variable 字段作为 x 轴数据

    this.yAxisData = data.map((item) => item.enrich_score) // 提取 enrich_score 字段作为 y 轴数据

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
      tooltip: {
        trigger: 'axis' // 触发类型：坐标轴触发
      },
      dataZoom: [
        {
          type: 'inside', // 内置型 dataZoom 组件
          mouseWheel: true // 启用鼠标滚轮
        }
      ],
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: this.yAxisData.slice(0, this.interval), // 柱状图数据，根据 interval 显示前几个柱子,
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
      if (lastClickedBar === currentBar) {
        _this.histogramParams = 'xx'
        // 如果两次点击的是同一个柱子，则恢复所有节点的透明度为 1
        // 其他柱子恢复
        _this.toggleBarsAll()
        lastClickedBar = null // 清除上次点击的柱子名称
      } else {
        _this.histogramParams = params.name
        // 如果点击的是不同柱子，则显示被点击的节点的透明度为 1，其他节点的透明度为 0.4
        node.style('opacity', (d) => (d.id === currentBar ? 1 : 0.4))
        // 高亮邻居
        let index = d3.select(node.filter((d) => d.id === currentBar)._groups[0][0]).datum().index
        node.style('opacity', function (o) {
          return neigh(index, o.index) ? 1 : 0.4
        })
        link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.4
        })
        // 其他柱子消失
        option.series[0].data = _this.yAxisData.slice(0, this.interval)
        option.xAxis.data = _this.data.map((item) => item.variable)
        if (_this.variablesValue) {
          option.xAxis.data = _this.variablesValue
          _this.variablesValue = null
        }
        var dataIndex = params.dataIndex // 获取点击的柱子的索引
        // const dataIndexValue = option.series[0].data[dataIndex]
        // option.series[0].data = [dataIndexValue]
        // 更新图表
        for (let i = 0; i < option.series[0].data.length; i++) {
          if (i !== dataIndex) {
            option.series[0].data[i] = 0
          }
        }

        _this.chartBar.setOption(option)

        // 设置边框颜色
        node.style('stroke', (d) => (d.id === currentBar ? 'black' : '#caa455'))
        node.style('stroke-width', (d) => (d.id === currentBar ? '2px' : '1px'))
        lastClickedBar = currentBar // 更新上次点击的柱子名称
      }
    })

    // 网络图

    this.graph = {
      nodes: elements.nodes,
      links: elements.links
    }
    this.nodesCount2 = elements.nodes.length
    let graph = this.graph

    let graphLayout = d3
      .forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-400))
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

    let graphTrans = d3.zoomTransform(graph.nodes)
    this.graphLayout = graphLayout

    this.graphTrans = graphTrans
    this.graphLinks = graph.links
    this.graphNodes = graph.nodes

    let svg = d3.select('#viy').attr('width', this.width).attr('height', this.height)
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

    let link = container.append('g').attr('class', 'links').selectAll('line').data(graph.links).enter().append('line').attr('stroke', 'pink').attr('stroke-width', '1px')

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
      .attr('r', 10)
      .attr('fill', (d) => colorMap[variableToCategoryMap[d.id]])
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
        .style('font-size', 15)
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
        _this.histogramParams = 'xx'
        // 如果两次点击的是同一个节点，则恢复所有节点的透明度为 1
        // 其他柱子恢复
        _this.toggleBarsAll()
        lastClickedBar = null // 清除上次点击的柱子名称
      } else {
        _this.histogramParams = currentBar
        _this.toggleBarsAll()
        // 如果点击的是不同节点，则显示被点击的节点的透明度为 1，其他节点的透明度为 0.4
        // node.style('opacity', (d) => (d.id === currentBar ? 1 : 0.4))
        // 高亮邻居

        let index = d3.select(d3.event.target).datum().index

        node.style('opacity', function (o) {
          return neigh(index, o.index) ? 1 : 0.4
        })
        link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.4
        })
        // 选中节点加粗边框
        node.style('stroke', (d) => (d.id === currentBar ? 'black' : '#caa455'))
        node.style('stroke-width', (d) => (d.id === currentBar ? '2px' : '1px'))
        // 其他柱子消失
        option.xAxis.data = _this.data.map((item) => item.variable)
        option.series[0].data = _this.yAxisData.slice(0, this.interval)
        var dataIndex = option.xAxis.data.indexOf(currentBar) // 获取点击的柱子的索引
        // 更新图表
        for (let i = 0; i < option.series[0].data.length; i++) {
          if (i !== dataIndex) {
            option.series[0].data[i] = 0
          }
        }
        _this.chartBar.setOption(option)
        lastClickedBar = currentBar // 更新上次点击的柱子名称
      }
    }
  },
  watch: {
    interval: 'updateChart' // 监听 interval 的变化，调用 updateChart 方法更新图表
  },
  methods: {
    // 更新图表
    updateChart() {
      const option = this.chartBar.getOption()

      option.series[0].data = this.yAxisData.slice(0, this.interval) // 根据 interval 显示前几个柱子
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
      option.xAxis[0].data = this.data.map((item) => item.variable)
      option.series[0].data = this.yAxisData.slice(0, this.interval)
      this.chartBar.setOption(option)
      this.node.style('opacity', 1)
      this.node.style('stroke', '#caa455')
      this.node.style('stroke-width', '1px')
    },
    // 匹配当前类别的柱子
    toggleBarsByCategory(category) {
      const option = this.chartBar.getOption()
      const variables = this.getVariablesByCategory(category)
      this.variablesValue = variables
      // 先恢复所有柱子
      this.toggleBarsAll()
      // 对于所有类别，只显示匹配当前类别的柱子
      option.xAxis[0].data = variables
      this.chartBar.setOption(option)
    },
    exploreData() {
      console.log('Explore Data clicked')
      // 添加 Data 按钮的点击事件逻辑
    },
    exploreMap() {
      // 添加 Map 按钮的点击事件逻辑
      console.log('this.histogramParams', this.histogramParams)
      this.$router.push({ name: 'ForceBased', params: { value: this.histogramParams } })
    }
  }
}
</script>

<style scoped>
.container {
  height: 200px;
  display: flex;
  justify-content: space-between;
}

.button-container {
  width: 30%;
  display: flex;
  flex-direction: column;
}
.category-button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-box {
  width: 13px;
  height: 13px;
  margin-right: 5px;
  border: 1px solid #ccc;
}

button {
  cursor: pointer;
  height: 13px;
  font-size: 13px;
}
.card-content {
  height: 200px;
  width: 900px;
}

.row {
  display: flex;
  justify-content: space-between;
  width: 1140px;
}

.module {
  margin-top: 50px;
  width: 200px;
}
h3 {
  margin-top: 20px;
}
.popup-content {
  cursor: pointer;
  color: blue; /* 设置字体颜色为蓝色 */
  text-decoration: underline; /* 添加下划线 */
}
#topBar {
  margin-left: 100px;
  margin-top: 5px;
}
</style>
