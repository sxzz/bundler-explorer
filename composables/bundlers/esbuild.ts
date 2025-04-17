import { build, initialize } from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'
import type { Bundler } from './index'

export const esbuild: Bundler<undefined> = {
  id: 'esbuild',
  name: 'esbuild',
  icon: 'i-logos:esbuild',
  pkgName: 'esbuild-wasm',
  async init() {
    await initialize({ wasmURL })
  },
  async build(code, config) {
    const bundle = await build({
      bundle: true,
      format: 'esm',
      ...config,
      stdin: {
        contents: code,
        loader: 'ts',
        ...config.stdin,
      },
      write: false,
    })
    return {
      code: bundle.outputFiles![0].text,
    }
  },
}

if (import.meta.hot) {
  import.meta.hot.accept((newModule: any) => {
    newModule.esbuild.initted = esbuild.initted
  })
}
