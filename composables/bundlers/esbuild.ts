import { build, initialize } from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'
import type { Bundler } from './index'

export const esbuild: Bundler = {
  id: 'esbuild',
  name: 'esbuild',
  icon: 'i-logos:esbuild',
  pkgName: 'esbuild-wasm',
  init() {
    return initialize({ wasmURL })
  },
  async build(code) {
    const bundle = await build({
      bundle: true,
      stdin: {
        contents: code,
        loader: 'ts',
      },
      format: 'esm',
      write: false,
    })
    return bundle.outputFiles[0].text
  },
}
