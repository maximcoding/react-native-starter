/**
 * Regenerate react-native-bootsplash **iOS/Android** native splash.
 * Source (first match): assets/bootsplash/logo.png → assets/logo.png
 * → assets/bootsplash-logo.svg (rasterized with sharp). Input is always a temp PNG so generator I/O never
 * clashes with source files.
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const sharp = require('sharp')

const root = path.join(__dirname, '..')
const SVG_SRC = path.join(root, 'assets', 'bootsplash-logo.svg')
const LOGO_PNG = path.join(root, 'assets', 'logo.png')
const BOOTSPLASH_LOGO = path.join(root, 'assets', 'bootsplash', 'logo.png')

const BG = { r: 17, g: 24, b: 39 }
const SVG_RASTER_PX = 1024

const outDir = path.join(root, 'assets', 'bootsplash')

/**
 * @returns {Promise<{ tmp: string; label: string }>}
 */
async function prepareSourcePng(tmp) {
  if (fs.existsSync(BOOTSPLASH_LOGO)) {
    fs.copyFileSync(BOOTSPLASH_LOGO, tmp)
    return { tmp, label: 'assets/bootsplash/logo.png' }
  }
  if (fs.existsSync(LOGO_PNG)) {
    fs.copyFileSync(LOGO_PNG, tmp)
    return { tmp, label: 'assets/logo.png' }
  }
  if (fs.existsSync(SVG_SRC)) {
    await sharp(SVG_SRC)
      .resize(SVG_RASTER_PX, SVG_RASTER_PX, {
        fit: 'cover',
        position: 'centre',
      })
      .flatten({ background: BG })
      .png({ compressionLevel: 9 })
      .toFile(tmp)
    return { tmp, label: 'assets/bootsplash-logo.svg' }
  }
  throw new Error(
    'bootsplash: missing source. Add assets/bootsplash/logo.png, assets/logo.png, or assets/bootsplash-logo.svg',
  )
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
