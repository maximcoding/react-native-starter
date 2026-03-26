/**
 * Generate iOS AppIcon.appiconset PNGs + Android mipmap launcher icons from one source.
 * Source: largest PNG under assets/bootsplash/ (logo@4x → … → logo.png), else
 * assets/app-icon.png, else assets/bootsplash-logo.svg (rasterized to temp).
 * Uses sharp (fit: cover, square). Flattens onto #111827 so marketing icon has no transparency.
 */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const sharp = require('sharp')

const root = path.join(__dirname, '..')
const SVG_LOGO = path.join(root, 'assets', 'bootsplash-logo.svg')
const APP_ICON = path.join(root, 'assets', 'app-icon.png')
const BOOTSPLASH_DIR = path.join(root, 'assets', 'bootsplash')
/** Prefer largest PNG first (matches typical react-native-bootsplash output names). */
const BOOTSPLASH_SOURCES = [
  'logo@4x.png',
  'logo@3x.png',
  'logo@2x.png',
  'logo@1,5x.png',
  'logo.png',
]

const BG = { r: 17, g: 24, b: 39 }
const SVG_RASTER_PX = 1024

/** @type {{ px: number; filename: string; idiom: string; size: string; scale: string }[]} */
const IOS_SLOTS = [
  {
    px: 40,
    filename: 'Icon-App-20x20@2x.png',
    idiom: 'iphone',
    size: '20x20',
    scale: '2x',
  },
  {
    px: 60,
    filename: 'Icon-App-20x20@3x.png',
    idiom: 'iphone',
    size: '20x20',
    scale: '3x',
  },
  {
    px: 58,
    filename: 'Icon-App-29x29@2x.png',
    idiom: 'iphone',
    size: '29x29',
    scale: '2x',
  },
  {
    px: 87,
    filename: 'Icon-App-29x29@3x.png',
    idiom: 'iphone',
    size: '29x29',
    scale: '3x',
  },
  {
    px: 80,
    filename: 'Icon-App-40x40@2x.png',
    idiom: 'iphone',
    size: '40x40',
    scale: '2x',
  },
  {
    px: 120,
    filename: 'Icon-App-40x40@3x.png',
    idiom: 'iphone',
    size: '40x40',
    scale: '3x',
  },
  {
    px: 120,
    filename: 'Icon-App-60x60@2x.png',
    idiom: 'iphone',
    size: '60x60',
    scale: '2x',
  },
  {
    px: 180,
    filename: 'Icon-App-60x60@3x.png',
    idiom: 'iphone',
    size: '60x60',
    scale: '3x',
  },
  {
    px: 1024,
    filename: 'Icon-App-1024x1024@1x.png',
    idiom: 'ios-marketing',
    size: '1024x1024',
    scale: '1x',
  },
]

/** Density folder → launcher side length (px) */
const ANDROID_MAP = [
  { folder: 'mipmap-mdpi', px: 48 },
  { folder: 'mipmap-hdpi', px: 72 },
  { folder: 'mipmap-xhdpi', px: 96 },
  { folder: 'mipmap-xxhdpi', px: 144 },
  { folder: 'mipmap-xxxhdpi', px: 192 },
]

function resolveBootsplashSource() {
  for (const name of BOOTSPLASH_SOURCES) {
    const p = path.join(BOOTSPLASH_DIR, name)
    if (fs.existsSync(p)) return p
  }
  return null
}

/**
 * @returns {{ path: string; cleanup: boolean; label: string } | null}
 */
function resolveSourceSync() {
  const fromBootsplash = resolveBootsplashSource()
  if (fromBootsplash) {
    return {
      path: fromBootsplash,
      cleanup: false,
      label: path.relative(root, fromBootsplash),
    }
  }

  if (fs.existsSync(APP_ICON)) {
    return { path: APP_ICON, cleanup: false, label: 'assets/app-icon.png' }
  }

  if (fs.existsSync(SVG_LOGO)) {
    return {
      path: SVG_LOGO,
      cleanup: true,
      label: 'assets/bootsplash-logo.svg',
    }
  }
  return null
}

/**
 * @param {string} destPng
 */
async function rasterizeSvgToPng(destPng) {
  await sharp(SVG_LOGO)
    .resize(SVG_RASTER_PX, SVG_RASTER_PX, {
      fit: 'cover',
      position: 'centre',
    })
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(destPng)
}

/**
 * @param {string} inputPath
 * @param {number} px
 */
async function renderIcon(inputPath, px) {
  return sharp(inputPath)
    .resize(px, px, { fit: 'cover', position: 'centre' })
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  const resolved = resolveSourceSync()
  if (!resolved) {
    console.error(
      'app-icon: missing source. Add PNGs under assets/bootsplash/ (logo@4x.png … logo.png), assets/app-icon.png, or assets/bootsplash-logo.svg.',
    )
    process.exit(1)
  }

  let inputPath = resolved.path
  if (resolved.cleanup) {
    inputPath = path.join(
      os.tmpdir(),
      `app-icon-svg-${process.pid}-${Date.now()}.png`,
    )
  }

  try {
    if (resolved.cleanup) {
      await rasterizeSvgToPng(inputPath)
    }
    console.log(`app-icon: using source ${resolved.label}`)

    const iosDir = path.join(
      root,
      'ios',
      'ReactNativeStarter',
      'Images.xcassets',
      'AppIcon.appiconset',
    )
    fs.mkdirSync(iosDir, { recursive: true })

    for (const slot of IOS_SLOTS) {
      const buf = await renderIcon(inputPath, slot.px)
      fs.writeFileSync(path.join(iosDir, slot.filename), buf)
      console.log(`  iOS ${slot.filename} (${slot.px}px)`)
    }

    const contents = {
      images: IOS_SLOTS.map(s => ({
        idiom: s.idiom,
        scale: s.scale,
        size: s.size,
        filename: s.filename,
      })),
      info: {
        author: 'xcode',
        version: 1,
      },
    }
    fs.writeFileSync(
      path.join(iosDir, 'Contents.json'),
      `${JSON.stringify(contents, null, 2)}\n`,
    )

    const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res')
    for (const { folder, px } of ANDROID_MAP) {
      const dir = path.join(androidRes, folder)
      fs.mkdirSync(dir, { recursive: true })
      const buf = await renderIcon(inputPath, px)
      for (const name of ['ic_launcher.png', 'ic_launcher_round.png']) {
        fs.writeFileSync(path.join(dir, name), buf)
      }
      console.log(`  Android ${folder} (${px}px)`)
    }

    console.log('app-icon: done')
  } finally {
    if (resolved.cleanup) {
      try {
        fs.unlinkSync(inputPath)
      } catch {
        // ignore
      }
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
