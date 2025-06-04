import { WebContainer } from '@webcontainer/api'

let _container: Promise<WebContainer> | null = null

function containerLog(message: string, error?: boolean) {
  const bold = 'font-weight: bold; color: yellow;'
  // eslint-disable-next-line no-console
  console[error ? 'error' : 'info'](`%c[WebContainer]:%c ${message}`, bold, '')
}

export function getWebContainer() {
  if (_container) return _container

  containerLog('> Initiating WebContainer...')
  return (_container = WebContainer.boot({ workdirName: 'workspace' })
    .then((wc) => {
      containerLog('> WebContainer is booted.')
      return wc
    })
    .catch((error) => {
      console.error(error)
      console.error('> WebContainer failed to boot.')
      throw error
    }))
}

export async function containerExec(
  wc: WebContainer,
  cmd: string,
  args: string[],
) {
  containerLog(`> ${cmd} ${args.join(' ')}`)
  const process = await wc.spawn(cmd, args)

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        containerLog(chunk)
      },
    }),
  )

  return process.exit.then(() => process)
}

export async function containerTeardown() {
  ;(await _container)?.teardown()
  _container = null
}

if (import.meta.hot) {
  import.meta.hot.dispose(containerTeardown)
}

// await containerTeardown()
// const wc = await getWebContainer()
// await containerExec(wc, 'node', ['-v'])
// await containerExec(wc, 'pnpm', ['init'])
// await containerExec(wc, 'pnpm', ['-v'])
// await containerExec(wc, 'pnpm', ['add', '-D', 'webpack', 'webpack-cli'])
// await containerExec(wc, 'pnpm', ['webpack', 'build'])
