<script setup lang="ts">
import { bundler } from '../composables/state'
import { version } from '../package.json'
</script>

<template>
  <div flex="~ wrap" items-center justify-between p2>
    <div flex="~ gap4">
      <div flex="~ gap1">
        <!-- <Logo /> -->
        <h1 text-lg font-bold>Bundler REPL</h1>
        <small>v{{ version }}</small>
      </div>

      <select v-model="bundler">
        <option value="rollup">Rollup</option>
        <!-- <option value="rolldown">Rolldown</option> -->
        <option value="esbuild">esbuild</option>
      </select>
    </div>

    <div flex="~ gap-3">
      <button @click="toggleDark">
        <div i-ri:sun-line dark:i-ri:moon-line />
      </button>
      <a
        href="https://github.com/sxzz/ast-explorer"
        target="_blank"
        flex
        items-center
      >
        <div i-ri:github-line />
      </a>
    </div>
  </div>
</template>
