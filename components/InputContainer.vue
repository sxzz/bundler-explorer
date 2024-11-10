<script setup lang="ts">
import { fileContent } from '../composables/state'
</script>

<template>
  <div>
    <CodeEditor v-model="fileContent" language="javascript" h-400px />
  </div>
</template>
