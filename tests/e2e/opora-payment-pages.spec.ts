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
});
