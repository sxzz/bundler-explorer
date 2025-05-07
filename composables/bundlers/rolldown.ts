import { rolldown as build, VERSION as version } from '@rolldown/browser'
import { resolve } from 'pathe'
import type { Bundler } from './index'

// @unocss-include

export const rolldown: Bundler = {
  id: 'rolldown',
  name: 'Rolldown',
  icon: 'i-vscode-icons:file-type-rolldown',
  version,
  pkgName: '@rolldown/browser',
  async build(files, input, options) {
    const warnings: string[] = []

    const bundle = await build({
      input,
      cwd: '/',
      onLog(level, log, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...options,
      plugins: [
        {
          name: 'bundler-explorer:fs',
          resolveId(source, importer) {
            if (source[0] === '/' || source[0] === '.') {
              return resolve(importer || '/', '..', source)
            } else {
              throw new Error(`Cannot resolve ${source}`)
            }
          },
          load(id) {
            if (id[0] !== '/') {
              throw new Error(`Cannot load ${id}`)
            }
            id = id.slice(1)
            if (files.has(id)) {
              return files.get(id)!.code
            }
          },
        },
        options?.plugins,
      ],
    })
    const result = await bundle.generate({
      format: 'esm',
      ...options?.output,
    })
    const output = Object.fromEntries(
      result.output.map((chunk) =>
        chunk.type === 'chunk'
          ? [chunk.fileName, chunk.code]
          : [
              chunk.fileName,
              typeof chunk.source === 'string' ? chunk.source : '[BINARY]',
            ],
      ),
    )
    return {
      output,
      warnings,
    }
  },
}
