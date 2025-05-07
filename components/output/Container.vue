<script setup lang="ts">
import ansis from 'ansis'
import { bundlers, type TransformResult } from '~/composables/bundlers'
import { currentBundlerId, files, timeCost } from '~/state/bundler'

const { data, status, error, refresh } = useAsyncData(
  '',
  async (): Promise<TransformResult> => {
    const bundler = bundlers[currentBundlerId.value]
    let context: any
    if (!bundler.initted && bundler.init) {
      context = await bundler.init()
      bundler.initted = true
    }
    const configCode = files.value.get('_config.js')?.code
    let configObject: any = {}

    let configUrl: string | undefined
    if (configCode) {
      configUrl = URL.createObjectURL(
        new Blob([configCode || ''], { type: 'text/javascript' }),
      )
      const mod = await import(/* @vite-ignore */ configUrl)
      configObject = mod.default || mod
    }
    const entries = Array.from(files.value.entries())
      .filter(([, file]) => file.isEntry)
      .map(([name]) => `/${name}`)

    const startTime = performance.now()

    try {
      const result = await bundler.build.call(
        context,
        files.value,
        entries,
        configObject,
      )
      return result
    } finally {
      timeCost.value = Math.round(performance.now() - startTime)
      if (configUrl) URL.revokeObjectURL(configUrl)
    }
  },
  { server: false, deep: false },
)

watch(status, (newStatus) => {
  if (newStatus === 'pending') {
    timeCost.value = undefined
  }
})

watch([files, currentBundlerId], () => refresh(), {
  deep: true,
})

const tabs = computed(() => Object.keys(data.value?.output || {}))

const errorText = computed(() => {
  if (!error.value) return ''
  const str = ansis.strip(String(error.value))
  let stack: string | undefined
  if (error.value instanceof Error) {
    stack = error.value.stack
    if (isSafari)
      stack = stack
        ?.split('\n')
        .map((line) => {
          const [fn, file] = line.split('@', 2)
          return `${' '.repeat(4)}at ${fn} (${file})`
        })
        .join('\n')
  }
  return `${str}\n\n${stack && str !== stack ? `${stack}\n` : ''}`
})
</script>

<template>
  <div h-full flex flex-col gap2>
    <Loading v-if="status === 'pending'" />
    <div
      v-else-if="status === 'error'"
      overflow-auto
      whitespace-pre
      text-sm
      text-red
      font-mono
      v-text="errorText"
    />
    <Tabs
      v-if="status === 'success'"
      v-slot="{ value }"
      :tabs
      readonly
      min-h-0
      w-full
      flex-1
    >
      <CodeEditor
        v-show="status === 'success'"
        :model-value="data?.output[value] || ''"
        language="javascript"
        readonly
        min-h-0
        w-full
        flex-1
      />
    </Tabs>
    <div
      v-if="data?.warnings?.length"
      pb4
      text-sm
      text-yellow-600
      font-mono
      dark:text-yellow
    >
      {{ ansis.strip(data?.warnings.join('\n') || '') }}
    </div>
  </div>
</template>
