/**
 * Regenerate react-native-bootsplash **iOS/Android** native splash.
 * Source of truth: assets/logo.png only.
 * Input is copied to a temp PNG so generator I/O never clashes with source files.
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const root = path.join(__dirname, '..')
const LOGO_PNG = path.join(root, 'assets', 'logo.png')

const outDir = path.join(root, 'assets', 'bootsplash')

/**
 * @returns {Promise<{ tmp: string; label: string }>}
 */
async function prepareSourcePng(tmp) {
  if (fs.existsSync(LOGO_PNG)) {
    fs.copyFileSync(LOGO_PNG, tmp)
    return { tmp, label: 'assets/logo.png' }
  }
  throw new Error('bootsplash: missing source. Add assets/logo.png')
}

async function main() {
  const tmp = path.join(
    os.tmpdir(),
    `bootsplash-src-${process.pid}-${Date.now()}.png`,
  )
  let exitCode = 1
  try {
    const { label } = await prepareSourcePng(tmp)
    console.log(`bootsplash: using source ${label}`)

    const args = [
      'react-native-bootsplash',
      'generate',
      tmp,
      '--platforms=android,ios',
      '--background=#111827',
      '--logo-width=160',
      '--assets-output',
      outDir,
      '--flavor=main',
    ]

    const result = spawnSync('npx', args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    exitCode = result.status === null ? 1 : result.status
  } catch (e) {
    console.error(e instanceof Error ? e.message : e)
    exitCode = 1
  } finally {
    try {
      fs.unlinkSync(tmp)
    } catch {
      // ignore
    }
  }
  process.exit(exitCode)
}

main()
