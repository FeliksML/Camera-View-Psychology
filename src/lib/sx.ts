import type { CSSProperties } from 'react'

/**
 * sx("padding:6.5px 10px;color:#A5A1C2") → frozen CSSProperties object.
 *
 * The design's logic layer computes styles as CSS text (the dc-runtime
 * applied them via the style attribute). This parser lets both the ported
 * logic and the converted JSX keep those strings byte-for-byte.
 *
 * Memoized by the exact input string: identical strings return the same
 * frozen object (no needless DOM style writes), while a changed string
 * (e.g. the film-dolly transform) yields a new object so CSS transitions
 * fire exactly like they did under the runtime.
 */
const cache = new Map<string, CSSProperties>()

const camel = (prop: string): string => {
  if (prop.startsWith('--')) return prop
  return prop.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase())
}

export function sx(css: string | undefined | null): CSSProperties | undefined {
  if (!css) return undefined
  const hit = cache.get(css)
  if (hit) return hit
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    const value = decl.slice(i + 1).trim()
    if (!prop || !value) continue
    out[camel(prop)] = value
  }
  const frozen = Object.freeze(out) as CSSProperties
  cache.set(css, frozen)
  return frozen
}
