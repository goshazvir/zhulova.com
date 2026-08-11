-- Migration: create leads table (GEO-23)
-- Reconstructed DDL: the original table lives in the old, now-paused Supabase
-- project and cannot be inspected. Derived from:
--   - src/pages/api/submit-lead.ts (actual insert shape — authoritative)
--   - specs/002-home-page/data-model.md (original spec)
--
-- Access posture: service-role key only. RLS enabled with ZERO policies —
-- identical to quiz_submissions. Anon key must see nothing.
--
-- Deviations from specs/002-home-page/data-model.md, on purpose:
--   - The spec's CHECK constraints (phone '^\+380\d{9}$', telegram min 5 chars)
--     are stricter than the API's Zod validation (any 7+ digit phone, telegram
--     min 3 chars). The DB must never reject a row the API accepted, so only
--     Zod-compatible checks are kept. Validation lives in the API layer.
--   - No updated_at: nothing reads or writes it and there is no update trigger.
--   - gen_random_uuid() (built into Postgres 13+) instead of uuid_generate_v4()
--     to avoid the uuid-ossp extension dependency.
--
-- How to apply: see docs/db/README.md (psql or Supabase SQL editor).
-- Verification: node .claude/scripts/test-supabase.js

create table public.leads (
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
-- No policies: service key (server) only, same as quiz_submissions.
create index leads_created_at_idx on public.leads (created_at desc);
