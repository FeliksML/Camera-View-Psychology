// One-off: renders the app icon + splash sources for @capacitor/assets.
// Motif from the design: the small figure watched through camera rings.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const FIGURE = 'M30 6 C36 6 40 11 40 17 C40 22 37 26 33 28 C43 31 48 42 48 56 L48 78 C48 88 40 92 30 92 C20 92 12 88 12 78 L12 56 C12 42 17 31 27 28 C23 26 20 22 20 17 C20 11 24 6 30 6 Z'

const iconSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#26224A"/>
      <stop offset="55%" stop-color="#1E1C33"/>
      <stop offset="100%" stop-color="#0D0C16"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="100%" r="70%">
      <stop offset="0%" stop-color="#E8A188" stop-opacity=".5"/>
      <stop offset="70%" stop-color="#E8A188" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <ellipse cx="512" cy="1030" rx="720" ry="330" fill="url(#glow)"/>
  <circle cx="512" cy="470" r="340" fill="none" stroke="#ECEAF7" stroke-opacity=".14" stroke-width="10"/>
  <circle cx="512" cy="470" r="252" fill="none" stroke="#ECEAF7" stroke-opacity=".26" stroke-width="10"/>
  <circle cx="512" cy="470" r="252" fill="none" stroke="#E8A188" stroke-opacity=".55" stroke-width="10"
    stroke-dasharray="396 1187" stroke-dashoffset="-99" stroke-linecap="round"/>
  <g transform="translate(512 470) scale(4.4) translate(-30 -49)">
    <path d="${FIGURE}" fill="#131120" stroke="#ECEAF7" stroke-opacity=".85" stroke-width="2.2"/>
  </g>
  <circle cx="512" cy="470" r="340" fill="none" stroke="#0D0C16" stroke-opacity="0"/>
</svg>`

const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="#0D0C16"/>
  <circle cx="1366" cy="1300" r="300" fill="none" stroke="#ECEAF7" stroke-opacity=".2" stroke-width="6"/>
  <g transform="translate(1366 1300) scale(3.2) translate(-30 -49)">
    <path d="${FIGURE}" fill="#131120" stroke="#ECEAF7" stroke-opacity=".7" stroke-width="2"/>
  </g>
  <text x="1366" y="1780" text-anchor="middle" font-family="Georgia, serif" font-size="96" fill="#ECEAF7" opacity=".9">CameraView</text>
</svg>`

mkdirSync('assets', { recursive: true })
mkdirSync('resources', { recursive: true })

await sharp(Buffer.from(iconSvg(1024))).png().toFile('assets/icon-only.png')
await sharp(Buffer.from(iconSvg(1024))).png().toFile('resources/icon.png')
await sharp(Buffer.from(splashSvg)).png().toFile('assets/splash-dark.png')
await sharp(Buffer.from(splashSvg)).png().toFile('assets/splash.png')
console.log('icon + splash written to assets/ and resources/')
