/**
 * Port of the dc-runtime's createPseudoSheet: turns the template's
 * style-hover / style-active / style-focus attributes into generated
 * CSS classes with real pseudo-class rules (.scp0:hover{…}).
 *
 * Same mechanism as the prototype runtime — including its cascade
 * semantics (no !important, so inline styles keep winning where they
 * set the same property), which keeps interaction fidelity 1:1.
 */
let el: HTMLStyleElement | null = null
const cache = new Map<string, string>()
let n = 0

export function pseudo(kind: string, css: string): string {
  const k = kind + '|' + css
  const hit = cache.get(k)
  if (hit) return hit
  if (!el) {
    el = document.createElement('style')
    document.head.appendChild(el)
  }
  const cls = 'scp' + (n++).toString(36)
  const sel = kind === 'before' || kind === 'after' ? `.${cls}::${kind}` : `.${cls}:${kind}`
  el.sheet!.insertRule(`${sel}{${css}}`, el.sheet!.cssRules.length)
  cache.set(k, cls)
  return cls
}
