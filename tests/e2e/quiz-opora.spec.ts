import { test, expect } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

/**
 * E2E for the quiz funnel page /quiz/opora (GEO-18).
 *
 * Covers only the critical flow (unit pyramid is heavy on RTL — 22 tests in
 * QuizApp.test.tsx): gate validation, full 12-answer run with a single POST,
 * and the lead-loss path where the API fails twice but the result still renders.
 *
 * Answering the FIRST option of every question yields the deterministic
 * fixture: pct 39, band «Опора майже вся зовнішня», type «Хороша дочка».
 */

const GATE_ERROR = 'Впиши свій нік, щоб почати';
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
 */
async function gotoQuiz(page: Page): Promise<void> {
  await page.goto('/quiz/opora');
  await page.waitForSelector('astro-island:not([ssr])', { state: 'attached' });
}

async function startQuiz(page: Page, handle: string): Promise<void> {
  await gotoQuiz(page);
  await page.getByLabel('Підтверди, що ти не бот').fill(handle);
  await page.getByRole('button', { name: 'Почати тест' }).click();
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
    await expect(page.getByRole('alert')).toHaveText(GATE_ERROR);
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

    await startQuiz(page, 'qa.e2e');
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

    // Exactly one POST with the normalized handle and 12 raw answers
    expect(submissions).toHaveLength(1);
    const body = submissions[0] as {
      instagram: string;
      answers: Array<{ question: number; option: number }>;
    };
    expect(body.instagram).toBe('@qa.e2e');
    expect(body.answers).toHaveLength(12);
    body.answers.forEach((answer, index) => {
      expect(answer).toEqual({ question: index, option: 0 });
    });
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
