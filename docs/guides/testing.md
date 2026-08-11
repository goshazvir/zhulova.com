# Testing Guide

How to run and write tests in this repository. Owned by QA; keep this file
current whenever the test suites or conventions change.

## Test pyramid

The suite is intentionally unit-heavy:

- **Unit / component (Vitest + React Testing Library)** — the bulk of coverage.
  Test files live next to the code they test (`Component.tsx` →
  `Component.test.tsx`, `scoring.ts` → `scoring.test.ts`).
- **E2E (Playwright, `tests/e2e/`)** — a small suite covering only the most
  critical user flows. Resist E2E sprawl: if a behavior can be asserted with
  RTL, it belongs in a unit test.

## Commands

```bash
# Unit tests
npm run test          # watch mode (development)
npm run test:run      # single run (CI, verification)
npm run test:coverage # with coverage report

# E2E tests (starts the dev server automatically via webServer config)
npm run test:e2e                          # all browsers locally, Chromium on CI
npx playwright test --project=chromium    # single browser
npm run test:e2e:report                   # open the HTML report

# Full pre-push gate
npm run test:run && npx playwright test --project=chromium && npm run build
```

## What the E2E suite covers

| Spec | Critical flow |
| --- | --- |
| `consultation-form.spec.ts` | Consultation modal: validation, submit, API error handling |
| `consultation-cta-buttons.spec.ts` | All CTA buttons open the consultation modal |
| `quiz-opora.spec.ts` | Quiz funnel `/quiz/opora`: gate validation, 12-answer run with a single POST, lead-loss path (API fails twice, result still renders) |
| `opora.spec.ts` | Course landing `/courses/opora` sections and catalog links |
| `opora-payment-pages.spec.ts` | Payment success/failure pages |
| `courses-pages.spec.ts` | Courses catalog and detail pages |
| `legal-pages.spec.ts` | Privacy policy and terms pages |
| `404-page.spec.ts` | Custom 404 page |

## Conventions

- **Semantic selectors first**: `getByRole`, `getByLabel`, `getByText`. Avoid
  CSS/XPath selectors unless there is no accessible handle (and treat that as
  an accessibility smell worth fixing in the component).
- **Mock serverless APIs with `page.route()`** — E2E must not hit Supabase or
  Resend. Assert on the captured request payloads instead.
- **Wait for island hydration before interacting.** Astro islands render
  static HTML first; React 18 attaches listeners only after `hydrateRoot`, so
  clicks fired before hydration are silently lost. `astro-island` drops its
  `ssr` attribute when hydration completes:

  ```ts
  await page.goto('/quiz/opora');
  await page.waitForSelector('astro-island:not([ssr])', { state: 'attached' });
  ```

  This race is test-runner-only (real users interact seconds after load), but
  without the wait the specs are flaky, especially on mobile projects.
- **Deterministic animations**: `await page.emulateMedia({ reducedMotion:
  'reduce' })` in `beforeEach` when asserting on animated values (count-ups,
  progress bars).
- **Keep tests independent** — no shared state between tests; each test
  navigates and sets up its own routes.
- **Unit tests are written FIRST** (strict TDD). They must encode the
  acceptance criteria of the task, not restate the implementation.

## CI

On every PR: unit tests → E2E (Chromium only) → summary, with fast-fail (E2E
skipped if unit tests fail). See `.claude/docs/ci-cd-testing.md` for the full
CI/CD strategy, artifact retention and troubleshooting.
