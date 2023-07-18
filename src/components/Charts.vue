<template>
  <div>{{ graphqlData }}</div>
</template>

<script>
import axios from 'axios'
export default {
  components: {},
  props: {},
  data() {
    return {
      graphqlData: null
    }
  },
  mounted() {
    axios
      .get('http://localhost:8080/graphql', {
        params: {
          query: `
         query {
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
        }
      })
      .then((response) => {
        // 处理响应数据
        this.graphqlData = response.data.data.graph.elements
      })
      .catch((error) => {
        // 处理错误
        console.error(error)
      })
  },
  methods: {}
}
</script>

<style scoped></style>
