<script setup lang="ts">
import { bundlers } from '~/composables/bundlers'
import { currentBundler } from '../../composables/state'
</script>

<template>
  <div>
    <select v-model="currentBundler">
      <option v-for="bundler of bundlers" :key="bundler.id" :value="bundler.id">
        {{ bundler.name }}
      </option>
    </select>
  </div>
</template>
