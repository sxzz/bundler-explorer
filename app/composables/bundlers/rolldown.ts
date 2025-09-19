import { rolldown as build, VERSION as version } from '@rolldown/browser'
import * as RolldownAPI from '@rolldown/browser'
import * as RolldownExperimentalAPI from '@rolldown/browser/experimental'
// @ts-expect-error missing types
import * as RolldownBinding from '../../../node_modules/@rolldown/browser/dist/rolldown-binding.wasi-browser'
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
    index: RolldownAPI,
    experimental: RolldownExperimentalAPI,
    binding: RolldownBinding,
  },
  async build(files, input, config) {
    const { __volume } = RolldownBinding
    __volume.reset()
    const inputFileJSON: Record<string, string> = {}
    for (const file of files.values()) {
      inputFileJSON[file.filename] = file.code
    }
    __volume.fromJSON(inputFileJSON)

    const warnings: string[] = []
    const inputOptions: RolldownAPI.InputOptions = {
      input,
      cwd: '/',
      onLog(level, log, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...config,
    }
    const outputOptions: RolldownAPI.OutputOptions = {
      format: 'esm',
      ...config?.output,
    }
    console.info('Rolldown input options', inputOptions)
    console.info('Rolldown output options', outputOptions)

    const bundle = await build(inputOptions)
    const result = await bundle.generate(outputOptions)
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
