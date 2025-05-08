import { rolldown as build, VERSION as version } from '@rolldown/browser'
import * as RolldownAPI from '@rolldown/browser'
import { resolve } from 'pathe'
// @ts-expect-error missing types
import * as RolldownBinding from '../../node_modules/@rolldown/browser/dist/rolldown-binding.wasi-browser'
import type { Bundler } from './index'

// @unocss-include

export const rolldown: Bundler = {
  id: 'rolldown',
  name: 'Rolldown',
  icon: 'i-vscode-icons:file-type-rolldown',
  version,
  pkgName: '@rolldown/browser',
  configFile: 'rolldown.config.js',
  api: {
    ...RolldownAPI,
    _binding: RolldownBinding,
  },
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
            }
          },
          load(id) {
            if (id[0] !== '/') return
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
