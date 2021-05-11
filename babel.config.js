module.exports = {
  presets: [
    '@vue/babel-preset-app',
    ['@babel/preset-typescript', {
      allExtensions: true,
      isTSX: true,
    }],
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@': './src',
      },
      cwd: 'packagejson',
      loglevel: 'info',
    }],
  ],
  env: {
    test: {
      plugins: [
        'istanbul',
      ],
    },
  },
}
