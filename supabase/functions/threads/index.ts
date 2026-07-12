// CameraView threads — clusters the user's saved sessions into shared roots
// ("Connections" screen). Reads sessions via service role scoped to the JWT's
// user, asks Claude to link them, caches the result in threads_cache.
import Anthropic from 'npm:@anthropic-ai/sdk@0.111.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json, preflight } from '../_shared/cors.ts'

const MODEL = 'claude-sonnet-5'
const MIN_SESSIONS = 5

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    roots: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          belief: { type: 'string', description: 'The shared core belief, quoted, ≤ 60 chars, first person, user language.' },
          age_label: { type: 'string', description: "Rough origin age range label, e.g. 'AGE 7–9' (uppercase, EN)." },
          pair_label: { type: 'string', description: "Areas it spans, e.g. 'WORK × FRIENDS — ONE THREAD' (uppercase, EN areas)." },
          narrative: { type: 'string', description: "1–2 sentences: which sessions circle this belief and what they trace back to, user's language." },
        },
        required: ['belief', 'age_label', 'pair_label', 'narrative'],
        additionalProperties: false,
      },
      description: '0–2 shared roots. Only create a root when ≥3 sessions genuinely share it.',
    },
    assignments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          session_id: { type: 'string' },
          root: { type: 'integer', enum: [0, 1, 2], description: '1/2 = index of the root above (in order), 0 = no thread yet.' },
          area: { type: 'string', enum: ['Work', 'Family', 'Friends', 'Self', 'Other'] },
          depth: { type: 'integer', enum: [0, 1, 2, 3], description: 'How far back this session reached (from its chat): 0 present, 3 childhood.' },
        },
        required: ['session_id', 'root', 'area', 'depth'],
        additionalProperties: false,
      },
    },
  },
  required: ['roots', 'assignments'],
  additionalProperties: false,
} as const

const SYSTEM = `You analyze a user's CameraView sessions (each: a difficult situation, an emotion, a short guided dialog, an ending belief) and find SHARED ROOTS — one core belief that several different situations keep circling, often formed early in life. Be conservative: a root needs at least 3 genuinely related sessions; otherwise return fewer roots or none. Every session gets exactly one assignment. Root beliefs are first-person quotes in the user's language, like "I'm only worth what I deliver." Labels (age_label, pair_label) are short uppercase English.`

function decodeSub(req: Request): string | null {
  // verify_jwt=true — the platform has already validated the signature.
  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '')
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.sub === 'string' && payload.sub.length > 0 ? payload.sub : null
  } catch {
    return null
  }
}

Deno.serve(async (req: Request) => {
  const pf = preflight(req)
  if (pf) return pf
  if (req.method !== 'POST') return json(req, { error: 'POST only' }, 405)

  const userId = decodeSub(req)
  if (!userId) return json(req, { gate: true, n: 0, reason: 'no_user' }, 200)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, started_at, situation, emotion, intensity, after_intensity, belief, chat, moments')
    .eq('user_id', userId)
    .order('started_at', { ascending: true })
    .limit(60)
  if (error) return json(req, { fallback: true, reason: error.message }, 200)
  if (!sessions || sessions.length < MIN_SESSIONS) {
    return json(req, { gate: true, n: sessions?.length ?? 0 }, 200)
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json(req, { fallback: true, reason: 'no_key' }, 200)

  const digest = sessions.map((s, i) => {
    const copyLines = (Array.isArray(s.chat) ? s.chat : [])
      .filter((m: { c?: boolean }) => m.c)
      .map((m: { t?: string }) => m.t)
      .join(' | ')
      .slice(0, 400)
    return `#${i + 1} id=${s.id} date=${(s.started_at || '').slice(0, 10)} emotion=${s.emotion} ${s.intensity}→${s.after_intensity}
situation: ${(s.situation || '').slice(0, 160)}
belief: ${s.belief || ''}
copy said: ${copyLines}`
  }).join('\n\n')

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
      },
      system: SYSTEM,
      messages: [{ role: 'user', content: `Sessions:\n\n${digest}` }],
    })
    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') {
      return json(req, { fallback: true, reason: response.stop_reason }, 200)
    }
    const text = response.content.find((b: { type: string }) => b.type === 'text') as
      | { type: 'text'; text: string }
      | undefined
    if (!text) return json(req, { fallback: true, reason: 'no_text' }, 200)
    const parsed = JSON.parse(text.text) as {
      roots: { belief: string; age_label: string; pair_label: string; narrative: string }[]
      assignments: { session_id: string; root: number; area: string; depth: number }[]
    }

    // Build render-ready session points (date label, title, emotion color key)
    const byId = new Map(sessions.map((s) => [s.id, s]))
    const points = parsed.assignments
      .filter((a) => byId.has(a.session_id))
      .map((a, i) => {
        const s = byId.get(a.session_id)!
        const d = new Date(s.started_at)
        return {
          n: i + 1,
          root: Math.min(a.root, parsed.roots.length), // clamp: no dangling root index
          area: a.area,
          emo: s.emotion || 'Other',
          depth: a.depth,
          t: (s.situation || '').slice(0, 48),
          d: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }
      })

    const payload = {
      roots: parsed.roots.slice(0, 2),
      session_points: points,
      n_sessions: sessions.length,
      computed_at: new Date().toISOString(),
    }
    await supabase.from('threads_cache').upsert({ user_id: userId, ...payload })
    return json(req, payload, 200)
  } catch (err) {
    console.error('threads error', err)
    return json(req, { fallback: true, reason: 'api_error' }, 200)
  }
})
