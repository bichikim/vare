import ts from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import {terser} from 'rollup-plugin-terser'

const name = 'vare'
const globals = {
  vue: 'vue',
}

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      globals,
      compact: true,
      sourcemap: true,
      name,
    },
    {
      file: 'dist/index.module.js',
      format: 'es',
      compact: true,
      sourcemap: true,
      globals,
      name,
    },
    {
      file: 'dist/index.global.js',
      format: 'iife',
      compact: true,
      sourcemap: true,
      globals,
      name,
    },
  ],
  external: ['vue'],
  plugins: [
    del({targets: 'dist/*'}),
    ts({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
      },
    }),
    terser(),
  ],
}
