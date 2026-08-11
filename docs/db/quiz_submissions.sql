-- Migration: create quiz_submissions table (GEO-15)
-- Authoritative spec: docs/architecture/quiz-opora.md §6 (SQL verbatim)
-- ADR: docs/decisions/0001-quiz-opora-architecture.md
--
-- Access posture: service-role key only. RLS enabled with ZERO policies —
-- identical to the existing `leads` table. Anon key must see nothing.
--
-- How to apply: paste this file into the Supabase SQL editor and run it.
-- Verification: node .claude/scripts/test-quiz-submissions.js

create table public.quiz_submissions (
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
-- No policies: service key (server) only, same as leads.
create index quiz_submissions_created_at_idx on public.quiz_submissions (created_at desc);
