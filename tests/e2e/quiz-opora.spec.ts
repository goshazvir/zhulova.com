import { test, expect } from '@playwright/test';
import type { Page, Route } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E for the quiz funnel page /quiz/opora (GEO-18 + GEO-19).
 *
 * Covers only the critical flow (unit pyramid is heavy on RTL — 22 tests in
 * QuizApp.test.tsx): gate validation, full 12-answer run with a single POST,
 * the lead-loss path where the API fails twice but the result still renders,
 * a keyboard-only pass (Tab/Enter) and axe scans of all three screens.
 *
 * Answering the FIRST option of every question yields the deterministic
 * fixture: pct 39, band «Опора майже вся зовнішня», type «Хороша дочка».
 */

const GATE_ERROR = 'Впиши свій нік, щоб почати';
// ADR-0002 #1: format error for a malformed Instagram nick
const FORMAT_ERROR = 'Перевір нік: латинські літери, цифри, крапки чи _, до 30 символів';
const EXPECTED_PCT = '39%';
const EXPECTED_BAND = 'Опора майже вся зовнішня';
const EXPECTED_TYPE = 'Хороша дочка';

/** Option cards are the only buttons carrying aria-pressed. */
function firstOption(page: Page) {
  return page.locator('button[aria-pressed]').first();
}

/**
 * Navigate and wait for island hydration: astro-island drops its `ssr`
 * attribute on `astro:hydrate`. Clicks before that are lost (React 18
 * attaches listeners only after hydrateRoot), which is unreachable for real
 * users (typing the handle outlasts hydration) but races the test runner.
 * The page carries three islands (QuizApp, Analytics, SpeedInsights), so the
 * wait must target the QuizApp island specifically.
 */
async function gotoQuiz(page: Page): Promise<void> {
  await page.goto('/quiz/opora');
  await page.waitForSelector('astro-island[component-url*="QuizApp"]:not([ssr])', {
    state: 'attached',
  });
}

async function startQuiz(page: Page, handle: string): Promise<void> {
  await gotoQuiz(page);
  await page.getByLabel('Підтверди, що ти не бот').fill(handle);
  await page.getByRole('button', { name: 'Почати тест' }).click();
}

/** GEO-19 AC3: zero critical axe violations on every quiz screen. */
async function expectNoCriticalViolations(page: Page, screen: string): Promise<void> {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const critical = violations.filter((violation) => violation.impact === 'critical');
  expect(critical, `critical axe violations on the ${screen} screen`).toEqual([]);
}

