// One-off: builds the app-icon + splash sources for @capacitor/assets from the
// Recraft asset pack (assets/recraft/, generated 2026-07-12). Run:
//   node scripts/make-icon.mjs && npx @capacitor/assets generate --ios
//
// Icon  = appicon/concept-a-1.png ("the figure watched through a camera frame").
// Splash = splash/splash-1.png (centered aperture bloom) + a serif wordmark.
// Swap the SRC_* paths below to try another concept from the pack.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC_ICON = 'assets/recraft/appicon/concept-a-1.png'
const SRC_SPLASH = 'assets/recraft/splash/splash-1.png'
const NIGHT = '#0D0C16'

mkdirSync('assets', { recursive: true })
mkdirSync('resources', { recursive: true })

// ---- App icon: 1024² full-bleed, no alpha (iOS applies its own rounded mask) ----
const icon = await sharp(SRC_ICON)
  .resize(1024, 1024, { fit: 'cover' })
  .flatten({ background: NIGHT })
  .png()
  .toBuffer()

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
