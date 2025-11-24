import { test, expect } from '@playwright/test';

/**
 * E2E tests for legal pages (Privacy Policy, Terms)
 * Tests basic page functionality and content rendering
 */

test.describe('Legal Pages', () => {
  test.describe('Privacy Policy Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/privacy-policy', { waitUntil: 'networkidle' });
    });

    test('should load privacy policy page successfully', async ({ page }) => {
      // Check page loaded
      await expect(page).toHaveURL(/privacy-policy/);

      // Check title contains privacy/policy text
      await expect(page).toHaveTitle(/політика конфіденційності/i);
    });

    test('should display privacy policy heading', async ({ page }) => {
      // Main heading should be visible - use specific selector to avoid browser extension elements
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/політика конфіденційності/i);
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
      // Check meta description exists
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);

      // Check og:title exists
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    });

    test('should have navigation menu', async ({ page }) => {
      // Header navigation should be visible - use semantic role to avoid browser extension elements
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();

      // Should have navigation links
      const navLinks = header.locator('nav a');
      await expect(navLinks.first()).toBeVisible();
    });

    test('should have footer', async ({ page }) => {
      // Footer should be visible - use semantic role
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();

      // Footer should have copyright text
      await expect(footer).toContainText(/© \d{4}/);
    });

    test('should be accessible with keyboard navigation', async ({ page }) => {
      // Tab through focusable elements
      await page.keyboard.press('Tab');

      // At least one element should be focused
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeDefined();
      expect(focusedElement).not.toBe('BODY');
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Page should still be readable - use specific selector
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();

      // Content should be visible
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should link back to home page', async ({ page }) => {
      // Find link to home page (usually in header/footer)
      const homeLink = page.locator('a[href="/"]').first();
      await expect(homeLink).toBeVisible();

      // Click should navigate home
      await homeLink.click();
      await expect(page).toHaveURL(/\/$|\/$/);
    });
  });

  test.describe('Terms Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/terms', { waitUntil: 'networkidle' });
    });

    test('should load terms page successfully', async ({ page }) => {
      // Check page loaded
      await expect(page).toHaveURL(/terms/);

      // Check title contains terms/conditions text
      await expect(page).toHaveTitle(/умови використання/i);
    });

    test('should display terms heading', async ({ page }) => {
      // Main heading should be visible - use specific selector to avoid browser extension elements
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/умови використання/i);
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
      // Check meta description exists
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);

      // Check og:title exists
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    });

    test('should have navigation menu', async ({ page }) => {
      // Header navigation should be visible - use semantic role to avoid browser extension elements
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();

      // Should have navigation links
      const navLinks = header.locator('nav a');
      await expect(navLinks.first()).toBeVisible();
    });

    test('should have footer', async ({ page }) => {
      // Footer should be visible - use semantic role
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();

      // Footer should have copyright text
      await expect(footer).toContainText(/© \d{4}/);
    });

    test('should be accessible with keyboard navigation', async ({ page }) => {
      // Tab through focusable elements
      await page.keyboard.press('Tab');

      // At least one element should be focused
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeDefined();
      expect(focusedElement).not.toBe('BODY');
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Page should still be readable - use specific selector
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();

      // Content should be visible
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should link back to home page', async ({ page }) => {
      // Find link to home page (usually in header/footer)
      const homeLink = page.locator('a[href="/"]').first();
      await expect(homeLink).toBeVisible();

      // Click should navigate home
      await homeLink.click();
      await expect(page).toHaveURL(/\/$|\/$/);
    });
  });

  test.describe('Cross-page navigation', () => {
    test('should navigate between privacy and terms pages', async ({ page }) => {
      await page.goto('/privacy-policy', { waitUntil: 'networkidle' });

      // Find link to terms page
      const termsLink = page.locator('a[href="/terms"]').first();
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/terms/);

        // Navigate back to privacy
        const privacyLink = page.locator('a[href="/privacy-policy"]').first();
        if (await privacyLink.isVisible()) {
          await privacyLink.click();
          await expect(page).toHaveURL(/privacy-policy/);
        }
      }
    });

    test('should have consistent footer across pages', async ({ page }) => {
      // Check footer on privacy policy - use semantic role to avoid browser extension elements
      await page.goto('/privacy-policy', { waitUntil: 'networkidle' });
      const footerOnPrivacy = await page.getByRole('contentinfo').textContent();

      // Check footer on terms
      await page.goto('/terms', { waitUntil: 'networkidle' });
      const footerOnTerms = await page.getByRole('contentinfo').textContent();

      // Both should have copyright
      expect(footerOnPrivacy).toMatch(/© \d{4}/);
      expect(footerOnTerms).toMatch(/© \d{4}/);
    });
  });
});
