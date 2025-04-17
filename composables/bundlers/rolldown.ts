import {
  rolldown as build,
  type LogLevel,
  type RollupLog,
} from '@rolldown/browser'
import type { Bundler } from './index'

export const rolldown: Bundler = {
  id: 'rolldown',
  name: 'Rolldown',
  icon: 'i-logos:rolldown',
  pkgName: 'i-vscode-icons:file-type-rolldown',
  async build(code, options) {
    const entry = '/virtual-entry.ts'
    const warnings: string[] = []
    const bundle = await build({
      input: [entry],
      cwd: '/',
      onLog(level: LogLevel, log: RollupLog, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...options,
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
        options?.plugins,
      ],
    })
    const result = await bundle.generate({
      format: 'esm',
      ...options?.output,
    })
    return {
      code: result.output[0].code,
      warnings,
    }
  },
}
