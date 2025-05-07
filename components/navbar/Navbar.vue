<script setup lang="ts">
import { version } from '~/package.json'
import { currentBundler } from '~/state/bundler'
import BundlerSelect from './BundlerSelect.vue'

const { branch } = useAppConfig()
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

    <div flex="~ center" gap1>
      <a
        :href="`https://npmjs.com/package/${currentBundler.pkgName}/v/${currentBundler.version}`"
        target="_blank"
        flex
        items-center
        gap1
        text-sm
        font-mono
      >
        <div :class="currentBundler.icon" />
        <div op80>
          {{ currentBundler.pkgName }}@{{ currentBundler.version }}
        </div>
      </a>

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
