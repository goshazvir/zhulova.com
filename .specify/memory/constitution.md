<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.1.0
Modified Principles:
  - I. Static-First Architecture → Static-First Delivery (enhanced with progressive enhancement and security)
  - IV. Accessibility-First Design → Accessibility & SEO Baseline (enhanced with metadata requirements)
Added Sections:
  - III. Simplicity Over Tooling (NEW principle)
  - Core Principles expanded from 5 to 6 principles
Removed Sections: N/A
Templates Status:
  ✅ plan-template.md - Updated (Constitution Check now includes 6 principles)
  ✅ spec-template.md - Compatible (Requirements align with new principles)
  ✅ tasks-template.md - Compatible (Task organization supports all principles)
Follow-up TODOs: None
-->

# Zhulova Project Constitution

## Core Principles

### I. Static-First Delivery (NON-NEGOTIABLE)

The site ships as HTML, CSS, JS, and static assets via a CDN. No server-side execution.

**Build Strategy:**
```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
```

**Mandatory Rules:**
- Zero server-side rendering (SSR) or hybrid output modes
- No runtime database queries or API calls for SEO-critical content
- All content rendered at build time via Astro's static site generation
- React hydration only for interactive islands (forms, modals, UI state)
- **Progressive Enhancement:** Core content MUST be usable without JavaScript where feasible; degrade gracefully
- **Security:** Dynamic content, if any, is fetched client-side from public endpoints only. NEVER embed secrets in client code

**Prohibited:**
- `output: 'server'` or `output: 'hybrid'` in `astro.config.mjs`
- Server routes, runtime data fetching for critical content
- Database integrations, backend logic, Node.js server requirements
- Embedding API keys, credentials, or secrets in client-side code

**Rationale:** Ensures maximum performance, optimal SEO, zero server costs, simplest deployment model (CDN-only), and enhanced security. Static-first architecture is the foundation enabling all performance targets.

### II. Performance-First Development (NON-NEGOTIABLE)

All features MUST meet performance budgets before deployment. Performance is not negotiable.

**Core Web Vitals Targets:**
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1
- **FCP** (First Contentful Paint): <1.8s
- **TTI** (Time to Interactive): <3.5s
- **TBT** (Total Blocking Time): <200ms

**Lighthouse Score Requirements:**
- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

**Performance Budgets:**
- HTML: <50KB (gzipped)
- CSS: <20KB (gzipped)
- JavaScript: <50KB (gzipped)
- Images: WebP/AVIF, lazy-loaded below fold
- Total Page Weight: <350KB

**Rationale:** Performance directly impacts user experience, conversion rates, and SEO rankings. These targets ensure fast load times even on 3G connections, supporting the luxury coach brand positioning with a premium user experience.

### III. Simplicity Over Tooling (NON-NEGOTIABLE)

Prefer vanilla HTML/CSS/JS. Introduce build tooling only when it clearly reduces size or complexity.

**Mandatory Rules:**
- **Minimal Dependencies:** Keep dependencies minimal; justify any framework choice with clear benefits
- **Small Initial JavaScript:** Keep initial JavaScript small (<50KB gzipped); defer or lazy-load non-critical code
- **Avoid Over-Engineering:** Use the simplest solution that meets requirements
- **Framework Justification:** Current stack (Astro + React islands + Tailwind + Zustand) is approved for:
  - **Astro:** Static site generation with optimal DX and performance
  - **React:** Interactive islands only (forms, modals, state-driven UI)
  - **Tailwind:** Utility-first CSS with automatic purging
  - **Zustand:** Lightweight state management (1KB gzipped)

**Before Adding New Dependencies:**
1. Can vanilla JS/CSS solve this?
2. Does this reduce bundle size or complexity?
3. Is there a lighter alternative?
4. What's the maintenance cost?

**Prohibited:**
- ❌ Heavy libraries without clear justification (moment.js → use native Date, lodash → use native methods)
- ❌ CSS-in-JS frameworks (styled-components, emotion)
- ❌ Unnecessary build complexity
- ❌ Client-side frameworks for static content

**Rationale:** Simplicity reduces bundle size, improves maintainability, decreases build times, and minimizes technical debt. Every dependency is a liability - choose wisely.

### IV. Accessibility-First Design (WCAG AA Compliance)

All components MUST be accessible to users with disabilities. Accessibility is a requirement, not a feature.

**Mandatory Requirements:**
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Single `<h1>` per page with logical heading hierarchy (no skipping levels)
- ARIA labels for all interactive elements
- Keyboard navigation support with visible focus indicators
- Color contrast ratios: ≥4.5:1 for text, ≥3:1 for UI elements
- Respect `prefers-reduced-motion` for animations
- Alt text for all images, `aria-hidden="true"` for decorative icons
- Screen reader compatibility

