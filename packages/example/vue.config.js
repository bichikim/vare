const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  lintOnSave: false,
  chainWebpack(config) {
    if (process.env.ANALYZER) {
      config.plugin('webpack-bundle-analyzer')
        .use(BundleAnalyzerPlugin)
    }
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm-bundler.js')
    config.resolve.alias.set('vue', path.resolve(__dirname, 'node_modules/vue'))
  },
}
