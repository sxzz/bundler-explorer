import {
  build,
  formatMessages,
  initialize,
  version,
  type BuildOptions,
} from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'
import { resolve } from 'pathe'
import type { Bundler } from './index'

// @unocss-include

export const esbuild: Bundler<undefined> = {
  id: 'esbuild',
  name: 'esbuild',
  icon: 'i-logos:esbuild',
  version,
  pkgName: 'esbuild-wasm',
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
              } else {
                //     throw new Error(`Cannot resolve ${source}`)
              }
            })

            build.onLoad({ filter: /.*/ }, (args) => {
              if (args.path[0] !== '/') {
                throw new Error(`Cannot load ${args.path}`)
              }
              const id = args.path.slice(1)
              if (files.has(id)) {
                return { contents: files.get(id)!.code }
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

if (import.meta.hot) {
  import.meta.hot.accept((newModule: any) => {
    newModule.esbuild.initted = esbuild.initted
  })
}
