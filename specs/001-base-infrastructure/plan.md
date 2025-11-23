# Implementation Plan: Base Infrastructure & Design System

**Branch**: `001-base-infrastructure` | **Date**: 2025-11-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-base-infrastructure/spec.md`

## Summary

Create a comprehensive foundation for the Zhulova website including a reusable BaseLayout component with full SEO support, a configured Tailwind design system with custom branding (Navy/Gold/Sage colors, Playfair Display + Inter typography), reusable Header and Footer components with responsive navigation, and global accessibility features. This infrastructure will serve as the foundation for all future pages, ensuring consistent SEO optimization, WCAG AA compliance, and Lighthouse scores of 95+ across all metrics.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Astro 4.x (SSG framework), React 18.x (interactive islands), Tailwind CSS 3.x (styling), Zustand 4.x (state management)
**Storage**: N/A (static site, no database)
**Testing**: Manual validation via Lighthouse, HTML validator, accessibility audits
**Target Platform**: Modern browsers (last 2 versions), mobile-first responsive
**Project Type**: web (static site generation)
**Performance Goals**: Lighthouse 95+ all categories, LCP <2.5s, CLS <0.1, FID <100ms
**Constraints**: <50KB HTML, <20KB CSS, <50KB JS (gzipped), <350KB total page weight
**Scale/Scope**: Foundation for ~10-20 pages, supporting thousands of concurrent users via CDN

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Validation ✅

- ✅ **Static-First Architecture**: Server mode permitted exclusively for future /api/* serverless functions (feature 005-fix-consultation-api); all pages including home/courses/contacts/privacy/terms remain pre-rendered static at build time (astro.config.mjs: `output: 'server'` with prerendering for all pages)
- ✅ **Performance Budgets**: Targets align with constitution (Lighthouse 95+, bundle limits)
- ✅ **Accessibility Requirements**: WCAG AA compliance is core requirement (User Story 5)
- ✅ **TypeScript Strict Mode**: Specified in technical context
- ✅ **Design System**: Tailwind utility-first, custom colors/typography defined

### Post-Phase 1 Validation (To be re-checked)

- [ ] Verify no server-side logic introduced
- [ ] Confirm bundle sizes within limits
- [ ] Validate accessibility patterns in components
- [ ] Check TypeScript interfaces for all props
- [ ] Ensure Tailwind-only styling (no CSS-in-JS)

## Project Structure

### Documentation (this feature)

```text
specs/001-base-infrastructure/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   └── (future: Button.astro, Card.astro)
│   └── layout/          # Layout components
│       ├── Header.astro
│       └── Footer.astro
├── layouts/
│   └── BaseLayout.astro # Main layout with SEO
├── styles/
│   └── global.css       # Global styles, fonts, accessibility
├── types/
│   └── index.ts         # TypeScript type definitions
└── stores/              # State management
    └── uiStore.ts       # Mobile menu state

public/
├── images/
│   └── og-default.jpg   # Default Open Graph image
└── robots.txt           # SEO robots file

# Config files at root
tailwind.config.mjs      # Tailwind configuration
astro.config.mjs         # Astro configuration
tsconfig.json            # TypeScript configuration
```

**Structure Decision**: Single project structure with Astro-based organization. Components are split between `components/layout/` for structural components (Header, Footer) and `layouts/` for the main page wrapper (BaseLayout). This follows Astro conventions where layouts wrap entire pages and components are reusable pieces.

## Complexity Tracking

> No violations - all implementation follows constitution principles strictly.

This implementation adheres to all five core principles without exception. The static-first architecture, performance budgets, accessibility requirements, TypeScript strict mode, and design system consistency are all maintained throughout the plan.