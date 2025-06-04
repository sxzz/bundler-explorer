<script setup lang="ts">
import { bundlers } from '~/composables/bundlers'
import { currentBundlerId } from '~/state/bundler'
</script>

<template>
  <div flex items-center gap2>
    <select v-model="currentBundlerId">
      <option v-for="bundler of bundlers" :key="bundler.id" :value="bundler.id">
        {{ bundler.name }}
      </option>
    </select>
  </div>
</template>
