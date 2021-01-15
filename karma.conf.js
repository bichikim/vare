const Service = require('@vue/cli-service/lib/Service')
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())
const WebpackMonorepoResolver = require('@welldone-software/webpack-monorepo-resolver')
service.init(process.env.VUE_CLI_MODE || process.env.NODE_ENV)

const webpackChain = service.resolveChainableWebpackConfig()

webpackChain.entryPoints.clear()
webpackChain.output.clear()
webpackChain.node.clear()
webpackChain.plugins.delete('html')
webpackChain.plugins.delete('prefetch')
webpackChain.plugins.delete('preload')
webpackChain.resolve.plugin('monorepo').use(WebpackMonorepoResolver, [{possiblePackageEntries: ['', 'src']}])

const webpackConfig = webpackChain.toConfig()

module.exports = (config) => {
  config.set({
    basePath: '.',
    singleRun: true,
    reporters: ['mocha'],
    frameworks: ['mocha', 'chai'],
    browsers: ['ChromeHeadless'],

    files: [
      {pattern: 'packages/*/tests/**/*.spec.ts', watched: false},
    ],

    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },

    preprocessors: {
      'packages/*/tests/**/*.spec.ts': ['webpack'],
    },
    webpack: {
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        alias: {
          '@': 'src',
          vue$: 'vue/dist/vue.runtime.esm-bundler.js',
        },
      },
      optimization: {
        runtimeChunk: false,
        splitChunks: false,
      },
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },
  })
}
