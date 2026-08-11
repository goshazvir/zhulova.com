# POST /api/submit-quiz

Serverless endpoint that persists a completed «Тест: на що ти опираєшся?» quiz
submission (GEO-17). Source: `src/pages/api/submit-quiz.ts`.
Authoritative spec: `docs/architecture/quiz-opora.md` §7, ADR
`docs/decisions/0001-quiz-opora-architecture.md` #6.

## Request

`POST /api/submit-quiz` — `Content-Type: application/json`

```jsonc
{
  "instagram": "viktoria.zh",          // ^@?[a-zA-Z0-9._]{2,30}$ — normalized to leading @
  "answers": [                          // exactly 12 items, unique question indices
    { "question": 0, "option": 2 },     // question: 0-11, option: 0-3
    ...
  ]
}
```

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
| 400 | `{ "success": false, "error": "Validation failed", "details": [...] }` | Zod validation failure (wrong answer count, duplicate question index, option/question out of range, invalid handle, malformed JSON) |
| 500 | `{ "success": false, "error": "..." }` | Missing env vars, or **both** DB insert and email notification failed |

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

`src/pages/api/submit-quiz.test.ts` — 30 unit tests (Supabase/Resend/logger
mocked, TDD-first): success path, server-side recompute, unknown-key
stripping, handle normalization, the full validation matrix, header capture,
the failure matrix above, and per-variable env fail-fast. The live-table
round-trip is covered in QA verification (GEO-19).
