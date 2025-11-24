# Research: Fix Navigation Bugs

**Feature**: 014-fix-navigation-bugs
**Date**: 2024-11-25

## Research Tasks

### 1. Astro View Transitions Event Handling

**Question**: How to properly re-initialize JavaScript event listeners after View Transitions navigation?

**Decision**: Use `astro:page-load` event

**Rationale**:
- Astro View Transitions swap DOM content but don't re-run inline `<script>` tags
- The `astro:page-load` event fires both on initial page load AND after every View Transition navigation
- This is the officially recommended pattern from Astro documentation

**Alternatives considered**:
1. ❌ `DOMContentLoaded` - Only fires once on initial load, not after View Transitions
2. ❌ `astro:after-swap` - Fires too early (before DOM is fully ready)
3. ❌ Disable View Transitions - Would degrade UX significantly
4. ✅ `astro:page-load` - Fires at the right time for both scenarios

**Documentation reference**: https://docs.astro.build/en/guides/view-transitions/#astropage-load

### 2. Conditional Link Rendering in Astro

**Question**: How to conditionally render logo as link or static image based on current page?

**Decision**: Use `Astro.url.pathname` in frontmatter to detect current page

**Rationale**:
- `Astro.url.pathname` is available in Astro components at build time
- Allows compile-time decision for static pages
- Clean ternary syntax for conditional rendering

**Code pattern**:
```astro
---
const isHomePage = Astro.url.pathname === '/' || Astro.url.pathname === '';
---

{isHomePage ? (
  <img ... />
) : (
  <a href="/"><img ... /></a>
)}
```

**Alternatives considered**:
1. ❌ Client-side JavaScript check - Causes layout shift (CLS issues)
2. ❌ CSS pointer-events - Bad for accessibility, no semantic meaning
3. ✅ Server-side conditional rendering - Clean, accessible, no CLS

### 3. Event Listener Cleanup Pattern

**Question**: Do we need to remove old event listeners before adding new ones?

**Decision**: No cleanup needed for this specific case

**Rationale**:
- With View Transitions, the old DOM elements are removed entirely
- Event listeners are garbage collected with their DOM elements
- Adding listeners via `addEventListener` is idempotent when elements are replaced

**Note**: If we were reusing the same DOM element, we would need to either:
1. Use `{ once: true }` option
2. Store reference and call `removeEventListener`
3. Use event delegation on a persistent parent

But since View Transitions replace the entire content, this is not needed.

### 4. Zustand State Persistence with View Transitions

**Question**: Does Zustand state persist across View Transitions?

**Decision**: Yes, Zustand state persists

**Rationale**:
- Zustand creates a singleton store in memory
- View Transitions only swap DOM, not JavaScript memory
- `useUIStore.getState()` returns the same store instance after navigation

**Testing confirmed**:
- `isMobileMenuOpen` state persists
- `openConsultationModal()` action works after navigation
- No state reset on View Transition

### 5. Accessibility for Conditional Links

**Question**: What accessibility considerations for conditional logo links?

**Decision**: Always include `aria-label` on link, describe destination

**Requirements**:
- When logo IS a link: `aria-label="На головну"` (or "Go to home page" in English)
- When logo is NOT a link: Just `alt` text on image is sufficient
- No `role="link"` on static images (confusing for screen readers)

**Pattern**:
```astro
{isHomePage ? (
  <img src="/logo.svg" alt="VZ" ... />
) : (
  <a href="/" aria-label="На головну" class="hover:opacity-80 transition-opacity">
    <img src="/logo.svg" alt="VZ" ... />
  </a>
)}
```

## Summary

All research questions resolved. No NEEDS CLARIFICATION items remain.

| Topic | Decision | Confidence |
|-------|----------|------------|
| Event re-initialization | `astro:page-load` event | High |
| Conditional link | `Astro.url.pathname` check | High |
| Event cleanup | Not needed (DOM replaced) | High |
| Zustand persistence | Works automatically | High |
| Accessibility | aria-label on links | High |
