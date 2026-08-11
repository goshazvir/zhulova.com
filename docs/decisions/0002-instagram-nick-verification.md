# ADR-0002: Quiz «Опора» — Instagram nick validation & best-effort existence check

**Date:** 2026-08-11 · **Status:** Accepted · **Owner:** CTO · **Issue:** GEO-24 (extends GEO-17)

## Context

The quiz intro gate collects an Instagram nick as the lead contact. The founder requires
(a) strict format validation and (b) a best-effort check that the account actually exists,
with the verification status visible in the DB. Instagram aggressively blocks datacenter
IPs (Vercel functions included), so an existence check can never be authoritative — the
design must guarantee that **no lead is ever lost because Instagram blocked us**.

## Decisions

1. **Canonical handle form = bare lowercase nick (no `@`).** Normalization: trim, strip one
   leading `@`, lowercase. Valid: 1–30 chars of `[a-z0-9._]`, no leading/trailing dot, no
   consecutive dots. This supersedes ADR-0001/§5 ("normalize to leading `@`", `{2,30}`) —
   the bare form is what the check API consumes and is cleaner in the DB. Founder-facing
   email keeps displaying `@nick`.
2. **One shared validator module, `src/utils/quiz/instagram.ts`**, exporting
   `normalizeInstagramNick` + `validateInstagramNick` (pure, no DOM/fetch). Imported by the
   island (instant intro-gate feedback, Ukrainian error message) and by the Zod schema in
   `/api/submit-quiz` (server is authoritative). TDD: validator unit tests written first.
3. **Existence check is server-side only**, in `src/utils/quiz/instagramCheck.ts`:
   single GET to `https://i.instagram.com/api/v1/users/web_profile_info/?username=<nick>`
   with `x-ig-app-id: 936619743392459` + browser User-Agent, `AbortController` hard timeout
   **2.5s**, exactly **one attempt, no retries, no fallback probe** (a second probe doubles
   worst-case latency; rejected). Client never calls Instagram (CORS + secrecy of mechanism).
4. **Three-outcome model** (`exists` | `missing` | `unknown`):
   - HTTP 200 with a user object → `exists`
   - HTTP 404, or 200 with `data.user == null` → `missing`
   - anything else (403/429/5xx, timeout, network error, JSON parse failure) → `unknown`
   `unknown` exists because a blocked/rate-limited probe proves nothing about the account;
   treating it as `missing` would drop real leads whenever IG blocks Vercel egress IPs.
5. **Fail-open policy:** only `missing` rejects — HTTP 400, machine code
   `instagram_not_found`, Ukrainian message («Не знаходимо такий акаунт в Instagram —
   перевір нік»). `exists` and `unknown` are accepted. On 400 the island returns the user
   to an editable nick field **preserving all 12 answers in state** for resubmit (no
   dedicated pre-check endpoint at intro — keeps one submit path and minimal IG traffic).
6. **Persistence:** two columns on `quiz_submissions` —
   `instagram_verified text not null default 'unknown' check (instagram_verified in
   ('exists','missing','unknown'))` and `instagram_checked_at timestamptz`.
   `missing` never persists in practice (rejected pre-insert) but stays in the enum for
   forward-compat (possible future soft-accept). Schema change lands **once** in
   `docs/db/quiz_submissions.sql` + `bootstrap.sql`, coordinated with GEO-15/GEO-23
   (new Supabase project) — CTO owns GEO-23 and folds these columns into the canonical SQL.
7. **Cache & safety:** module-level in-memory `Map<nick, {outcome, at}>` per warm function
   instance (Fluid Compute reuses instances). TTL: 24h for `exists`/`missing`, 10min for
   `unknown` (blocks are transient). Cap ~500 entries, evict oldest. No external cache —
   best-effort semantics don't justify new infrastructure. The check must never make the
   endpoint hang: timeout is enforced inside the module and any thrown error maps to
   `unknown`, never to 5xx.
8. **Testing policy:** mock `fetch` in unit tests (outcome mapping matrix: 200/404/403/
   timeout/malformed JSON; cache TTL; endpoint accept/reject paths). E2E keeps mocking
   `/api/submit-quiz` via `page.route()`. **No test, CI job, or e2e run ever contacts real
   Instagram.**

## Consequences

- Founder sees in Supabase which leads have confirmed accounts (`instagram_verified`).
- A blocked probe costs at most ~2.5s once per nick per instance per TTL window; typical
  submissions are unaffected (cache) and no lead is lost to IG's anti-bot measures.
- Docs to update in the same task: `docs/architecture/quiz-opora.md` §5–§7,
  `docs/api/submit-quiz.md`, `docs/db/quiz_submissions.sql` (+ bootstrap), `.env` docs
  untouched (no new env vars).
