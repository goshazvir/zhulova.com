# Implementation Plan: PageSpeed Accessibility Optimization

**Branch**: `017-pagespeed-a11y` | **Date**: 2025-11-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-pagespeed-a11y/spec.md`

## Summary

Fix accessibility and performance issues identified by PageSpeed Insights:

**Accessibility (target: 100/100)**:
1. Add proper ARIA tablist structure to QuestionsSection tabs
2. Improve color contrast for gold text elements across multiple sections
3. Increase touch target size for carousel indicators

**Performance (target: 90+)**:
4. Fix render-blocking CSS and fonts (save 400-1740ms)
5. Optimize hero image with responsive srcset (save 19-52KB)
6. Eliminate forced reflows in CaseStudiesSection carousel
7. Reduce LCP from 3.1s to <2.5s

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Astro 4.x, Tailwind CSS 3.x
**Storage**: N/A (no data changes)
**Testing**: Lighthouse CI, PageSpeed Insights, axe-core
**Target Platform**: Web (all browsers, mobile + desktop)
**Project Type**: Web application (static site)
**Performance Goals**: Lighthouse Accessibility 100/100, Performance 90+, LCP <2.5s
**Constraints**: Changes must not break existing functionality or visual design
**Scale/Scope**: 6 components affected + BaseLayout for font preloading

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First Delivery | ✅ Pass | No server-side changes, CSS/HTML only |
| II. Performance-First Development | ✅ Pass | No bundle size impact, CSS changes only |
| III. Simplicity Over Tooling | ✅ Pass | Using existing Tailwind classes, no new deps |
| IV. Accessibility-First Design | ✅ Pass | **Primary goal** - fixing a11y issues |
| V. TypeScript Strict Mode | ✅ Pass | Minor JS changes follow existing patterns |
| VI. Design System Consistency | ✅ Pass | Adjusting colors within existing palette |

**All gates passed. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/017-pagespeed-a11y/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Color contrast research, ARIA patterns
├── quickstart.md        # Implementation guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to modify)

```text
src/components/sections/
├── QuestionsSection.astro    # ARIA tablist structure (FR-001 to FR-004)
├── StatsSection.astro        # Color contrast fix (FR-005)
├── CaseStudiesSection.astro  # Color contrast + touch targets + forced reflow fix (FR-006, FR-009-011, FR-021)
├── TestimonialsSection.astro # Color contrast fix (FR-007)
└── HeroSection.astro         # Responsive hero image (FR-018, FR-019)

src/layouts/
└── BaseLayout.astro          # Font preloading (FR-015)

src/styles/
└── global.css                # Font-display: swap for Google Fonts (FR-015)
```

**Structure Decision**: Modifying existing Astro components. No new files needed.

## Complexity Tracking

> No constitution violations. All changes follow existing patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
