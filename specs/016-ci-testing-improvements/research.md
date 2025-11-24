# Research: CI/CD Testing Improvements

**Feature**: 016-ci-testing-improvements
**Date**: 2024-11-24
**Status**: Complete

## Research Questions

### RQ1: What color provides sufficient contrast for the 404 page?

**Decision**: Use `text-navy-600` instead of `text-gold-600`

**Rationale**:
- `text-gold-600` (#b8941f) on white (#ffffff) = 2.87:1 contrast (FAILS WCAG AA)
- `text-navy-600` (#4a5568 equivalent) on white (#ffffff) = 5.9:1 contrast (PASSES WCAG AA)
- `text-navy-600` is already used for other secondary links on the page
- Brand consistency maintained (navy is a primary brand color)

**Alternatives considered**:
- `text-gold-700` - Still insufficient contrast (~3.5:1)
- `text-gold-800` - Acceptable contrast but loses gold brand feel
- `text-navy-900` - High contrast (>7:1) but too heavy for secondary links

### RQ2: What ESLint configuration is best for Astro + React + TypeScript?

**Decision**: ESLint 9.x flat config with Astro and TypeScript plugins

**Rationale**:
- ESLint 9.x uses flat config (`eslint.config.js`) - modern standard
- Astro has official `eslint-plugin-astro` for `.astro` file support
- TypeScript support via `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`
- Minimal rules (errors only, no style opinions - Prettier handles formatting)

**Configuration approach**:
```javascript
// eslint.config.js
export default [
  // Base TypeScript config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    }
  },
  // Astro config
  {
    files: ['**/*.astro'],
    plugins: { astro },
    processor: 'astro/astro',
  },
  // Ignore patterns
  {
    ignores: ['dist/', 'node_modules/', '.astro/']
  }
];
```

**Alternatives considered**:
- Biome (faster, but less ecosystem support for Astro)
- ESLint 8.x legacy config - deprecated, not recommended for new projects
- Stricter ruleset - would require fixing many existing issues

### RQ3: What tests are needed for MobileMenu to reach 80% coverage?

**Decision**: 9 test cases covering all branches and functionality

**Analysis of MobileMenu component** (252 lines):

| Code Section | Lines | Current Coverage | Tests Needed |
|--------------|-------|------------------|--------------|
| Escape key handler | 15-29 | 0% | 1-2 tests |
| Path detection | 32-34 | 0% | Mocked |
| handleNavClick | 36-46 | 0% | 2 tests |
| getNavItemClasses | 48-54 | 0% | 1 test |
| getPageNavItemClasses | 56-59 | 0% | 1 test |
| Render (closed) | 61 | 100% | Existing |
| Render (open) | 63-249 | 0% | 3-4 tests |

**Test cases**:
1. `renders null when menu is closed` - verify early return
2. `renders menu panel when open` - verify dialog appears
3. `closes menu on close button click` - verify closeMobileMenu called
4. `closes menu on backdrop click` - verify closeMobileMenu called
5. `closes menu on Escape key press` - verify keyboard handler
6. `renders main navigation links` - verify 6 links for main variant
7. `renders legal navigation links` - verify 3 links for legal variant
8. `applies active styles to current section` - verify activeSection styling
9. `calls scrollToSection on home page` - verify smooth scroll behavior

**Mocking strategy**:
- Mock `useUIStore` to control state
- Mock `scrollToSection` to verify calls
- Mock `window.location.pathname` for path detection

### RQ4: Where should ESLint step be placed in CI workflow?

**Decision**: Add lint step as first step after dependency installation, before unit tests

**Rationale**:
- Linting is fastest check (~5-10 seconds)
- Should fail fast before slower tests run
- Follows fast-fail pattern already established

**Workflow structure**:
```yaml
jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  unit-tests:
    needs: lint  # Only run if lint passes
    ...

  e2e-tests:
    needs: unit-tests  # Only run if unit tests pass
    ...
```

**Alternative considered**:
- Lint as part of unit-tests job - Would not provide fast feedback
- Lint after tests - Defeats purpose of catching issues early
- Parallel lint and unit tests - Acceptable but sequential is simpler

## Implementation Order

1. **US1: Fix 404 contrast** (10 min)
   - Simple CSS class change
   - Verify with axe-core test

2. **US2: Add ESLint** (30 min)
   - Install dependencies
   - Create config
   - Add CI step
   - Fix any existing issues

3. **US3: MobileMenu tests** (60 min)
   - Write 9 test cases
   - Verify 80%+ coverage

**Total estimated time**: ~2 hours

## References

- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro)
- [Vitest Testing React](https://vitest.dev/guide/testing-ui.html)
