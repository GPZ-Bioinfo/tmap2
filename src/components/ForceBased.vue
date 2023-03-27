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
      <!-- 下载控件 -->
      <el-button class="buttonStyle" @click="screenShot"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="图片导出"><v-icon>mdi-download</v-icon></el-tooltip></el-button
      >
      <!-- 直方图控件 -->
      <el-button class="buttonStyle" @click="theChartBar" v-if="histogramExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="直方图"><v-icon>mdi-chart-histogram</v-icon></el-tooltip></el-button
      >
      <el-button class="buttonStyle" @click="ChartBarNone" v-if="!histogramExit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="隐藏"><v-icon>mdi-cursor-default-outline</v-icon></el-tooltip></el-button
      >
      <!-- 画板控件 -->
      <el-button class="buttonStyle" v-if="!buttonColor" @click="ColorSelect"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="调色板"><v-icon>mdi-palette</v-icon></el-tooltip></el-button
      >
      <!-- 修改控件 -->
      <el-button class="buttonStyle" @click="nodeEdit"
        ><el-tooltip placement="right" :delay="{ show: 500, hide: 1000 }" :hide-after="2000" content="节点编辑"><v-icon>mdi-pencil-minus</v-icon></el-tooltip></el-button
      >
    </div>
    <!-- 点线数量 -->
    <div class="CountBoard">
      nodes:<span class="Countnumber">{{ nodesCount }}</span
      >,links:<span class="Countnumber">{{ linksCount }}</span>
    </div>
    <!-- 直方图 -->
    <div id="chartBar" style="width: 500px; height: 500px"></div>
    <!-- 数据面板 -->
    <el-card class="dataBoard" v-if="boardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Selected</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="boardClose">❌</el-button>
      </div>
      <div v-for="(item, index) in nodesData" :key="index" class="datacard">
        {{ index + 1 + '、id: ' + item }}
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
        <div class="color-strip">
          <div class="color-block" v-for="(color, index) in colorList2" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
        <div class="color-strip">
          <div class="color-block" v-for="(color, index) in colorList3" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
        <div class="color-strip">
          <div class="color-block" v-for="(color, index) in colorList4" :key="index" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
        </div>
      </div>
      <div class="colorBoardButton">
        <el-button @click="colorBarCancel">Cancel</el-button>
        <el-button>Reset</el-button>
        <el-button>Preview</el-button>
        <el-button>Apply Color Palette</el-button>
      </div>
    </el-card>
    <!-- 节点编辑面板 -->
    <el-card class="NodesEditBoard" v-if="NodesEditBoardExit">
      <div slot="header" class="clearfix">
        <h3 style="text-align: center">Nodes Edit</h3>
        <el-button style="position: absolute; right: 10px; top: 0" type="text" @click="NodesEditBoardClose">❌</el-button>
      </div>
      <div>
        <el-input v-model="searchValue" placeholder="请输入搜索内容" @keyup.enter.native="doSearch" :suffix-icon="icon" clearable style="width: 500px"></el-input>
      </div>
      <div class="dropdown">
        <el-dropdown>
          <el-button type="primary"> Select Item<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Select Item</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="dropdown">
        <el-button @click="nodeFilter">Edit</el-button>
      </div>
      <div class="dropdown">
        <el-button @click="nodeReset">Reset</el-button>
      </div>
    </el-card>
    <!-- d3画布 -->
    <span ref="box" style="background-color: #fff">
      <svg id="viz" class="container-border" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
    </span>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as echarts from 'echarts'
// import * as chromatic from 'd3-scale-chromatic'
import { elements } from './static/ran2.json'