test.describe('Quiz /quiz/opora', () => {
  test.beforeEach(async ({ page }) => {
    // Deterministic result screen: no count-up animation
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('gate blocks empty and invalid handles; page stays out of site nav', async ({ page }) => {
    await gotoQuiz(page);
    await expect(page).toHaveTitle(/Тест: на що ти зараз опираєшся\?/);

    // Campaign chrome: logo-only header, no site navigation to/from the quiz
    await expect(page.locator('header nav')).toHaveCount(0);

    const start = page.getByRole('button', { name: 'Почати тест' });
    await start.click();
    await expect(page.getByRole('alert')).toHaveText(GATE_ERROR);
    await expect(page.locator('text=01 / 12')).toHaveCount(0);

    await page.getByLabel('Підтверди, що ти не бот').fill('bad handle!');
    await start.click();
    await expect(page.getByRole('alert')).toHaveText(FORMAT_ERROR);
    await expect(page.locator('text=01 / 12')).toHaveCount(0);
  });

  test('full flow: 12 answers fire exactly one POST and render the result', async ({ page }) => {
    const submissions: unknown[] = [];
    await page.route('**/api/submit-quiz', async (route: Route) => {
      submissions.push(route.request().postDataJSON());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // The raw input exercises normalization: strip `@`, lowercase (ADR-0002)
    await startQuiz(page, '@QA.e2e');
    await expect(page.getByText('01 / 12')).toBeVisible();

    // Answer Q1, go back, verify the selection is preserved, answer again
    await firstOption(page).click();
    await expect(page.getByText('02 / 12')).toBeVisible();
    await page.getByRole('button', { name: 'Назад' }).click();
    await expect(page.getByText('01 / 12')).toBeVisible();
    await expect(firstOption(page)).toHaveAttribute('aria-pressed', 'true');

    for (let i = 0; i < 12; i++) {
      await expect(page.getByText(`${String(i + 1).padStart(2, '0')} / 12`)).toBeVisible();
      await firstOption(page).click();
    }

    // Result screen with the deterministic fixture
    await expect(page.getByRole('heading', { name: EXPECTED_TYPE })).toBeVisible();
    await expect(page.getByText(EXPECTED_PCT)).toBeVisible();
    await expect(page.getByText(EXPECTED_BAND)).toBeVisible();

    // Both CTAs present; booking falls back to calendly unless configured
    await expect(page.getByRole('link', { name: 'Забираю курс собі' })).toHaveAttribute(
      'href',
      /^(\/contacts|https?:\/\/)/
    );
    await expect(
      page.getByRole('link', { name: 'Записатись на діагностику вже зараз' })
    ).toHaveAttribute('href', /^https?:\/\//);

    // Exactly one POST with the canonical bare handle (ADR-0002) and 12 raw answers
    expect(submissions).toHaveLength(1);
    const body = submissions[0] as {
      instagram: string;
      answers: Array<{ question: number; option: number }>;
    };
    expect(body.instagram).toBe('qa.e2e');
    expect(body.answers).toHaveLength(12);
    body.answers.forEach((answer, index) => {
      expect(answer).toEqual({ question: index, option: 0 });
    });
    // Server-side scoring only: the client must not send any score fields
    expect(Object.keys(body).sort()).toEqual(['answers', 'instagram']);
  });

  test('keyboard-only: gate error, handle entry and first question via Tab/Enter', async ({
    page,
  }) => {
    await page.route('**/api/submit-quiz', (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    );
    await gotoQuiz(page);

    // Tab from the top of the page until the gate input receives focus
    const gateInput = page.getByLabel('Підтверди, що ти не бот');
    for (let i = 0; i < 10 && !(await gateInput.evaluate((el) => el === document.activeElement)); i++) {
      await page.keyboard.press('Tab');
    }
    await expect(gateInput).toBeFocused();

    // Empty submit from the keyboard shows the gate error and keeps focus on the input
    await page.keyboard.press('Enter');
    await expect(page.getByRole('alert')).toHaveText(GATE_ERROR);
    await expect(gateInput).toBeFocused();

    // Type the handle and submit with Enter — the quiz starts
    await page.keyboard.type('qa.keyboard');
    await page.keyboard.press('Enter');
    await expect(page.getByText('01 / 12')).toBeVisible();

    // Focus lands on the question heading; Tab reaches the first option card
    await expect(page.getByRole('heading', { level: 2 })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(firstOption(page)).toBeFocused();

    // Enter activates the option and advances to question 2
    await page.keyboard.press('Enter');
    await expect(page.getByText('02 / 12')).toBeVisible();
  });

  test('axe: no critical violations on intro, question and result screens', async ({ page }) => {
    await page.route('**/api/submit-quiz', (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    );

    await gotoQuiz(page);
    await expectNoCriticalViolations(page, 'intro');

    await page.getByLabel('Підтверди, що ти не бот').fill('qa.axe');
    await page.getByRole('button', { name: 'Почати тест' }).click();
    await expect(page.getByText('01 / 12')).toBeVisible();
    await expectNoCriticalViolations(page, 'question');

    for (let i = 0; i < 12; i++) {
      await firstOption(page).click();
    }
    await expect(page.getByRole('heading', { name: EXPECTED_TYPE })).toBeVisible();
    await expectNoCriticalViolations(page, 'result');
  });

  test('double API failure: result still renders and the lead loss is logged', async ({
    page,
  }) => {
    let attempts = 0;
    await page.route('**/api/submit-quiz', async (route: Route) => {
      attempts++;
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await startQuiz(page, '@qa.failure');
    for (let i = 0; i < 12; i++) {
      await firstOption(page).click();
    }

    await expect(page.getByRole('heading', { name: EXPECTED_TYPE })).toBeVisible();
    await expect(page.getByText(EXPECTED_PCT)).toBeVisible();
    expect(attempts).toBe(2);
    expect(consoleErrors.join('\n')).toContain('lead lost');
  });
});
