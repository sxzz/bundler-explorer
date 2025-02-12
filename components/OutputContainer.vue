<script setup lang="ts">
import { bundlers } from '~/composables/bundlers'

const { data, status, error } = useAsyncData(
  '',
  async () => {
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
  <div flex>
    <Loading v-if="status === 'pending'" />
    <div
      v-else-if="status === 'error'"
      overflow-auto
      whitespace-pre
      text-red
      font-mono
      v-text="error"
    />
    <!-- @vue-expect-error TODO: data could be null -->
    <CodeEditor
      v-show="status === 'success'"
      v-model="data"
      language="javascript"
      readonly
      h-full
      w-full
    />
  </div>
</template>
