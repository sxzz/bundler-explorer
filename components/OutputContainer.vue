<script setup lang="ts">
import { rollup } from '@rollup/browser'
import { build, initialize } from 'esbuild-wasm'
import wasmURL from 'esbuild-wasm/esbuild.wasm?url'

const outputCode = ref('')

initialize({ wasmURL })

watch([fileContent, bundler], ([code, bundler]) => {
  switch (bundler) {
    case 'rollup':
      rollupBundle(code)
      break
    case 'esbuild':
      esbuildBundle(code)
      break
    // case 'rolldown':
    //   rolldownBundle(code)
    //   break
  }
})

async function esbuildBundle(code: string) {
  const bundle = await build({
    bundle: true,
    stdin: {
      contents: code,
      loader: 'ts',
    },
    format: 'esm',
    write: false,
  })
  outputCode.value = bundle.outputFiles[0].text
}

async function rollupBundle(code: string) {
  const entry = 'main.js'
  const bundle = await rollup({
    input: [entry],
    plugins: [
      {
        name: 'entry',
        resolveId(source) {
          return source === entry ? source : null
        },
        load(id) {
          return id === 'main.js' ? code : null
        },
      },
    ],
  })
  const result = await bundle.generate({ format: 'esm' })
  outputCode.value = result.output[0].code
}
</script>

<template>
  <div>
    <CodeEditor v-model="outputCode" language="javascript" h-400px />
  </div>
</template>
