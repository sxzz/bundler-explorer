export const fileContent = ref<string>('')

export type Bundler = 'rollup' | 'rolldown' | 'esbuild'
export const bundler = ref<Bundler>('rollup')
