# Testing Setup Guide

## Unit Testing Stack

### Core Testing Framework

```json
{
  "devDependencies": {
    // Test Runner
    "vitest": "^1.0.0",

    // React Testing (RTL)
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",

    // DOM Environment
    "happy-dom": "^12.0.0", // Faster than jsdom

    // Utilities
    "@vitest/ui": "^1.0.0", // Visual test runner
    "@vitest/coverage-v8": "^1.0.0" // Coverage reports
  }
}
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        '**/*.d.ts',
        '**/*.stories.tsx'
      ]
    }
  }
});
```

### Test Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Example Component Test with RTL

```typescript
// src/components/Button/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-navy-900');
  });

  it('is keyboard accessible', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Press me</Button>);

    const button = screen.getByRole('button');
    button.focus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## E2E Testing with Playwright

### Installation

```bash
npm install -D @playwright/test
npx playwright install
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ],

  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: !process.env.CI
  }
});
```

### Example E2E Test

```typescript
// tests/e2e/consultation-form.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Consultation Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('submits form successfully', async ({ page }) => {
    // Open modal
    await page.click('button:has-text("Безкоштовна консультація")');

    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=Дякуємо')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.click('button:has-text("Безкоштовна консультація")');
    await page.click('button[type="submit"]');

    // Check validation messages
    await expect(page.locator('text=обов\'язкове')).toBeVisible();
  });
});
```

## Lighthouse CI Testing

### Setup

```bash
npm install -D @lhci/cli
```

### Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/courses',
        'http://localhost:4321/contacts'
      ],
      numberOfRuns: 3
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### GitHub Action

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Testing Priorities

### 1. Unit Tests (Vitest + RTL)
- Components in `src/components/common/`
- Utility functions in `src/utils/`
- Zustand stores in `src/stores/`

### 2. Integration Tests
- API endpoint `/api/submit-lead`
- Form submissions
- Modal interactions

### 3. E2E Tests (Playwright)
- Critical user journeys
- Form submission flow
- Navigation between pages
- Responsive design

### 4. Performance Tests (Lighthouse CI)
- Automated on every PR
- Blocks merge if scores < 95
- Tracks Core Web Vitals trends

## Commands

```bash
# Unit tests
npm run test           # Run tests
npm run test:ui        # Visual test runner
npm run test:coverage  # Coverage report

# E2E tests
npm run test:e2e       # Run Playwright tests
npx playwright test --ui  # Visual debugger

# Performance tests
npm run lighthouse     # Run Lighthouse locally
lhci autorun          # Run Lighthouse CI
```

## Coverage Goals

- Unit tests: 80% coverage
- Critical paths: 100% E2E coverage
- Lighthouse: 95+ on all metrics
- Accessibility: Zero violations