import {webpack, Configuration} from 'webpack'

const config: Configuration = {
  entry: './src/',
  output: {
    libraryTarget: 'module',
  },
}
