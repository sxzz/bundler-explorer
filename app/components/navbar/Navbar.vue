<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { version } from '~~/package.json'
import { toggleDark } from '~/composables/dark'
import {
  activeFile,
  currentBundler,
  DEFAULT_ENTRY,
  defaultFiles,
  files,
  timeCost,
} from '~/state/bundler'
import BundlerSelect from './BundlerSelect.vue'

const { branch } = useAppConfig()

function resetState() {
  if (
    // eslint-disable-next-line no-alert
    confirm(
      'Are you sure you want to reset the code and config to their default values?',
    )
  ) {
    monaco!.editor.getModels().forEach((model) => {
      if (model.uri.authority === 'model') return
      model.dispose()
    })
    files.value = defaultFiles()
    activeFile.value = DEFAULT_ENTRY
  }
}
</script>

<template>
  <div flex="~ wrap" items-center justify-between p2>
    <div flex="~ gap4">
      <div flex="~ gap1">
        <!-- <Logo /> -->
        <h1 text-lg font-bold>Bundler Explorer</h1>
        <small>{{ branch === 'release' ? `v${version}` : 'dev' }}</small>
      </div>
      <BundlerSelect />
    </div>

    <div flex="~ center" gap2>
      <div flex="~ center" gap2>
        <div
          v-if="timeCost != null"
          flex
          items-center
          gap1
          text-sm
          font-mono
          title="Time Cost"
        >
          <div i-ri:time-line op60 />
          <span op80>{{ timeCost }}ms</span>
        </div>

        <a
          :href="`https://npmjs.com/package/${currentBundler.pkgName}/v/${currentBundler.version}`"
          target="_blank"
          flex
          items-center
          gap1
          text-sm
          font-mono
          :title="`${currentBundler.pkgName}@${currentBundler.version}`"
        >
          <div :class="currentBundler.icon" />
          <div op80>
            {{ currentBundler.pkgName }}@{{ currentBundler.version }}
          </div>
        </a>
      </div>

      <button title="Reset State" nav-button @click="resetState">
        <div i-ri:refresh-line />
      </button>

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
