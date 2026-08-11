# ADR-0001: Quiz «Опора» — architecture decisions

**Date:** 2026-08-11 · **Status:** Accepted · **Owner:** CTO · **Issue:** GEO-7

## Context

zhulova.com needs an interactive 12-question quiz («Тест: на що ти опираєшся?») with
mandatory lead capture. Reference: `docs/reference/test_opora.html`. Site is Astro static
(SSG) + React islands + Vercel serverless API + Supabase/Resend.

## Decisions

1. **URL `/quiz/opora`, not in main nav.** Campaign landing distributed via Instagram;
   `/quiz/` namespace reserves room for future tests. Nav link is a founder call, deferred.
2. **Single React island (`client:load`), no Zustand.** The quiz is the whole page; local
   component state is sufficient. Keeps global JS budget intact — no other page pays for it.
3. **Canonical quiz data + pure scoring module shared by client and server.**
   `src/utils/quiz/questions.ts` + `scoring.ts` are imported by both the island and
   `/api/submit-quiz`. Client computes for instant UX; **server recomputes from raw answers
   and stores only its own numbers** — client-computed scores are never trusted.
4. **Contact capture = required Instagram handle on intro (as in reference), no email step.**
   Reference already gates the test with an IG-handle input; reproducing it keeps funnel
   friction unchanged while satisfying the lead requirement. Adding an email step would be
   scope beyond the reference and hurt conversion; revisit only on founder request.
5. **New table `quiz_submissions`** (jsonb answers + server-computed score/band/type +
   user_agent/referrer), RLS enabled with no anon policies — service-key-only access, same
   posture as `leads`. Schema/SQL in `docs/architecture/quiz-opora.md` §6.
6. **Dual persistence: DB primary, Resend notification secondary.** Email failure is
   non-fatal; DB failure with successful email still returns 200 (lead not lost); both
   failing → 500 and one client retry, after which the result is still shown (UX over
   capture on the edge case).
7. **New env var `PUBLIC_DIAGNOSTIC_BOOKING_URL`** (fallback `https://calendly.com/`);
   reuse `PUBLIC_OPORA_BOT_URL` for the course CTA — verified it points to the same
   «Опора на себе» bot used by `courses/opora/success.astro`.

## Consequences

- Scoring is fully unit-testable and immune to client tampering.
- Founder reads leads in Supabase Table Editor and via email notifications; no admin UI in v1.
- Privacy policy must mention quiz answer + handle storage (subtask).
