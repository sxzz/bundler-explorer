import { bundlers, type BundlerName } from '../composables/bundlers'

export const codeTemplate = 'export const foo = 42'
export const configTemplate = `export default {\n\n}`

export const CONFIG_FILES = Object.values(bundlers)
  .map((b) => b.configFile)
  .filter((v): v is string => !!v)

export const currentBundlerId = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
export const currentBundler = computed(() => bundlers[currentBundlerId.value])

export const DEFAULT_ENTRY = 'index.ts'
export const defaultFiles = () => {
  const files = new Map([
    [DEFAULT_ENTRY, useSourceFile(DEFAULT_ENTRY, codeTemplate, true)],
  ])

  const configFile = currentBundler.value.configFile
  if (configFile) {
    files.set(configFile, useSourceFile(configFile, configTemplate))
  }
  return files
}

export const files = ref<SourceFileMap>(defaultFiles())
export const activeFile = ref<string>()
export const timeCost = ref<number>()
