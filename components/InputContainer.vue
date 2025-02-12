<script setup lang="ts">
import { fileContent } from '../composables/state'
</script>

<template>
  <div>
    <CodeEditor
      v-model="fileContent"
      language="javascript"
      input
      h-full
      w-full
    />
  </div>
</template>
