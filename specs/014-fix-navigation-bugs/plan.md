# Implementation Plan: Fix Navigation Bugs

**Branch**: `014-fix-navigation-bugs` | **Date**: 2024-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-fix-navigation-bugs/spec.md`

## Summary

Fix three critical navigation bugs caused by View Transitions and missing link wrappers:
1. **Footer logo** - not wrapped in link to home page from internal pages
2. **Mobile menu** - event listeners not re-initialized after View Transitions navigation
3. **Consultation modal** - CTA button event listeners not re-initialized after View Transitions navigation

**Technical approach**: Use Astro's `astro:page-load` event to re-attach event listeners after View Transitions, and conditionally render logo as link based on current page path.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Astro 4.x, React 18.x, Zustand 4.x, Tailwind CSS 3.x
**Storage**: N/A (no database changes)
**Testing**: Playwright (E2E), Vitest (unit)
**Target Platform**: Static website (CDN-delivered), all modern browsers
**Project Type**: Web application (static site with interactive islands)
**Performance Goals**: Lighthouse 95+, LCP <2.5s, CLS <0.1
**Constraints**: <50KB JS gzipped, no SSR, View Transitions must remain enabled
**Scale/Scope**: Bug fix affecting 4 components (Header, Footer, MobileMenu, HeroSection scripts)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | ✅ Pass | No SSR changes, pure client-side event handling |
| II. Performance-First | ✅ Pass | No bundle size increase, using native Astro events |
| III. Simplicity Over Tooling | ✅ Pass | Using built-in `astro:page-load` event, no new dependencies |
| IV. Accessibility-First | ✅ Pass | Logo links will have proper aria-labels, no a11y regression |
| V. TypeScript Strict Mode | ✅ Pass | All changes will be fully typed |
| VI. Design System Consistency | ✅ Pass | No visual changes, only behavior fixes |

**Gate Status**: ✅ PASSED - No violations, proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/014-fix-navigation-bugs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (files to modify)

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro       # Conditional logo link + event re-init
│   │   ├── Footer.astro       # Add conditional logo link wrapper
│   │   └── MobileMenu/
│   │       └── index.tsx      # No changes needed (React handles state)
│   └── sections/
│       └── HeroSection.astro  # Event re-initialization for CTA buttons

tests/
└── e2e/
    └── navigation-bugs.spec.ts  # New E2E tests for bug fixes
```

**Structure Decision**: Existing Astro static site structure. Modifying 3 Astro components and adding 1 E2E test file.

## Complexity Tracking

> No violations - all changes follow constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Root Cause Analysis

### Bug 1: Footer Logo Not a Link

**Current state** (`Footer.astro:61-67`):
```html
<img src="/logo-light.svg" alt="Viktoria Zhulova" class="h-10 mb-2" />
```

**Problem**: Logo is a static `<img>` without any `<a>` wrapper.

**Solution**: Conditionally wrap in `<a href="/">` when NOT on home page.

### Bug 2: Mobile Menu Not Opening

**Current state** (`Header.astro:149-159`):
```javascript
const mobileMenuButton = document.getElementById('mobile-menu-button');
if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', () => {
    useUIStore.getState().toggleMobileMenu();
  });
}
```

**Problem**: This script runs once on initial page load. With View Transitions, the DOM is swapped but the script doesn't re-run, so the new button has no event listener.

**Solution**: Use `astro:page-load` event which fires on initial load AND after every View Transition.

### Bug 3: Modal Not Opening After Navigation

**Same root cause as Bug 2** - CTA button event listeners in `HeroSection.astro` and `Footer.astro` are attached once and not re-attached after View Transitions.

**Solution**: Same pattern - use `astro:page-load` event.

## Implementation Approach

### Pattern: Astro View Transitions Event Re-initialization

```javascript
// Before (broken):
document.addEventListener('DOMContentLoaded', () => {
  // This only runs once on initial page load
  const button = document.getElementById('my-button');
  button?.addEventListener('click', handler);
});

// After (fixed):
document.addEventListener('astro:page-load', () => {
  // This runs on initial load AND after every View Transition
  const button = document.getElementById('my-button');
  button?.addEventListener('click', handler);
});
```

### Pattern: Conditional Logo Link

```astro
---
const isHomePage = Astro.url.pathname === '/' || Astro.url.pathname === '';
---

{isHomePage ? (
  <img src="/logo.svg" alt="VZ" class="..." />
) : (
  <a href="/" aria-label="На головну">
    <img src="/logo.svg" alt="VZ" class="..." />
  </a>
)}
```

## Files to Modify

| File | Change | Priority |
|------|--------|----------|
| `src/components/layout/Footer.astro` | Add conditional logo link | P1 |
| `src/components/layout/Header.astro` | Conditional logo link + `astro:page-load` event | P1 |
| `src/components/sections/HeroSection.astro` | `astro:page-load` for CTA buttons | P1 |
| `tests/e2e/navigation-bugs.spec.ts` | New E2E tests | P2 |

## Testing Strategy

### E2E Tests (Playwright)

1. **Logo navigation tests**:
   - Visit /courses → click footer logo → verify on home page
   - Visit /contacts → click header logo → verify on home page
   - Visit home → verify logo is NOT a link (no navigation on click)

2. **Mobile menu tests**:
   - Visit /courses on mobile → tap hamburger → verify menu opens
   - Navigate home → /contacts → tap hamburger → verify menu opens

3. **Modal tests**:
   - Visit home → /contacts → home → click CTA → verify modal opens
   - Navigate through multiple pages → return home → click CTA → verify modal opens

### Manual Testing

1. Test on actual mobile device (iOS Safari, Android Chrome)
2. Test keyboard navigation (Tab, Enter on logo links)
3. Test with screen reader (VoiceOver)
