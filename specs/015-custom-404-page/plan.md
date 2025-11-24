# Implementation Plan: Custom 404 Error Page

**Branch**: `015-custom-404-page` | **Date**: 2025-11-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-custom-404-page/spec.md`

## Summary

Create a custom 404 error page for the Zhulova coaching website with minimalist elegant design matching the "Soft Luxury Coach" aesthetic. The page will feature empathetic Ukrainian messaging, responsive layout (mobile/tablet/desktop), WCAG AA accessibility compliance, and subtle fade-in animation.

**Technical Approach**: Single Astro page (`404.astro`) using existing BaseLayout and design system components. No new dependencies required - leverages existing Tailwind CSS, typography, and color tokens.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Astro 4.x
**Primary Dependencies**: Astro (existing), Tailwind CSS 3.x (existing), React 18.x (for Button component if needed)
**Storage**: N/A (static page, no data persistence)
**Testing**: Playwright E2E tests, axe-core accessibility audit, Lighthouse CI
**Target Platform**: Web (CDN-delivered static HTML)
**Project Type**: Web application (static site)
**Performance Goals**: Lighthouse 85+, LCP <2.5s, page load <1s on 4G
**Constraints**: <50KB total page weight, zero JavaScript required for core functionality
**Scale/Scope**: Single page addition to existing site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | ✅ PASS | 404.astro is pre-rendered at build time, no SSR |
| II. Performance-First | ✅ PASS | Minimal page (<50KB), no heavy assets, lazy-loaded nothing |
| III. Simplicity Over Tooling | ✅ PASS | No new dependencies, reuses existing components |
| IV. Accessibility-First | ✅ PASS | WCAG AA compliance built into requirements |
| V. TypeScript Strict Mode | ✅ PASS | Typed Props interface for component |
| VI. Design System Consistency | ✅ PASS | Navy/gold colors, Playfair/Inter fonts, Tailwind utilities |

**Gate Result**: ✅ ALL GATES PASSED - Proceeding with implementation

## Project Structure

### Documentation (this feature)

```text
specs/015-custom-404-page/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file
├── research.md          # Best practices research (completed)
├── quickstart.md        # Implementation guide
├── checklists/
│   └── requirements.md  # Quality checklist (completed)
└── tasks.md             # Task breakdown (next phase)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── 404.astro        # NEW: Custom 404 error page
├── components/
│   ├── common/
│   │   └── Button.tsx   # REUSE: Existing button component
│   └── layout/
│       └── BaseLayout.astro  # REUSE: Existing layout with SEO
├── styles/
│   └── global.css       # EXISTING: Contains animation utilities
└── layouts/
    └── BaseLayout.astro # EXISTING: Page wrapper

tests/
└── e2e/
    └── 404.spec.ts      # NEW: E2E tests for 404 page
```

**Structure Decision**: Single page addition to existing Astro pages structure. No new directories needed - follows established patterns.

## Design Decisions

### D1: Page Layout Strategy

**Decision**: Centered content with vertical stacking
**Rationale**: Matches minimalist aesthetic, works well across all breakpoints, reduces cognitive load
**Alternative Rejected**: Split layout (image + text) - adds complexity, requires additional assets

### D2: Animation Approach

**Decision**: CSS-only fade-in animation with `prefers-reduced-motion` support
**Rationale**: No JavaScript dependency, native browser support, respects accessibility preferences
**Alternative Rejected**: JavaScript animation library - adds bundle size, complexity

### D3: CTA Structure

**Decision**: 1 primary button + 2 text links
**Rationale**: Clear visual hierarchy, reduces choice paralysis (research shows 3 options optimal)
**Alternative Rejected**: Multiple buttons of equal weight - dilutes primary action

### D4: Typography Hierarchy

**Decision**: "404" as decorative element (not h1), page title as h1
**Rationale**: "404" is visual indicator, not semantic heading. Screen readers should announce meaningful title first
**Alternative Rejected**: "404" as h1 - poor screen reader experience

## Implementation Phases

### Phase 1: Core Page Structure
- Create `src/pages/404.astro` with BaseLayout
- Add semantic HTML structure
- Implement Ukrainian messaging

### Phase 2: Styling & Responsiveness
- Apply Tailwind CSS classes
- Implement mobile-first responsive design
- Add fade-in animation with reduced-motion support

### Phase 3: Navigation & CTAs
- Primary CTA button linking to home
- Secondary text links for courses and contacts
- Proper focus states and keyboard navigation

### Phase 4: Testing & Validation
- E2E tests for all user flows
- Accessibility audit (axe-core)
- Lighthouse performance check
- Cross-browser testing

## Complexity Tracking

> No constitution violations. All requirements align with existing architecture.

| Aspect | Complexity | Justification |
|--------|------------|---------------|
| New Dependencies | None | Reuses existing stack |
| Component Changes | None | Uses existing Button, BaseLayout |
| Build Changes | None | Astro handles 404.astro automatically |
| Test Coverage | Low | Single page, 5-6 E2E scenarios |

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Vercel 404 routing issues | Low | Medium | Test on preview deployment before merge |
| Animation performance | Low | Low | CSS-only, hardware accelerated |
| Color contrast issues | Low | High | Use established color tokens, verify with axe-core |

## Next Steps

1. Run `/speckit.tasks` to generate task breakdown
2. Implement Phase 1-4 sequentially
3. Validate against success criteria in spec.md
