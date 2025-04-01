import process from 'node:process'

const crossOriginHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt', 'nuxt-monaco-editor'],
  ssr: false,
  vite: {
    optimizeDeps: {
      exclude: ['@rollup/browser'],
    },
    server: {
      headers: crossOriginHeaders,
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: crossOriginHeaders,
      },
    },
    vercel: {
      config: {
        routes: [
          {
            src: '.*',
            // @ts-expect-error - type dismatch in `nitropack`
            headers: crossOriginHeaders,
          },
        ],
      },
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/vars.css',
    '~/styles/global.css',
  ],
  imports: {
    dirs: ['./composables', './utils'],
  },
  appConfig: {
    branch: process.env.VERCEL_GIT_COMMIT_REF,
  },
})
