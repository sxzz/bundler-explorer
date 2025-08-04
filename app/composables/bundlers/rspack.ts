import * as RspackAPI from '@rspack/browser'
import { builtinMemFs } from '@rspack/browser'
import type { Bundler, TransformResult } from './index'

// @unocss-include

export const rspack: Bundler = {
  id: 'rspack',
  name: 'Rspack',
  icon: '',
  version: RspackAPI.version,
  pkgName: '@rspack/browser',
  configFile: 'rspack.config.js',
  api: RspackAPI,
  build(files, input, config) {
    builtinMemFs.volume.reset()

    const inputFileJSON: Record<string, string> = {}
    for (const file of files.values()) {
      inputFileJSON[file.filename] = file.code
    }
    builtinMemFs.volume.fromJSON(inputFileJSON)

    const options: RspackAPI.RspackOptions = {
      mode: 'development',
      devtool: false,
      entry: input,
      ...config,
    }

    return new Promise<TransformResult>((resolve, reject) => {
      RspackAPI.rspack(options, (error, stats) => {
        if (error) reject(error)

        const dist = stats?.compilation.compiler.options.output.path
        if (!dist) {
          return reject(new Error('REPL: Rspack output path is not found'))
        }

        const output = builtinMemFs.volume.toJSON(dist)
        const statsJson = stats.toJson({
          all: false,
          warnings: true,
          errors: true,
        })

        if (statsJson.errors?.length) {
          return reject(statsJson.errors[0])
        }

        resolve({
          output,
          warnings:
            statsJson?.warnings?.map((warning) => warning.message) || [],
        })
      })
    })
  },
}
