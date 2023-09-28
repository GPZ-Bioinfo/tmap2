<template>
  <div>
    <ul>
      <li v-for="item in graphqlItems.graph.elements.links" :key="item.id">
        {{ item }}
      </li>
    </ul>
    <ul>
      <li v-for="item in graphqlItems.graph.elements.nodes" :key="item.id">
        {{ item }}
      </li>
    </ul>
    <ul>
      <li v-for="item in graphqlItems.scores" :key="item.id">
        {{ item.id }}
      </li>
    </ul>
  </div>
</template>

<script>
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

export default {
  data() {
    return {
      graphqlItems: []
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    fetchItems() {
      const apolloClient = new ApolloClient({
        uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
      })
      apolloClient
        .query({
          query: gql`
            query {
              scores(column: "Age") {
                id
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
          this.graphqlItems = response.data
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }
}
</script>
