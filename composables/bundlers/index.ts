import { esbuild } from './esbuild'
import { rolldown } from './rolldown'
import { rollup } from './rollup'

export type Awaitable<T> = T | Promise<T>
export interface Bundler<T = void> {
  id: string
  name: string
  icon: string
  pkgName: string
  version: string
  api?: any
  // webContainer?: boolean

  init?: () => Awaitable<T>
  initted?: boolean

  configFile?: string

  build: (
    this: T,
    files: FileMap,
    entries: string[],
    config: any,
  ) => Awaitable<TransformResult>
}

export interface TransformResult {
  output: Record<string, string>
  warnings?: string[]
}

export const bundlers = { rollup, rolldown, esbuild }
export type BundlerName = keyof typeof bundlers
