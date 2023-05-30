<template>
  <div>
    <ul>
      <li v-for="item in graph" :key="item.id">{{ item.id }}</li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const GET_ITEMS = gql`
  query {

  }
`

export default {
  apollo: {
    graph: {
      query: GET_ITEMS
    }
  }
}
</script>
