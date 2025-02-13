import type { Bundler } from './index'

export const rolldown: Bundler = {
  id: 'rolldown',
  name: 'Rolldown',
  icon: 'i-logos:rolldown',
  pkgName: 'i-vscode-icons:file-type-rolldown',
  webContainer: true,
  // async init() {
  //   await import('rolldown')
  // },

  build(code) {
    return 'placeholder'
    // const { default: rolldown } = await import('rolldown')
    // return rolldown(code)
  },
}
