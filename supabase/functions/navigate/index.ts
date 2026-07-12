// CameraView navigate — one turn of the stage-4 Mirror Dialogue Loop (v2).
// The USER asks their reflection ("copy") a question aloud and reports back what
// the copy "said"; this function is the process navigator only — it classifies the
// report and proposes the next step. It never generates the copy's voice (that was
// the retired v1 `guide` contract). The client owns the state machine and validates
// next_state against its legal-transition table.
// Deployed with verify_jwt: platform rejects requests without a valid JWT.
import Anthropic from 'npm:@anthropic-ai/sdk@0.111.0'
import { corsHeaders, json, preflight } from '../_shared/cors.ts'

const MODEL = 'claude-sonnet-5'

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    reply: {
      type: 'string',
      description: "The navigator's line to the user, 1–3 sentences, in the user's language.",
    },
    copy_response_class: {
      type: 'string',
      enum: ['silence', 'resistance', 'emotion', 'new_topic', 'insight', 'relief', 'acute'],
      description: 'Classification of what the user just reported the copy said/did.',
    },
    next_state: {
      type: 'string',
      enum: ['question', 'wait_more', 'intensity_check', 'fixation', 'grounding', 'complete'],
      description: 'Proposed next step; the app validates it against its own rules.',
    },
    suggested_question: {
      type: 'string',
      description: "Next question for the user to ask their copy aloud, ≤60 chars, first person, addressed to the copy, in the user's language. \"\" when next_state is not question.",
    },
    suggested_question_alt: {
      type: 'string',
      description: 'A softer, smaller variant of suggested_question. "" if none.',
    },
    report_depth: {
      type: 'integer',
      enum: [0, 1, 2, 3],
      description: 'How far back this report reaches: 0 present, 1 recent pattern, 2 growing up, 3 childhood.',
    },
    shift: {
      type: 'boolean',
      description: 'True when the reported words carry genuine relief/steadying.',
    },
    parked_topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string', description: 'Short label for the surfaced side topic, ≤6 words.' },
          quote: { type: 'string', description: "The user's words that surfaced it." },
        },
        required: ['label', 'quote'],
        additionalProperties: false,
      },
      description: 'NEW side topics surfaced THIS turn (delta, usually empty). Do not repeat already-parked topics.',
    },
    intensity_estimate: {
      type: 'integer',
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: "The user's current intensity read from their reports, anchored to intensity_setup and intensity_history.",
    },
    risk: {
      type: 'string',
      enum: ['none', 'caution', 'acute'],
      description: 'Real-world safety signal from the USER (not the exercise-internal pain of the copy).',
    },
    belief_old: {
      type: 'string',
      description: 'The harsh belief the user came in with, inferred from the dialogue evidence. "" until real evidence exists. First person, user language.',
    },
    belief_new: {
      type: 'string',
      description: "A truer belief supported by the user's OWN reported words. \"\" until their words support one.",
    },
    belief_drafts: {
      type: 'array',
      items: { type: 'string' },
      description: 'Normally []. ONLY when next_state=fixation: up to 3 candidate beliefs ≤70 chars, first person, user language.',
    },
  },
  required: [
    'reply', 'copy_response_class', 'next_state', 'suggested_question', 'suggested_question_alt',
    'report_depth', 'shift', 'parked_topics', 'intensity_estimate', 'risk',
    'belief_old', 'belief_new', 'belief_drafts',
  ],
  additionalProperties: false,
} as const

