module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: 8889,
    proxy: {
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    }
  }
}