**Validation:**
- Manual keyboard navigation testing
- Automated accessibility audits (pa11y, axe-core)
- Lighthouse Accessibility score ≥95

**Rationale:** Accessibility ensures the site is usable by everyone, expands audience reach, improves SEO, and is legally required in many jurisdictions. WCAG AA compliance is a professional standard for modern web applications.

**SEO Metadata Requirements:**
- **HTML Lang:** Set `lang` attribute on `<html>` tag (e.g., `<html lang="ru">`)
- **Meta Tags:** Title (50-60 chars), description (150-160 chars), canonical URL
- **Social Sharing:** Open Graph tags (og:title, og:description, og:image, og:url)
- **Twitter Cards:** twitter:card, twitter:title, twitter:description, twitter:image
- **Structured Data:** JSON-LD schema for Person/Organization/Course
- **Sitemaps:** `robots.txt` in public/, `sitemap.xml` auto-generated

### V. TypeScript Strict Mode & Type Safety

All code MUST use TypeScript in strict mode. No `any` types without explicit justification.

**Code Quality Standards:**
- TypeScript strict mode enabled (`"strict": true`)
- All component props typed with interfaces
- Path aliases for clean imports (`@components/*`, `@layouts/*`, `@stores/*`, `@types/*`)
- No unused imports, variables, or parameters
- Descriptive variable names following conventions:
  - Components: `PascalCase.astro` or `PascalCase.tsx`
  - Utilities: `camelCase.ts`
  - Constants: `SCREAMING_SNAKE_CASE`
  - Types/Interfaces: `PascalCase`

**Component Structure Pattern (Astro):**
```astro
---
// 1. Imports
// 2. Type definitions (interface Props)
// 3. Props destructuring with defaults
// 4. Logic
---
<!-- 5. Template (semantic HTML + Tailwind classes) -->
```

**Rationale:** TypeScript strict mode catches errors at compile time, improves maintainability, enables better IDE support, and reduces runtime bugs. Type safety is essential for long-term codebase health.

### VI. Design System Consistency

All UI components MUST use the established design system. No deviations without explicit approval.

**Design System Rules:**
- **Styling:** Tailwind CSS utility-first only (no CSS-in-JS, no inline styles)
- **Colors:** Navy (`navy-{50-900}`), Gold (`gold-{50-900}`), Sage (`sage-{50-900}`)
- **Typography:** Headings use `font-serif` (Playfair Display), body uses `font-sans` (Inter)
- **Spacing:** Standard Tailwind scale + custom values (`spacing-{18, 88, 112, 128}`)
- **Responsive:** Mobile-first design with Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)

**Component Reusability:**
- Shared components in `src/components/common/` (Button, Card, etc.)
- Layout components in `src/components/layout/` (Header, Footer, Navigation)
- Page-specific sections in `src/components/sections/`

**Tone & Aesthetic:**
- Professional, calm, minimalistic, supportive ("Minimal Luxury Coach")
- Large whitespace, generous padding/margins
- Subtle animations only (fade-in, slide-up), respect `prefers-reduced-motion`

**Rationale:** Design system consistency ensures a cohesive brand experience, accelerates development with reusable components, and maintains the luxury aesthetic across all pages.

## Performance & Quality Gates

### Image Optimization (Mandatory)

**Always use Astro's `<Image>` component:**
```astro
import { Image } from 'astro:assets';

<Image
  src={image}
  alt="Descriptive text"
  width={1200}
  height={800}
  format="webp"
  quality={85}
  loading="lazy" // or "eager" for above-fold
/>
```

**Rules:**
- Above-fold images: `loading="eager"` + `fetchpriority="high"`
- Below-fold images: `loading="lazy"`
- Format priority: WebP → AVIF → JPEG/PNG fallback (automatic)
- Max dimensions: Hero 1920x1080, Thumbnails 600x400

### JavaScript Optimization

**Islands Architecture (Partial Hydration):**
- Static content: Astro components (`.astro`) with no hydration
- Interactive UI: React components (`.tsx`) with client directives:
  - `client:load` — Critical interactivity (rare)
  - `client:idle` — Non-critical (forms, modals)
  - `client:visible` — Lazy load (carousels, animations)
  - `client:media` — Responsive components

**State Management:**
- Use Zustand for global UI state (modals, sidebars, preferences)
- Small, focused stores (<100 lines) with TypeScript interfaces
- Selective subscriptions to prevent re-renders

### CSS Optimization

- Critical CSS automatically inlined in `<head>` by Astro
- Tailwind purge configured for production
- Custom utilities in `src/styles/global.css` under `@layer utilities`
- Minimize specificity: utility classes over custom CSS

