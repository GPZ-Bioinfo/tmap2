<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="diagram"></div>
    <div class="bar-chart"></div>
    <div class="canvas"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { bus } from '../main'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      x: null,
      xScale2: null,
      menu: [
        {
          name: 1,
          orders: 200
        },
        {
          name: 2,
          orders: 600
        },
        {
          name: 3,
          orders: 300
        },
        {
          name: 4,
          orders: 700
        }
      ]
    }
  },
  mounted() {
    let rects = null
    // let xScale2 = null
    let x = null
    let y = null
    let yScale2 = null
    let globVar = null

    function drawingD3(menu) {
      // select the svg container first
      console.log('globVar', globVar)
      const svg = d3.select('.bar-chart').append('svg').attr('width', 400).attr('height', 300)

      // create margins & dimensions
      const margin = { top: 20, right: 20, bottom: 100, left: 60 }
      const graphHeight = 400 - margin.left - margin.right
      const graphWidth = 300 - margin.top - margin.bottom
      // const graphWidth = 180;
      // const graphHeight = 340;
      const graph = svg.append('g').attr('width', graphHeight).attr('height', graphWidth).attr('transform', `translate(${margin.left}, ${margin.top})`)

      // create axes groups
      const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphWidth})`)

      const yAxisGroup = graph.append('g')

      // d3.json("menu.json").then((data) => {
      x = d3
        .scaleLinear()
        .domain([0, d3.max(menu, (d) => d.orders)])
        .range([0, graphHeight])

      y = d3
        .scaleBand()
        .domain(menu.map((item) => item.name))
        .range([graphWidth, 0])
        .paddingInner(0.2)
        .paddingOuter(0.2)

      // this.xScale2 = d3
      //   .scaleBand()
      //   .domain(menu.map((item) => item.name))
      //   .range([0, graphWidth])
      //   .paddingInner(0.2)
      //   .paddingOuter(0.2)

      yScale2 = d3
        .scaleBand()
        .domain(menu.map((item) => item.name))
        .range([graphWidth, 0])
        .paddingInner(0.2)
        .paddingOuter(0.2)

      // join the data to circs
      rects = graph.selectAll('rect').data(menu)

      // append the enter selection to the DOM

      rects
        .enter()
        .append('rect')
        .attr('height', y.bandwidth)
        .attr('width', (d) => {
          return x(d.orders)
        })
        .attr('fill', 'rgb(37 157 241)')
        .attr('class', 'rects')
        .attr('y', (d) => y(d.name))
        .attr('x', (d) => {
          return 0
        })

      // create & call axesit
      const xAxis = d3.axisBottom(x).ticks(3)
      const yAxis = d3
        .axisLeft(y)
        .ticks(3)
        .tickFormat((d) => d)

      xAxisGroup
        .call(xAxis)
        .call((g) => g.selectAll('.domain').attr('stroke-width', 0.3).attr('stroke', '#606060'))
        .call((g) => g.selectAll('line').attr('stroke-width', 0.3).attr('stroke', '#606060'))
        .call((g) => g.selectAll('text').attr('fill', '#606060'))
        .call((g) => {
          g.append('text')
            .attr('x', margin.right + 140)
            .attr('y', 35)
            .attr('fill', 'currentColor')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'end')
            .attr('font-weight', '500')
            .attr('font-size', '13px')
            .attr('font-family', 'Roboto, sans-serif')
            .text('Genes')
        })

      yAxisGroup
        .call(yAxis)
        .call((g) => g.selectAll('line').attr('stroke-width', 0.3).attr('stroke', '#606060'))
        .call((g) => g.selectAll('text').attr('fill', '#606060'))
        .call((g) => {
          g.append('text')
            .attr('x', margin.right + 144)
            .attr('y', 35)
            .attr('fill', 'currentColor')
            .attr('font-weight', '500')
            .attr('font-size', '13px')
            .attr('font-family', 'Roboto, sans-serif')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(90)')
            .text('User-defined HPO terms')
        })
        .call((g) => g.selectAll('.domain').attr('stroke-width', 0.3).attr('stroke', '#606060'))

      xAxisGroup.selectAll('text').attr('text-anchor', 'end')

      // Create a variable for brush and use it so it loads by default
      var yBrush = d3
        .brushY() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [graphHeight, graphWidth]
        ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on('start end', brushing)

      graph.append('g').attr('class', 'brush').call(yBrush).call(yBrush.move, [51.42857142857144, 128.57142857142858])

      // graph.call(
      //   d3
      //     .brushY() // Add the brush feature using the d3.brush function
      //     .extent([
      //       [0, 0],
      //       [graphHeight, graphWidth],
      //     ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      //     .on("start end", brushing)
      // );
      // if (true) {
      //   console.log("here");

      //   var brush = d3.brushY();
      //   brush.extent([
      //     [0, 0],
      //     [graphHeight, graphWidth],
      //   ]);

      //   // var brush = d3
      //   //   .brushY()
      //   //   .extent([
      //   //     [0, 0],
      //   //     [graphHeight, graphWidth],
      //   //   ])
      //   //   .on("start brush end", brushOnLoad);

      //   // graph
      //   //   .call(brush)
      //   //   .call(brush.move, 51.42857142857144, 128.57142857142858)
      //   //   .on("mousedown touchstart", brushOnLoad);
      // }
      // graph.call(
      //   d3.brushY()
      //   .extent([
      //       [0, 0],
      //       [graphHeight, graphWidth],
      //     ])
      // )
      // brushOnLoad([94.28571428571429, 128.57142857142858]);
    }

    function brushing(event) {
      console.log('brushing')
      var extent = event.selection
      console.log('extent', extent)
      var newInput = []
      var brushArea = event.selection
      console.log('brushArea', brushArea)

      if (brushArea === null) brushArea = y.range()

      // console.log("this.xScale2.domain()", yScale2.domain());

      yScale2.domain().forEach((d) => {
        var pos = yScale2(d) + yScale2.bandwidth() / 2
        if (pos >= brushArea[0] && pos <= brushArea[1]) {
          newInput.push(d)
        }
      })

      d3.selectAll('.rects').attr('fill', (d) => {
        if (d.name !== undefined) {
          // return "red";
          var val = d.name
          // console.log("val", val);
          var pos = yScale2(val) + yScale2.bandwidth() / 2
          if (pos >= brushArea[0] && pos <= brushArea[1]) {
            return 'steelblue'
          } else {
            return 'rgb(37 157 241)'
          }
        }
      })

      // var rectangleBars = d3.selectAll('rect')
      // console.log("rectangleBars", rectangleBars);

      // console.log("newInput", newInput);

      bus.$emit('cutoffvalues', [newInput[0], newInput[newInput.length - 1]])

      var left = yScale2(d3.min(newInput))
      var right = yScale2(d3.max(newInput)) + yScale2.bandwidth()
      var top = null
      var bottom = null

      if (left > right) {
        top = right
        bottom = left
      } else {
        top = left
        bottom = right
      }

      if (newInput.length > 1) {
        top = top - yScale2.bandwidth()
        bottom = bottom + yScale2.bandwidth()
      }
      // console.log("top", top);
      // console.log("bottom", bottom);

      if (event.sourceEvent) {
        console.log('here in ebent!')
        d3.select(this).transition().call(event.target.move, [top, bottom])
      } else {
        console.log('false')
      }
    }
    console.log('changing value of global variable')
    globVar = 5
    drawingD3(this.menu)
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

rect {
  fill: steelblue;
}

.selected {
  fill: red !important;
}
</style>
