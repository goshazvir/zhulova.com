# Implementation Plan: Legal Pages (Terms & Conditions, Privacy Policy)

**Branch**: `004-legal-pages` | **Date**: 2025-11-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-legal-pages/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create two static legal pages (Privacy Policy and Terms & Conditions) with Ukrainian content complying with GDPR and Ukrainian data protection laws. Pages will use Astro's static site generation with consistent "Minimal Luxury" styling, responsive layouts for all devices, and integration with footer navigation and consultation modal privacy notices. Legal content will be stored as static markdown/HTML in the codebase, pre-rendered at build time, and served via CDN for optimal performance.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Astro 4.x
**Primary Dependencies**: Astro (SSG framework), React 18.x (client-side modal updates only), Tailwind CSS 3.x (styling)
**Storage**: Static content files in `src/pages/` directory (Astro file-based routing)
**Testing**: Manual browser testing (mobile/tablet/desktop), Lighthouse audits (Performance/Accessibility ≥95), keyboard navigation testing
**Target Platform**: Static HTML/CSS/JS served via CDN (Vercel), all modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (static site with pre-rendered pages)
**Performance Goals**: LCP <2.5s, CLS <0.1, page weight <100KB per legal page, Lighthouse Performance ≥95
**Constraints**: Ukrainian language only (legal requirement), GDPR + Ukrainian Law compliance, WCAG AA accessibility, no SSR/hybrid modes, static-first architecture
**Scale/Scope**: 2 legal pages (Privacy Policy, Terms & Conditions), 2 component updates (Footer, ConsultationModal), minimal JavaScript (footer + modal already exist)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static-First Delivery ✅ PASS

- **Status**: COMPLIANT
- **Analysis**:
  - Legal pages will be created as static Astro pages (`src/pages/privacy-policy.astro`, `src/pages/terms.astro`)
  - Content pre-rendered at build time via Astro SSG
  - No server-side rendering, no runtime database queries
  - Footer and modal updates are static HTML/React components (already using Islands Architecture)
  - No dynamic data fetching for legal content
- **Evidence**: Using `output: 'static'` in astro.config.mjs (existing configuration)

### II. Performance-First Development ✅ PASS

- **Status**: COMPLIANT
- **Performance Budget Analysis**:
  - **HTML**: Legal pages estimated ~30-40KB (gzipped) - well under 50KB limit
  - **CSS**: Shared Tailwind CSS already optimized (~15KB gzipped) - no additional CSS needed
  - **JavaScript**: Zero additional JS (static pages only) - current bundle ~45KB
  - **Total Page Weight**: ~50-60KB per page (under 350KB limit)
- **Core Web Vitals Targets**:
  - **LCP**: Static HTML renders immediately (<1s expected)
  - **CLS**: No dynamic content shifts (static layout)
  - **FID**: No interactive elements on legal pages
- **Lighthouse Score**: Expected ≥95 (text-heavy static pages, no images, minimal JS)

### III. Simplicity Over Tooling ✅ PASS

- **Status**: COMPLIANT
- **No New Dependencies**: Feature uses existing stack (Astro + Tailwind + React)
- **Vanilla Approach**: Legal pages are plain Astro components with semantic HTML
- **Minimal JavaScript**: Only client-side JS is existing modal/footer components (no new JS for legal pages)
- **Justification**: No new tooling required - leveraging existing Astro static generation

### IV. Accessibility-First Design ✅ PASS

- **Status**: COMPLIANT
- **Semantic HTML**: Legal pages will use `<main>`, `<article>`, `<section>`, proper heading hierarchy
- **Keyboard Navigation**: All footer and modal links will have focus indicators (already styled globally)
- **ARIA Labels**: Footer links and modal privacy notice link will include aria-label attributes
- **Color Contrast**: Using existing navy/gold/sage palette (verified ≥4.5:1 contrast)
- **Screen Reader**: Legal content will be plain text with semantic structure
- **SEO Metadata**: Each legal page will include proper meta tags (title, description, lang="uk")

### V. TypeScript Strict Mode & Type Safety ✅ PASS

- **Status**: COMPLIANT
- **Strict Mode**: Already enabled in tsconfig.json (`"strict": true`)
- **Type Safety**:
  - Footer component (Astro) - props typed with interface
  - ConsultationModal (React) - props typed with interface
  - Legal pages (Astro) - no props needed, static content
- **Path Aliases**: Using `@components/*`, `@layouts/*` for imports

### VI. Design System Consistency ✅ PASS

- **Status**: COMPLIANT
- **Styling**: Tailwind utility classes only (no custom CSS-in-JS)
- **Colors**: Using existing navy/gold/sage palette
- **Typography**: Headings (`font-serif` - Playfair Display), body (`font-sans` - Inter)
- **Responsive**: Mobile-first Tailwind breakpoints (sm:, md:, lg:)
- **Component Reuse**: Using BaseLayout, existing Footer and ConsultationModal components
- **Tone**: Minimal Luxury aesthetic maintained (large whitespace, professional typography)

---

### GATE RESULT: ✅ ALL GATES PASSED

**No constitution violations detected.** Feature fully complies with all 6 core principles. Proceeding to Phase 0 (Research).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── privacy-policy.astro        # NEW: Privacy Policy page
│   └── terms.astro                 # NEW: Terms & Conditions page
├── components/
│   └── layout/
│       └── Footer.astro            # MODIFIED: Add legal links, update layout
└── components/
    └── forms/
        └── ConsultationModal.tsx   # MODIFIED: Add privacy notice with link

