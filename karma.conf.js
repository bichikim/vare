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
webpackChain.plugins.delete('define')
webpackChain.plugins.delete('terser')
webpackChain.resolve.alias.delete('@')
webpackChain.resolve.alias.set('@', 'src')
webpackChain.optimization.clear()
webpackChain.optimization.runtimeChunk(false)
webpackChain.optimization.splitChunks(false)
webpackChain.optimization.minimizers.delete('terser')
webpackChain.devtool('inline-source-map')
webpackChain.resolve.plugin('monorepo').use(WebpackMonorepoResolver, [{possiblePackageEntries: ['', 'src']}])
// webpackChain.module.rule('istanbul').test(/\.(ts|vue)$/).exclude.add(/spec.ts$/).add(/__tests__/).end().post().use('istanbul').loader('istanbul-instrumenter-loader').options({esModules: true})

const webpackConfig = webpackChain.toConfig()

module.exports = (config) => {
  config.set({
    basePath: '.',
    singleRun: true,
    reporters: ['mocha', 'coverage-istanbul'],
    frameworks: ['mocha', 'chai'],
    browsers: ['ChromeHeadlessNoneSecurity'],

    files: [
      'test.ts',
      // for coverage
      // {pattern: 'packages/*/src/**/*.ts', watched: false},
    ],

    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },

    preprocessors: {
      'test.ts': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
    coverageIstanbulReporter: {
      reports: ['html', 'text-summary', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },

    customLaunchers: {
      ChromeHeadlessNoneSecurity: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security', '--disable-site-isolation-trials'],
      },
    },
  })
}
