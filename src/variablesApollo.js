import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'

// 在组件中使用Apollo Client和Vuex
const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
})
let variablesValue = null
apolloClient
  .query({
    query: gql`
      query
        {
          variablesCategory {
            category
            variables
          }

    `
  })
  .then((response) => {
    // 处理响应数据
    variablesValue = response.data.variablesCategory
    console.log(variablesValue)
  })
export { variablesValue }
