import { test, expect } from '@playwright/test';

/**
 * E2E tests for courses pages
 * Tests catalog and individual course pages
 */

test.describe('Courses Pages', () => {
  test.describe('Courses Catalog Page (/courses)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/courses', { waitUntil: 'networkidle' });
    });

    test('should load courses catalog successfully', async ({ page }) => {
      await expect(page).toHaveURL(/courses$/);
      await expect(page).toHaveTitle(/курси/i);
    });

    test('should display main heading', async ({ page }) => {
      // Use specific selector to avoid matching browser extension elements
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(/курси/i);
    });

    test('should display course cards', async ({ page }) => {
      // Should have at least one course card
      const courseCards = page.locator('a[href^="/courses/"]');
      const count = await courseCards.count();

      expect(count).toBeGreaterThan(0);

      // First card should be visible
      await expect(courseCards.first()).toBeVisible();
    });

    test('should have navigation and footer', async ({ page }) => {
      // Use semantic roles to avoid matching browser extension elements
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('contentinfo')).toBeVisible();
    });

    test('should navigate to course detail page', async ({ page }) => {
      // Find first course link
      const firstCourse = page.locator('a[href^="/courses/"]').first();
      await firstCourse.click();

      // Should navigate to course detail page
      await expect(page).toHaveURL(/\/courses\/.+/);
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Course cards should still be visible
      const courseCards = page.locator('a[href^="/courses/"]');
      await expect(courseCards.first()).toBeVisible();
    });
  });

  test.describe('Course Detail Pages', () => {
    const courseSlugs = ['my-course', 'mindset-mastery', 'goals-achievement'];

    courseSlugs.forEach((slug) => {
      test.describe(`/courses/${slug}`, () => {
        test.beforeEach(async ({ page }) => {
          await page.goto(`/courses/${slug}`, { waitUntil: 'networkidle' });
        });

        test(`should load ${slug} page successfully`, async ({ page }) => {
          await expect(page).toHaveURL(new RegExp(`/courses/${slug}`));
        });

        test(`should display course title on ${slug}`, async ({ page }) => {
          // Should have h1 heading - use specific selector to avoid browser extension elements
          const heading = page.locator('main h1').first();
          await expect(heading).toBeVisible();

          // Heading should not be empty
          const headingText = await heading.textContent();
          expect(headingText).toBeTruthy();
          expect(headingText!.length).toBeGreaterThan(3);
        });

        test(`should have proper SEO meta tags on ${slug}`, async ({ page }) => {
          // Check meta description
          const metaDescription = page.locator('meta[name="description"]');
          await expect(metaDescription).toHaveAttribute('content', /.+/);

          // Check og:title
          const ogTitle = page.locator('meta[property="og:title"]');
          await expect(ogTitle).toHaveAttribute('content', /.+/);
        });

        test(`should have navigation and footer on ${slug}`, async ({ page }) => {
          // Use semantic roles to avoid matching browser extension elements
          await expect(page.getByRole('banner')).toBeVisible();
          await expect(page.getByRole('contentinfo')).toBeVisible();
        });

        test(`should have main content on ${slug}`, async ({ page }) => {
          // Main content area should exist
          const main = page.locator('main');
          await expect(main).toBeVisible();

          // Should have some text content
          const content = await main.textContent();
          expect(content).toBeTruthy();
          expect(content!.length).toBeGreaterThan(100);
        });

        test(`should be accessible with keyboard on ${slug}`, async ({ page }) => {
          // Tab navigation should work
          await page.keyboard.press('Tab');

          const focusedElement = await page.evaluate(() => {
            return document.activeElement?.tagName;
          });

          expect(focusedElement).toBeDefined();
          expect(focusedElement).not.toBe('BODY');
        });

        test(`should work on mobile viewport on ${slug}`, async ({ page }) => {
          await page.setViewportSize({ width: 375, height: 667 });

          // Content should be visible and readable - use specific selector
          const heading = page.locator('main h1').first();
          await expect(heading).toBeVisible();

          const main = page.locator('main');
          await expect(main).toBeVisible();
        });

        test(`should link back to courses catalog from ${slug}`, async ({ page }) => {
          // Find link back to /courses (breadcrumb or button)
          const catalogLink = page.locator('a[href="/courses"]').first();

          if (await catalogLink.isVisible()) {
            await catalogLink.click();
            await expect(page).toHaveURL(/\/courses$/);
          }
        });
      });
    });
  });

  test.describe('Course Navigation', () => {
    test('should navigate between different courses', async ({ page }) => {
      await page.goto('/courses', { waitUntil: 'networkidle' });

      // Get all course links
      const courseLinks = page.locator('a[href^="/courses/"]');
      const count = await courseLinks.count();

      if (count >= 2) {
        // Click first course and wait for navigation
        await courseLinks.first().click();
        await page.waitForURL(/\/courses\/.+/);
        const firstUrl = page.url();

        // Go back to catalog
        await page.goto('/courses', { waitUntil: 'networkidle' });

        // Click second course and wait for navigation
        await page.locator('a[href^="/courses/"]').nth(1).click();
        await page.waitForURL(/\/courses\/.+/);
        const secondUrl = page.url();

        // URLs should be different
        expect(firstUrl).not.toBe(secondUrl);
        expect(secondUrl).toMatch(/\/courses\/.+/);
      }
    });

    test('should have consistent header across all course pages', async ({ page }) => {
      // Check header on catalog - use semantic role to avoid browser extension elements
      await page.goto('/courses', { waitUntil: 'networkidle' });
      const headerOnCatalog = await page.getByRole('banner').textContent();

      // Check header on detail page
      await page.goto('/courses/my-course', { waitUntil: 'networkidle' });
      const headerOnDetail = await page.getByRole('banner').textContent();

      // Both should have navigation
      expect(headerOnCatalog).toBeTruthy();
      expect(headerOnDetail).toBeTruthy();
    });
  });
});
