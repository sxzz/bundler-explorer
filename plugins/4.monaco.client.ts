import { activeFile, files } from '~/state/bundler'

export default defineNuxtPlugin(() => {
  const monaco = useMonaco()!

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    allowComments: true,
    enableSchemaRequest: true,
    trailingCommas: 'ignore',
  })

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    allowImportingTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
  })

  monaco.editor.registerEditorOpener({
    openCodeEditor(_, resource) {
      let path = resource.toString()
      if (!path.startsWith('inmemory:/')) return false

      path = path.slice('inmemory:/'.length)
      if (!files.value.has(path)) return false

      activeFile.value = path
      return true
    },
  })
})
