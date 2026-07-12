-- Mirror Dialogue Loop: additive session fields (all nullable/defaulted so
-- old app builds that omit them keep inserting cleanly).
-- Applied to the remote project (nmiypjoafwfscflpbkzv) on 2026-07-11 via MCP.
-- NOTE: the pre-existing schema (profiles/sessions/threads_cache + RLS) predates
-- this migrations folder and lives remote-only; baseline it with `supabase db pull`
-- before adding further DDL here.
alter table public.sessions
  add column if not exists intensity_checkpoints jsonb not null default '[]'::jsonb,
  add column if not exists outcome text,
  add column if not exists loop_stats jsonb not null default '{}'::jsonb,
  add column if not exists old_belief_source text;

alter table public.sessions drop constraint if exists sessions_outcome_chk;
alter table public.sessions
  add constraint sessions_outcome_chk
  check (outcome is null or outcome in ('completed','partial','safety_stopped','abandoned'));

alter table public.sessions drop constraint if exists sessions_old_belief_source_chk;
alter table public.sessions
  add constraint sessions_old_belief_source_chk
  check (old_belief_source is null or old_belief_source in ('inferred','confirmed','edited'));
