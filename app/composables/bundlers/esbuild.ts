import * as EsbuildAPI from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'
import { extname, resolve } from 'pathe'
import type { Bundler } from './index'
import type { BuildOptions, Loader } from 'esbuild-wasm'

// @unocss-include

export const esbuild: Bundler<undefined> = {
  id: 'esbuild',
  name: 'esbuild',
  icon: 'i-logos:esbuild',
  version: EsbuildAPI.version,
  pkgName: 'esbuild-wasm',
  configFile: 'esbuild.config.js',
  api: EsbuildAPI,
  async init() {
    await EsbuildAPI.initialize({ wasmURL })
  },
  async build(files, entries, config: BuildOptions) {
    const options: BuildOptions = {
      entryPoints: entries,
      bundle: true,
      format: 'esm',
      outdir: '.',
      ...config,
      plugins: [
        {
          name: 'bundler-explorer:fs',
          setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
              if (args.path[0] === '/' || args.path[0] === '.') {
                return { path: resolve(args.importer, '..', args.path) }
              }
            })

            build.onLoad({ filter: /.*/ }, (args) => {
              if (args.path[0] !== '/') return

              const id = args.path.slice(1)
              if (files.has(id)) {
                return {
                  contents: files.get(id)!.code,
                  loader: guessLoader(id),
                }
              }
            })
          },
        },
        ...(config?.plugins || []),
      ],
      write: false,
    }
    const bundle = await EsbuildAPI.build<BuildOptions>(options)
    const output = Object.fromEntries(
      bundle.outputFiles!.map((file) => [file.path.slice(1), file.text]),
    )
    const warnings = await EsbuildAPI.formatMessages(bundle.warnings, {
      kind: 'warning',
      color: false,
      terminalWidth: 1000,
    })
    return {
      output,
      warnings,
    }
  },
}

const ExtToLoader: Record<string, Loader> = {
  '.js': 'js',
  '.mjs': 'js',
  '.cjs': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.cts': 'ts',
  '.mts': 'ts',
  '.tsx': 'tsx',
  '.css': 'css',
  '.less': 'css',
  '.stylus': 'css',
  '.scss': 'css',
  '.sass': 'css',
  '.json': 'json',
  '.txt': 'text',
}

export function guessLoader(id: string): Loader {
  return ExtToLoader[extname(id).toLowerCase()] || 'js'
}

if (import.meta.hot) {
  import.meta.hot.accept((newModule: any) => {
    newModule.esbuild.initted = esbuild.initted
  })
}
