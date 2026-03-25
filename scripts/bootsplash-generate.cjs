/**
 * Regenerate react-native-bootsplash native assets + assets/bootsplash/*.
 * Copies the source PNG to a temp path first so Sharp can read the input while
 * writing outputs into assets/bootsplash (same-dir input+output would error).
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const root = path.join(__dirname, '..')
const preferredSrc = path.join(root, 'assets', 'logo.png')
const fallbackSrc = path.join(root, 'assets', 'bootsplash', 'logo.png')
const src = fs.existsSync(preferredSrc) ? preferredSrc : fallbackSrc

if (!fs.existsSync(src)) {
  console.error(
    'bootsplash: missing source image. Add assets/logo.png (recommended) or assets/bootsplash/logo.png',
  )
  process.exit(1)
}

const tmp = path.join(
  os.tmpdir(),
  `bootsplash-src-${process.pid}-${Date.now()}.png`,
)
fs.copyFileSync(src, tmp)

const outDir = path.join(root, 'assets', 'bootsplash')
const args = [
  'react-native-bootsplash',
  'generate',
  tmp,
  '--platforms=android,ios',
  '--background=#111827',
  '--logo-width=100',
  '--assets-output',
  outDir,
  '--flavor=main',
]

const result = spawnSync('npx', args, {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

try {
  fs.unlinkSync(tmp)
} catch {
  // ignore
}

process.exit(result.status === null ? 1 : result.status)
