<script setup lang="ts">
import { code, config } from '~/state/bundler'
</script>

<template>
  <div flex="~ col">
    <CodeEditor
      v-model="code"
      language="javascript"
      input
      h-full
      min-h-0
      w-full
    />
    <CodeEditor
      v-model="config"
      language="javascript"
      input
      h-full
      min-h-0
      w-full
    />
  </div>
</template>
