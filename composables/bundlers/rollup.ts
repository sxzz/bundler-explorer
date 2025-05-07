// @ts-expect-error missing types
import { transform as oxcTransform } from '@oxc-transform/binding-wasm32-wasi'
import { rollup as build, VERSION as version } from '@rollup/browser'
import { resolve } from 'pathe'
import type { Bundler } from './index'

// @unocss-include

export const rollup: Bundler = {
  id: 'rollup',
  name: 'Rollup',
  icon: 'i-logos:rollupjs',
  version,
  pkgName: '@rollup/browser',
  async build(files, input, config) {
    const warnings: string[] = []

    const bundle = await build({
      input,
      onLog(level, log, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...config,
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
        {
          name: 'oxc-transform',
          filter: /\.ts$/,
          transform(code, id) {
            const result = oxcTransform(id, code)
            return {
              code: result.code,
              map: result.map,
            }
          },
        },
        config?.plugins,
      ],
    })
    const result = await bundle.generate({
      format: 'esm',
      ...config?.output,
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
