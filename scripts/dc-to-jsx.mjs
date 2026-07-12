// One-off codemod: converts the dc.html template DSL into React TSX files.
// DSL:  <sc-if value="{{c}}">…   →  {c && (…)}
//       <sc-for list="{{xs}}" as="x">… → {xs.map((x, i) => …)}
//       {{ expr }} text/attr bindings, style-hover, hint-*, x-import
// Output is committed and then hand-tuned; re-running OVERWRITES the
// generated files. Throwaway tooling — not part of the app build.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = readFileSync(join(ROOT, 'design/CameraView Prototype.dc.html'), 'utf8')

// ── extract x-dc inner html, drop <helmet> ──────────────────────────────
const open = SRC.indexOf('<x-dc>')
const close = SRC.lastIndexOf('</x-dc>')
let tpl = SRC.slice(open + 6, close)
tpl = tpl.replace(/<helmet>[\s\S]*?<\/helmet>/, '')
// dc-script is outside x-dc; not our concern here.

// ── tiny HTML parser (regular, machine-authored subset) ────────────────
const VOID = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'])

function parseAttrs(s) {
  const attrs = []
  const re = /([\w:-]+)(?:="([^"]*)")?/g
  let m
  while ((m = re.exec(s))) attrs.push({ name: m[1], value: m[2] })
  return attrs
}

function parseHTML(src) {
  const root = { type: 'root', tag: '#root', children: [] }
  const stack = [root]
  const top = () => stack[stack.length - 1]
  const re = /<!--([\s\S]*?)-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"]|"[^"]*")*?)(\/?)>/g
  let last = 0
  let m
  const pushText = (t) => {
    if (t) top().children.push({ type: 'text', value: t })
  }
  while ((m = re.exec(src))) {
    if (m.index > last) pushText(src.slice(last, m.index))
    last = re.lastIndex
    if (m[1] !== undefined) {
      top().children.push({ type: 'comment', value: m[1].trim() })
    } else if (m[2]) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === m[2]) {
          stack.length = i
          break
        }
      }
    } else {
      const el = { type: 'el', tag: m[3], attrs: parseAttrs(m[4]), children: [] }
      top().children.push(el)
      if (!m[5] && !VOID.has(m[3].toLowerCase())) stack.push(el)
    }
  }
  if (last < src.length) pushText(src.slice(last))
  return root
}

// ── helpers ─────────────────────────────────────────────────────────────
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

const warnings = []
const warn = (msg) => warnings.push(msg)

