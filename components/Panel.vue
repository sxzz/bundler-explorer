<script setup lang="ts">
import { showPanel } from '~/state/panel'
</script>

<template>
  <div
    flex="~ gap-4 items-center"
    z-panel
    fixed
    bottom-4
    right-4
    border="~ base"
    rounded-full
    shadow
    bg-glass
  >
    <button
      h-10
      w-10
      flex
      items-center
      justify-center
      rounded-full
      op50
      hover:bg-gray
      hover:bg-opacity-20
      hover:op100
      title="Toggle Terminal"
      @click="showPanel = !showPanel"
    >
      <div i-ph-terminal-window-duotone text-xl />
    </button>
  </div>
</template>
