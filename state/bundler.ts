import { bundlers, type BundlerName } from '../composables/bundlers'

export class File {
  constructor(
    public code: string,
    public isEntry = false,
  ) {}
}
export type FileMap = Map<string, File>

export const codeTemplate = 'export const foo = 42'
export const configTemplate = `export default {}`

export const DEFAULT_ENTRY = 'index.ts'
export const defaultFiles = () =>
  new Map([
    [DEFAULT_ENTRY, new File(codeTemplate, true)],
    ['_config.js', new File(configTemplate)],
  ])

export const files = ref<FileMap>(defaultFiles())
export const activeFile = ref<string>()

export const currentBundlerId = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
export const currentBundler = computed(() => bundlers[currentBundlerId.value])
