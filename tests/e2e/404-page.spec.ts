import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E tests for 404 error page
 * Tests navigation, accessibility, and responsive design
 */

test.describe('404 Error Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a non-existent URL to trigger 404
    await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });
  });

  test('should display 404 page for non-existent URLs', async ({ page }) => {
    // Page should show 404 indicator
    const decorative404 = page.locator('p[aria-hidden="true"]').filter({ hasText: '404' });
    await expect(decorative404).toBeVisible();

    // Should have proper title
    await expect(page).toHaveTitle(/не знайдено/i);
  });

  test('should display empathetic Ukrainian heading', async ({ page }) => {
    // Main heading should be visible and in Ukrainian
    const heading = page.locator('main h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/сторінку не знайдено/i);
  });

  test('should display empathetic message in Ukrainian', async ({ page }) => {
    // Paragraph with explanation should be visible
    const message = page.locator('main p').filter({ hasText: /переміщена|не існує/i });
    await expect(message).toBeVisible();
  });

  test('should have primary CTA "На головну" that navigates to home', async ({ page }) => {
    // Find primary CTA button
    const homeButton = page.locator('a').filter({ hasText: /на головну/i });
    await expect(homeButton).toBeVisible();

    // Click should navigate to home
    await homeButton.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('should have secondary CTA "Переглянути курси" that navigates to courses', async ({
    page,
  }) => {
    // Find courses link
    const coursesLink = page.locator('a[href="/courses"]');
    await expect(coursesLink).toBeVisible();

    // Click should navigate to courses
    await coursesLink.click();
    await expect(page).toHaveURL(/\/courses/);
  });

  test('should have secondary CTA "Зв\'язатися зі мною" that navigates to contacts', async ({
    page,
  }) => {
    // Find contacts link
    const contactsLink = page.locator('a[href="/contacts"]');
    await expect(contactsLink).toBeVisible();

    // Click should navigate to contacts
    await contactsLink.click();
    await expect(page).toHaveURL(/\/contacts/);
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Tab through focusable elements
    await page.keyboard.press('Tab');

    // First focusable should be primary CTA
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        text: el?.textContent?.trim(),
      };
    });

    expect(focusedElement.tag).toBe('A');

    // Continue tabbing to verify all links are focusable
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to tab through all interactive elements
    const allFocusable = await page.evaluate(() => {
      const elements = document.querySelectorAll('main a');
      return elements.length;
    });

    expect(allFocusable).toBeGreaterThanOrEqual(3);
  });

  test('should pass axe-core accessibility audit', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('main')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have exactly one h1
    const h1Count = await page.locator('main h1').count();
    expect(h1Count).toBe(1);

    // 404 text should be aria-hidden (decorative)
    const decorative404 = page.locator('p[aria-hidden="true"]').filter({ hasText: '404' });
    await expect(decorative404).toBeVisible();
  });

  test('should work on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Content should be visible without horizontal scroll
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Heading should be readable
    const heading = page.locator('main h1').first();
    await expect(heading).toBeVisible();

    // Primary CTA should be tappable (min 48px)
    const homeButton = page.locator('a').filter({ hasText: /на головну/i });
    const buttonBox = await homeButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(48);
  });

  test('should work on tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Content should scale appropriately
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // All links should be visible
    const links = page.locator('main a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should work on desktop viewport (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Content should be centered
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // 404 text should be large
    const decorative404 = page.locator('p[aria-hidden="true"]').filter({ hasText: '404' });
    await expect(decorative404).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check og:title exists
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('should have navy brand colors', async ({ page }) => {
    // 404 text should have navy color
    const decorative404 = page.locator('p[aria-hidden="true"]').filter({ hasText: '404' });
    const has404NavyClass = await decorative404.evaluate((el) =>
      el.classList.contains('text-navy-900')
    );
    expect(has404NavyClass).toBe(true);

    // Secondary links should have navy color (accessible contrast)
    const coursesLink = page.locator('a[href="/courses"]');
    const hasNavyClass = await coursesLink.evaluate((el) =>
      el.classList.contains('text-navy-600')
    );
    expect(hasNavyClass).toBe(true);
  });
});
