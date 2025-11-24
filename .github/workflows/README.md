# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing and performance monitoring.

## Workflows Overview

### 🧪 `test.yml` - Automated Testing
**Triggers:** Pull requests and pushes to `main`/`master`

**Jobs:**
1. **Unit Tests** (Vitest) - Runs first
   - Executes 78 unit tests for components, utils, and stores
   - Generates coverage report (uploaded for 14 days)
   - Comments coverage summary on PR
   - Fast execution (~30 seconds)

2. **E2E Tests** (Playwright) - Runs only if unit tests pass ✅
   - Executes 73 end-to-end tests
   - Tests only Chromium on CI (90% of users, 4x faster)
   - Locally tests all browsers: Chrome, Firefox, Safari, Mobile
   - HTML report uploaded for 30 days
   - Screenshots/traces uploaded only on failure (7 days retention)
   - Comments test results on PR

3. **Test Summary** - Always runs
   - Shows overall pass/fail status
   - Fails workflow if any test suite failed

**Key Features:**
- ✅ **Fast-fail pattern**: E2E tests skip if unit tests fail → saves CI minutes
- ✅ **Smart artifact retention**:
  - Coverage: 14 days (trend analysis)
  - E2E reports: 30 days (historical data)
  - Screenshots: 7 days (recent failures only)
- ✅ **Optimized CI execution**: Only Chromium (2-3 min vs 10-15 min)
- ✅ **PR comments**: Auto-posts coverage and test results

**Estimated CI time:**
- Unit tests pass + E2E tests pass: ~3-4 minutes
- Unit tests fail: ~30 seconds (E2E skipped)
- E2E tests fail: ~4-5 minutes (with retries)

---

### ⚡ `performance-gate.yml` - Performance Requirements
**Triggers:** Pull requests to `main`/`master`

**Checks:**
1. **Lighthouse CI**
   - Performance: 85+ (warn)
   - Accessibility: 90+ (error) ✅
   - Best Practices: 85+ (warn)
   - SEO: 90+ (error) ✅

2. **Bundle Size**
   - JavaScript: < 100KB gzipped ✅
   - CSS: < 20KB gzipped ✅

**Result:** Comments performance scores on PR. Blocks merge if accessibility or SEO fail.

---

### 📊 `performance-monitor.yml` - Daily Performance Tracking
**Triggers:** Daily at 6:00 AM UTC

**Monitors:**
- Production site performance
- Core Web Vitals trends
- Creates issue if performance degrades

---

### 🚨 `performance-alerts.yml` - Production Monitoring
**Triggers:** Daily at 8:00 AM UTC

**Monitors:**
- Production Lighthouse scores
- Alerts on degradation
- Uses GitHub Issues for notifications

---

## CI/CD Strategy

### Sequential Execution Pattern
```
PR Created/Updated
│
├─ test.yml (parallel to performance-gate.yml)
│  ├─ Unit Tests (30s)
│  │  └─ FAIL? → Stop, skip E2E ❌
│  │  └─ PASS? → Continue to E2E ✅
│  │
│  ├─ E2E Tests (3-4 min)
│  │  └─ Run only Chromium on CI
│  │  └─ Upload artifacts on failure
│  │
│  └─ Test Summary
│     └─ Overall pass/fail status
│
└─ performance-gate.yml (parallel to test.yml)
   ├─ Lighthouse CI
   ├─ Bundle size check
   └─ Comment results on PR
```

### Why Sequential (Unit → E2E)?

**Cost Efficiency** 💰
- Unit tests: cheap (seconds)
- E2E tests: expensive (minutes)
- Don't run E2E if unit tests fail → saves 3-4 minutes per failed build

**Fast Feedback** 🚀
- Unit test failures reported in ~30 seconds
- Developers can fix quickly without waiting for E2E

**Logical Flow** 🧩
- If basic units are broken, integration tests will fail anyway
- Fix foundations first, then test integration

---

## Local Development

### Running Tests Locally

```bash
# Unit tests (all browsers/devices)
npm run test              # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage

# E2E tests (all 5 projects: Chromium, Firefox, Safari, Mobile Chrome, Mobile Safari)
npm run test:e2e          # Headless
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:report   # View last report

# Quick test (Chromium only)
npx playwright test --project=chromium
```

### Simulating CI Environment

```bash
# Run tests exactly as CI does
export CI=true

# Unit tests
npm run test:run

# E2E tests (Chromium only)
npx playwright test --project=chromium

# View artifacts
open coverage/index.html
open playwright-report/index.html
```

---

## Artifact Access

### In GitHub UI
1. Go to **Actions** tab
2. Select workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `coverage-report` (14 days)
   - `playwright-report` (30 days)
   - `test-results` (7 days, only on failure)

### Artifact Retention
- **Coverage reports**: 14 days (trend analysis)
- **Playwright HTML reports**: 30 days (historical comparison)
- **Screenshots/traces**: 7 days (recent failures only)

---

## Best Practices

### ✅ DO
- Run `npm run test:run` before pushing
- Run `npm run test:e2e` for critical changes
- Check coverage reports for new code
- Review E2E failures in Playwright UI (`npm run test:e2e:ui`)

### ❌ DON'T
- Don't use `test.only()` (blocked by CI with `forbidOnly`)
- Don't commit without tests for new features
- Don't ignore E2E failures (they represent real user issues)
- Don't push `test-results/` or `playwright-report/` (in `.gitignore`)

---

## Troubleshooting

### "Unit tests passed locally but failed on CI"
- Check Node.js version (CI uses 20.x)
- Verify environment variables in GitHub Secrets
- Check for timezone-dependent tests

### "E2E tests flaky on CI"
- Playwright retries tests 2x on CI automatically
- Check `trace` artifact for detailed debugging
- Use `await expect(...).toBeVisible({ timeout: 10000 })` for slow elements

### "CI is too slow"
- Unit + E2E should take ~4 minutes total
- If longer, check `workers: 1` setting (intentionally sequential on CI)
- Locally, tests run in parallel for faster feedback

### "Artifacts not found"
- Unit tests must run to generate coverage
- E2E tests must fail to generate screenshots
- Check `if: always()` and `if: failure()` conditions in workflow

---

## Monitoring & Metrics

### Key Metrics Tracked
- ✅ Unit test pass rate
- ✅ E2E test pass rate
- ✅ Code coverage (current: 40% threshold, target: 80%)
- ✅ Lighthouse scores (current: 95+ average)
- ✅ Bundle sizes (JS: ~0KB, CSS: ~12KB)

### Where to View
- **Test results**: GitHub Actions → Summary
- **Coverage trends**: Download artifacts over time
- **Performance**: Vercel Dashboard → Speed Insights
- **E2E failures**: Playwright report artifacts

---

## Future Improvements

- [ ] Increase coverage threshold from 40% → 60% → 80%
- [ ] Add visual regression testing (Playwright screenshots)
- [ ] Integrate Vercel Speed Insights API data
- [ ] Add test result trends visualization
- [ ] Setup Slack/Discord notifications for failures
