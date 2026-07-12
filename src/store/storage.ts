// Local-first storage + Supabase sync for CameraView.
//
// The store (logic.core.js) is synchronous, so all reads here are synchronous
// too: a versioned localStorage cache seeds freshState() on first render, and
// the network reconciles it afterwards via hydrate()/flushQueue().
//
// Sessions are append-only: insert on save, queue on failure, flush on
// reconnect. Profile/settings are last-write-wins with a debounce.
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'

const CACHE_KEY = 'cv:v1:cache'

export const MOCK = import.meta.env.VITE_MOCK_AUTH === '1'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// PKCE so the OAuth code can come back via a deep link on iOS (and a plain
// redirect on the web); detectSessionInUrl auto-exchanges the web callback.
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
      })
    : null

// Dev-only console handle for debugging auth/sync (not shipped in prod builds)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  ;(window as unknown as { __sb: SupabaseClient | null }).__sb = supabase
}

export interface SessionRow {
  id: string
  started_at: string
  ended_at: string | null
  duration_min: number | null
  situation: string | null
  emotion: string | null
  intensity: number | null
  after_intensity: number | null
  old_belief: string | null
  belief: string | null
  shift: string | null
  chat: unknown[]
  moments: unknown[]
  topics: unknown[]
  // Mirror Dialogue Loop (v2) — optional so pre-loop rows keep hydrating cleanly
  intensity_checkpoints?: { i: number; at: number; source: string }[]
  outcome?: 'completed' | 'partial' | 'safety_stopped' | 'abandoned' | null
  loop_stats?: Record<string, number>
  old_belief_source?: 'inferred' | 'confirmed' | 'edited' | null
}

export interface Settings {
  voiceOn?: boolean
  voiceSpeed?: number
  haptics?: boolean
  transcripts?: boolean
  remind?: boolean
  plan?: string
}

export interface Cache {
  v: number
  authed: boolean
  userId: string | null
  email: string | null
  displayName: string | null
  onboarded: boolean
  settings: Settings
  sessions: SessionRow[]
  threads: Record<string, unknown> | null
  queue: SessionRow[]
}

const DEFAULT_CACHE: Cache = {
  v: 1,
  authed: false,
  userId: null,
  email: null,
  displayName: null,
  onboarded: false,
  settings: {},
  sessions: [],
  threads: null,
  queue: [],
}

export function loadCache(): Cache {
  if (MOCK) {
    // Mock mode: a fake signed-in local user; data still persists locally.
    const c = readRaw()
    return { ...c, authed: true, userId: c.userId ?? 'mock-user', displayName: c.displayName ?? 'Alex' }
  }
  return readRaw()
}

function readRaw(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return { ...DEFAULT_CACHE }
    const parsed = JSON.parse(raw) as Cache
    if (parsed.v !== 1) return { ...DEFAULT_CACHE }
    return { ...DEFAULT_CACHE, ...parsed }
  } catch {
    return { ...DEFAULT_CACHE }
  }
}

export function saveCache(patch: Partial<Cache>): Cache {
  const next = { ...readRaw(), ...patch }
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(next))
  } catch {
    /* storage full/unavailable — keep going in memory */
  }
  return next
}

export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* noop */
  }
}

// ── auth ────────────────────────────────────────────────────────────────

export async function sendOtp(email: string): Promise<{ error?: string }> {
  if (MOCK || !supabase) return {}
  const { error } = await supabase.auth.signInWithOtp({ email })
  return error ? { error: error.message } : {}
}

export async function verifyOtp(email: string, code: string): Promise<{ error?: string }> {
  if (MOCK || !supabase) return {}
  const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
  if (error || !data.user) return { error: error?.message ?? 'Verification failed' }
  saveCache({ authed: true, userId: data.user.id, email: data.user.email ?? email })
  return {}
}

export async function signOutRemote(): Promise<void> {
  if (MOCK || !supabase) return
  try {
    await supabase.auth.signOut()
  } catch {
    /* token may already be dead — local clear is what matters */
  }
}

// ── OAuth (Apple / Google) ──────────────────────────────────────────────

// Registered in Info.plist (CFBundleURLTypes) and in the Supabase dashboard
// redirect allowlist. On iOS the OAuth pages open in SFSafariViewController
// (Google forbids embedded webviews) and come back through this deep link.
const NATIVE_REDIRECT = 'cameraview://auth-callback'

export async function signInWithProvider(provider: 'apple' | 'google'): Promise<{ error?: string }> {
  if (MOCK || !supabase) return {}
  const native = Capacitor.isNativePlatform()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: native ? NATIVE_REDIRECT : window.location.origin,
      skipBrowserRedirect: native,
    },
  })
  if (error) return { error: error.message }
  if (native && data?.url) {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url: data.url })
  }
  return {}
}

