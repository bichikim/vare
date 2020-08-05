module.exports = {
  presets: [
    '@vue/babel-preset-app',
    ['@babel/preset-typescript', {}],
  ],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': './src',
      },
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