function rewriteExpr(raw, scope) {
  const e = raw.trim()
  if (/^(true|false|null|-?\d+(\.\d+)?|'[^']*')$/.test(e)) return e
  const m = e.match(/^[A-Za-z_$][\w$]*/)
  if (!m) {
    warn(`unparseable expr: ${e}`)
    return e
  }
  if (!/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(e)) warn(`complex expr passed through: ${e}`)
  return scope.has(m[0]) ? e : `v.${e}`
}

// value with {{ }} → JS expression string for attr={…}
function bindingParts(value) {
  const parts = []
  const re = /\{\{([\s\S]*?)\}\}/g
  let last = 0
  let m
  while ((m = re.exec(value))) {
    if (m.index > last) parts.push({ lit: value.slice(last, m.index) })
    parts.push({ expr: m[1] })
    last = re.lastIndex
  }
  if (last < value.length) parts.push({ lit: value.slice(last) })
  return parts
}

function attrExpr(value, scope) {
  const parts = bindingParts(value)
  if (parts.length === 1 && parts[0].expr !== undefined) return rewriteExpr(parts[0].expr, scope)
  return (
    '`' +
    parts
      .map((p) => (p.expr !== undefined ? '${' + rewriteExpr(p.expr, scope) + '}' : decode(p.lit).replace(/([`$\\])/g, '\\$1')))
      .join('') +
    '`'
  )
}

const EVENT_ATTRS = new Set(['onClick', 'onChange', 'onInput', 'onKeyDown', 'onKeyUp', 'onPointerDown', 'onPointerUp', 'onPointerMove', 'onFocus', 'onBlur', 'onSubmit'])

const camelAttr = (n) => {
  if (n.startsWith('data-') || n.startsWith('aria-')) return n
  if (n === 'class') return 'className'
  if (n === 'for') return 'htmlFor'
  if (!n.includes('-')) return n
  return n.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

const jsStr = (s) => JSON.stringify(s)

// static attr value → JSX attr rhs
function staticAttr(value) {
  const d = decode(value)
  if (d.includes('"') || d.includes('\n')) return `{${jsStr(d)}}`
  return `"${d}"`
}

// ── emitter ─────────────────────────────────────────────────────────────
let usesFragment = false
let usesSx = false
let usesPseudo = false

function emitText(node, scope, ind, hasElSiblings) {
  const parts = bindingParts(node.value)
  const out = []
  for (const p of parts) {
    if (p.expr !== undefined) {
      out.push(`${ind}{${rewriteExpr(p.expr, scope)}}`)
      continue
    }
    let t = p.lit
    if (!t.trim()) continue
    const decoded = decode(t)
    const leading = /^\s/.test(t)
    const trailing = /\s$/.test(t)
    let body = decoded.trim().replace(/\s+/g, ' ')
    if (hasElSiblings && (leading || trailing)) {
      body = (leading ? ' ' : '') + body + (trailing ? ' ' : '')
      out.push(`${ind}{${jsStr(body)}}`)
    } else if (/[{}<>&`]/.test(body)) {
      out.push(`${ind}{${jsStr(body)}}`)
    } else {
      out.push(ind + body)
    }
  }
  return out.join('\n')
}

function childrenHaveEl(children) {
  return children.some((c) => c.type === 'el')
}

function emitChildren(children, scope, ind, depth) {
  const hasEl = childrenHaveEl(children)
  return children
    .map((c) => emitNode(c, scope, ind, depth, hasEl))
    .filter(Boolean)
    .join('\n')
}

// emit children of sc-if / sc-for: single element → bare, else fragment
function emitBlockChildren(children, scope, ind, depth, keyExpr) {
  const meaningful = children.filter((c) => !(c.type === 'text' && !c.value.trim()))
  if (meaningful.length === 1 && meaningful[0].type === 'el') {
    return emitNode(meaningful[0], scope, ind, depth, false, keyExpr)
  }
  usesFragment = true
  const openTag = keyExpr ? `<Fragment key={${keyExpr}}>` : '<>'
  const closeTag = keyExpr ? '</Fragment>' : '</>'
  return `${ind}${openTag}\n${emitChildren(children, scope, ind + '  ', depth)}\n${ind}${closeTag}`
}

function emitNode(node, scope, ind, depth, hasElSiblings, keyExpr) {
  if (node.type === 'comment') {
    return `${ind}{/* ${node.value.replace(/\*\//g, '*\\/')} */}`
  }
  if (node.type === 'text') {
    return emitText(node, scope, ind, hasElSiblings)
  }
  const tag = node.tag

  if (tag === 'sc-if') {
    const valueAttr = node.attrs.find((a) => a.name === 'value')
    const cond = attrExpr(valueAttr.value, scope)
    const inner = emitBlockChildren(node.children, scope, ind + '  ', depth)
    return `${ind}{${cond} && (\n${inner}\n${ind})}`
  }

  if (tag === 'sc-for') {
    const listAttr = node.attrs.find((a) => a.name === 'list')
    const asAttr = node.attrs.find((a) => a.name === 'as')
    const item = asAttr ? asAttr.value : 'item'
    const idx = depth === 0 ? 'i' : `i${depth + 1}`
    const list = attrExpr(listAttr.value, scope)
    const newScope = new Set(scope)
    newScope.add(item)
    newScope.add(idx)
    const inner = emitBlockChildren(node.children, newScope, ind + '  ', depth + 1, idx)
    return `${ind}{${list}.map((${item}: any, ${idx}: number) => (\n${inner}\n${ind}))}`
  }

  if (tag === 'x-import') {
    // handled by the section splitter; if reached, just emit children
    return emitChildren(node.children, scope, ind, depth)
  }

  // regular element
  const attrs = []
  const pseudos = [] // [kind, css] from style-hover/active/focus (runtime: pseudo classes)
  let staticClass = null
  for (const a of node.attrs) {
    const { name, value } = a
    if (name.startsWith('hint-')) continue
    const pm = name.match(/^style-([a-z]+)$/)
    if (pm) {
      pseudos.push([pm[1], decode(value)])
      continue
    }
    if (name === 'class' && value !== undefined && !value.includes('{{')) {
      staticClass = decode(value)
      continue
    }
    if (value === undefined) {
      attrs.push(camelAttr(name))
      continue
    }
    const bound = value.includes('{{')
    if (name === 'style') {
      usesSx = true
      if (bound) attrs.push(`style={sx(${attrExpr(value, scope)})}`)
      else attrs.push(`style={sx(${jsStr(decode(value))})}`)
      continue
    }
    const jsxName = camelAttr(name)
    if (bound) {
      const expr = attrExpr(value, scope)
      if (EVENT_ATTRS.has(jsxName) || jsxName === 'ref') attrs.push(`${jsxName}={${expr}}`)
      else attrs.push(`${jsxName}={${expr}}`)
    } else {
      attrs.push(`${jsxName}=${staticAttr(value)}`)
    }
  }
  if (pseudos.length) {
    usesPseudo = true
    const calls = pseudos.map(([kind, css]) => `pseudo('${kind}', ${jsStr(css)})`)
    const joined = calls.join(" + ' ' + ")
    const expr = staticClass ? `${jsStr(staticClass + ' ')} + ${joined}` : joined
    attrs.push(`className={${expr}}`)
  } else if (staticClass !== null) {
    attrs.push(`className="${staticClass}"`)
  }
  if (keyExpr) attrs.unshift(`key={${keyExpr}}`)

  const jsxTag = tag
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : ''
  if (!node.children.length || VOID.has(tag.toLowerCase())) {
    return `${ind}<${jsxTag}${attrStr} />`
  }
  const meaningful = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
  if (!meaningful.length) return `${ind}<${jsxTag}${attrStr} />`
  // compact: single short text child stays inline
  if (meaningful.length === 1 && meaningful[0].type === 'text') {
    const t = emitText(meaningful[0], scope, '', false)
    if (t && !t.includes('\n') && t.length < 70) {
      return `${ind}<${jsxTag}${attrStr}>${t}</${jsxTag}>`
    }
  }
  const inner = emitChildren(node.children, scope, ind + '  ', depth)
  return `${ind}<${jsxTag}${attrStr}>\n${inner}\n${ind}</${jsxTag}>`
}

// ── locate structure: rail, stage wrapper, phone content, sections ─────
const tree = parseHTML(tpl)
const shellFlex = tree.children.find((n) => n.type === 'el' && n.tag === 'div')
const [railDiv, stageDiv] = shellFlex.children.filter((n) => n.type === 'el')
const xImport = stageDiv.children.find((n) => n.type === 'el' && n.tag === 'x-import')
const phoneDiv = xImport.children.find((n) => n.type === 'el')

const MANIFEST = [
  [/1 · ONBOARDING/, 'Onboarding', 'src/screens/Onboarding.tsx'],
  [/2 · SIGN IN/, 'Signin', 'src/screens/Signin.tsx'],
  [/3 · HOME/, 'Home', 'src/screens/Home.tsx'],
  [/4 · SETUP/, 'Setup', 'src/screens/Setup.tsx'],
  [/SESSION SHELL/, 'Session', 'src/screens/Session.tsx'],
  [/11 · SUMMARY/, 'Summary', 'src/screens/Summary.tsx'],
  [/12 · JOURNAL/, 'Journal', 'src/screens/Journal.tsx'],
  [/13 · PROGRESS/, 'Progress', 'src/screens/Progress.tsx'],
  [/17 · CONNECTIONS/, 'Threads', 'src/screens/Threads.tsx'],
  [/15 · SETTINGS/, 'Settings', 'src/screens/Settings.tsx'],
  [/16 · CRISIS/, 'Crisis', 'src/screens/Crisis.tsx'],
  [/TAB DOCK/, 'TabDock', 'src/components/TabDock.tsx'],
  [/14 · PAYWALL SHEET/, 'Paywall', 'src/components/Paywall.tsx'],
  [/^toast$/, 'Toast', 'src/components/Toast.tsx'],
  [/^film grain$/, 'FilmGrain', 'src/components/FilmGrain.tsx'],
]

const sections = [] // {name, file, label, nodes}
let current = null
for (const child of phoneDiv.children) {
  if (child.type === 'comment') {
    const label = child.value.replace(/═/g, '').trim()
    const hit = MANIFEST.find(([re]) => re.test(label))
    if (hit) {
      current = { name: hit[1], file: hit[2], label, nodes: [] }
      sections.push(current)
      continue
    }
  }
  if (current) current.nodes.push(child)
  else if (child.type === 'el') warn('node before first section: <' + child.tag + '>')
}

// ── file writer ─────────────────────────────────────────────────────────
function relImport(fromFile, toModule) {
  const depth = fromFile.split('/').length - 2 // under src/
  const up = depth === 0 ? './' : '../'.repeat(depth)
  return up + toModule
}

function emitComponentFile(name, file, label, nodes, extraRootClass) {
  usesFragment = false
  usesSx = false
  usesPseudo = false
  const scope = new Set()
  if (extraRootClass) {
    const rootEl = nodes.find((n) => n.type === 'el')
    if (rootEl) {
      const cls = rootEl.attrs.find((a) => a.name === 'class')
      if (cls) cls.value = cls.value + ' ' + extraRootClass
      else rootEl.attrs.push({ name: 'class', value: extraRootClass })
    }
  }
  const meaningful = nodes.filter((n) => !(n.type === 'text' && !n.value.trim()))
  let body
  if (meaningful.length === 1 && meaningful[0].type === 'el' && !meaningful[0].tag.startsWith('sc-')) {
    body = emitNode(meaningful[0], scope, '    ', 0, false)
  } else {
    // root is an expression ({cond && …}) or multiple nodes — needs a JSX wrapper
    body = '    <>\n' + emitChildren(nodes, scope, '      ', 0) + '\n    </>'
  }
  const needsV = /\bv\./.test(body)
  const imports = []
  if (usesFragment) imports.push(`import { Fragment } from 'react'`)
  if (usesSx) imports.push(`import { sx } from '${relImport(file, 'lib/sx')}'`)
  if (usesPseudo) imports.push(`import { pseudo } from '${relImport(file, 'lib/pseudo')}'`)
  if (needsV) imports.push(`import { useApp } from '${relImport(file, 'store/AppContext')}'`)
  const src = `// GENERATED from design/CameraView Prototype.dc.html — section "${label}".
// Hand-tuned after generation; the design file remains the source of truth.
${imports.join('\n')}

export function ${name}() {
${needsV ? '  const v = useApp()\n' : ''}  return (
${body}
  )
}
`
  const abs = join(ROOT, file)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, src)
  return src.split('\n').length
}

const report = []
for (const s of sections) {
  const lines = emitComponentFile(s.name, s.file, s.label, s.nodes)
  report.push(`${s.file} (${lines} lines)`)
}

// Rail
{
  const lines = emitComponentFile('Rail', 'src/components/Rail.tsx', 'navigator rail', [railDiv], 'cv-rail')
  report.push(`src/components/Rail.tsx (${lines} lines)`)
}

// PhoneApp — the gradient content div wrapping every section, in order
{
  const styleAttr = phoneDiv.attrs.find((a) => a.name === 'style')
  const importLines = sections
    .map((s) => {
      const p = s.file.replace('src/', './').replace('.tsx', '')
      return `import { ${s.name} } from '${p}'`
    })
    .join('\n')
  const src = `// GENERATED from design/CameraView Prototype.dc.html — phone content wrapper.
import { sx } from './lib/sx'
${importLines}

export function PhoneApp() {
  return (
    <div style={sx(${jsStr(decode(styleAttr.value))})}>
      ${sections.map((s) => `<${s.name} />`).join('\n      ')}
    </div>
  )
}
`
  writeFileSync(join(ROOT, 'src/PhoneApp.tsx'), src)
  report.push(`src/PhoneApp.tsx (${src.split('\n').length} lines)`)
}

// stage wrapper style for App.tsx reference
const stageStyle = stageDiv.attrs.find((a) => a.name === 'style')
console.log('STAGE_STYLE:', stageStyle ? stageStyle.value : '(none)')
console.log(report.join('\n'))
if (warnings.length) {
  console.log('\nWARNINGS:')
  for (const w of [...new Set(warnings)]) console.log('  -', w)
} else {
  console.log('\nno warnings')
}
