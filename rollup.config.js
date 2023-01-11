import tsc from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import css from 'rollup-plugin-import-css'

export default {
  input: 'src/entry.ts',
  output: { file: 'docs/app.js', format: 'es', sourcemap: true },
  plugins: [
    tsc(),
    resolve({}),
    commonjs(),
    json(),
    css(),
    injectProcessEnv(),
    process.env.minify ? terser() : {},
  ]
}
