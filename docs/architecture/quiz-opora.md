# Quiz «Тест: на що ти опираєшся?» — Technical Shaping (GEO-7)

**Author:** CTO · **Date:** 2026-08-11 · **Status:** Approved for BA slicing
**Reference:** `docs/reference/test_opora.html` (content/logic source only — do NOT embed/iframe)

## 1. Overview

Native quiz funnel page on zhulova.com: intro (with Instagram-handle gate) → 12 questions
(one at a time, back navigation, progress 01/12) → persisted submission → result screen with
course CTA («Опора на себе» bot) and diagnostic booking link. All copy in Ukrainian, taken
verbatim from the reference HTML.

**Primary business goal:** lead capture. Every completed quiz MUST be persisted with the
contact and full answers.

## 2. URL & navigation

- **URL:** `/quiz/opora` (namespace allows future quizzes). Page is indexable, static (SSG).
- **Navigation:** NOT added to Header/Footer nav — this is a campaign landing shared via
  Instagram. Founder can request a nav link later (one-line change); flag the question to the
  founder in shaping review, do not block on it.

## 3. Page architecture

| Piece | Location | Notes |
|---|---|---|
| Page | `src/pages/quiz/opora.astro` | Static, `BaseLayout` + SEO props; minimal chrome (logo-only header or Header variant — Designer decides), Footer `legal` variant |
| Quiz island | `src/components/quiz/QuizApp.tsx` + subcomponents | React 18, `client:load` (quiz IS the page content), Tailwind + `@design-system` primitives (Button, Input, Card, Heading, Text) |
| Quiz content | `src/utils/quiz/questions.ts` | Canonical 12 questions / options / categories / internal scores + result copy (ARCH, BANDS) as typed constants. Single source of truth shared by island AND API |
| Scoring | `src/utils/quiz/scoring.ts` | Pure functions, no DOM. Unit-tested FIRST (TDD) |
| API | `src/pages/api/submit-quiz.ts` | `export const prerender = false` (Astro 5 static mode — mandatory), Zod validation, Supabase insert, Resend notification |

**Island state machine:** `intro → question(0..11) → submitting → result | error`.
Answers stored in local component state (no Zustand needed — single island, no cross-island
state). Back navigation preserves previous answers (reference behavior).

**Flow:** on answering question 12 the island POSTs `/api/submit-quiz`, then shows the result.
If the POST fails: retry once automatically; on second failure still show the result (UX first)
— the lead-loss event is logged server/client-side. Result is computed client-side for instant
display; the API **recomputes** score/type server-side from the raw answers and stores its own
values (client payload of computed scores is never trusted).

## 4. Scoring model (from reference, verbatim behavior)

- 6 categories: `mama, tato, rodyna, partner, kontrol, sebe`. Each of 12 answers carries
  `category` + `internal` score (0–3). `MAX_INTERNAL = 36`.
- `pct = round(sum(internal) / 36 * 100)`.
- Band by threshold: `>=70`, `>=45`, `>=25`, `>=0` (first match).
- Result type: `sebe` if `pct >= 70` OR (`pct >= 50` AND `count(sebe) >= max(externalCounts) + 2`);
  otherwise the dominant external category with **first-wins tie-break in order
  `mama, tato, rodyna, partner, kontrol`** (must be preserved exactly — it is observable behavior).

Unit tests must cover: pct math, each band boundary (70/69, 45/44, 25/24, 0), sebe-override
rule (both branches, boundary pct=50, `+2` margin), external tie-break order, full-answer
fixtures for each of the 6 result types.

## 5. Contact capture

Mirror the reference exactly: **required Instagram handle** on the intro screen
(«Підтверди, що ти не бот», placeholder `@твій нік в інстаграмі`), validated
`^@?[a-zA-Z0-9._]{2,30}$` (normalized to leading `@`), error «Впиши свій нік, щоб почати».
No extra email step — keeps funnel friction at reference level. The handle is submitted
together with answers on completion. (Decision recorded in ADR-0001.)

> **Superseded in part by ADR-0002 (GEO-24):** canonical handle form is now a bare
> lowercase nick (strip `@`, trim, lowercase; 1–30 chars, no leading/trailing/double dots)
> via shared `src/utils/quiz/instagram.ts`, plus a server-side best-effort existence check
> (`exists` / `missing` / `unknown`) persisted as `instagram_verified` +
> `instagram_checked_at` on `quiz_submissions`. Only `missing` rejects; `unknown` is
> accepted so no lead is lost when Instagram blocks the probe. See
> `docs/decisions/0002-instagram-nick-verification.md`.

## 6. Data model (Supabase)

New table `quiz_submissions` (service-role access only, RLS enabled, no anon policies —
same posture as `leads`):

```sql
create table public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_slug text not null default 'opora',
  instagram_handle text not null,
  answers jsonb not null,          -- [{"question":0,"option":2,"category":"sebe","internal":3}, ...] (12 items)
  score_internal smallint not null check (score_internal between 0 and 36),
  score_pct smallint not null check (score_pct between 0 and 100),
  band text not null,              -- band key by min threshold: "70" | "45" | "25" | "0"
  result_type text not null check (result_type in ('mama','tato','rodyna','partner','kontrol','sebe')),
  -- Best-effort Instagram existence check (GEO-24, ADR-0002):
  -- 'unknown' = probe blocked/timed out — proves nothing about the account.
  instagram_verified text not null default 'unknown'
    check (instagram_verified in ('exists','missing','unknown')),
  instagram_checked_at timestamptz,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.quiz_submissions enable row level security;
-- No policies: service key (server) only, same as leads.
create index quiz_submissions_created_at_idx on public.quiz_submissions (created_at desc);
```

