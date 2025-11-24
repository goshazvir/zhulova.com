# Quickstart: Fix Navigation Bugs

**Feature**: 014-fix-navigation-bugs
**Date**: 2024-11-25

## Prerequisites

- Node.js 18+
- npm 9+
- Project cloned and dependencies installed

## Quick Setup

```bash
# Switch to feature branch
git checkout 014-fix-navigation-bugs

# Install dependencies (if not already)
npm install

# Start dev server
npm run dev
```

## Bug Reproduction Steps

### Bug 1: Footer Logo Not a Link
1. Open http://localhost:4321/courses
2. Scroll to footer
3. Click on VZ logo → **Expected**: Navigate to home | **Actual**: Nothing happens

### Bug 2: Mobile Menu Not Opening
1. Open http://localhost:4321/courses
2. Resize browser to mobile width (< 768px)
3. Click hamburger menu icon → **Expected**: Menu opens | **Actual**: Nothing happens

### Bug 3: Modal Not Opening After Navigation
1. Open http://localhost:4321 (home page)
2. Navigate to /contacts (click "Контакти" link)
3. Navigate back to home (click header logo or use browser back)
4. Click any "Записатись на розбір" button → **Expected**: Modal opens | **Actual**: Nothing happens

## Files to Modify

| File | What to Change |
|------|----------------|
| `src/components/layout/Footer.astro` | Add conditional logo link wrapper |
| `src/components/layout/Header.astro` | Add conditional logo link + `astro:page-load` for mobile menu |
| `src/components/sections/HeroSection.astro` | Change to `astro:page-load` for CTA buttons |

## Implementation Pattern

### Pattern 1: Conditional Logo Link

```astro
---
// In frontmatter
const isHomePage = Astro.url.pathname === '/' || Astro.url.pathname === '';
---

<!-- In template -->
{isHomePage ? (
  <img src="/logo.svg" alt="VZ" class="h-10" />
) : (
  <a href="/" aria-label="На головну" class="hover:opacity-80 transition-opacity">
    <img src="/logo.svg" alt="VZ" class="h-10" />
  </a>
)}
```

### Pattern 2: Event Re-initialization with View Transitions

```javascript
// Change from:
document.addEventListener('DOMContentLoaded', () => {
  // ... event listeners
});

// To:
document.addEventListener('astro:page-load', () => {
  // ... event listeners (runs on initial load AND after View Transitions)
});
```

## Testing Commands

```bash
# Run E2E tests
npx playwright test tests/e2e/navigation-bugs.spec.ts --project=chromium

# Run all E2E tests
npm run test:e2e

# Run unit tests
npm run test:run

# Build and check types
npm run build
```

## Verification Checklist

After implementing fixes:

- [ ] Footer logo links to home from /courses
- [ ] Footer logo links to home from /contacts
- [ ] Footer logo is NOT a link on home page
- [ ] Header logo links to home from internal pages
- [ ] Header logo is NOT a link on home page
- [ ] Mobile menu opens on /courses
- [ ] Mobile menu opens on /contacts
- [ ] Mobile menu opens on /courses/* (detail pages)
- [ ] CTA modal opens after: home → contacts → home
- [ ] CTA modal opens after: home → courses → home
- [ ] All E2E tests pass
- [ ] Build succeeds (`npm run build`)
- [ ] No accessibility regressions (keyboard navigation works)

## Common Issues

### Issue: Logo still not linking
**Check**: Ensure `Astro.url.pathname` comparison handles both `/` and empty string

### Issue: Event listeners firing multiple times
**Solution**: View Transitions replace DOM, so old listeners are garbage collected. If not using View Transitions on some pages, add cleanup logic.

### Issue: Modal opens but immediately closes
**Check**: Ensure no conflicting click handlers on backdrop or close buttons

## Related Documentation

- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [astro:page-load event](https://docs.astro.build/en/guides/view-transitions/#astropage-load)
- [Zustand with React](https://docs.pmnd.rs/zustand/getting-started/introduction)