### SEO Requirements

**Every page MUST include:**
- Unique `<title>` (50-60 characters)
- Meta description (150-160 characters)
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Canonical URL
- Structured data (JSON-LD for Person/Organization)

**Auto-generated:**
- `sitemap.xml` via Astro sitemap integration
- `robots.txt` in public directory

## Development Workflow

### File Organization Standards

```
src/
├── components/
│   ├── common/          # Reusable UI (Button, Card)
│   ├── layout/          # Header, Footer, Navigation
│   └── sections/        # Homepage sections
├── layouts/
│   └── BaseLayout.astro # SEO meta tags, global structure
├── pages/
│   ├── index.astro      # File-based routing
│   ├── about.astro
│   ├── courses/
│   │   ├── index.astro
│   │   └── [slug].astro # Dynamic routes
│   └── contact.astro
├── content/
│   ├── config.ts        # Content Collections schema
│   └── courses/         # Markdown content
├── stores/
│   └── uiStore.ts       # Zustand state management
├── styles/
│   └── global.css       # Tailwind base, custom utilities
├── types/
│   └── index.ts         # Shared TypeScript types
└── utils/
    └── helpers.ts       # Pure utility functions
```

### Build Process

**Build Commands:**
```bash
npm run dev        # Dev server at localhost:4321
npm run build      # Type-check + build to dist/
npm run preview    # Preview production build
```

**Build Validation:**
- `astro check` runs before every build (TypeScript validation)
- Build fails on type errors
- Console logs removed in production (terser config)
- Bundle size warnings if budgets exceeded

### Pre-Launch Checklist

**Performance:**
- [ ] Lighthouse Performance ≥95
- [ ] LCP <2.5s on 3G
- [ ] CLS <0.1
- [ ] Bundle size <350KB total

**Accessibility:**
- [ ] Lighthouse Accessibility ≥95
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader tested

**SEO:**
- [ ] All pages have unique titles
- [ ] Meta descriptions <160 chars
- [ ] Canonical URLs set
- [ ] Sitemap.xml generated
- [ ] Structured data present

**Code Quality:**
- [ ] TypeScript strict mode passes
- [ ] No console errors
- [ ] No unused imports
- [ ] ESLint passes (if configured)
- [ ] Build completes without warnings

## Governance

### Amendment Procedure

1. **Proposal:** Document proposed change with rationale
2. **Impact Analysis:** Review affected templates, code, and documentation
3. **Version Bump:** Increment constitution version per semantic versioning:
   - **MAJOR:** Backward-incompatible governance/principle removals or redefinitions
   - **MINOR:** New principle/section added or materially expanded guidance
   - **PATCH:** Clarifications, wording, typo fixes, non-semantic refinements
4. **Template Sync:** Update all dependent templates (plan, spec, tasks)
5. **Approval:** Document decision and update `LAST_AMENDED_DATE`

### Compliance Review

All feature specifications (`spec.md`), implementation plans (`plan.md`), and task lists (`tasks.md`) MUST verify compliance with this constitution.

**Constitution Check (in plan.md):**
- Static-First Delivery: Verified ✓
- Performance Budgets: Validated ✓
- Simplicity Over Tooling: Confirmed ✓
- Accessibility & SEO: Verified ✓
- TypeScript Strict Mode: Enabled ✓
- Design System: Followed ✓

### Prohibited Patterns

**NEVER:**
- ❌ Use CSS-in-JS (styled-components, emotion)
- ❌ Add large libraries (moment.js, lodash) without justification
- ❌ Implement server-side logic or database integrations
- ❌ Create non-static routes or hybrid output modes
- ❌ Ignore TypeScript errors or use `any` without justification
- ❌ Skip accessibility attributes (alt text, ARIA labels)
- ❌ Use inline styles instead of Tailwind classes
- ❌ Fetch data at runtime for SEO-critical content
- ❌ Add tracking scripts without async/defer attributes

### Complexity Justification

Any violation of these principles MUST be documented in the Implementation Plan (`plan.md`) under "Complexity Tracking" with:
- **Violation:** What principle is being violated
- **Why Needed:** Specific technical or business requirement
- **Simpler Alternative Rejected Because:** Justification for why the standard approach is insufficient

### Runtime Development Guidance

For day-to-day development guidance, developers should consult:
- `CLAUDE.md` — Primary development guide for Claude Code
- `.claude/docs/technical-spec.md` — Detailed technical specifications
- `.claude/docs/about.md` — Business requirements and design principles
- This constitution file — Overarching principles and governance

**Precedence:** This constitution supersedes all other practices. When in conflict, constitution principles take priority.

---

**Version**: 1.1.0 | **Ratified**: 2025-11-14 | **Last Amended**: 2025-11-14
