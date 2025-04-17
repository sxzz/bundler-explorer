import type { BundlerName } from '../composables/bundlers'

export const code = ref('')
export const codeTemplate = 'export const foo = 42'

export const currentBundler = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
