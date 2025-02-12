<script setup lang="ts">
import type { MonacoLanguage } from '#imports'
import type * as Monaco from 'monaco-editor'

const props = defineProps<{
  language: MonacoLanguage
  readonly?: boolean
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
    readOnly: props.readonly,
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
    <Loading />
  </MonacoEditor>
</template>
