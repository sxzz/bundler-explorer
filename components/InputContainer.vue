<script setup lang="ts">
import { activeFile, File, files } from '~/state/bundler'

const tabs = computed(() => Array.from(files.value.keys()))

function updateCode(name: string, code: string) {
  files.value.get(name)!.code = code
}

function addTab(name: string) {
  files.value.set(name, new File(''))
}

function renameTab(oldName: string, newName: string) {
  files.value = new Map(
    Array.from(files.value.entries()).map(([key, value]) => {
      if (key === oldName) {
        return [newName, value]
      }
      return [key, value]
    }),
  )
}

function removeTab(name: string) {
  files.value.delete(name)
}

function setEntry(name: string) {
  const file = files.value.get(name)
  if (file) {
    file.isEntry = !file.isEntry
  }
}
</script>

<template>
  <div flex="~ col" pl3>
    <Tabs
      v-model="activeFile"
      :tabs
      h-full
      min-h-0
      w-full
      @add-tab="addTab"
      @rename-tab="renameTab"
      @remove-tab="removeTab"
    >
      <template #default="{ value }">
        <CodeEditor
          :model-value="files.get(value)!.code"
          language="typescript"
          input
          @update:model-value="updateCode(value, $event)"
        />
      </template>

      <template #tab-prefix="{ value }">
        <button
          v-if="value !== '_config.js'"
          title="Toggle Entry"
          p="0.5"
          mr="0.5"
          rounded-full
          text-sm
          op80
          hover:bg-op-60
          :class="
            files.get(value)?.isEntry
              ? 'bg-green-400 text-black bg-op-90'
              : 'bg-gray bg-op-0'
          "
          @click="setEntry(value)"
        >
          <div i-ri:anchor-line />
        </button>
      </template>
    </Tabs>
  </div>
</template>
