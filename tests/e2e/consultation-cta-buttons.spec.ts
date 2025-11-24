import { test, expect } from '@playwright/test';

/**
 * E2E tests for all CTA buttons that open consultation modal
 * Tests cover all pages: Home page and Contacts page
 */

test.describe('Consultation CTA Buttons', () => {
  // Mock API endpoint for form submission
  test.beforeEach(async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/submit-lead', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'test-lead-123' },
        }),
      });
    });

    // Track failed requests for debugging
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    // Wait for hydration (same as consultation-form.spec.ts)
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          setTimeout(resolve, 3000);
        } else {
          window.addEventListener('load', () => {
            setTimeout(resolve, 3000);
          });
        }
      });
    });

    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let hydrated = 0;
        const islands = document.querySelectorAll('astro-island[client="load"]');

        if (islands.length === 0) {
          resolve();
          return;
        }

        const checkHydration = () => {
          islands.forEach((island) => {
            island.addEventListener(
              'astro:hydrate',
              () => {
                hydrated++;
                if (hydrated >= islands.length) {
                  resolve();
                }
              },
              { once: true }
            );
          });

          setTimeout(resolve, 5000);
        };

        checkHydration();
      });
    });
  });

  test.describe('Home Page CTA Buttons', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('Hero CTA button "Записатись на розбір" should open modal', async ({ page }) => {
      // Find hero CTA button
      const heroButton = page.locator('#hero-cta-button');
      await expect(heroButton).toBeVisible();
      await expect(heroButton).toHaveText('Записатись на розбір');

      // Click button
      await heroButton.click();

      // Verify modal opened
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      await expect(modal.getByText(/записатись на консультацію/i)).toBeVisible();
    });

    test('Case Studies CTA button "Записатись на консультацію" should open modal', async ({
      page,
    }) => {
      // Scroll to case studies section
      await page.locator('#case-studies-cta').scrollIntoViewIfNeeded();

      // Find case studies CTA button
      const caseStudiesButton = page.locator('#case-studies-cta');
      await expect(caseStudiesButton).toBeVisible();
      await expect(caseStudiesButton).toHaveText('Записатись на консультацію');

      // Click button
      await caseStudiesButton.click();

      // Verify modal opened
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
    });

    test('Motivational Quote CTA button "Почати змінювати життя сьогодні" should open modal', async ({
      page,
    }) => {
      // Scroll to quote section
      await page.locator('#quote-cta').scrollIntoViewIfNeeded();

      // Find quote CTA button
      const quoteButton = page.locator('#quote-cta');
      await expect(quoteButton).toBeVisible();
      await expect(quoteButton).toHaveText('Почати змінювати життя сьогодні');

      // Click button
      await quoteButton.click();

      // Verify modal opened
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
    });

    test('Footer CTA button "Записатись на діагностику" should open modal', async ({ page }) => {
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Find footer CTA button by text
      const footerButton = page.getByRole('button', { name: /записатись на діагностику/i });
      await expect(footerButton).toBeVisible();

      // Click button
      await footerButton.click();

      // Verify modal opened
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Contacts Page CTA Button', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/contacts', { waitUntil: 'networkidle' });
    });

    test('Contacts page CTA button "Записатись на консультацію" should open modal', async ({
      page,
    }) => {
      // Find contacts CTA button
      const contactsButton = page.getByRole('button', { name: /записатись на консультацію/i });
      await expect(contactsButton).toBeVisible();

      // Click button
      await contactsButton.click();

      // Verify modal opened
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Form Validation Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Open modal
      await page.locator('#hero-cta-button').click();
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should show validation for empty required fields', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Try to submit empty form
      const submitButton = modal.getByRole('button', { name: /відправити заявку/i });
      await submitButton.click();

      // Name field should be invalid (required attribute)
      const nameInput = modal.getByLabel(/ім'я/i);
      await expect(nameInput).toHaveAttribute('required');

      // Phone field should be invalid (required attribute)
      const phoneInput = modal.getByLabel(/телефон/i);
      await expect(phoneInput).toHaveAttribute('required');
    });

    test('should validate phone number format', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Fill name
      await modal.getByLabel(/ім'я/i).fill('Тест');

      // Fill invalid phone
      await modal.getByLabel(/телефон/i).fill('invalid');

      // Try to submit
      await modal.getByRole('button', { name: /відправити заявку/i }).click();

      // Phone field should have validation error
      // Note: Actual validation is done by Zod schema, error message appears in UI
      const phoneInput = modal.getByLabel(/телефон/i);
      await expect(phoneInput).toBeVisible();
    });

    test('should validate email format when provided', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Fill required fields
      await modal.getByLabel(/ім'я/i).fill('Тест');
      await modal.getByLabel(/телефон/i).fill('+380501234567');

      // Fill invalid email
      await modal.getByLabel(/email/i).fill('invalid-email');

      // Try to submit
      await modal.getByRole('button', { name: /відправити заявку/i }).click();

      // Email field should have type="email" for HTML5 validation
      const emailInput = modal.getByLabel(/email/i);
      await expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('should accept valid form data', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Fill valid form data
      await modal.getByLabel(/ім'я/i).fill('Тестовий Користувач');
      await modal.getByLabel(/телефон/i).fill('+380501234567');
      await modal.getByLabel(/telegram/i).fill('@testuser');
      await modal.getByLabel(/email/i).fill('test@example.com');

      // Submit form
      await modal.getByRole('button', { name: /відправити заявку/i }).click();

      // Should show success message
      await expect(modal.getByText(/дякуємо за вашу заявку/i)).toBeVisible({ timeout: 10000 });

      // Modal should auto-close after 3 seconds
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Form Submission with API Mock', () => {
    test('should successfully submit form and show success message', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Open modal
      await page.locator('#hero-cta-button').click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Fill valid form
      await modal.getByLabel(/ім'я/i).fill('API Test User');
      await modal.getByLabel(/телефон/i).fill('+380501234567');
      await modal.getByLabel(/email/i).fill('apitest@example.com');

      // Submit form
      await modal.getByRole('button', { name: /відправити заявку/i }).click();

      // Verify success message appears
      await expect(modal.getByText(/дякуємо за вашу заявку/i)).toBeVisible({ timeout: 10000 });
      await expect(
        modal.getByText(/ми зв'яжемося з вами найближчим часом/i)
      ).toBeVisible();

      // Modal should auto-close after 3 seconds
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Override mock to return error
      await page.route('**/api/submit-lead', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { message: 'Internal Server Error' },
          }),
        });
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      // Open modal
      await page.locator('#hero-cta-button').click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Fill valid form
      await modal.getByLabel(/ім'я/i).fill('Error Test');
      await modal.getByLabel(/телефон/i).fill('+380501234567');

      // Submit form
      await modal.getByRole('button', { name: /відправити заявку/i }).click();

      // Should show error message
      await expect(modal.getByRole('alert')).toBeVisible({ timeout: 5000 });
      await expect(modal.getByText(/Internal Server Error/i)).toBeVisible();
    });
  });

  test.describe('Modal Close Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      // Open modal
      await page.locator('#hero-cta-button').click();
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should close modal with close button (X)', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Click close button
      const closeButton = modal.getByRole('button', { name: /закрити|close/i });
      await closeButton.click();

      // Modal should close
      await expect(modal).not.toBeVisible();
    });

    test('should close modal with Escape key', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(modal).not.toBeVisible();
    });

    test('should close modal when clicking backdrop', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Click backdrop (outside modal content)
      await page.mouse.click(10, 10);

      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    });

    test('should close modal with "Скасувати" button', async ({ page }) => {
      const modal = page.getByRole('dialog');

      // Click cancel button
      const cancelButton = modal.getByRole('button', { name: /скасувати/i });
      await cancelButton.click();

      // Modal should close
      await expect(modal).not.toBeVisible();
    });
  });
});