public/
└── (no changes - static assets unchanged)
```

**Structure Decision**: **Web application (static site)** - Using Astro's file-based routing in `src/pages/` for legal pages. Modifications to existing components in `src/components/layout/` (Footer) and `src/components/forms/` (ConsultationModal). No new directories required - feature integrates into existing structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations detected. This section is intentionally empty.

---

## Phase 0: Research & Unknowns Resolution

### Research Tasks

Since all technical context is clear and no "NEEDS CLARIFICATION" items were identified, research focuses on legal content requirements and best practices:

1. **Ukrainian GDPR & Data Protection Law Compliance**
   - **Question**: What specific sections must be included in Privacy Policy under Ukrainian Law on Personal Data Protection + GDPR?
   - **Priority**: P1 (blocking legal compliance)

2. **Ukrainian Terms & Conditions Requirements**
   - **Question**: What sections are legally required for coaching services in Ukraine?
   - **Priority**: P1 (blocking legal compliance)

3. **Accessibility Best Practices for Legal Pages**
   - **Question**: What are WCAG AA requirements for long-form text content (table of contents, anchor links)?
   - **Priority**: P2 (quality enhancement)

4. **Footer Layout Patterns**
   - **Question**: What are industry-standard responsive patterns for copyright (left) + legal links (right) footer layouts?
   - **Priority**: P2 (implementation guidance)

### Research Dispatch

**Status**: ✅ COMPLETED

Research agents dispatched and findings consolidated in `research.md`:
1. ✅ Ukrainian Privacy Policy Requirements - 16 mandatory sections identified
2. ✅ Ukrainian Terms & Conditions Requirements - 20 mandatory sections identified
3. ✅ WCAG AA Accessibility Requirements - Complete checklist with long-form best practices
4. ✅ Footer Layout Patterns - Flexbox responsive pattern confirmed

### Research Output

All findings documented in: **`specs/004-legal-pages/research.md`**

Key decisions:
- **Privacy Policy**: 16 sections (Ukrainian Law 2297-VI + GDPR compliance)
- **Terms & Conditions**: 20 sections (Ukrainian consumer protection law + EU alignment)
- **Accessibility**: WCAG 2.1 AA with table of contents, semantic HTML, keyboard navigation
- **Footer Layout**: Flexbox with `sm:flex-row` breakpoint (copyright left, links right)

---

## Phase 1: Design & Contracts

### Status: ✅ COMPLETED

All Phase 1 artifacts generated successfully.

### Design Artifacts

1. **Data Model** (`data-model.md`) - ✅ Complete
   - Legal Page entity structure (route, title, sections, TOC)
   - Footer component layout specification
   - Consultation Modal privacy notice structure
   - Entity relationships and state management (none required)
   - Performance estimates (50-55KB per page)

2. **API Contracts** (`contracts/README.md`) - ✅ Complete
   - Status: No API contracts required (purely static feature)
   - Static routes documented: `/privacy-policy`, `/terms`
   - Existing API endpoints unchanged

3. **Quickstart Guide** (`quickstart.md`) - ✅ Complete
   - Step-by-step implementation guide (6 steps)
   - Estimated timeline: 3.5 hours
   - Testing procedures and troubleshooting
   - Code examples for all components

4. **Agent Context Update** - ✅ Complete
   - Updated `CLAUDE.md` with legal requirements context
   - No new technologies added (using existing stack)

### Constitution Re-Check (Post-Design)

**Status**: ✅ ALL GATES STILL PASS

No design decisions violate constitution principles:
- Static-first architecture maintained (no SSR, no database queries)
- Performance budgets respected (50-55KB per page, well under 100KB limit)
- No new dependencies introduced (Astro + Tailwind + React)
- Accessibility requirements met (WCAG AA checklist, semantic HTML)
- TypeScript strict mode maintained (no new type safety issues)
- Design system consistency preserved (Tailwind utilities, existing color palette)

---

## Phase 2: Tasks Generation

**Status**: ⏸️ NOT STARTED (Use `/speckit.tasks` command)

Phase 2 is executed separately via the `/speckit.tasks` slash command, which will:
- Break down implementation into actionable tasks
- Assign priority and dependencies
- Generate `tasks.md` file

**Command to run**: `/speckit.tasks`

---

## Implementation Readiness

### Artifacts Completed

✅ `plan.md` - This file (implementation plan)
✅ `research.md` - Research findings with legal requirements
✅ `data-model.md` - Entity structure and component specifications
✅ `contracts/README.md` - API contracts (none required)
✅ `quickstart.md` - Developer implementation guide
✅ `CLAUDE.md` - Agent context updated

### Ready for Implementation

All planning artifacts are complete. The feature is ready for:
1. Task breakdown via `/speckit.tasks`
2. Implementation via `/speckit.implement`
3. Manual implementation following `quickstart.md`

### Files to Create

- `src/pages/privacy-policy.astro` (new)
- `src/pages/terms.astro` (new)

### Files to Modify

- `src/components/layout/Footer.astro` (add legal links)
- `src/components/forms/ConsultationModal.tsx` (add privacy notice)

### No Changes Required

- No database migrations
- No new dependencies
- No API endpoints
- No configuration changes
- No environment variables

---

## Summary

**Branch**: `004-legal-pages`
**Planning Status**: ✅ COMPLETE
**Constitution Compliance**: ✅ PASS (all 6 principles)
**Estimated Implementation Time**: 3.5 hours
**Complexity**: Low (static pages + component updates)

**Next Action**: Run `/speckit.tasks` to generate task breakdown, then proceed with implementation.
