import type { BundlerName } from './bundlers'

export const fileContent = useLocalStorage<string>('code', '')
export const currentBundler = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
