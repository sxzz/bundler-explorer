import { rollup as build } from '@rollup/browser'
import type { Bundler } from './index'

export const rollup: Bundler = {
  id: 'rollup',
  name: 'Rollup',
  icon: 'i-logos:rollupjs',
  pkgName: '@rollup/browser',
  async build(code) {
    const entry = '_virtual-entry.js'
    const bundle = await build({
      input: [entry],
      plugins: [
        {
          name: 'entry',
          resolveId(source) {
            return source === entry ? source : null
          },
          load(id) {
            return id === entry ? code : null
          },
        },
      ],
    })
    const result = await bundle.generate({ format: 'esm' })
    return result.output[0].code
  },
}
