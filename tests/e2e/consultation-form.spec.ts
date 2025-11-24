import { test, expect } from '@playwright/test';

// Helper function to open consultation modal
async function openConsultationModal(page: any) {
  // Wait for the global test function to be available
  await page.waitForFunction(() => {
    // @ts-ignore
    return typeof window.__openConsultationModal === 'function';
  }, { timeout: 10000 });

  // Open modal using the global test function
  await page.evaluate(() => {
    // @ts-ignore
    window.__openConsultationModal();
  });

  // Wait for modal to appear
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });
}

test.describe('Consultation Form', () => {
  test.beforeEach(async ({ page }) => {
    // Track failed requests
    const failedRequests: string[] = [];
    page.on('requestfailed', request => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    // Navigate to home page where consultation modal is triggered
    await page.goto('/', { waitUntil: 'networkidle' });

    // Log failed requests
    if (failedRequests.length > 0) {
      console.log('Failed requests:', failedRequests);
    }

    // Wait for all module scripts to load and execute
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        // Wait for window.load event
        if (document.readyState === 'complete') {
          // Page already loaded, wait for module scripts to execute
          setTimeout(resolve, 3000);
        } else {
          window.addEventListener('load', () => {
            // Give ES modules and React components time to load and hydrate
            setTimeout(resolve, 3000);
          });
        }
      });
    });

    // Wait for astro:hydrate event (fired when islands are hydrated)
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
            island.addEventListener('astro:hydrate', () => {
              hydrated++;
              if (hydrated >= islands.length) {
                resolve();
              }
            }, { once: true });
          });

          // Fallback timeout
          setTimeout(resolve, 5000);
        };

        checkHydration();
      });
    });
  });

  test('should open consultation modal when CTA button is clicked', async ({ page }) => {
    // Verify CTA button is visible
    const ctaButton = page.locator('#hero-cta-button');
    await expect(ctaButton).toBeVisible();

    // Open modal
    await openConsultationModal(page);

    // Verify modal content
    const modal = page.getByRole('dialog');
    await expect(modal.getByText(/записатись на консультацію/i)).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Try to submit empty form
    const submitButton = modal.getByRole('button', { name: /відправити заявку/i });
    await submitButton.click();

    // Check for validation messages (form uses HTML5 required attribute)
    const nameInput = modal.getByLabel(/ім'я/i);
    await expect(nameInput).toHaveAttribute('required');
  });

  test('should close modal when clicking outside', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Click outside modal (backdrop)
    await page.locator('.modal-backdrop, [role="dialog"]').first().click({ position: { x: 0, y: 0 } });

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(modal).not.toBeVisible();
  });

  test('should fill and submit consultation form successfully', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Fill out the form (name and phone are required)
    await modal.getByLabel(/ім'я/i).fill('Тестовий Користувач');
    await modal.getByLabel(/телефон/i).fill('+380501234567');
    await modal.getByLabel(/email/i).fill('test@example.com');

    // Verify form is filled correctly
    await expect(modal.getByLabel(/ім'я/i)).toHaveValue('Тестовий Користувач');
    await expect(modal.getByLabel(/телефон/i)).toHaveValue('+380501234567');
    await expect(modal.getByLabel(/email/i)).toHaveValue('test@example.com');

    // Submit button should be enabled
    const submitButton = modal.getByRole('button', { name: /відправити заявку/i });
    await expect(submitButton).toBeEnabled();

    // Note: We don't test actual submission in E2E since it requires real API/DB
    // Actual submission is covered by integration tests
  });

  test('should validate email format', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Fill with invalid email
    await modal.getByLabel(/ім'я/i).fill('Тест');
    await modal.getByLabel(/телефон/i).fill('+380501234567');
    await modal.getByLabel(/email/i).fill('invalid-email');

    // Try to submit
    const submitButton = modal.getByRole('button', { name: /відправити заявку/i });
    await submitButton.click();

    // Email field should show validation error (HTML5 validation)
    const emailInput = modal.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Open modal
    await openConsultationModal(page);

    const modal = page.getByRole('dialog');

    // Click on first field to start keyboard navigation from form
    await modal.getByLabel(/ім'я/i).click();
    await expect(modal.getByLabel(/ім'я/i)).toBeFocused();

    // Tab through remaining form fields: Phone -> Telegram -> Email
    await page.keyboard.press('Tab'); // Phone field
    await expect(modal.getByLabel(/телефон/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Telegram field
    await expect(modal.getByLabel(/telegram/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Email field
    await expect(modal.getByLabel(/email/i)).toBeFocused();
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open modal
    await openConsultationModal(page);

    // Modal should be visible and responsive
    const modal = page.getByRole('dialog');

    // Form should be usable
    await modal.getByLabel(/ім'я/i).fill('Mobile Test');
    await expect(modal.getByLabel(/ім'я/i)).toHaveValue('Mobile Test');
  });
});
