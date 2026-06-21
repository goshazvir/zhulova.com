# Opora Payment Result Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add branded success and error pages that WayForPay redirects to after a payment for the "Опора на себе" course, routing buyers to the Telegram bot.

**Architecture:** Two static Astro pages nested under `/courses/opora/`, built with the existing `BaseLayout` + `Header` + `Footer` and the existing `CtaButton`. A new optional `noindex` prop on `BaseLayout` keeps these pages out of search. The bot link comes from a new `PUBLIC_OPORA_BOT_URL` env var (falls back to `/contacts` when unset). No serverless code — the pages are informational only.

**Tech Stack:** Astro 4 (SSG), Tailwind CSS 3, Playwright (e2e). Spec: `docs/superpowers/specs/2026-06-21-opora-payment-result-pages-design.md`.

## Global Constraints

- UI copy is **Ukrainian**; all code, comments, and commit messages are **English**.
- Pages are **static** (Astro `output: 'static'`); no server-side rendering, no payment verification.
- Reuse `@components/sections/opora/CtaButton.astro` for buttons (it already opens `http*` links in a new tab with `rel="noopener noreferrer"`).
- Reuse `BaseLayout` (`@layouts/BaseLayout.astro`), `Header` (`@components/layout/Header.astro`, `variant="main"`), `Footer` (`@components/layout/Footer.astro`, `variant="legal"`) — same as `src/pages/courses/opora.astro`.
- `PUBLIC_*` display links may use a non-secret fallback (this is not a secret-bearing API var, so the "no fallback" rule for API secrets does not apply here).
- Run e2e with: `npx playwright test <file> --project=chromium`.

---

### Task 1: Success page (`/courses/opora/success`) + `noindex` support

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (add optional `noindex` prop + robots meta)
- Modify: `.env.example` (document `PUBLIC_OPORA_BOT_URL`)
- Modify: `.env` (local value; gitignored, not committed)
- Create: `src/pages/courses/opora/success.astro`
- Test: `tests/e2e/opora-payment-pages.spec.ts`

**Interfaces:**
- Consumes: `BaseLayout` with new `noindex?: boolean` prop; `CtaButton` (`href: string` prop, external links open in new tab).
- Produces: route `/courses/opora/success`; env var `PUBLIC_OPORA_BOT_URL`; `BaseLayout` `noindex` prop reused by Task 2.

- [ ] **Step 1: Write the failing e2e test**

Create `tests/e2e/opora-payment-pages.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Opora payment result pages (success / error).
 * These pages are where WayForPay redirects the buyer after payment.
 */

test.describe('Opora Payment Result Pages', () => {
  test.describe('Success page (/courses/opora/success)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/courses/opora/success', { waitUntil: 'networkidle' });
    });

    test('should load successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/courses\/opora\/success$/);
    });

    test('should display a heading', async ({ page }) => {
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/успішно/i);
    });

    test('should have a primary CTA with a non-empty link', async ({ page }) => {
      const cta = page.locator('main a').filter({ hasText: /забрати курс/i }).first();
      await expect(cta).toBeVisible();
      const href = await cta.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href!.length).toBeGreaterThan(1);
    });

    test('should be excluded from search engines (noindex)', async ({ page }) => {
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveAttribute('content', /noindex/);
    });

    test('should have navigation and footer', async ({ page }) => {
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/e2e/opora-payment-pages.spec.ts --project=chromium`
Expected: FAIL — the page 404s (no `main h1` / wrong URL), `meta[name="robots"]` not found.

- [ ] **Step 3: Add `noindex` support to `BaseLayout`**

In `src/layouts/BaseLayout.astro`, change the `Props` interface (lines 6–11):

```astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
}
```

Change the props destructuring (lines 13–18):

```astro
const {
  title,
  description,
  image = '/images/og-default.jpg',
  canonical,
  noindex = false,
} = Astro.props;
```

Add the robots meta right after the description meta (after line 35, `<meta name="description" ... />`):

```astro
    {noindex && <meta name="robots" content="noindex, nofollow" />}
```

- [ ] **Step 4: Add the bot env var to `.env.example` and `.env`**

In `.env.example`, append after the `PUBLIC_OPORA_CHECKOUT_URL` line:

