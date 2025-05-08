import {
  build,
  formatMessages,
  initialize,
  version,
  type BuildOptions,
  type Loader,
} from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'
import { extname, resolve } from 'pathe'
import type { Bundler } from './index'

// @unocss-include

export const esbuild: Bundler<undefined> = {
  id: 'esbuild',
  name: 'esbuild',
  icon: 'i-logos:esbuild',
  version,
  pkgName: 'esbuild-wasm',
  configFile: 'esbuild.config.js',
  async init() {
    await initialize({ wasmURL })
  },
  async build(files, entries, options: BuildOptions) {
    const bundle = await build<BuildOptions>({
      entryPoints: entries,
      bundle: true,
      format: 'esm',
      outdir: 'dist',
      ...options,
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
        ...(options?.plugins || []),
      ],
      write: false,
    })
    const output = Object.fromEntries(
      bundle.outputFiles!.map((file) => [file.path.slice(1), file.text]),
    )
    const warnings = await formatMessages(bundle.warnings, {
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
