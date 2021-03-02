module.exports = {
  env: {
    test: {
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              src: './src',
              '@': './src',
            },
            cwd: 'packagejson',
            loglevel: 'info',
          },
        ],
        // ['@babel/plugin-transform-react-jsx'],
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            // for tree shaking
            targets: {
              node: true,
            },
          },
        ],
        ['@babel/preset-typescript', {
          allExtensions: true,
          isTSX: true,
        }],
      ],
    },
  },
}
