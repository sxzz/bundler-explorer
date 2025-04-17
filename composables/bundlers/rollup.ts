import { rollup as build, type LogLevel, type RollupLog } from '@rollup/browser'
import type { Bundler } from './index'

export const rollup: Bundler = {
  id: 'rollup',
  name: 'Rollup',
  icon: 'i-logos:rollupjs',
  pkgName: '@rollup/browser',
  async build(code, config) {
    const entry = '_virtual-entry.js'
    const warnings: string[] = []
    const bundle = await build({
      input: [entry],
      onLog(level: LogLevel, log: RollupLog, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...config,
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
        config?.plugins,
      ],
    })
    const result = await bundle.generate({
      format: 'esm',
      ...config?.output,
    })
    return {
      code: result.output[0].code,
      warnings,
    }
  },
}
