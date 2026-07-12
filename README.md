# CameraView

A self-distancing therapy app — step outside a difficult moment, watch yourself
"through a camera", guide your copy from distress to calm, and leave with a
better belief. Started as a 1:1 port of the claude.ai/design project
**"CameraView дизайн-промпты"**; now a real product:

- **AI guide** — the stage-4 chat, belief drafting, and cross-session
  "Connections" clustering run on `claude-sonnet-5` via Supabase Edge
  Functions (`supabase/functions/{guide,belief,threads}`). The design's
  scripted dialog remains as the offline/error fallback.
- **Accounts & sync** — Supabase email-OTP auth; sessions/settings live in
  Postgres behind RLS, cached locally (localStorage) so the app boots
  instantly and works offline (queued writes flush on reconnect).
- **Real data** — journal, streak, calm-shift, progress charts and
  Connections derive from your actual sessions. Crisis screen uses real
  `tel:988` / `sms:741741` links. Guide voice via on-device TTS.
- **iOS app** — Capacitor 8 wrapper (`ios/`), safe-area aware, dark splash,
  status bar, breathing haptics. Desktop keeps the design's demo shell
  (navigator rail + device frame).

## Run (web)

```bash
npm install
cp .env.example .env.local     # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev                    # http://localhost:5173
npm run build                  # tsc --noEmit + vite build
```

Dev toggles: `VITE_MOCK_AUTH=1` (fake local user, no emails needed),
`?empty=1` (empty journal), `?plus=1` (decorative — Plus is always on in the
personal build).

## Run (iPhone)

```bash
npm run build && npx cap sync ios
npx cap open ios               # Xcode: pick your Team → Run on your iPhone
```

One-time setup that only the account owner can do:

1. **Anthropic API key** — create a fresh key at console.anthropic.com
   (rotate any key that was ever pasted into a chat), then:
   `supabase secrets set ANTHROPIC_API_KEY=sk-ant-…` (project `cameraview` /
   `nmiypjoafwfscflpbkzv`), or Dashboard → Edge Functions → Secrets.
   Until the secret exists, the app silently falls back to the scripted guide.
2. **Auth redirect** — Supabase Dashboard → Auth → URL Configuration → add
   `capacitor://localhost` to allowed redirect URLs (email OTP works without
   it, but keep it for future OAuth).
3. **Xcode signing** — select your Apple Developer team for the `App` target,
   run on device, trust the developer profile on the iPhone
   (Settings → General → VPN & Device Management). Optional: Archive →
   TestFlight.

## Architecture

- `src/store/logic.core.js` — the app's single state machine. Productized
  from the design's dc-script (no longer byte-synced): auth flow, async AI
  calls with scripted fallback, real dates/stats, TTS, crisis links.
- `src/store/storage.ts` — local-first cache + Supabase sync (append-only
  sessions with an offline queue; debounced last-write-wins settings) +
  `callFn()` edge-function client (returns `null` → caller uses fallback).
- `supabase/functions/` — Deno edge functions (verify_jwt): `guide` returns
  `{copy_reply, coach_note, depth, shift, risk, advance, suggested_replies}`
  as structured output; `risk:true` routes the app to the crisis screen;
  `threads` clusters sessions into shared roots and caches them.
- `src/lib/sx.ts` + `src/lib/pseudo.ts` — the design's CSS-string styling
  system (see git history for the prototype phase).
- `src/native/ios.ts` — Capacitor glue: status bar, splash, breathing
  haptics synced to the grounding stage.
- `design/` — the original prototype, kept as visual reference
  (`cd design && python3 -m http.server 8123`, needs network).

Supabase project: `nmiypjoafwfscflpbkzv` (eu-central-1) — tables `profiles`,
`sessions`, `threads_cache`, all RLS `auth.uid()`-scoped.

## Phase 2 backlog

Sign in with Apple/Google (needs Services ID in the Apple portal) · push
session reminders · StoreKit payments + real paywall · App Store release ·
narrated scene audio (stage 2) · account deletion & data export · realtime
multi-device sync.