Run via Supabase SQL editor; the executable migrations live in
`docs/db/quiz_submissions.sql` and `docs/db/bootstrap.sql` (kept in sync with this doc).

**Founder visibility:** rows readable in Supabase Table Editor (sorted by `created_at`);
CSV export available there natively. Additionally every submission triggers a **Resend email
notification** to `NOTIFICATION_EMAIL` (same mechanism as `submit-lead`) with handle, %,
result type — founder sees leads without opening Supabase. A dedicated admin/export page is
explicitly out of scope for v1 (propose as follow-up if founder asks).

## 7. API contract

`POST /api/submit-quiz` — body:

```ts
{
  instagram: string,                 // validated via shared instagram.ts → canonical bare lowercase nick (ADR-0002)
  answers: Array<{ question: number /* 0-11 */, option: number /* 0-3 */ }> // exactly 12, no duplicates
}
```

Server resolves `category`/`internal` from `questions.ts` (never trusts client scores),
runs the best-effort Instagram existence check (`instagramCheck.ts`, fail-open — see §5
and ADR-0002), recomputes pct/band/type, inserts row, sends Resend notification. Responses:
`200 {success, resultType, scorePct}` · `400` validation ·
`400 {error: "instagram_not_found", message}` when the account is confirmed missing
(the island returns to the nick field, answers preserved) · `500` server error.
Persistence policy: DB insert is primary; Resend failure is non-fatal (logged). If DB fails
but email succeeds → still `200` (lead captured via email, error logged). Both fail → `500`
(island retries once). Structured logging via `@utils/logger` — follow `submit-lead.ts` patterns
(env validation on cold start, no fallback values for secrets).

## 8. Environment variables

| Var | Status | Use |
|---|---|---|
| `PUBLIC_OPORA_BOT_URL` | exists | CTA «Забираю курс собі» → same Opora course bot as `courses/opora/success.astro` (correct bot — same course being gifted). Fallback `/contacts` as in success page |
| `PUBLIC_DIAGNOSTIC_BOOKING_URL` | in `.env.example` | «Записатись на діагностику вже зараз»; default fallback `https://calendly.com/` until founder supplies real Calendly link (swap in Vercel env, no code change) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NOTIFICATION_EMAIL` | exist | reused by `/api/submit-quiz` |

Add `PUBLIC_DIAGNOSTIC_BOOKING_URL` to `.env.example` and Vercel.

## 9. Design constraints (for Designer — BEFORE implementation)

Adapt reference visuals to the zhulova design system (navy/gold/sage, Playfair Display +
Inter) — do NOT copy the reference palette (paper/orange/olive) or Manrope. States to design:
intro / question + progress / result / error / loading (submitting). Keep reference UX
mechanics: progress bar + `01 / 12` counter, tappable option cards, back button, animated
result percentage bar, olive/gold CTA panel hierarchy. Respect `prefers-reduced-motion`.

## 10. Quality gates (Definition of Done)

- **TDD:** Vitest unit tests written FIRST for `scoring.ts` (see §4 matrix) and API
  validation/recompute logic (mock Supabase/Resend). Component tests for island state
  transitions (RTL).
- **E2E:** ONE Playwright happy path: intro gate → answer 12 questions → result visible;
  API mocked via `page.route()` per site convention, asserting the request payload
  (12 answers + handle). Real-DB round-trip verified once by QA using the
  `.claude/scripts/test-supabase.js` pattern against `quiz_submissions`.
- **A11y:** axe passes (0 critical). Options are real `<button>`s, focus moves to question
  heading on advance, progress announced via `aria-live=polite`, gate input properly labelled.
- **Performance:** island is page-scoped; bundle stays within 100KB gz JS budget. Lighthouse
  gates already enforce on PR.
- **Docs:** this file kept current; README page list + CLAUDE.md "Existing Pages" updated;
  privacy policy page updated to mention quiz data collection (IG handle + answers) — required
  by issue.
- **In-thread review gates (no separate review issues):** each code task (GEO-16, GEO-17,
  GEO-18) gets an explicit Code Critic APPROVE in its own issue thread before it closes.
  Final verification (manual browser check of `/quiz/opora`, ONE real Supabase round-trip
  into `quiz_submissions` with cleanup, unit + e2e suites green) is part of GEO-19.
  CTO verifies the full DoD on GEO-7 before closing the parent.

## 11. Task routing

Large task → BA sliced per this shaping into subtasks under GEO-7:
GEO-14 design spec (blocks frontend), GEO-15 DB table, GEO-16 questions/scoring (TDD),
GEO-17 submit-quiz endpoint (TDD, after GEO-16), GEO-18 island + page (after GEO-14/16),
GEO-19 Playwright happy path + axe + final verification (after GEO-18), GEO-20 docs &
privacy (after GEO-17/18). Review/QA are in-thread gates, not separate issues.
