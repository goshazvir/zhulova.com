# Database schema (Supabase)

The entire database is reproducible from this directory — schema as code.
Target: the founder's NEW Supabase org, project `zhulova` (the old project
`lulajggsrmfzcrnnrhwn` is paused and abandoned; its data is NOT migrated —
fresh start, see GEO-23).

## Files

| File | Purpose |
|------|---------|
| `leads.sql` | `leads` table — consultation form (`/api/submit-lead`) |
| `quiz_submissions.sql` | `quiz_submissions` table — quiz «Опора» (`/api/submit-quiz`, GEO-15) |
| `bootstrap.sql` | Consolidated, idempotent copy of all tables for the SQL Editor |

`bootstrap.sql` must be kept in sync with the per-table files; the per-table
files are the source of truth.

## Access posture (all tables)

RLS is **enabled with zero policies**. Only the service-role key (used by the
serverless functions) can read or write; the anon key sees nothing. Never add
policies that open tables to the anon role.

## How to apply

Two supported paths — pick one:

1. **psql (preferred, needs `SUPABASE_DB_URL`)** — a Postgres connection
   string from Supabase Dashboard → Project Settings → Database:

   ```bash
   psql "$SUPABASE_DB_URL" -f docs/db/bootstrap.sql
   ```

2. **Supabase SQL Editor (no CLI access needed)** — paste the contents of
   `docs/db/bootstrap.sql` into Dashboard → SQL Editor → Run. The file is
   idempotent (`create table if not exists`), safe to re-run.

## Verification

With `.env` pointing at the target project:

```bash
node .claude/scripts/test-supabase.js          # leads: connection + CRUD round-trip
node .claude/scripts/test-quiz-submissions.js  # quiz_submissions: insert + read
```

End-to-end (Definition of Done for GEO-23): submit the consultation form and
complete the quiz on local dev (`npm run dev`), then confirm one new row in
`leads` and one in `quiz_submissions`.

## Environment variables

Required by the app (see `.env.example`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_KEY`. Optional, only for applying schema via psql:
`SUPABASE_DB_URL`. The same three app variables must be set in Vercel
(production + preview) when the project is switched.
