import { code, codeTemplate, config, configTemplate } from './bundler'
import { STORAGE_PREFIX } from './constants'

const LAST_STATE_KEY = `${STORAGE_PREFIX}last-state`

export function initUrlState() {
  const serializedUrl = atou(location.hash!.slice(1))
  let state = serializedUrl && JSON.parse(serializedUrl)
  if (!state) {
    const serialized = localStorage.getItem(LAST_STATE_KEY)
    if (serialized) state = JSON.parse(serialized)
  }
  code.value = state?.c || codeTemplate
  config.value = state?.o || configTemplate

  // serialize state to url
  watchEffect(() => {
    // code
    const c = code.value === codeTemplate ? '' : code.value
    const o = config.value === configTemplate ? '' : config.value
    const serialized = JSON.stringify({
      c,
      o,
    })
    location.hash = utoa(serialized)
    localStorage.setItem(LAST_STATE_KEY, serialized)
  })
}
