<script setup lang="ts">
const title = 'Bundler Explorer'
const desc = 'A web tool to explore and compare different JavaScript bundlers.'
const url = 'https://bundler.sxzz.dev/'

const ogImage = {
  url: '/og.png',
  width: 2560,
  height: 1280,
  type: 'image/png',
} as const
useServerSeoMeta({
  title,
  description: desc,
  ogTitle: title,
  ogDescription: desc,
  ogImage,
  ogUrl: url,
  twitterTitle: title,
  twitterDescription: desc,
  twitterImage: ogImage,
  twitterCard: 'summary_large_image',
})

useServerHeadSafe({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg', sizes: 'any' },
  ],
})
</script>

<template>
  <main flex="~ col" lg:h-screen>
    <ClientOnly>
      <Navbar />
      <div min-h-0 flex flex-1 flex-col gap4 lg:flex-row>
        <InputContainer min-w-0 flex-1 />
        <OutputContainer min-w-0 flex-1 />
        <Panel />
      </div>
    </ClientOnly>
  </main>
</template>
