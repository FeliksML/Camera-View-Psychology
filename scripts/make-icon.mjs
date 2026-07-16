// One-off: builds the app-icon + splash sources for @capacitor/assets from the
// Recraft asset pack (assets/recraft/, generated 2026-07-12). Run:
//   node scripts/make-icon.mjs && npx @capacitor/assets generate --ios
//
// Icon  = the aperture bloom cropped from splash-1 (a warm peach dot in rings on
//         deep indigo — the "camera view" mark; the highest-contrast, most legible
//         option at 40px, and consistent with the splash).
// Splash = splash/splash-1.png (centered aperture bloom) + a serif wordmark.
// For a figure-based icon instead, set ICON_FROM_APERTURE=false to use SRC_ICON.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const ICON_FROM_APERTURE = true
const SRC_ICON = 'assets/recraft/appicon/concept-a-1.png' // used only if ICON_FROM_APERTURE=false
const SRC_SPLASH = 'assets/recraft/splash/splash-1.png'
const NIGHT = '#0D0C16'

mkdirSync('assets', { recursive: true })
mkdirSync('resources', { recursive: true })

// ---- App icon: 1024² full-bleed, no alpha (iOS applies its own rounded mask) ----
let icon
if (ICON_FROM_APERTURE) {
  const { width } = await sharp(SRC_SPLASH).metadata()
  const half = Math.round(width * 0.32) // center crop that keeps both rings + bloom
  icon = await sharp(SRC_SPLASH)
    .extract({ left: width / 2 - half, top: width / 2 - half, width: half * 2, height: half * 2 })
    .resize(1024, 1024)
    .modulate({ brightness: 1.06 }) // a touch more pop at small sizes
    .flatten({ background: NIGHT })
    .png()
    .toBuffer()
} else {
  icon = await sharp(SRC_ICON)
    .resize(1024, 1024, { fit: 'cover' })
    .flatten({ background: NIGHT })
    .png()
    .toBuffer()
}

await sharp(icon).toFile('assets/icon-only.png')
await sharp(icon).toFile('resources/icon.png')

// ---- Splash: 2732² with the aperture bloom centered and a quiet wordmark ----
const bloom = await sharp(SRC_SPLASH)
  .resize(2732, 2732, { fit: 'cover' })
  .toBuffer()

const wordmark = Buffer.from(`
<svg width="2732" height="2732" xmlns="http://www.w3.org/2000/svg">
  <text x="1366" y="1820" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="104" letter-spacing="2" fill="#ECEAF7" fill-opacity="0.85">CameraView</text>
</svg>`)

const splash = await sharp({
  create: { width: 2732, height: 2732, channels: 3, background: NIGHT },
})
  .composite([
    { input: bloom, blend: 'over' },
    { input: wordmark, blend: 'over' },
  ])
  .png()
  .toBuffer()

await sharp(splash).toFile('assets/splash.png')
await sharp(splash).toFile('assets/splash-dark.png')

console.log('icon + splash rebuilt from Recraft pack → assets/ and resources/')
