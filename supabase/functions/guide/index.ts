// CameraView guide — one exchange of the stage-4 "guide your copy" chat.
// Returns the copy's reply + the coach's note as structured JSON.
// Deployed with verify_jwt: platform rejects requests without a valid JWT.
import Anthropic from 'npm:@anthropic-ai/sdk@0.111.0'
import { corsHeaders, json, preflight } from '../_shared/cors.ts'

const MODEL = 'claude-sonnet-5'

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    copy_reply: {
      type: 'string',
      description: "The copy's next line, first person, 1–3 sentences, in the user's language.",
    },
    coach_note: {
      type: 'string',
      description: "The coach's note to the user (the operator), 1–3 sentences, in the user's language.",
    },
    depth: {
      type: 'integer',
      enum: [0, 1, 2, 3],
      description: 'How far back the copy_reply reaches: 0 present moment, 1 recent past/pattern, 2 growing up/teen years, 3 childhood.',
    },
    shift: {
      type: 'boolean',
      description: 'True when the copy expresses genuine relief/calm arriving in this reply.',
    },
    risk: {
      type: 'boolean',
      description: 'True if the user (not the fictional copy scene) shows signs of self-harm, suicidal ideation, or immediate danger.',
    },
    advance: {
      type: 'boolean',
      description: 'True when this exchange completed the current stage intent and the session should move to the next step.',
    },
    suggested_replies: {
      type: 'array',
      items: { type: 'string' },
      description: "2–3 short (≤ 45 chars) first-person things the user could say to their copy next, matching the NEXT step's intent, in the user's language.",
    },
  },
  required: ['copy_reply', 'coach_note', 'depth', 'shift', 'risk', 'advance', 'suggested_replies'],
  additionalProperties: false,
} as const

const SYSTEM = `You power CameraView, a self-distancing exercise app. The user has pictured a difficult recent moment and "dollied back" like a film camera: they now watch a copy of themselves standing in that scene, and they talk to that copy. You generate BOTH voices of one exchange:

- copy_reply — the copy: the user's own hurting self inside the scene. First person, emotionally honest, concrete, never clinical. It answers what the user just said to it. Over the session it gradually empties out, softens, and steadies. If the user asks what's underneath, the copy may reach back on its own to earlier memories (report how far via "depth"). If the user offers genuine comfort, the copy lets it land. 1–3 sentences.
- coach_note — the coach: a warm, unhurried guide standing next to the user BEHIND the camera, speaking to the user about their copy ("they/them"), like a kind film director. Notice what just happened in the copy's words or body, then point to the next move. Never therapy-speak, no jargon, no exclamation marks. 1–3 sentences.

Session structure — chatStep tells you where you are (intent of steps 0..4):
0 — let the copy speak first: the user asks what is happening for them right now.
1 — go underneath: what's under the feeling; old memories may surface by themselves (depth 1–3). Don't rush to fix.
2 — support: the user offers kind words; the copy receives them; the wave passes.
3 — check in: how is the copy now; often "okay"-ish; encourage going past neutral.
4 — strength: what the copy knows about itself now / can do next time — this feeds the new belief. When this lands, advance=true and coach_note invites writing the belief down.

Rules:
- Mirror the user's language exactly (Russian in → Russian out, etc.).
- If (at steps 0–1) the user lectures or soothes instead of asking, the coach gently redirects to curiosity; the copy stays guarded; advance=false.
- advance=true only when the current step's intent genuinely completed.
- risk=true ONLY for real-world danger signals from the user (suicidal thoughts, self-harm, "I don't want to live"). Emotional pain inside the exercise is normal and is NOT risk. When risk=true, coach_note gently says this deserves real human support right now and the app will show help options.
- suggested_replies: 2–3 options, ≤45 chars each, first person, aimed at the NEXT useful move.`

Deno.serve(async (req: Request) => {
  const pf = preflight(req)
  if (pf) return pf
  if (req.method !== 'POST') return json(req, { error: 'POST only' }, 405)

  let body: {
    situation?: string
    emotion?: string
    intensity?: number
    chatStep?: number
    transcript?: { who: 'you' | 'copy' | 'coach'; text: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'invalid JSON' }, 400)
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json(req, { error: 'ANTHROPIC_API_KEY secret is not set', fallback: true }, 503)

  const transcript = (body.transcript ?? [])
    .slice(-24)
    .map((m) => `${m.who === 'you' ? 'USER (to their copy)' : m.who === 'copy' ? 'COPY' : 'COACH'}: ${m.text}`)
    .join('\n')

  const userMsg = `Scene: "${(body.situation || 'a difficult recent moment').slice(0, 300)}" · feeling: ${body.emotion ?? 'Anxiety'} at ${body.intensity ?? 7}/10.
chatStep: ${body.chatStep ?? 0}

Transcript so far (last line is the user's newest message — respond to it):
${transcript}`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
      },
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    })

    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') {
      return json(req, { fallback: true, reason: response.stop_reason }, 200)
    }
    const text = response.content.find((b: { type: string }) => b.type === 'text') as
      | { type: 'text'; text: string }
      | undefined
    if (!text) return json(req, { fallback: true, reason: 'no_text' }, 200)
    return json(req, JSON.parse(text.text), 200)
  } catch (err) {
    console.error('guide error', err)
    return json(req, { fallback: true, reason: 'api_error' }, 200)
  }
})