```bash
# Telegram bot that delivers the Opora course after payment
PUBLIC_OPORA_BOT_URL=https://t.me/your_bot
```

In `.env` (local, gitignored), add the same key (leave the value empty for now — the page will fall back to `/contacts`):

```bash
PUBLIC_OPORA_BOT_URL=
```

- [ ] **Step 5: Create the success page**

Create `src/pages/courses/opora/success.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import CtaButton from '@components/sections/opora/CtaButton.astro';

// Bot link delivers the course; fall back to contacts if not configured yet.
const botUrl: string = import.meta.env.PUBLIC_OPORA_BOT_URL || '/contacts';
---

<BaseLayout
  title="Оплата успішна — Опора на себе · Вікторія Жульова"
  description="Оплата пройшла успішно. Відкрий телеграм-бот, щоб забрати курс «Опора на себе»."
  noindex
>
  <Header variant="main" />

  <main class="min-h-screen bg-white pt-32 pb-20">
    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600"
      >
        <svg
          class="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
        Оплата пройшла успішно
      </h1>

      <p class="text-lg text-navy-700 mb-8 leading-relaxed">
        Дякую за покупку! Доступ до курсу — у телеграм-боті. Натисни кнопку нижче, щоб
        відкрити його й почати.
      </p>

      <CtaButton href={botUrl}>Відкрити бота й забрати курс</CtaButton>

      <p class="mt-6 text-sm text-navy-500">
        Бот не відкрився?
        <a href="/contacts" class="text-gold-600 underline hover:text-gold-500">Напиши нам</a>.
      </p>
    </section>
  </main>

  <Footer variant="legal" />
</BaseLayout>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/e2e/opora-payment-pages.spec.ts --project=chromium`
Expected: PASS (all success-page tests green).

- [ ] **Step 7: Type-check**

Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/BaseLayout.astro .env.example src/pages/courses/opora/success.astro tests/e2e/opora-payment-pages.spec.ts
git commit -m "feat(opora): add post-payment success page and BaseLayout noindex"
```

---

### Task 2: Error page (`/courses/opora/error`)

**Files:**
- Create: `src/pages/courses/opora/error.astro`
- Test: `tests/e2e/opora-payment-pages.spec.ts` (extend with an error-page describe block)

**Interfaces:**
- Consumes: `BaseLayout` `noindex` prop (from Task 1); `CtaButton`; env var `PUBLIC_OPORA_CHECKOUT_URL` (already used by `src/pages/courses/opora.astro`).
- Produces: route `/courses/opora/error`.

- [ ] **Step 1: Write the failing e2e test**

Append this describe block inside the top-level `test.describe('Opora Payment Result Pages', ...)` in `tests/e2e/opora-payment-pages.spec.ts`, right after the Success page block:

```typescript
  test.describe('Error page (/courses/opora/error)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/courses/opora/error', { waitUntil: 'networkidle' });
    });

    test('should load successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/courses\/opora\/error$/);
    });

    test('should display a heading', async ({ page }) => {
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/не пройшла/i);
    });

    test('should have a retry CTA with a non-empty link', async ({ page }) => {
      const cta = page.locator('main a').filter({ hasText: /спробувати ще раз/i }).first();
      await expect(cta).toBeVisible();
      const href = await cta.getAttribute('href');
      expect(href).toBeTruthy();
    });

    test('should link to contacts', async ({ page }) => {
      await expect(page.locator('main a[href="/contacts"]').first()).toBeVisible();
    });

    test('should be excluded from search engines (noindex)', async ({ page }) => {
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveAttribute('content', /noindex/);
    });
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/e2e/opora-payment-pages.spec.ts --project=chromium`
Expected: FAIL — error page 404s (no `main h1`, wrong URL, no robots meta). Success-page tests still pass.

- [ ] **Step 3: Create the error page**

Create `src/pages/courses/opora/error.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
import CtaButton from '@components/sections/opora/CtaButton.astro';

// Send the buyer back to the WayForPay button to try again.
const checkoutUrl: string = import.meta.env.PUBLIC_OPORA_CHECKOUT_URL || '#';
---

<BaseLayout
  title="Оплата не пройшла — Опора на себе · Вікторія Жульова"
  description="Оплата не пройшла. Спробуй ще раз або звернись до нас."
  noindex
