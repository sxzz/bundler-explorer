import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor'],
  ssr: false,
  vite: {
    optimizeDeps: {
      exclude: ['@rollup/browser'],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
  },
  css: ['@unocss/reset/tailwind.css', './styles/global.css'],
  imports: {
    dirs: [
      './composables',
      './composables/state',
      './composables/parser',
      './utils',
    ],
  },
  appConfig: {
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
})
