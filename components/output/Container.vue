<script setup lang="ts">
import { bundlers, type TransformResult } from '~/composables/bundlers'

const { data, status, error } = useAsyncData(
  '',
  async (): Promise<TransformResult> => {
    const bundler = bundlers[currentBundler.value]
    if (!bundler.initted && bundler.init) {
      await bundler.init()
      bundler.initted = true
    }
    const result = await bundler.build(fileContent.value)
    return result
  },
  {
    server: false,
    watch: [fileContent, currentBundler],
  },
)
</script>

<template>
  <div h-full flex flex-col gap2>
    <Loading v-if="status === 'pending'" />
    <div
      v-else-if="status === 'error'"
      overflow-auto
      whitespace-pre
      text-red
      font-mono
      v-text="error"
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
    <div v-if="data?.warnings?.length" pb4 text-yellow font-mono>
      {{ data?.warnings.join('\n') }}
    </div>
  </div>
</template>
