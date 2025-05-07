import { bundlers, type BundlerName } from '../composables/bundlers'

export const code = ref('')
export const codeTemplate = 'export const foo = 42'

export const config = ref('')
export const configTemplate = `// config.js\n\nreturn {}`

export const currentBundlerId = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
export const currentBundler = computed(() => bundlers[currentBundlerId.value])
