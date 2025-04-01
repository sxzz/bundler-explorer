import type { Bundler } from './index'

export const rolldown: Bundler = {
  id: 'rolldown',
  name: 'Rolldown',
  icon: 'i-logos:rolldown',
  pkgName: 'i-vscode-icons:file-type-rolldown',
  webContainer: true,

  build(code) {
    return {
      code: `// WIP\n${code}`,
    }
  },
}
