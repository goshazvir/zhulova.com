-- Bootstrap: full database schema for the zhulova Supabase project (GEO-23)
-- Single consolidated file for pasting into the Supabase SQL Editor when no
-- direct psql connection string is available.
--
-- KEEP IN SYNC with the per-table files (they are the source of truth):
--   - docs/db/leads.sql
--   - docs/db/quiz_submissions.sql
--
-- Idempotent: safe to re-run on a project where some tables already exist.
-- Access posture for ALL tables: RLS enabled with ZERO policies — reads and
-- writes go through the service-role key only (serverless functions). The
-- anon key must see nothing.

-- ============================================
-- leads (consultation form, /api/submit-lead)
-- ============================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) >= 2),
  phone text not null,
  telegram text,                  -- normalized to "@handle" by the API
  email text,
  source text not null default 'consultation_modal',
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- ============================================
-- quiz_submissions (quiz «Опора», /api/submit-quiz)
-- ============================================

create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_slug text not null default 'opora',
  instagram_handle text not null,
  answers jsonb not null,          -- [{"question":0,"option":2,"category":"sebe","internal":3}, ...] (12 items)
  score_internal smallint not null check (score_internal between 0 and 36),
  score_pct smallint not null check (score_pct between 0 and 100),
  band text not null,              -- band key by min threshold: "70" | "45" | "25" | "0"
  result_type text not null check (result_type in ('mama','tato','rodyna','partner','kontrol','sebe')),
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.quiz_submissions enable row level security;
create index if not exists quiz_submissions_created_at_idx
  on public.quiz_submissions (created_at desc);
