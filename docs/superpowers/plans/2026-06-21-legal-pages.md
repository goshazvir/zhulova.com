# Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Ukrainian public-offer page and re-align the existing terms and privacy pages so the site's legal documents match its real business model (digital mini-courses via Telegram paid through WayForPay, plus coaching).

**Architecture:** Three static Astro pages following the existing legal-page pattern (`BaseLayout` + `Header variant="main"` + `Footer variant="legal"`, Tailwind, `<article class="max-w-4xl mx-auto">`). A new `/oferta` page is created; `/terms` and `/privacy-policy` are edited in place. The footer legal block gains a third link. Playwright e2e tests cover the new page and cross-navigation.

**Tech Stack:** Astro 4.x (SSG), Tailwind CSS 3.x, Playwright (e2e). No React, no new dependencies.

## Global Constraints

- All page content, headings, and copy: **Ukrainian**. Code, comments, commit messages: **English**.
- Original Ukrainian copy only — **do not reproduce text from sviridov-pro.com or any example site**.
- Seller is a Ukrainian **ФОП**; concrete requisites are unknown — use explicit placeholders (`[ПІБ]`, `[РНОКПП]`, `[дата]`) for the owner to fill in.
- Contact email already used across the site: `hello@zhulova.com`.
- Markup pattern for every section: `<h2 class="text-2xl font-serif text-navy-900 mb-4">` heading inside `<section class="mb-10">`, body in `<div class="text-navy-700 leading-relaxed space-y-4">`, lists as `<ul class="list-disc list-inside space-y-2 ml-4">`, internal links as `class="text-gold-600 hover:text-gold-400 underline transition-colors"`.
- Refund policy is **mixed**: digital products — consent to immediate access + waiver of the 14-day withdrawal right, no refund after access granted; coaching — refund for sessions not delivered, 24h cancellation/reschedule rule.
- Do NOT `git push`. Commit only.
- Build must pass: `npm run build` runs `astro check` first and fails on type errors.

---

### Task 1: Public offer page `/oferta`

**Files:**
- Create: `src/pages/oferta.astro`
- Test: `tests/e2e/legal-pages.spec.ts` (add an "Offer Page" describe block)

**Interfaces:**
- Consumes: `@layouts/BaseLayout.astro`, `@components/layout/Header.astro`, `@components/layout/Footer.astro` (existing, unchanged).
- Produces: a page reachable at route `/oferta` with `<main>` containing a single `<h1>` "Публічна оферта" and BaseLayout `<title>` matching `/публічна оферта/i`. Task 4's footer link and cross-nav test depend on this route and title.

- [ ] **Step 1: Write the failing e2e test**

Append this describe block inside the top-level `test.describe('Legal Pages', () => { ... })` in `tests/e2e/legal-pages.spec.ts`, after the `Terms Page` block (around line 177, before `Cross-page navigation`):

```typescript
  test.describe('Offer Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/oferta', { waitUntil: 'networkidle' });
    });

    test('should load offer page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/oferta/);
      await expect(page).toHaveTitle(/публічна оферта/i);
    });

    test('should display offer heading', async ({ page }) => {
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/публічна оферта/i);
    });

    test('should have seller requisites section', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toContainText(/реквізити продавця/i);
    });

    test('should link to privacy policy', async ({ page }) => {
      const privacyLink = page.locator('main a[href="/privacy-policy"]').first();
      await expect(privacyLink).toBeVisible();
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    });

    test('should have footer', async ({ page }) => {
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
      await expect(footer).toContainText(/© \d{4}/);
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
    });
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts -g "Offer Page"`
Expected: FAIL — page `/oferta` returns 404, title/heading assertions fail.

- [ ] **Step 3: Create the offer page**

Create `src/pages/oferta.astro`. Use the structure below. Headings are fixed (exact Ukrainian text required); for descriptive paragraphs, write original Ukrainian prose following the Global Constraints markup pattern. The legally-critical clauses (sections 7 and 15) are given verbatim — use them as written.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';
---

<BaseLayout
  title="Публічна оферта - Вікторія Жульова"
  description="Договір публічної оферти про надання цифрових продуктів та коучингових послуг. Умови оплати, доступу та повернення коштів."
