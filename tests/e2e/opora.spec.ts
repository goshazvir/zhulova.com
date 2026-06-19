import { test, expect } from '@playwright/test';

test.describe('Opora landing', () => {
  test('renders all sections and CTA links', async ({ page }) => {
    await page.goto('/courses/opora');

    // H1 present and contains expected text (scoped to main to be robust with View Transitions)
    await expect(page.locator('main h1')).toContainText('сто разів чула');

    // Key section headings present
    await expect(page.getByRole('heading', { name: 'Тривога забирає не тільки настрій' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Що почне мінятися вже за три дні' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Спробуй «Опору на себе» за 9 €' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Що міняється, коли почнеш' })).toBeVisible();

    // FAQ is interactive (native details)
    const firstFaq = page.locator('details.faq-item').first();
    await expect(firstFaq).not.toHaveAttribute('open', '');
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');

    // At least one CTA present
    await expect(page.getByText('ЗАБРАТИ ЗА 9 €').first()).toBeVisible();
  });

  test('catalog links to the course and dummy pages are gone', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('link', { name: 'Дізнатись більше' })).toHaveAttribute('href', '/courses/opora');

    // Check that dummy course routes are not linked from catalog
    await expect(page.locator('a[href="/courses/my-course"]')).toHaveCount(0);
    await expect(page.locator('a[href="/courses/mindset-mastery"]')).toHaveCount(0);
    await expect(page.locator('a[href="/courses/goals-achievement"]')).toHaveCount(0);
  });
});
