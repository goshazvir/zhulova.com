# Implementation Plan: CI/CD Testing Improvements

**Branch**: `016-ci-testing-improvements` | **Date**: 2024-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-ci-testing-improvements/spec.md`

## Summary

Fix three CI/CD issues identified during code review:
1. **Accessibility**: Fix color contrast on 404 page (gold text fails WCAG AA)
2. **CI Pipeline**: Add ESLint to catch bugs before tests run
3. **Test Coverage**: Improve MobileMenu from 44% to 80%+ coverage

All fixes are minimal effort with high impact on code quality and accessibility compliance.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Astro 4.x, React 18.x, Tailwind CSS 3.x, Vitest 4.x, ESLint 9.x (to be added)
**Storage**: N/A (no data changes)
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Static web (Vercel CDN)
**Project Type**: Web application (Astro SSG)
**Performance Goals**: CI execution <5 minutes, 80%+ test coverage
**Constraints**: No increase in bundle size, maintain WCAG AA compliance
**Scale/Scope**: 3 files modified, 1 new config file, ~100 lines of new tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | ✅ Pass | No SSR changes, all static content |
| II. Performance-First | ✅ Pass | No bundle size increase, CI <5min |
| III. Simplicity Over Tooling | ✅ Pass | ESLint is standard tool, minimal config |
| IV. Accessibility-First | ✅ Pass | Fixing a11y violation (color contrast) |
| V. TypeScript Strict Mode | ✅ Pass | All code in strict mode |
| VI. Design System | ✅ Pass | Using existing Tailwind colors |

**Result**: All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/016-ci-testing-improvements/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research findings
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (by /speckit.tasks)
```

### Source Code (files to modify)

```text
src/
├── pages/
│   └── 404.astro                    # Fix color contrast (FR-001, FR-002)
└── components/
    └── layout/
        └── MobileMenu/
            ├── index.tsx            # Component under test
            └── MobileMenu.test.tsx  # Add comprehensive tests (FR-008-012)

.github/
└── workflows/
    └── test.yml                     # Add ESLint step (FR-004-007)

eslint.config.js                     # New: ESLint flat config (FR-006)
package.json                         # Add ESLint dependencies and scripts
```

**Structure Decision**: Using existing Astro web application structure. No new directories needed.

## Complexity Tracking

> No violations. All changes follow Constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Approach

### US1: Fix 404 Page Color Contrast (P1)

**Current state**: Link uses `text-gold-600` with contrast ratio 2.87:1
**Target state**: Link uses `text-navy-600` with contrast ratio >4.5:1

**Change**:
- File: `src/pages/404.astro`
- Replace any remaining `text-gold-600` with `text-navy-600`
- Keep `hover:text-gold-700` for hover effect (acceptable for hover states)

### US2: Add ESLint to CI (P2)

**Current state**: No linting in CI pipeline
**Target state**: ESLint runs before unit tests

**Changes**:
1. Install: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-astro`
2. Create `eslint.config.js` (flat config for ESLint 9.x)
3. Add `lint` script to `package.json`
4. Add lint step to `.github/workflows/test.yml` before unit tests

### US3: Improve MobileMenu Test Coverage (P3)

**Current state**: 1 test, 44% coverage
**Target state**: 8-10 tests, 80%+ coverage

**Test cases to add**:
1. Menu opens when `isMobileMenuOpen` is true
2. Menu closes on close button click
3. Menu closes on backdrop click
4. Menu closes on Escape key press
5. Navigation links render correctly (main variant)
6. Navigation links render correctly (legal variant)
7. Active section highlighting works
8. handleNavClick scrolls on home page
9. Social links render and have correct hrefs

## Dependencies

| Dependency | Purpose | Size Impact |
|------------|---------|-------------|
| eslint | Linting | Dev only (0KB prod) |
| @typescript-eslint/parser | TS support | Dev only |
| @typescript-eslint/eslint-plugin | TS rules | Dev only |
| eslint-plugin-astro | Astro support | Dev only |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ESLint flags existing issues | Medium | Low | Fix issues or add to `.eslintignore` |
| CI time increase >30s | Low | Low | ESLint is fast (<10s typically) |
| MobileMenu tests flaky | Low | Medium | Mock Zustand store properly |

## Success Verification

1. Run `npx playwright test tests/e2e/404-page.spec.ts` - all tests pass
2. Run `npm run lint` - exits with 0
3. Run `npm run test:coverage` - MobileMenu >80%
4. Push to feature branch - CI passes all stages
