// CameraView belief — stage-5 helper: drafts a truer belief from the live
// session transcript and self-checks the user's current wording.
import Anthropic from 'npm:@anthropic-ai/sdk@0.111.0'
import { corsHeaders, json, preflight } from '../_shared/cors.ts'

const MODEL = 'claude-sonnet-5'

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    drafts: {
      type: 'array',
      items: { type: 'string' },
      description: "3 candidate beliefs, ≤ 70 chars each, first person, in the user's language.",
    },
    check_text: {
      type: 'string',
      description: "One-sentence reaction to the user's current belief wording, in the user's language.",
    },
    check_kind: {
      type: 'string',
      enum: ['strong', 'others', 'neutral'],
      description: 'strong = lives inside the user and is sturdy; others = leans on other people/luck; neutral = true but could be stronger.',
    },
  },
  required: ['drafts', 'check_text', 'check_kind'],
  additionalProperties: false,
} as const

const SYSTEM = `You help a CameraView user distill a new belief at the end of a self-distancing session. A good belief: first person, lives inside the user (not in other people's hands, not luck), honest (no toxic positivity), short, sayable out loud. Style examples: "Criticism stings, but it doesn't define my worth." / "I can handle moments like this — I've done it before." Mirror the user's language. check_text speaks directly to the user about their current wording, one warm sentence, in the style: "Lives inside you — and it's strong. Keep it." / "This leans on other people. Can it live inside you instead?" / "True and calm. Could it be stronger — what do you know you can do?"`

Deno.serve(async (req: Request) => {
  const pf = preflight(req)
  if (pf) return pf
  if (req.method !== 'POST') return json(req, { error: 'POST only' }, 405)

  let body: {
    situation?: string
    emotion?: string
    oldBelief?: string
    currentBelief?: string
    transcript?: { who: string; text: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'invalid JSON' }, 400)
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json(req, { fallback: true, reason: 'no_key' }, 200)

  const transcript = (body.transcript ?? [])
    .slice(-24)
    .map((m) => `${m.who.toUpperCase()}: ${m.text}`)
    .join('\n')

  const userMsg = `Situation: "${(body.situation || '').slice(0, 300)}" · emotion: ${body.emotion ?? ''}.
Old belief being replaced: "${body.oldBelief ?? ''}"
User's current draft: "${body.currentBelief ?? ''}"

Session transcript:
${transcript}

Produce 3 belief drafts grounded in what the copy actually said (especially any strength that surfaced), and check the user's current draft.`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
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
    console.error('belief error', err)
    return json(req, { fallback: true, reason: 'api_error' }, 200)
  }
})
