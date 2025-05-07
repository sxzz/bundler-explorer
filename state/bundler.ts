import { bundlers, type BundlerName } from '../composables/bundlers'

export class File {
  constructor(
    public code: string,
    public isEntry = false,
  ) {}
}
export type FileMap = Map<string, File>

export const codeTemplate = 'export const foo = 42'
export const configTemplate = `// config.js\n\nreturn {}`
export const defaultFiles = () =>
  new Map([
    ['index.ts', new File(codeTemplate, true)],
    ['_config.js', new File(configTemplate)],
  ])

export const files = ref<FileMap>(new Map(defaultFiles()))

export const currentBundlerId = useLocalStorage<BundlerName>(
  'current-bundler',
  'rollup',
)
export const currentBundler = computed(() => bundlers[currentBundlerId.value])

export const timeCost = ref<number>()
