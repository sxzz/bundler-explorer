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
  app: {
    head: {
      title: 'Bundler REPL',
      meta: [{ name: 'description', content: 'Bundler REPL' }],
    },
  },
})
