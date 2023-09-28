import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'
import { variablesValue } from './variablesApollo'

// 在组件中使用Apollo Client和Vuex
const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/graphql' // 替换成你的GraphQL API的URL
})
let scoresValue = null
setTimeout(() => {
  apolloClient
    .query({
      variables: {
        variable: variablesValue[0].variables[0]
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
    })
}, 200)
export { scoresValue }