>
  <Header variant="main" />

  <main class="min-h-screen bg-white pt-32 pb-20 px-6">
    <article class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-serif text-navy-900 mb-8">
        Публічна оферта
      </h1>

      <p class="text-sm text-navy-600 mb-8">Дата набрання чинності: [дата]</p>

      <div class="mb-12 text-lg text-navy-700 leading-relaxed space-y-4">
        <p>
          Цей документ є офіційною публічною пропозицією (офертою) фізичної особи-підприємця
          [ПІБ] (далі — «Виконавець») укласти договір про надання цифрових продуктів та
          коучингових послуг на викладених нижче умовах.
        </p>
        <p>
          Оплата замовлення означає повну та беззастережну згоду Замовника з умовами цієї оферти
          (акцепт).
        </p>
      </div>

      <!-- 1 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Загальні положення</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- offer is a public contract; acceptance occurs through payment; parties are Виконавець and Замовник -->
        </div>
      </section>

      <!-- 2 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Терміни та визначення</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- define: Оферта, Акцепт, Виконавець, Замовник, Цифровий продукт, Коучингова послуга, Сайт -->
        </div>
      </section>

      <!-- 3 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Предмет договору</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- Виконавець надає цифрові продукти та/або коучингові послуги; Замовник оплачує -->
        </div>
      </section>

      <!-- 4 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Опис продуктів і послуг</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- digital: міні-курси та матеріали з доступом у Telegram; coaching: індивідуальні/групові онлайн-сесії -->
        </div>
      </section>

      <!-- 5 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Вартість та порядок оплати</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- ціни вказані на сторінках продуктів; оплата через платіжний сервіс WayForPay; валюти UAH/EUR; разовий платіж; Виконавець не зберігає дані платіжних карток -->
        </div>
      </section>

      <!-- 6 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Надання доступу та «доставка»</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- digital: доступ надається у Telegram одразу/невдовзі після оплати; coaching: час сесій узгоджується індивідуально -->
        </div>
      </section>

      <!-- 7 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Повернення коштів</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p><strong>Цифрові продукти.</strong> Оплачуючи цифровий продукт, Замовник дає згоду на негайне надання доступу до контенту та підтверджує, що ознайомлений із втратою права на відмову протягом 14 днів після початку надання доступу. Після надання доступу до цифрового продукту кошти поверненню не підлягають.</p>
          <p><strong>Коучингові послуги.</strong> Замовник має право відмовитися від подальших послуг; у такому разі повертаються кошти за непроведені (ненадані) сесії. Перенесення або скасування сесії можливе за умови попередження не менше ніж за 24 години — інакше сесія вважається проведеною.</p>
          <p><strong>Винятки.</strong> Якщо послуга не була надана з вини Виконавця, кошти повертаються у повному обсязі протягом 7 робочих днів.</p>
        </div>
      </section>

      <!-- 8 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Права та обов'язки сторін</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- обов'язки Виконавця (надати доступ/послугу) та Замовника (оплатити, не порушувати правила, не передавати доступ третім особам) -->
        </div>
      </section>

      <!-- 9 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Інтелектуальна власність</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- усі матеріали — власність Виконавця; заборона копіювання, поширення, комерційного використання без письмової згоди -->
        </div>
      </section>

      <!-- 10 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Відповідальність та обмеження</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- коучинг не є психотерапією/медичною послугою; Виконавець не гарантує конкретних результатів; результат залежить від зусиль Замовника -->
        </div>
      </section>

      <!-- 11 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Форс-мажор</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- обставини непереборної сили (війна, стихійні лиха, відключення зв'язку) звільняють від відповідальності; послуги переносяться -->
        </div>
      </section>

      <!-- 12 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Конфіденційність</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p>Обробка персональних даних здійснюється відповідно до <a href="/privacy-policy" class="text-gold-600 hover:text-gold-400 underline transition-colors">Політики конфіденційності</a>.</p>
        </div>
      </section>

      <!-- 13 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Строк дії та зміна умов</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- оферта діє безстроково до відкликання; Виконавець може змінювати умови, актуальна редакція — на Сайті -->
        </div>
      </section>

      <!-- 14 --> <section class="mb-10"><h2 class="text-2xl font-serif text-navy-900 mb-4">Вирішення спорів</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- регулюється законодавством України; спори — у досудовому порядку, інакше у судах України; згадати захист прав споживачів -->
        </div>
      </section>

      <!-- 15 --> <section class="mb-10 p-6 bg-sage-50 rounded-lg"><h2 class="text-2xl font-serif text-navy-900 mb-4">Реквізити продавця</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p>
            <strong>Фізична особа-підприємець:</strong> [ПІБ]<br />
            <strong>РНОКПП / ЄДРПОУ:</strong> [РНОКПП]<br />
            <strong>Email:</strong> <a href="mailto:hello@zhulova.com" class="text-gold-600 hover:text-gold-400 underline transition-colors">hello@zhulova.com</a><br />
            <strong>Веб-сайт:</strong> <a href="https://zhulova.com" class="text-gold-600 hover:text-gold-400 underline transition-colors">zhulova.com</a>
          </p>
        </div>
      </section>

    </article>
  </main>

  <Footer variant="legal" />
</BaseLayout>
```

- [ ] **Step 4: Run the offer e2e tests to verify they pass**

Run: `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts -g "Offer Page"`
Expected: PASS (all 7 tests in the Offer Page block).

- [ ] **Step 5: Verify the build passes**

Run: `npm run build`
Expected: `astro check` reports 0 errors; build completes and emits `dist/oferta/index.html`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/oferta.astro tests/e2e/legal-pages.spec.ts
git commit -m "feat(legal): add public offer page (/oferta)"
```

---

### Task 2: Slim down `/terms`

**Files:**
- Modify: `src/pages/terms.astro` (currently ~237 lines, replace body sections)

**Interfaces:**
- Consumes: existing `/oferta` route (Task 1) and `/privacy-policy` route for internal links.
- Produces: a lighter terms page; title still matches `/умови використання/i` (existing e2e in `Terms Page` block relies on this — do not change the title or `<h1>`).

- [ ] **Step 1: Replace the page body with the slimmed structure**

Keep the frontmatter, `<BaseLayout>` wrapper, `title`, `Header`, `<main>`, `<h1>Умови використання</h1>`, and `<Footer variant="legal" />` exactly as they are. Replace everything between the `<h1>` and the closing `</article>` with these sections (write original Ukrainian prose following the markup pattern):

```astro
      <div class="mb-12 text-lg text-navy-700 leading-relaxed space-y-4">
        <p>
          Ці Умови використання регулюють користування веб-сайтом zhulova.com. Користуючись
          сайтом, ви погоджуєтеся з цими умовами.
        </p>
      </div>

      <section class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Користування сайтом</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- загальні правила: сайт надається «як є»; заборона неправомірного використання; інформаційний характер контенту -->
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Покупки та оплата</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p>
            Придбання цифрових продуктів та коучингових послуг регулюється
            <a href="/oferta" class="text-gold-600 hover:text-gold-400 underline transition-colors">Публічною офертою</a>,
            яка містить умови оплати, надання доступу та повернення коштів.
          </p>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Характер коучингу</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p><strong>Коучинг не є психотерапією або медичною послугою.</strong></p>
          <!-- працюємо зі здоровими людьми; коучинг не замінює медичну/психологічну допомогу; за наявності медичних станів — звернутися до фахівця -->
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Інтелектуальна власність</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <!-- весь контент сайту (тексти, зображення, дизайн) належить Виконавцю; заборона копіювання без згоди -->
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Персональні дані</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p>
            Обробка персональних даних описана в
            <a href="/privacy-policy" class="text-gold-600 hover:text-gold-400 underline transition-colors">Політиці конфіденційності</a>.
          </p>
        </div>
      </section>

      <section class="mb-10 p-6 bg-sage-50 rounded-lg">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">Контакти</h2>
        <div class="text-navy-700 leading-relaxed space-y-4">
          <p>
            <strong>Email:</strong> <a href="mailto:hello@zhulova.com" class="text-gold-600 hover:text-gold-400 underline transition-colors">hello@zhulova.com</a><br />
            <strong>Веб-сайт:</strong> <a href="https://zhulova.com" class="text-gold-600 hover:text-gold-400 underline transition-colors">zhulova.com</a>
          </p>
        </div>
      </section>
```

- [ ] **Step 2: Verify existing Terms e2e tests still pass**

Run: `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts -g "Terms Page"`
Expected: PASS (title and heading still `умови використання`; footer and nav unchanged).

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/terms.astro
git commit -m "refactor(legal): slim terms page; move purchase rules to offer"
```

---

### Task 3: Refresh `/privacy-policy` data processors

**Files:**
- Modify: `src/pages/privacy-policy.astro:89-92` (the third-party services list inside "Хто має доступ до ваших даних")

**Interfaces:**
- Consumes: nothing new.
- Produces: privacy page reflecting the real stack; title unchanged (existing `Privacy Policy Page` e2e relies on `/політика конфіденційності/i`).

- [ ] **Step 1: Expand the third-party processors list**

Replace the `<ul>` at `src/pages/privacy-policy.astro:89-92`:

```astro
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Supabase</strong> — постачальник хмарних баз даних для зберігання запитів на консультацію (GDPR-сумісний)</li>
            <li><strong>Resend</strong> — сервіс електронної пошти для надсилання сповіщень про нові запити (GDPR-сумісний)</li>
          </ul>
```

with:

```astro
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Supabase</strong> — постачальник хмарних баз даних для зберігання запитів на консультацію (GDPR-сумісний)</li>
            <li><strong>Resend</strong> — сервіс електронної пошти для надсилання сповіщень про нові запити (GDPR-сумісний)</li>
            <li><strong>WayForPay</strong> — платіжний сервіс для обробки онлайн-оплат; дані платіжних карток обробляються на стороні сервісу і не зберігаються нами</li>
            <li><strong>Vercel</strong> — хостинг сайту та аналітика продуктивності (Analytics, Speed Insights)</li>
            <li><strong>Telegram</strong> — канал надання доступу до придбаних цифрових продуктів</li>
          </ul>
```

- [ ] **Step 2: Verify existing Privacy e2e tests still pass**

Run: `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts -g "Privacy Policy Page"`
Expected: PASS.

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/privacy-policy.astro
git commit -m "docs(legal): align privacy policy with WayForPay/Vercel/Telegram processors"
```

---

### Task 4: Footer link to the offer + cross-navigation test

**Files:**
- Modify: `src/components/layout/Footer.astro:190-205` (legal links nav)
- Test: `tests/e2e/legal-pages.spec.ts` (extend the `Cross-page navigation` describe block)

**Interfaces:**
- Consumes: `/oferta` route (Task 1).
- Produces: footer legal block links to all three legal pages on every page that renders the footer.

- [ ] **Step 1: Add the offer link to the footer legal nav**

In `src/components/layout/Footer.astro`, inside the `<nav aria-label="Legal navigation">` block (~line 190), add a third link after the existing «Умови використання» link (after line 204):

```astro
            <a
              href="/oferta"
              class="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              aria-label="Перейти до публічної оферти"
            >
              Публічна оферта
            </a>
```

- [ ] **Step 2: Add a cross-navigation assertion for the offer link**

In `tests/e2e/legal-pages.spec.ts`, inside `test.describe('Cross-page navigation', ...)`, add this test after the existing `should navigate between privacy and terms pages` test:

```typescript
    test('should link to offer from footer on legal pages', async ({ page }) => {
      await page.goto('/terms', { waitUntil: 'networkidle' });
      const offerLink = page.getByRole('contentinfo').locator('a[href="/oferta"]').first();
      await expect(offerLink).toBeVisible();
      await offerLink.click();
      await expect(page).toHaveURL(/oferta/);
    });
```

- [ ] **Step 3: Run the full legal-pages e2e suite**

Run: `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts`
Expected: PASS (all Privacy, Terms, Offer, and Cross-page navigation tests).

- [ ] **Step 4: Verify the build passes**

Run: `npm run build`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.astro tests/e2e/legal-pages.spec.ts
git commit -m "feat(legal): add public offer link to footer legal nav"
```

---

## Final verification

- [ ] Run full unit + e2e legal coverage: `npm run test:run` and `npx playwright test --project=chromium tests/e2e/legal-pages.spec.ts` — all pass.
- [ ] `npm run build` — 0 type errors; `dist/oferta/index.html`, `dist/terms/index.html`, `dist/privacy-policy/index.html` all emitted.
- [ ] Manually confirm `/oferta`, `/terms`, `/privacy-policy` render in Ukrainian, share header/footer, and the footer shows all three legal links.
- [ ] Confirm requisite placeholders (`[ПІБ]`, `[РНОКПП]`, `[дата]`) remain visible for the owner to fill in.