export default {
  name: 'ForceBasedLabelPlacementI',
  data: () => ({
    snackbar: false,
    version: '',
    fullScreen: true,
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
    width: window.innerWidth,
    height: window.innerHeight,
    container: null,
    graphLayout: null,
    graphTrans: null,
    buttonStop: true,
    brushStop: true,
    nodesCount: 0,
    linksCount: 0,
    buttonColor: false,
    svg: null,
    node: null,
    link: null,
    boardExit: false,
    nodesData: [],
    SelectStop: true,
    labelNode: null,
    graphLinks: null,
    LightStop: true,
    multiple: 10,
    brush: null,
    graphNodes: null,
    labelLayout: null,
    theGreen: [],
    theBlue: [],
    theRed: [],
    colorBoardExit: false,
    radio: 3,
    colorList1: ['#eff3ff', '#bcd7e8', '#68add8', '#2b81c0', '#064e9e'],
    colorList2: ['#edf9fc', '#b1e3e3', '#62c3a4', '#25a35c', '#006e29'],
    colorList3: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    colorList4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
    histogramExit: true,
    BarColorList: ['#244e96', '#25a8b6', '#7cf728', '#f09e30', '#b2392d'],
    option: null,
    searchValue: '',
    icon: 'el-icon-search',
    NodesEditBoardExit: false
  }),
  async mounted() {
    this.nodesCount = elements.nodes.length
    this.linksCount = elements.links.length

    // let label = {
    //   nodes: [],
    //   links: []
    // }
    let graph = {
      nodes: [],
      links: []
    }

    for (let index = 0; index < elements.nodes.length; index++) {
      const nodesId = elements.nodes[index].data.id
      const obj1 = { id: nodesId, group: 1 }
      graph.nodes.push(obj1)
    }

    for (let index = 0; index < elements.links.length; index++) {
      const linksSource = elements.links[index].data.source
      const linksTarget = elements.links[index].data.target
      const obj2 = {
        source: linksSource,
        target: linksTarget,
        value: 4
      }
      graph.links.push(obj2)
    }

    // graph.nodes.forEach(function (d, i) {
    //   label.nodes.push({ node: d })
    //   label.nodes.push({ node: d })
    //   label.links.push({
    //     source: i * 2,
    //     target: i * 2 + 1
    //   })
    // })

    // let labelLayout = d3.forceSimulation(label.nodes).force('charge', d3.forceManyBody().strength(-50)).force('link', d3.forceLink(label.links).distance(0).strength(2))

    let graphLayout = d3
      .forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-3000))
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
    // this.labelLayout = labelLayout
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

    let link = container.append('g').attr('class', 'links').selectAll('line').data(graph.links).enter().append('line').attr('stroke', this.linkColor).attr('stroke-width', '1px')
    // .attr('sid', function (d) {
    //   return d.source.id
    // })
    // .attr('tid', function (d) {
    //   return d.target.id
    // })

    let node = container
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', 12)
      .attr('fill', this.circleColor)
      .attr('id', function (d) {
        return d.id
      })

    // let labelNode = container
    //   .append('g')
    //   .attr('class', 'labelNodes')
    //   .selectAll('text')
    //   .data(label.nodes)
    //   .enter()
    //   .append('text')
    //   .text(function (d, i) {
    //     return i % 2 === 0 ? '' : d.node.id
    //   })
    //   .style('fill', this.labelColor)
    //   .style('font-family', 'Arial')
    //   .style('font-size', 12)
    //   .style('pointer-events', 'none') // to prevent mouseover/drag capture

    this.node = node
    this.link = link
    // this.labelNode = labelNode
    function ticked() {
      node.call(updateNode)
      link.call(updateLink)

      //   labelLayout.alphaTarget(0.3).restart()
      //   labelNode.each(function (d, i) {
      //     if (i % 2 === 0) {
      //       d.x = d.node.x
      //       d.y = d.node.y
      //     } else {
      //       let b = this.getBBox()

      //       let diffX = d.x - d.node.x
      //       let diffY = d.y - d.node.y

      //       let dist = Math.sqrt(diffX * diffX + diffY * diffY)

      //       let shiftX = (b.width * (diffX - dist)) / (dist * 2)
      //       shiftX = Math.max(-b.width, Math.min(0, shiftX))
      //       let shiftY = 16
      //       this.setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')')
      //     }
      //   })
      //   labelNode.call(updateNode)
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

    console.log('link', link)
    console.log('node', node)

    // const colorList = ['#244e96', '#25a8b6', '#25dc4c', '#7cf728', '#f8d039', '#f09e30', '#d75f28', '#b2392d']
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];

    // }
    // if (params.dataIndex >= colorList.length) {
    //   params.dataIndex = params.dataIndex - colorList.length
    //   node.attr('fill', colorList[params.dataIndex])
    // }

    // 图表
    var myChart = echarts.init(document.getElementById('chartBar'))
    const _this = this
    var option = {
      xAxis: {
        data: [1, 2, 3, 4, 5]
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          // data: [1, 2, 3, 4, 5, 6, 7, 8],
          data: [this.theBlue.length, 8, this.theGreen.length, 9, this.theRed.length],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = _this.BarColorList
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
    this.option = option
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    document.getElementById('chartBar').style.display = 'none'
    // // 创建比例尺
    // const _this = this
    // let domainArray = _this.data
    // domainArray.push(8)
    // const xScale = d3.scaleBand().range([100, 300]).domain(domainArray).padding(0.1)

    // const yScale = d3
    //   .scaleLinear()
    //   .domain([0, d3.max(_this.data)])
    //   .range([300, 100])
    // const colorScale = d3.scaleSequential(chromatic.interpolateSpectral).domain(d3.extent(this.data))
    // // 创建条形
    // svg
    //   .selectAll('.bar')
    //   .data(this.data)
    //   .enter()
    //   .append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', (d, i) => xScale(i))
    //   .attr('y', (d) => yScale(d))
    //   .attr('width', xScale.bandwidth())
    //   .attr('height', (d) => 300 - yScale(d))
    //   .attr('fill', function (d) {
    //     return colorScale((d * 8) / _this.data.length)
    //   })

    // // 创建x轴和y轴
    // const xAxis = d3.axisBottom(xScale)
    // const yAxis = d3.axisLeft(yScale)

    // svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${300})`).call(xAxis)

    // svg.append('g').attr('class', 'y-axis').attr('transform', `translate(100, ${0})`).call(yAxis)

    // // 添加x轴标题
    // svg
    //   .append('text')
    //   .attr('class', 'axis-label')
    //   .attr('text-anchor', 'middle')
    //   .attr('x', 300 / 2)
    //   .attr('y', 300 + 50 - 10)
    //   .text('X轴')

    // // 添加y轴标题
    // svg
    //   .append('text')
    //   .attr('class', 'axis-label')
    //   .attr('text-anchor', 'middle')
    //   .attr('transform', `translate(${50 + 10}, ${300 / 2}) rotate(0)`)
    //   .text('Y轴')

    // // 添加x轴线
    // svg.append('line').attr('class', 'axis-line').attr('x1', 80).attr('y1', 300).attr('x2', 300).attr('y2', 300)

    // // 添加y轴线
    // svg.append('line').attr('class', 'axis-line').attr('x1', 80).attr('y1', 80).attr('x2', 80).attr('y2', 300)
    console.log('this.theBlue', this.theGreen)
    console.log('this.theBlue', this.theRed)
  },
  methods: {
    positonUpdate() {
      const _this = this
      _this.graphLayout = d3
        .forceSimulation(_this.graphNodes)
        .force('charge', d3.forceManyBody().strength(-3000))

        .force('center', d3.forceCenter(this.width / 3, this.height / 2))
        .force('x', d3.forceX(this.width / 3).strength(1))
        .force('y', d3.forceY(this.height / 2).strength(1))
        .force(
          'link',
          d3
            .forceLink(_this.graphLinks)
            .id(function (d) {
              return d.id
            })
            .distance(50)
            .strength(1)
        )
        .on('tick', ticked)

      function ticked() {
        _this.node.call(updateNode)
        _this.link.call(updateLink)
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
    },
    linkColor() {
      return 'pink'
    },
    circleColor(d) {
      if (d.id >= '20') {
        this.theGreen.push(d.id)
        return '#7cf728'
        // 绿色
      } else if (d.id < '10') {
        this.theBlue.push(d.id)
        return '#244e96'
        // 蓝色
      } else {
        this.theRed.push(d.id)
        return '#b2392d'
        // 红色7
      }
    },

    // linkColor() {
    //   return '#fff'
    // },
    // labelColor() {
    //   return '#fff'
    // },
    // circleColor(d) {
    //   if (d.id >= '11' && d.id !== 15 && d.id !== 16) {
    //     return '#b2392d'
    //   } else if (d.id <= '3') {
    //     // return '#244e96'
    //     return '#fff'
    //   } else {
    //     // return '#7cf728'
    //     return '#fff'
    //   }
    // },

    // 全屏
    requestFullscreen() {
      this.fullScreen = false
      const docElm = document.documentElement
      // const _this = this
      docElm.requestFullscreen()
      // this.svg.attr('width', window.innerWidth)
      // this.svg.attr('height', window.innerHeight)
      // this.graphLayout = d3
      //   .forceSimulation(_this.graphNodes)
      //   .force('charge', d3.forceManyBody().strength(-3000))
      //   .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      //   .force('x', d3.forceX(this.width / 2).strength(1))
      //   .force('y', d3.forceY(this.height / 2).strength(1))
      // document.getElementById('chartBar').style.display = 'none'
    },
    exitFullScreen() {
      this.fullScreen = true
      document.exitFullscreen()
      // this.svg.attr('width', 1200)
      // this.svg.attr('height', 700)
      // document.getElementById('chartBar').style.display = 'block'
    },
    // 暂停
    forceStop() {
      this.graphLayout.stop()
      this.buttonStop = false
    },
    forceStart() {
      this.graphLayout.restart()
      this.buttonStop = true
    },
    // 高亮
    LightCancel() {
      this.LightStop = true
      this.node
        .on('mouseover', function () {
          ''
        })
        .on('mouseout', '')
    },
    highLight() {
      this.LightStop = false
      const _this = this
      this.node.on('mouseover', focus).on('mouseout', unfocus)
      let adjlist = []

      this.graphLinks.forEach(function (d) {
        adjlist[d.source.index + '-' + d.target.index] = true
        adjlist[d.target.index + '-' + d.source.index] = true
      })
      function neigh(a, b) {
        return a === b || adjlist[a + '-' + b]
      }
      function focus(d) {
        // console.log(d) // eslint-disable-line
        let index = d3.select(d3.event.target).datum().index
        _this.node.style('opacity', function (o) {
          return neigh(index, o.index) ? 1 : 0.1
        })
        // _this.labelNode.attr('display', function (o) {
        //   return neigh(index, o.node.index) ? 'block' : 'none'
        // })
        _this.link.style('opacity', function (o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.1
        })
      }

      function unfocus() {
        // _this.labelNode.attr('display', 'block')
        _this.node.style('opacity', 1)
        _this.link.style('opacity', 1)
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
              const nodeData = d3.select(this).attr('id')
              if (nodeData && !_this.nodesData.includes(nodeData)) {
                _this.nodesData.unshift(nodeData)
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
      // 获取缩放比例
      // const scale = _this.container.attr('transform', (d) => `scale(${d.x}})`)
      const transformMatrix = d3.zoomTransform(_this.container.node())
      const scale = transformMatrix.k
      // console.log('scale', scale)
      let newWidth = null
      let newHeight = null
      if (scale) {
        // 计算新的绑定 brush 的元素大小
        const bounds = d3.select('#viz').node().getBoundingClientRect()
        newWidth = bounds.width / scale
        newHeight = bounds.height / scale
        brush.extent([
          [0, 0],
          [newWidth, newHeight]
        ])
        _this.width = newWidth
        _this.height = newHeight
        // console.log('newWidth', newWidth)
      }
      _this.container.call(brush)

      const newTransformMatrix = d3.zoomIdentity.translate(0, 0).scale(scale)
      _this.container.attr('transform', newTransformMatrix.toString())
      this.positonUpdate()
      this.brush = brush
    },
    async brushCancel() {
      this.node.style('opacity', 1)
      this.container.call(this.brush.move, null)
      this.container.on('.brush', null)
      document.querySelector('#viz > g > rect.overlay').remove()
      this.brushStop = true
      this.link.style('opacity', 1)
      // this.boardClose()
    },
    // 多选
    MultiSelect() {
      this.SelectStop = false
      const _this = this
      this.boardExit = true
      this.node.style('opacity', 0.4)
      this.link.style('opacity', 0.4)
      // 获取缩放比例
      // const scale = _this.container.attr('transform', (d) => `scale(${d.x}})`)
      const transformMatrix = d3.zoomTransform(_this.container.node())
      const scale = transformMatrix.k
      // console.log('scale', scale)
      let newWidth = null
      let newHeight = null
      if (scale) {
        // 计算新的绑定 brush 的元素大小
        const bounds = d3.select('#viz').node().getBoundingClientRect()
        newWidth = bounds.width / scale
        newHeight = bounds.height / scale
        _this.width = newWidth
        _this.height = newHeight
        // console.log('newWidth', newWidth)
      }
      const newTransformMatrix = d3.zoomIdentity.translate(0, 0).scale(scale)
      _this.container.attr('transform', newTransformMatrix.toString())
      this.positonUpdate()

      this.node.on('click', function (event) {
        d3.select(this).style('opacity', 1)
        // d3.select(this).style('fill', '#caa455')
        const nodeData = d3.select(this).attr('id')
        if (nodeData) {
          _this.nodesData.unshift(nodeData)
        }
        // console.log('nodeData', nodeData)
        // console.log('nodesData', _this.nodesData)
      })
    },
    SelectCancel() {
      this.SelectStop = true
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
      this.node.on('click', '')
      // this.boardClose()
    },
    boardClose() {
      this.boardExit = false

      this.nodesData = []
    },
    colorBoardClose() {
      this.colorBoardExit = false
    },
    // 图片导出
    screenShot() {
      console.log('screenShot', 3)
      const svg = this.svg.node()
      const xml = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      canvas.width = 1300
      canvas.height = 800
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
      this.histogramExit = false
    },
    ChartBarNone() {
      document.getElementById('chartBar').style.display = 'none'
      this.histogramExit = true
    },
    // 调色板
    selectColor(color) {
      this.$emit('select', color)
    },
    ColorSelect() {
      this.colorBoardExit = true
      // document.getElementById('chartBar').style.display = 'none'

      // console.log('111', 10 / 3)
      // const ids = d3
      //   .selectAll('circle') // 选择所有的<circle>节点
      //   .nodes() // 获取节点数组
      //   .map((node) => node.id) // 将节点ID映射到一个新数组中

      // console.log(ids)
      // const ids = [1, 2, 3, 4, 5]
      // const colorScale = d3.scaleSequential(chromatic.interpolateSpectral).domain(d3.extent(ids))
      // this.svg
      //   .append('rect')
      //   .data(ids)
      //   .enter()
      //   .append('rect')
      //   .attr('y', function (d, i) {
      //     return i * 20 + 250
      //   })
      //   .attr('x', 1400)
      //   .attr('width', 20)
      //   .attr('height', 20)
      //   .attr('fill', function (d) {
      //     return colorScale((d * 8) / ids.length)
      //   })

      // const chart = document.getElementById('chartBar')

      // 数据绑定和更新
      // const bars = chart.selectAll('div').data(ids)

      // bars
      //   .enter()
      //   .append('div')
      //   .style('width', (d) => d + 'px')
      //   .style('background-color', (d) => colorScale(d))

      // bars.style('width', (d) => d + 'px').style('background-color', (d) => colorScale(d))

      // bars.exit().remove()
    },
    // 色带点击事件
    colorBarChange1() {
      const num1 = []
      const num2 = []
      const num3 = []
      const num4 = []
      const num5 = []
      this.node.attr('fill', function (d) {
        if (d.id >= '26') {
          num5.push(d.id)
          return '#064e9e'
        } else if (d.id >= '12' && d.id < '20') {
          num3.push(d.id)
          return '#68add8'
        } else if (d.id >= '5' && d.id < '12') {
          num2.push(d.id)
          return '#bcd7e8'
        } else if (d.id < '5') {
          num1.push(d.id)
          return '#eff3ff'
        } else {
          num4.push(d.id)
          return '#2b81c0'
        }
      })
      const _this = this
      var myChart = echarts.init(document.getElementById('chartBar'))
      var option = {
        xAxis: {
          data: [1, 2, 3, 4, 5]
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            // data: [1, 2, 3, 4, 5, 6, 7, 8],
            data: [num1.length, num2.length, num3.length, num4.length, num5.length],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = _this.colorList1
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
    colorBarCancel() {
      this.node.attr('fill', this.circleColor)
      console.log('this.theBlue', this.theBlue)
      var mySecChart = echarts.init(document.getElementById('chartBar'))
      const _this = this
      var option = {
        xAxis: {
          data: [1, 2, 3, 4, 5]
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            // data: [1, 2, 3, 4, 5, 6, 7, 8],
            data: [10, 8, 11, 9, 10],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = _this.BarColorList
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
      // 使用刚指定的配置项和数据显示图表。
      mySecChart.setOption(option)
    },
    nodeEdit() {
      this.NodesEditBoardExit = true
    },
    doSearch() {
      // 执行搜索操作
    },
    nodeFilter() {
      this.node.style('opacity', 0)
      this.node.filter((d) => d.id < 10).style('opacity', 1)
      this.link.style('opacity', function (o) {
        return o.source.index < 10 && o.target.index < 10 ? 1 : 0
      })
    },
    nodeReset() {
      this.node.style('opacity', 1)
      this.link.style('opacity', 1)
    },
    NodesEditBoardClose() {
      this.NodesEditBoardExit = false
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
  margin-top: 20px;
}

.color-block {
  width: 30px;
  height: 30px;
  display: inline-block;
  cursor: pointer;
}
/* .links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: black;
  stroke-width: 0px;
} */

.components {
  position: absolute;
  z-index: 5;

  /* display: flex;
  position: relative; */
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
.Countnumber {
  font-size: 22px;
  color: #000;
}
#chartBar {
  margin-left: 1200px;
  position: absolute;
  z-index: 10;
}
.datacard {
  font-size: 14px;
  margin-bottom: 18px;
}

.dataBoard {
  height: 500px;
  width: 550px;
  right: 0;
  position: absolute;
  z-index: 15;
  overflow: auto;
}
.NodesEditBoard {
  height: 500px;
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
  top: 450px;
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
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.dropdown {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
