import { esbuild } from './esbuild'
import { rollup } from './rollup'

export type Awaitable<T> = T | Promise<T>
export interface Bundler<T = void> {
  id: string
  name: string
  icon: string
  pkgName: string
  webContainer?: boolean

  init?: () => Awaitable<T>
  initted?: boolean
  build: (this: T, code: string) => Awaitable<string>
}

export const bundlers = { rollup, esbuild }
export type BundlerName = keyof typeof bundlers
