<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as Monaco from 'monaco-editor'

defineProps<{
  language: MonacoLanguage
}>()
const code = defineModel<string>()

const container = shallowRef<{
  $editor: Monaco.editor.IStandaloneCodeEditor | undefined
}>()

const options = computed<Monaco.editor.IStandaloneEditorConstructionOptions>(
  () => ({
    ...getSharedMonacoOptions(),
    fontSize: 14,
    fontLigatures: true,
  }),
)
</script>

<template>
  <MonacoEditor
    ref="container"
    v-model="code"
    :lang="language"
    :options="options"
  >
    <div flex="~ col center" h-full w-full gap2>
      <div i-ri:loader-2-line animate-spin text-4xl />
      <span text-lg>Loading...</span>
    </div>
  </MonacoEditor>
</template>