>
  <Header variant="main" />

  <main class="min-h-screen bg-white pt-32 pb-20">
    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
        Оплата не пройшла
      </h1>

      <p class="text-lg text-navy-700 mb-8 leading-relaxed">
        Щось пішло не так під час оплати, і гроші не списано. Спробуй ще раз — це займе
        хвилину.
      </p>

      <CtaButton href={checkoutUrl}>Спробувати ще раз</CtaButton>

      <p class="mt-6 text-sm text-navy-500">
        Не виходить?
        <a href="/contacts" class="text-gold-600 underline hover:text-gold-500">Звернись до нас</a>.
      </p>
    </section>
  </main>

  <Footer variant="legal" />
</BaseLayout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/e2e/opora-payment-pages.spec.ts --project=chromium`
Expected: PASS (both success and error page blocks green).

- [ ] **Step 5: Type-check**

Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/courses/opora/error.astro tests/e2e/opora-payment-pages.spec.ts
git commit -m "feat(opora): add post-payment error page"
```

---

### Task 3: Deploy config — Vercel env var + WayForPay cabinet

**Files:** none (operational configuration).

**Interfaces:**
- Consumes: routes `/courses/opora/success` and `/courses/opora/error` (Tasks 1–2); env var `PUBLIC_OPORA_BOT_URL`.
- Produces: live, working redirect flow on production.

- [ ] **Step 1: Add the bot URL to Vercel (Production + Preview)**

Replace `<BOT_URL>` with the real Telegram bot link (e.g. `https://t.me/opora_bot`):

```bash
printf "<BOT_URL>" | vercel env add PUBLIC_OPORA_BOT_URL production
printf "<BOT_URL>" | vercel env add PUBLIC_OPORA_BOT_URL preview
```

Verify:

```bash
vercel env ls | grep -i OPORA_BOT
```

Expected: `PUBLIC_OPORA_BOT_URL` listed for Production and Preview.

- [ ] **Step 2: Configure the WayForPay button redirects (merchant cabinet)**

In the WayForPay cabinet, open the payment button used for Opora, then:

1. Enable the toggle **"Налаштувати переадресацію клієнта"**.
2. **Approve URL:** `https://zhulova.com/courses/opora/success`
3. **Decline URL:** `https://zhulova.com/courses/opora/error`
4. Enable **"Вимкнути надсилання POST на returnUrl"** (forces a plain GET redirect so the static pages load correctly).
5. Save.

- [ ] **Step 3: Push to trigger a production deploy**

```bash
git push origin master
```

(Only after explicit approval to push — per project rules.)

- [ ] **Step 4: Verify the live flow**

After the deploy is `Ready`:

```bash
curl -s https://zhulova.com/courses/opora/success | grep -o 'noindex'
curl -s https://zhulova.com/courses/opora/error | grep -o 'noindex'
```

Expected: `noindex` printed for both (pages are live and excluded from search). Then make a real test payment (or use WayForPay test mode) and confirm the redirect lands on `/courses/opora/success`.

---

## Self-Review

**Spec coverage:**
- Success page → Task 1 ✓
- Error page → Task 2 ✓
- `PUBLIC_OPORA_BOT_URL` env var + `/contacts` fallback → Task 1 (Steps 4–5) ✓
- `noindex` on both pages → Task 1 (BaseLayout prop) + used in both pages ✓
- WayForPay cabinet config + POST→GET toggle → Task 3 ✓
- Nested routing under `/courses/opora/` → Tasks 1–2 file paths ✓
- E2E coverage (load, h1, CTA, noindex) → Tasks 1–2 ✓
- Out of scope (payment verification, webhook, generic success page) → not implemented ✓

**Placeholder scan:** No TBD/TODO. `<BOT_URL>` in Task 3 is an intentional operator-supplied value, clearly marked. Page copy is final Ukrainian text.

**Type consistency:** `noindex?: boolean` defined in Task 1 BaseLayout `Props`, used as `noindex` attribute in both pages. `CtaButton` `href: string` matches existing component. `botUrl` / `checkoutUrl` are local `string` consts. CTA selectors in tests (`забрати курс`, `спробувати ще раз`) match the button label text in the pages.
