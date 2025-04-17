<script setup lang="ts">
import ansis from 'ansis'
import { bundlers, type TransformResult } from '~/composables/bundlers'
import { code, currentBundler } from '~/state/bundler'

const { data, status, error } = useAsyncData(
  '',
  async (): Promise<TransformResult> => {
    const bundler = bundlers[currentBundler.value]
    let context: any
    if (!bundler.initted && bundler.init) {
      context = await bundler.init()
      bundler.initted = true
    }
    const result = await bundler.build.call(context, code.value)
    return result
  },
  {
    server: false,
    watch: [code, currentBundler],
  },
)

const errorText = computed(() => {
  if (!error.value) return ''
  const str = ansis.strip(String(error.value))
  let stack: string | undefined
  if (error.value instanceof Error) {
    stack = error.value.stack
    if (isSafari)
      stack = stack
        ?.split('\n')
        .map((line) => {
          const [fn, file] = line.split('@', 2)
          return `${' '.repeat(4)}at ${fn} (${file})`
        })
        .join('\n')
  }
  return `${str}\n\n${stack && str !== stack ? `${stack}\n` : ''}`
})
</script>

<template>
  <div h-full flex flex-col gap2>
    <Loading v-if="status === 'pending'" />
    <div
      v-else-if="status === 'error'"
      overflow-auto
      whitespace-pre
      text-sm
      text-red
      font-mono
      v-text="errorText"
    />
    <CodeEditor
      v-show="status === 'success'"
      :model-value="data?.code || ''"
      language="javascript"
      readonly
      min-h-0
      w-full
      flex-1
    />
    <div
      v-if="data?.warnings?.length"
      pb4
      text-yellow-600
      font-mono
      dark:text-yellow
    >
      {{ data?.warnings.join('\n') }}
    </div>
  </div>
</template>
