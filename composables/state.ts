import type { BundlerName } from './bundlers'

export const fileContent = ref<string>('')
export const currentBundler = ref<BundlerName>('rollup')
