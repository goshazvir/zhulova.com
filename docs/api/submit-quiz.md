# POST /api/submit-quiz

Serverless endpoint that persists a completed «Тест: на що ти опираєшся?» quiz
submission (GEO-17, extended by GEO-24). Source: `src/pages/api/submit-quiz.ts`.
Authoritative spec: `docs/architecture/quiz-opora.md` §7, ADRs
`docs/decisions/0001-quiz-opora-architecture.md` #6 and
`docs/decisions/0002-instagram-nick-verification.md`.

## Request

`POST /api/submit-quiz` — `Content-Type: application/json`

```jsonc
{
  "instagram": "@Viktoria.Zh",          // normalized to canonical bare lowercase nick: "viktoria.zh"
  "answers": [                          // exactly 12 items, unique question indices
    { "question": 0, "option": 2 },     // question: 0-11, option: 0-3
    ...
  ]
}
```

- The nick is validated by the shared module `src/utils/quiz/instagram.ts`
  (also used by the QuizApp island): trim, strip one leading `@`, lowercase;
  then 1-30 chars of `[a-z0-9._]`, no leading/trailing dot, no consecutive
  dots. The canonical **bare lowercase** form is what gets stored
  (`instagram_handle`); founder-facing email still displays `@nick`.
- Unknown keys are stripped. Client-computed scores are **never trusted or
  read** — the server resolves `category`/`internal` for every answer from
  `src/utils/quiz/questions.ts` and recomputes `pct`/`band`/`resultType` via
  `src/utils/quiz/scoring.ts`.
- `user-agent` and `referer` request headers are captured into the row
  (nullable).

## Responses

| Status | Body | When |
|---|---|---|
| 200 | `{ "success": true, "resultType": "sebe", "scorePct": 100 }` | Submission captured by DB and/or email |
| 400 | `{ "success": false, "error": "Validation failed", "details": [...] }` | Zod validation failure (wrong answer count, duplicate question index, option/question out of range, invalid nick format, malformed JSON) |
| 400 | `{ "success": false, "error": "instagram_not_found", "message": "Не знаходимо такий акаунт в Instagram — перевір нік" }` | Existence check **confirmed** the account is missing. The island returns the user to the editable nick field, preserving all 12 answers for resubmit |
| 500 | `{ "success": false, "error": "..." }` | Missing env vars, or **both** DB insert and email notification failed |

## Instagram existence check (GEO-24, ADR-0002)

After format validation the server runs a **best-effort** probe
(`src/utils/quiz/instagramCheck.ts`): one GET to
`i.instagram.com/api/v1/users/web_profile_info/?username=<nick>` with the
public `x-ig-app-id` header, hard **2.5s** timeout, exactly one attempt, no
retries. Three outcomes:

| Outcome | Meaning | Effect |
|---|---|---|
| `exists` | HTTP 200 with a user object | Accept; persisted as `instagram_verified = 'exists'` |
| `missing` | HTTP 404, or 200 with `data.user: null` | Reject with `400 instagram_not_found`; nothing persisted |
| `unknown` | Anything else: 403/429/5xx, timeout, network error, malformed JSON | **Accept** (fail-open); persisted as `instagram_verified = 'unknown'` |

**Why `unknown` exists:** Instagram aggressively blocks datacenter IPs
(including Vercel egress). A blocked or timed-out probe proves nothing about
the account — treating it as `missing` would drop real leads whenever
Instagram throttles us. Only a *confirmed* missing account rejects; the check
can never make the endpoint hang (timeout enforced in-module) or return 5xx
(every error maps to `unknown`).

Results are cached per nick in the warm function instance (24h for
`exists`/`missing`, 10min for `unknown`, ~500 entries, oldest evicted).
`instagram_checked_at` records when the outcome was obtained.

## Persistence policy (ADR-0001 #6)

Dual persistence: Supabase insert into `quiz_submissions` (primary, schema in
`docs/db/quiz_submissions.sql`) + Resend notification to `NOTIFICATION_EMAIL`
(secondary: handle, score %, result type).

- DB ok, email fails → `200` (error logged)
- DB fails, email ok → `200` (lead captured via email, error logged)
- Both fail → `500` (client retries once)

## Environment variables

Validated fail-fast on cold start, no fallback values: `SUPABASE_URL`,
`SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
`NOTIFICATION_EMAIL`. Missing vars → `500 Server misconfiguration`.

## Logging

Structured logging via `@utils/logger` (PII sanitization applied). No PII
beyond the Instagram handle is logged; raw answers are never logged.

## Tests

`src/pages/api/_submit-quiz.test.ts` (underscore keeps Astro from routing the
test file as an endpoint) — 41 unit tests (Supabase/Resend/logger and the
Instagram check mocked, TDD-first): success path, server-side recompute,
unknown-key stripping, nick normalization, the existence-check matrix
(exists/unknown accepted, missing → 400, defensive fail-open), the full
validation matrix, header capture, the failure matrix above, and per-variable
env fail-fast. The validator and probe have their own suites:
`src/utils/quiz/instagram.test.ts` (23) and
`src/utils/quiz/instagramCheck.test.ts` (18 — fetch always mocked; **no test
ever contacts real Instagram**). The live-table round-trip is covered in QA
verification (GEO-19).
