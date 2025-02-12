<script setup lang="ts">
import { version } from '~/package.json'
import { bundler } from '../composables/state'

const { branch } = useAppConfig()
</script>

<template>
  <div flex="~ wrap" items-center justify-between p2>
    <div flex="~ gap4">
      <div flex="~ gap1">
        <!-- <Logo /> -->
        <h1 text-lg font-bold>Bundler REPL</h1>
        <small>{{ branch === 'release' ? `v${version}` : 'dev' }}</small>
      </div>

      <select v-model="bundler">
        <option value="rollup">Rollup</option>
        <option value="rolldown">Rolldown</option>
        <option value="esbuild">esbuild</option>
      </select>
    </div>

    <div flex="~ center" gap1>
      <button title="Toggle Dark Mode" nav-button @click="toggleDark">
        <div i-ri:sun-line dark:i-ri:moon-line />
      </button>
      <a
        href="https://github.com/sxzz/bundler-explorer"
        target="_blank"
        title="GitHub"
        nav-button
      >
        <div i-ri:github-line />
      </a>
      <a
        href="https://github.com/sponsors/sxzz"
        target="_blank"
        flex="~ center"
        title="Sponsor"
        group
        nav-button
      >
        <div
          i-ri:heart-3-line
          group-hover:i-ri:heart-3-fill
          text-pink-400
          group-hover:text-pink-400
        />
      </a>
    </div>
  </div>
</template>
