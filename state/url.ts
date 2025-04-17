import { STORAGE_PREFIX } from './constants'
import { code, codeTemplate } from './editor'

const LAST_STATE_KEY = `${STORAGE_PREFIX}last-state`

export function initUrlState() {
  const serializedUrl = atou(location.hash!.slice(1))
  let state = serializedUrl && JSON.parse(serializedUrl)
  if (!state) {
    const serialized = localStorage.getItem(LAST_STATE_KEY)
    if (serialized) state = JSON.parse(serialized)
  }
  code.value = state?.c || codeTemplate

  // serialize state to url
  watchEffect(() => {
    // code
    const c = code.value === codeTemplate ? '' : code.value
    const serialized = JSON.stringify({
      c,
    })
    location.hash = utoa(serialized)
    localStorage.setItem(LAST_STATE_KEY, serialized)
  })
}
