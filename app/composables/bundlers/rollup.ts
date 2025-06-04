import { transform as oxcTransform } from '@rolldown/browser/experimental'
import * as RollupAPI from '@rollup/browser'
import { resolve } from 'pathe'
import type { Bundler } from './index'

// @unocss-include

export const rollup: Bundler = {
  id: 'rollup',
  name: 'Rollup',
  icon: 'i-logos:rollupjs',
  version: RollupAPI.VERSION,
  pkgName: '@rollup/browser',
  configFile: 'rollup.config.js',
  api: RollupAPI,
  async build(files, input, config) {
    const warnings: string[] = []

    const options: RollupAPI.RollupOptions = {
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
        {
          name: 'oxc-transform',
          transform: {
            filter: { id: /\.ts$/ },
            handler(code, id) {
              const result = oxcTransform(id, code)
              return {
                code: result.code,
                map: result.map,
              }
            },
          },
        },
        config?.plugins,
      ],
    }
    console.info('Rollup options:', options)
    const bundle = await RollupAPI.rollup(options)
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