/** Exchange the PKCE code from the deep-link callback for a session. */
export async function handleAuthCallback(callbackUrl: string): Promise<boolean> {
  if (!supabase) return false
  let code: string | null = null
  try {
    code = new URL(callbackUrl).searchParams.get('code')
  } catch {
    return false
  }
  if (!code) return false
  try {
    const { Browser } = await import('@capacitor/browser')
    await Browser.close()
  } catch {
    /* browser sheet may already be gone */
  }
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  return !error
}

/** Fires on real sign-ins (OAuth redirect, deep link, OTP) — not on restores. */
export function onAuthChange(cb: () => void): void {
  supabase?.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') cb()
  })
}

// ── sync ────────────────────────────────────────────────────────────────

/** Pull profile + sessions + threads cache for the signed-in user. Null if not authed. */
export async function hydrate(): Promise<Partial<Cache> | null> {
  if (MOCK || !supabase) return null
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return null

  const [profileRes, sessionsRes, threadsRes] = await Promise.all([
    supabase.from('profiles').select('display_name, onboarded, settings').eq('id', user.id).maybeSingle(),
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(200),
    supabase.from('threads_cache').select('roots, session_points, n_sessions, computed_at').eq('user_id', user.id).maybeSingle(),
  ])

  const patch: Partial<Cache> = {
    authed: true,
    userId: user.id,
    email: user.email ?? null,
    displayName: profileRes.data?.display_name ?? null,
    onboarded: profileRes.data?.onboarded ?? false,
    settings: (profileRes.data?.settings as Settings) ?? {},
    sessions: (sessionsRes.data as SessionRow[]) ?? [],
    threads: (threadsRes.data as Record<string, unknown>) ?? null,
  }
  saveCache(patch)
  return patch
}

/** Persist a finished session: cache immediately, insert remotely, queue on failure. */
export async function pushSession(row: SessionRow): Promise<void> {
  const cache = readRaw()
  saveCache({ sessions: [row, ...cache.sessions] })
  if (MOCK || !supabase) return
  try {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) throw new Error('not authed')
    const { error } = await supabase.from('sessions').insert({ ...row, user_id: user.id })
    if (error) throw error
  } catch {
    saveCache({ queue: [...readRaw().queue, row] })
  }
}

export async function flushQueue(): Promise<void> {
  if (MOCK || !supabase) return
  const { queue } = readRaw()
  if (!queue.length) return
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return
  const remaining: SessionRow[] = []
  for (const row of queue) {
    const { error } = await supabase
      .from('sessions')
      .upsert({ ...row, user_id: user.id }, { onConflict: 'id' })
    if (error) remaining.push(row)
  }
  saveCache({ queue: remaining })
}

let settingsTimer: ReturnType<typeof setTimeout> | undefined

/** Debounced last-write-wins persist of profile fields. Cache is written immediately. */
export function saveProfileDebounced(fields: { settings?: Settings; displayName?: string; onboarded?: boolean }): void {
  const patch: Partial<Cache> = {}
  if (fields.settings) patch.settings = { ...readRaw().settings, ...fields.settings }
  if (fields.displayName !== undefined) patch.displayName = fields.displayName
  if (fields.onboarded !== undefined) patch.onboarded = fields.onboarded
  saveCache(patch)
  if (MOCK || !supabase) return
  clearTimeout(settingsTimer)
  settingsTimer = setTimeout(async () => {
    const { data: userData } = await supabase!.auth.getUser()
    const user = userData?.user
    if (!user) return
    const cache = readRaw()
    await supabase!
      .from('profiles')
      .upsert({
        id: user.id,
        settings: cache.settings,
        display_name: cache.displayName,
        onboarded: cache.onboarded,
        updated_at: new Date().toISOString(),
      })
  }, 1200)
}

// ── edge functions ──────────────────────────────────────────────────────

/**
 * Call a CameraView edge function. Returns the parsed payload, or null when
 * the caller should use its scripted/local fallback (offline, error, or the
 * function itself asked for fallback).
 */
export async function callFn<T = Record<string, unknown>>(name: string, body: Record<string, unknown>): Promise<T | null> {
  if (!supabase) return null
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return null
  try {
    const { data, error } = await supabase.functions.invoke(name, { body })
    if (error) return null
    if (data && typeof data === 'object' && (data as { fallback?: boolean }).fallback) return null
    return data as T
  } catch {
    return null
  }
}
