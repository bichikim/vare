import ts from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import {terser} from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'
import externals from 'rollup-plugin-node-externals'
import path from 'path'
import {camelCase} from 'lodash'

const globals = {
  vue: 'vue',
}

const cwd = process.cwd()

const pkg = require(path.resolve(cwd, 'package.json'))

const name = camelCase(pkg.name)

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      globals,
      compact: false,
      sourcemap: true,
      name,
    },
    {
      file: 'dist/index.module.js',
      format: 'es',
      compact: false,
      sourcemap: true,
      globals,
      name,
    },
    {
      file: 'dist/index.global.js',
      format: 'iife',
      compact: false,
      sourcemap: true,
      globals,
      name,
    },
  ],
  plugins: [
    externals({
      builtins: true,
      deps: true,
    }),
    del({targets: 'dist/*'}),
    ts({
      typescript: ttypescript,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          plugins: [{transform: '@zerollup/ts-transform-paths'}],
        },
        exclude: [
          'node_modules',
          'src/__tests__/**/*',
          '__tests__/**/*',
        ],
      },
    }),
    terser(),
  ],
}
