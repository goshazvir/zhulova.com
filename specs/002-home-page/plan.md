# Implementation Plan: Home Page - Viktoria Zhulova Coaching Website

**Branch**: `002-home-page` | **Date**: 2025-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-home-page/spec.md`

## Summary

Build a high-performance static homepage for Viktoria Zhulova's coaching website with consultation request form, credibility-building content sections, and seamless mobile experience. The page captures leads via serverless function + database storage while maintaining strict static-first architecture and Lighthouse 95+ performance targets.

**Primary User Journey**: Visitor lands → reads value proposition → books consultation → receives confirmation → coach receives email notification.

**Technical Approach**: Astro static site generation with React islands for interactive components (form modal, mobile menu), Zustand for UI state, Supabase PostgreSQL for lead storage, Resend for email notifications, deployed on Vercel with global CDN.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**:
- Astro 4.x (SSG framework)
- React 18.x (interactive islands)
- Tailwind CSS 3.x (styling)
- Zustand 4.x (state management)
- Zod 3.x (validation)
- @supabase/supabase-js 2.x (database client)
- Resend 3.x (email service)
- React Hook Form 7.x (form management)

**Storage**: Supabase PostgreSQL (serverless)
**Testing**: Manual testing + Lighthouse audits (automated tests not in MVP scope)
**Target Platform**: Web (modern browsers from last 2 years)
**Project Type**: Web (static frontend + serverless API)
**Performance Goals**: Lighthouse 95+, LCP <2.5s, CLS <0.1, bundle <350KB
**Constraints**: Static-first (no SSR), performance budgets mandatory, WCAG AA compliance
**Scale/Scope**: Single homepage, ~10 sections, ~100 form submissions/month initially

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static-First Delivery ✅ **PASS**

- ✅ All homepage content pre-rendered at build time via Astro SSG
- ✅ Server mode permitted exclusively for /api/submit-lead serverless function; homepage and all content pages remain pre-rendered static at build time
- ✅ Serverless functions used only for non-SEO-critical operations (form submission to Supabase + Resend email)
- ✅ React hydration limited to interactive islands (consultation modal, mobile menu)
- ✅ Progressive enhancement: Core content usable without JavaScript (navigation, hero, stats, questions viewable without JS)
- ✅ Security: No secrets in client code (API keys stored in serverless environment variables: RESEND_API_KEY, SUPABASE_SERVICE_KEY)

**Rationale**: Homepage content is fully static for optimal SEO and performance. Consultation form submission requires server-side logic (database write, email sending) handled via /api/submit-lead serverless endpoint (`export const prerender = false`). This aligns with Static-First principle when server mode scoped exclusively to API routes (see feature 005-fix-consultation-api for architecture justification).

### II. Performance-First Development ✅ **PASS**

- ✅ Core Web Vitals targets validated in research.md (expected LCP ~1.8s, CLS ~0.05)
- ✅ Lighthouse 95+ achievable with Astro Image optimization, Tailwind purging, minimal JS
- ✅ Performance budgets defined and validated:
  - HTML ~30KB (target <50KB) ✓
  - CSS ~15KB (target <20KB) ✓
  - JS ~35KB (target <50KB) ✓
  - Images: WebP format, lazy loading
  - Total ~250KB (target <350KB) ✓

**Rationale**: Static generation + image optimization + minimal JavaScript ensures sub-2.5s LCP on 3G connections.

### III. Simplicity Over Tooling ✅ **PASS**

- ✅ Dependencies justified:
  - Astro: Static site generation with optimal DX and performance
  - React: Mature ecosystem for interactive islands (forms, modals)
  - Tailwind: Utility-first CSS with tree-shaking
  - Zustand: Lightweight state (1KB) vs Redux (10KB+)
  - Zod: Runtime validation + TypeScript types from single schema
- ✅ No heavy libraries (rejected: moment.js, lodash, CSS-in-JS frameworks)
- ✅ Scroll animations using native Intersection Observer (no external library)
- ✅ Mobile menu using Zustand (no Alpine.js or Headless UI)

**Rationale**: Each dependency provides clear value with minimal bundle impact. Vanilla JS preferred where feasible.

### IV. Accessibility & SEO Baseline ✅ **PASS**

- ✅ Semantic HTML5 (header, nav, main, section, article, footer)
- ✅ ARIA labels for interactive elements (navigation, modal, form fields)
- ✅ Keyboard navigation (Tab, Enter, Esc) with visible focus indicators
- ✅ Color contrast ≥4.5:1 (Navy #1a202c on white #ffffff = 15.8:1)
- ✅ Alt text for all images
- ✅ Respect prefers-reduced-motion
- ✅ SEO meta tags:
  - Title: "Вікторія Жульова - Сертифікований коуч | Коучинг для підприємців та IT-спеціалістів"
  - Description: "Допоможу досягти ваших цілей за допомогою коучингу, медитацій, НЛП..."
  - OG tags for social sharing
  - JSON-LD structured data for Person schema
  - HTML lang="uk" attribute

**Rationale**: WCAG AA compliance mandatory per constitution. SEO critical for organic traffic.

### V. TypeScript Strict Mode & Type Safety ✅ **PASS**

- ✅ TypeScript strict mode enabled in `tsconfig.json`
- ✅ All component props typed with interfaces
- ✅ Zod schemas provide runtime validation + TypeScript types
- ✅ Path aliases configured (`@components/*`, `@layouts/*`, `@stores/*`, `@types/*`)
- ✅ No `any` types (Zod infers types, Supabase SDK typed)

**Rationale**: Type safety reduces bugs, improves maintainability, enables better IDE support.

### VI. Design System Consistency ✅ **PASS**

- ✅ Tailwind CSS utility-first (no CSS-in-JS, no inline styles)
- ✅ Color palette: Navy (`navy-{50-900}`), Gold (`gold-{50-900}`), Sage (`sage-{50-900}`)
- ✅ Typography: Headings use `font-serif` (Playfair Display), body uses `font-sans` (Inter)
- ✅ Responsive: Mobile-first with Tailwind breakpoints
- ✅ Component structure: `common/`, `layout/`, `sections/` organization
- ✅ Tone: Professional, calm, minimalistic ("Minimal Luxury Coach" aesthetic)

**Rationale**: Design system ensures brand consistency across all pages and accelerates development.

---

## **CRITICAL NOTE**: Architecture Change from Specification

**Change**: Specification assumed static-only architecture. Implementation uses **hybrid approach** with serverless functions for form submission while maintaining static homepage.

**Justification**:
1. **Form requirements mandate backend**: FR-028 requires persistent database storage, FR-029 requires email notifications
2. **Serverless ≠ Server-side rendering**: Serverless functions don't violate static-first principle (homepage HTML is still static)
3. **Constitution compliance**: Static-First Delivery principle allows serverless for "non-SEO-critical operations" (form submission is not SEO content)
4. **Performance maintained**: Serverless functions don't impact page load speed (invoked only on form submit)
5. **Scalability**: Serverless scales automatically without server maintenance

**Impact**: None on user experience or performance. Homepage remains 100% static. Only form POST request uses serverless function.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-home-page/
├── spec.md              # Business requirements (completed)
├── plan.md              # This file (completed)
├── research.md          # Technical research (completed)
├── data-model.md        # Database schema (completed)
├── quickstart.md        # Development setup guide (completed)
├── contracts/           # API contracts (completed)
│   └── submit-lead.yaml # OpenAPI spec for form submission
├── checklists/          # Quality validation (completed)
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan - use /speckit.tasks)
```

### Source Code (repository root)

```text
# Web application structure (static frontend + serverless backend)

src/
├── components/
│   ├── common/               # Reusable UI components
│   │   ├── Button.tsx        # CTA button component
│   │   ├── Modal.tsx         # Modal wrapper component
│   │   └── Input.tsx         # Form input component
│   ├── layout/               # Layout components
│   │   ├── Header.astro      # Site header with sticky navigation
│   │   ├── Footer.astro      # Site footer
│   │   └── MobileMenu.tsx    # Mobile navigation drawer (React)
│   ├── sections/             # Homepage sections
│   │   ├── HeroSection.astro         # Hero with CTA
│   │   ├── StatsSection.astro        # 4 achievement stats
│   │   ├── QuestionsSection.astro    # Personal/Business questions
│   │   ├── MotivationalQuote.astro   # Time value quote
│   │   ├── CaseStudiesSection.astro  # Client transformations
│   │   ├── TestimonialsSection.astro # Client testimonials
│   │   └── CoursesPreview.astro      # Featured course
│   └── forms/                # Form components
│       └── ConsultationModal.tsx     # Lead capture form (React)
├── layouts/
│   └── BaseLayout.astro      # Base page layout with SEO meta tags
├── pages/
│   ├── index.astro           # Homepage (imports all sections)
│   └── api/
│       └── submit-lead.ts    # Serverless function for form submission
├── stores/
│   └── uiStore.ts            # Zustand store for modal/menu state
├── types/
│   ├── consultationForm.ts   # Form validation schema + types
│   └── lead.ts               # Lead entity types
├── data/
│   └── homePageContent.ts    # Static content data (stats, questions, etc.)
├── styles/
│   └── global.css            # Tailwind directives + custom utilities
└── utils/
    └── scrollAnimations.ts   # Intersection Observer for scroll effects

public/
├── images/                   # Static images (hero, case studies, etc.)
├── fonts/                    # Self-hosted fonts (if not using Google Fonts)
└── robots.txt                # Search engine directives

# Astro configuration
astro.config.mjs              # Framework config (output: 'static')
tailwind.config.mjs           # Design system config
tsconfig.json                 # TypeScript strict mode config
package.json                  # Dependencies + scripts
.env.example                  # Example environment variables
```

**Structure Decision**: Web application structure (Option 2) chosen because feature includes both frontend (static pages) and backend logic (serverless API). Frontend in `src/`, serverless functions in `src/pages/api/` following Astro file-based routing conventions.

---

## Complexity Tracking

**No violations** - All constitution principles followed.

---

## Phase Summaries

### Phase 0: Research ✅ **COMPLETE**

**Output**: `research.md` (10 technical decisions documented)

**Key Decisions**:
1. **Form handling**: Serverless functions + Supabase PostgreSQL
2. **Email service**: Resend (modern API, React Email templates)
3. **Database**: Supabase PostgreSQL with Row Level Security
4. **Analytics**: Plausible (privacy-focused, lightweight)
5. **Form validation**: Zod + React Hook Form
6. **Content management**: Hardcoded in TypeScript (MVP), Content Collections for courses
7. **Image optimization**: Astro Image + Sharp + WebP/AVIF
8. **Mobile navigation**: React drawer with Zustand state
9. **Scroll animations**: Native Intersection Observer API
10. **Hosting**: Vercel (serverless support, global CDN)

**Performance Budget Validation**: All targets met (HTML 30KB, CSS 15KB, JS 35KB, total 250KB)

### Phase 1: Design & Contracts ✅ **COMPLETE**

**Output**:
- `data-model.md` - Database schema with PostgreSQL DDL, constraints, indexes, RLS policies
- `contracts/submit-lead.yaml` - OpenAPI 3.0 spec for form submission API
- `quickstart.md` - Development setup guide with environment variables, database migration, testing steps
- Agent context updated in `CLAUDE.md`

**Key Artifacts**:
- Database: Single `leads` table with 4 indexes, 5 constraints, 3 RLS policies
- API: POST `/api/submit-lead` endpoint with validation, rate limiting, error handling
- Types: Zod schema + TypeScript interfaces for client/server validation
- Migration: Complete SQL script for table creation with rollback

**Readiness for Phase 2**: ✅ All design artifacts complete, ready for task breakdown via `/speckit.tasks`

---

## Next Steps

**This plan is complete.** To proceed with implementation:

1. **Run `/speckit.tasks`** to generate task breakdown (`tasks.md`)
2. **Run `/speckit.implement`** to execute tasks (optional - uses agents to implement)
3. **Manual implementation** following `quickstart.md` setup guide

**Critical Dependencies Before Coding**:
- [ ] Supabase project created
- [ ] Resend account created
- [ ] Environment variables configured (`.env` file)
- [ ] Database migration executed
- [ ] Email domain verified in Resend

**Estimated Implementation Time**: 16-24 hours (1 developer, full-time)

**Deployment Checklist**:
- [ ] Lighthouse scores ≥95 verified
- [ ] Form submission tested end-to-end
- [ ] Email notifications working
- [ ] Mobile responsive on all breakpoints (320px-1920px)
- [ ] Keyboard navigation verified
- [ ] Alt text added to all images
- [ ] Vercel environment variables configured
- [ ] Custom domain configured (zhulova.com)

---

**Plan Status**: ✅ **COMPLETE**
**Ready for tasks**: Yes (`/speckit.tasks`)
**Constitution compliance**: ✅ All principles validated