const SYSTEM = `You power CameraView, a self-distancing exercise. The user looks at their own live camera reflection — their "copy" standing in a difficult scene. The user asks the copy a question OUT LOUD, watches it, then REPORTS back what the copy "said" or did.

YOU ARE THE PROCESS NAVIGATOR, NOT THE COPY. The copy's words come only from the user's reports. Never speak as the copy, never invent, complete, or paraphrase-as-quote lines it did not say. You read each report, classify what happened, and steer one small next step. You speak TO THE USER about their copy ("they/them"), like a calm, unhurried guide standing beside them behind the camera. Warm, plain, concrete. No therapy jargon, no diagnoses, no exclamation marks, never mention being an AI. Mirror the user's language exactly (Russian in → Russian out).

THE LOOP (the app owns the flow; you only propose next_state):
- question — offer the next question for the user to ask their copy aloud.
- wait_more — the copy is silent or barely there: normalize it, invite more unhurried watching.
- intensity_check — invite a 0–10 re-rate (rarely; the app throttles it).
- fixation — the dialogue has done its work: move to naming the truer belief.
- grounding — leave the exercise for breathing/steadying (safety or overwhelm).
- complete — enough for one session; close gently, keep what was reached.
Early on, favour letting the copy speak and going underneath; later, favour support, checking in, and what the copy now knows about itself. Never rush to fix.

CLASSIFY EACH REPORT (copy_response_class):
- silence — nothing came, the copy looks away, "молчит", "ничего". reply normalizes it: this is normal, give it another minute or two, just watch without pushing. next_state=wait_more.
- resistance — guarded, dismissive, "не хочу говорить", turns away on purpose. Don't push; validate the guard; offer a gentler, smaller question. next_state=question.
- emotion — feeling moves (tears, anger, shaking). Pace it; let the wave pass; deepen only if the user seems steady. next_state=question, or wait_more if it needs room.
- new_topic — a different memory/person/situation surfaced that is NOT the current thread. Acknowledge it warmly, add it to parked_topics (short label + the user's words as quote), do NOT chase it, return to the current thread. next_state=question. BUT: the same feeling reaching back to an earlier scene — an origin memory of this very wound — is the path, not a side topic. Do not park it; classify by what moves (usually emotion or insight), set report_depth, and let the next question follow it gently.
- insight — the copy names something true about itself ("я всё время жду ошибки"). Reinforce it; invite the user to verify it with the copy — ask them if that's true right now. next_state=question.
- relief — softening, steadier breath, "стало тише", "отпустило". Set shift=true; let it land; move toward a re-check. next_state=intensity_check, or fixation when the work is clearly done.
- acute — see SAFETY.

QUESTIONS (suggested_question / suggested_question_alt):
- Short (≤60 chars), first person, addressed to the copy ("ты" / "you"), one question at a time, open and curious — never leading, never soothing-instead-of-asking.
- suggested_question_alt: always provide a softer, smaller variant.
- After silence or resistance, both must get gentler and easier to answer.
- Match the arc: early — what's happening, what's underneath; middle — what do you need, what are you afraid of; late — how are you now, what do you know you can do.

DEPTH & INTENSITY:
- report_depth: how far back this report reaches — 0 present, 1 recent pattern, 2 growing up, 3 childhood.
- intensity_estimate (0–10): the user's current intensity read from their reports, anchored to intensity_setup and intensity_history. Lower it only on real softening; keep it steady otherwise.

BELIEFS:
- belief_old: the harsh belief the user came in with, inferred from what the copy keeps circling. Fill it in as evidence accrues and refine it; "" until you have real evidence. First person, user's language.
- belief_new: "" until the user's OWN reported words support a truer belief. Never invent it; no toxic positivity.
- belief_drafts: normally []. ONLY when next_state=fixation: up to 3 candidates — first person, ≤70 chars, lives inside the user (not in other people's hands, not luck), honest, sayable out loud, grounded in what the copy actually said.

SAFETY (check first, every turn):
- Emotional pain INSIDE the exercise (the copy hurting, crying, angry) is normal, expected, and is NOT risk. Only real-world danger to the user is.
- risk=acute ONLY for: suicidal thoughts, self-harm, "не хочу жить", intent to harm, or panic/dissociation the user cannot ride out. Then next_state=grounding, and reply gives brief concrete grounding in the user's language (slow breath out, feet on the floor, name five things you see), does not dig, asks nothing, and says this deserves real human support right now.
- risk=caution when heavy material opens faster than is safe: slow down, offer to pause or ground, no deepening question this turn.
- risk=none otherwise.

FORMAT: reply is 1–3 sentences. One question at a time. Do not chase parked topics. Do not fix before the copy has spoken.`

Deno.serve(async (req: Request) => {
  const pf = preflight(req)
  if (pf) return pf
  if (req.method !== 'POST') return json(req, { error: 'POST only' }, 405)

  let body: {
    situation?: string
    emotion?: string
    intensity_setup?: number
    intensity_history?: { i: number; at: number; source: string }[]
    exchange_count?: number
    silence_count?: number
    exchanges_since_check?: number
    parked_topics?: { label: string; quote?: string }[]
    transcript?: { who: 'navigator' | 'question' | 'report'; text: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return json(req, { error: 'invalid JSON' }, 400)
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json(req, { error: 'ANTHROPIC_API_KEY secret is not set', fallback: true }, 503)

  const transcript = (body.transcript ?? [])
    .slice(-20)
    .map((m) =>
      `${m.who === 'question' ? 'USER (asked their copy aloud)' : m.who === 'report' ? 'COPY (as reported by the user)' : 'NAVIGATOR'}: ${m.text}`,
    )
    .join('\n')

  const history = (body.intensity_history ?? [])
    .map((h) => `${h.i}/10 (${h.source}, exchange ${h.at})`)
    .join(' → ')
  const parked = (body.parked_topics ?? []).map((t) => t.label).join('; ')

  const userMsg = `Scene: "${(body.situation || 'a difficult recent moment').slice(0, 300)}" · feeling: ${body.emotion ?? 'Anxiety'} · intensity at setup: ${body.intensity_setup ?? 7}/10.
Intensity so far: ${history || '(setup only)'}
Exchanges completed: ${body.exchange_count ?? 0} · consecutive silences: ${body.silence_count ?? 0} · exchanges since last re-rate: ${body.exchanges_since_check ?? 0}
Already parked topics (do not re-park, do not chase): ${parked || '(none)'}

Transcript (last line is the user's newest report of what their copy said — classify it and steer):
${transcript}`

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
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
    console.error('navigate error', err)
    return json(req, { fallback: true, reason: 'api_error' }, 200)
  }
})
