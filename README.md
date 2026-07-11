# CameraView

A self-distancing therapy app prototype — step outside a difficult moment, watch
yourself "through a camera", guide your copy from distress to calm, and leave
with a better belief. 17 screens: onboarding → sign-in → home → session setup →
six-stage guided session (grounding, scene, camera pull-back, guide-your-copy
chat with a live session path map, belief work, coming back) → summary →
journal / progress / connections, plus paywall, settings, and crisis support.

Implemented as a Vite + React 18 + TypeScript SPA, ported 1:1 from the
claude.ai/design project **"CameraView дизайн-промпты"**
(`CameraView Prototype.dc.html` — imported in [design/](design/)).

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (or PORT)
npm run build      # tsc --noEmit + vite build
```

Dev state toggles (the design's `data-props`):

- `?empty=1` — empty journal state
- `?plus=1` — Plus subscription active

## Layout

Desktop shows the design's demo shell: screen-navigator rail + iOS device
frame. Below 1000px the rail hides; at ≤450px the app runs full-bleed
(bezel, dynamic island, and mock status bar removed).

## Architecture

- `src/store/logic.core.js` — the design's state machine, byte-identical to the
  `<script data-dc-script>` in the .dc.html (only the class header changed).
  Keep it in sync with the design file; fidelity fixes go there first.
- `src/store/StoreBase.ts` — minimal DCLogic replacement (setState, subscribe,
  mount hooks) wired to React via `useSyncExternalStore` in
  `src/store/AppContext.tsx`.
- `src/lib/sx.ts` — memoized CSS-text → style-object parser; lets both the
  logic layer and the converted JSX keep the design's CSS strings verbatim.
- `src/lib/pseudo.ts` — port of the dc-runtime's style-hover/active/focus
  pseudo-class sheet.
- `src/screens/*`, `src/components/*` — generated from the template by
  `scripts/dc-to-jsx.mjs` (one-off codemod), then hand-tuned.
- `src/ios/IOSFrame.tsx` — TSX port of the design's iOS 26 device frame.

## Original prototype (reference)

The imported design files run as-is for side-by-side comparison — serve them
raw (Vite would transform the .jsx import):

```bash
cd design && python3 -m http.server 8123
# open http://localhost:8123/CameraView%20Prototype.dc.html  (needs network for unpkg React/Babel)
```
