import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { GIFT_BOT_URL } from './promo-gift-env';

/**
 * E2E for the gift promo modal (GEO-27), spec: docs/architecture/promo-modal.md.
 *
 * Covers only the critical flow (the unit pyramid in promoTrigger.test.ts and
 * PromoModal.test.tsx is heavy): timed appearance, CTA href, dismissal,
 * no-reappear persistence and an axe scan of the open state.
 *
 * The 12s trigger is fast-forwarded with the Playwright clock API. Fake time
 * must be advanced in slices with real pauses in between: fastForward fires
 * requestIdleCallback (hydration start), but the client:idle island then loads
 * its modules over the real-time network — a single large fastForward completes
 * before the island's poll interval even exists, and fake time never moves again.
 *
 * NOTE: the dev server must run with PUBLIC_GIFT_BOT_URL set; playwright.config.ts
 * injects the shared fallback from ./promo-gift-env into the webServer env.
 * A manually started, reused dev server without that var makes the island absent.
 */

const DIALOG_TITLE = 'Перші 2 уроки — у подарунок';

async function gotoWithClock(page: Page, path: string): Promise<void> {
  await page.clock.install();
  await page.goto(path);
}

/**
 * Advance fake time in 2s slices with a real pause after each one, so island
 * hydration (real-time module loading) and the 1s poll interval both get to run.
 * 30s of fake time is comfortably past triggerDelayMs (12s) counted from
 * whenever the island's effect actually mounted.
 */
async function fastForwardBy(page: Page, totalMs: number): Promise<void> {
  const sliceMs = 2_000;
  for (let elapsed = 0; elapsed < totalMs; elapsed += sliceMs) {
    await page.clock.fastForward(sliceMs);
    await page.waitForTimeout(50);
  }
}

/** Hydrate the idle island and cross the 12s trigger threshold. */
async function fastForwardPastTrigger(page: Page): Promise<void> {
  await fastForwardBy(page, 30_000);
}

test.describe('gift promo modal', () => {
  test('appears after the trigger, CTA targets the bot, dismiss persists across reloads', async ({
    page,
  }) => {
    await gotoWithClock(page, '/');

    // Pre-trigger: nothing in the DOM
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await fastForwardPastTrigger(page);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(DIALOG_TITLE)).toBeVisible();

    // CTA is a real link to the configured bot, opening in a new tab
    const cta = dialog.getByRole('link', { name: 'Забрати уроки в Telegram' });
    await expect(cta).toHaveAttribute('href', GIFT_BOT_URL);
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', 'noopener noreferrer');

    // Axe scan of the open state: zero critical violations
    const { violations } = await new AxeBuilder({ page }).analyze();
    const critical = violations.filter((violation) => violation.impact === 'critical');
    expect(critical, 'critical axe violations with the promo modal open').toEqual([]);

    // Text dismiss closes the modal
    await dialog.getByRole('button', { name: 'Дякую, не зараз' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Dismissal is persisted: no reappearance on the next pageview
    await page.reload();
    await fastForwardBy(page, 30_000);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('never renders on excluded pages', async ({ page }) => {
    await gotoWithClock(page, '/privacy-policy');
    await fastForwardBy(page, 30_000);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('persistent gift CTA (GEO-31)', () => {
  test('header CTA opens the modal immediately, bypassing the frequency cap', async ({ page }) => {
    // Desktop layout: the header CTA is hidden below the md breakpoint.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Seed a cap-ineligible state (just dismissed — well within the 7-day reshow window),
    // so the passive auto-trigger would not be allowed to re-show this modal.
    await page.evaluate(() => {
      window.localStorage.setItem(
        'zh_promo_gift_v1',
        JSON.stringify({ status: 'dismissed', at: Date.now(), shownCount: 1 })
      );
    });
    await page.reload();

    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByRole('button', { name: /забери подарунок/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(DIALOG_TITLE)).toBeVisible();
  });
});
