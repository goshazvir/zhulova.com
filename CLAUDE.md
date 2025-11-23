# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

High-performance static website for Viktoria Zhulova, a mindset coach. Built with Astro's Islands Architecture for optimal performance and SEO.

**Tech Stack:** Astro v4 + React v18 + TypeScript v5 (strict) + Tailwind CSS v3 + Zustand v4 + Supabase + Resend

**Critical Constraints:**
- **⚠️ CRITICAL: Language Policy** - ALWAYS respond to user in Russian (Русский язык) for all conversational messages. ALL code, comments, documentation, commit messages, and technical writing MUST be in English only. This is NON-NEGOTIABLE.
  - ✅ User communication: Russian
  - ✅ Code, comments, docs: English
  - ✅ Git commits, PRs: English
  - ❌ Never mix languages in code or documentation
- **Hybrid static-first** - Static pages + Serverless functions for forms
- **Performance targets:** Lighthouse 95+, LCP <2.5s, CLS <0.1
- **Accessibility:** WCAG AA compliance mandatory
- **Security:** Input validation, environment variables, RLS policies
- **⚠️ CRITICAL: English only for Git** - ALL git commits, PR titles, PR descriptions, PR comments, and git-related communication MUST be written in English. Never use Ukrainian, Russian, or any other language in git operations.
- **⚠️ CRITICAL: Never push without approval** - NEVER execute `git push` without explicit user approval. Always wait for the user to explicitly say "push", "deploy", or give clear permission before pushing to any remote repository.

## Spec-Driven Development

This project uses **[Spec-Kit](https://github.com/github/spec-kit)** for structured development workflow.

**Spec-Kit commands** (use as slash commands in Claude Code):

```
/speckit.constitution  # Create/update project principles and standards
/speckit.specify       # Create detailed feature specification
/speckit.plan          # Generate implementation plan
/speckit.tasks         # Break down into actionable tasks
/speckit.implement     # Execute implementation
/speckit.clarify       # Ask structured questions before planning
/speckit.analyze       # Check cross-artifact consistency
/speckit.checklist     # Generate quality validation checklists
```

**Workflow:**
1. Start with `/speckit.constitution` to establish project principles
2. Use `/speckit.specify` for each new feature
3. Follow with `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`

**Spec-Kit files:**
- `.specify/` - Spec-Kit templates and memory
- `.claude/commands/speckit.*.md` - Slash command definitions
- `.claude/docs/` - Project documentation (technical-spec.md, about.md)
- `.claude/scripts/` - Utility scripts for testing and maintenance

## Project Documentation

All project documentation is centralized in `.claude/docs/`:

- **`technical-spec.md`** - Complete technical specification
  - Performance requirements (Lighthouse 95+, Core Web Vitals)
  - Image optimization rules
  - CSS/JS optimization strategies
  - Accessibility guidelines (WCAG AA)
  - SEO requirements
  - Component patterns and decision trees
  - Prohibited patterns

- **`about.md`** - Project requirements and business context
  - Project overview and goals
  - Target audience (entrepreneurs, IT professionals, personal brand builders)
  - Required pages (Home, About, Courses, Contact)
  - Design principles ("Minimal Luxury Coach" aesthetic)
  - Content strategy
  - Payment integration approach

**When building features:**
1. Consult `technical-spec.md` for technical constraints
2. Reference `about.md` for business requirements and design direction
3. Both documents are authoritative - follow them strictly

## Utility Scripts

Project utility scripts are located in `.claude/scripts/`:

- **`test-supabase.js`** - Supabase connection test script
  - Tests database connection and credentials
  - Validates table structure and RLS policies
  - Performs full CRUD cycle (insert, read, delete)
  - Usage: `npm run test:supabase` or `node .claude/scripts/test-supabase.js`

- **`generate-favicon-from-svg.js`** - Favicon PNG generator from SVG
  - Generates all PNG favicon formats from favicon.svg
  - Creates: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, favicon-16.png, favicon-32.png
  - Uses Sharp for SVG to PNG conversion
  - Usage: `npm run favicon:update` or `node .claude/scripts/generate-favicon-from-svg.js`
  - Source: `public/favicon.svg` (dark square with white VZ + gold corner accent)

- **`convert-footer-image.js`** - Footer image converter with Soft Luxury styling
  - Converts `viktoriia2.jpg` to optimized `footer-viktoria.webp`
  - Applies **Soft Luxury** styling matching hero image aesthetic
  - Effects: Subtle color grading (brightness 1.02, saturation 0.95), warm hue shift, soft contrast, gold gradient overlay, subtle vignette
  - Output: 600x800px WebP (quality 92, ~100KB)
  - Usage: `node .claude/scripts/convert-footer-image.js`
  - Benefits: 154x compression, consistent brand styling across site

- **`generate-hero-premium.js`** - Premium hero image style generator
  - Creates 4 premium variants: Soft Luxury, Aurora, Editorial, Minimalist
  - Currently used: **Soft Luxury** (`hero-viktoria-luxury.webp`)
  - Source: `public/images/original.png`

**When creating new scripts:**
- Place all utility scripts in `.claude/scripts/` directory
- Use descriptive names (e.g., `test-<feature>.js`, `migrate-<task>.js`)
- Add shebang `#!/usr/bin/env node` for Node.js scripts
- Document script purpose and usage in header comments
- Use English for all comments and console output

## Development Commands

```bash
npm run dev          # Astro dev server at localhost:4321 (static pages only)
npm run dev:vercel   # Vercel dev server at localhost:3000 (with serverless functions)
npm run build        # Type-check + build to dist/
npm run preview      # Preview production build
npm run astro        # Astro CLI access
```

**Which command to use:**
- **`npm run dev`** - Standard development server (supports both static pages AND API routes via hybrid mode)
- **`npm run dev:vercel`** - Vercel dev server (optional, for testing Vercel-specific features)

**Build process:** `astro check` (TypeScript validation) runs before every build. Build fails on type errors.

## Architecture

### Hybrid Static-First Philosophy

**Configuration:** `output: 'hybrid'` in `astro.config.mjs` with Vercel adapter

Every **page** is pre-rendered at build time (static). API endpoints are serverless functions:

```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
                                      ↓
                     Form Submit → Serverless Function → Supabase/Resend
```

**Static Layer (pages):**
- All pages pre-rendered at build time (default behavior in hybrid mode)
- Pages are static unless `export const prerender = false` is added
- Content from Astro Content Collections

**Dynamic Layer (API endpoints):**
- Location: `src/pages/api/**/*.ts`
- Must have `export const prerender = false` to work as serverless functions
- Form submissions → `/api/submit-lead` (POST)
- Email notifications → Resend
- Database writes → Supabase PostgreSQL

**Example API endpoint:**
```typescript
// src/pages/api/submit-lead.ts
export const prerender = false; // REQUIRED for serverless function

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  // Process request, save to DB, send email
};
```

**Never add:**
- Server-side rendering for regular pages (keep pages static for performance)
- Database queries for page content (use Content Collections instead)
- Client-side data fetching for SEO-critical content

### Islands Architecture

**React components** are used sparingly for interactive UI only:

```astro
<!-- Static by default (no hydration) -->
<Header />

<!-- Hydrate when visible in viewport -->
<Newsletter client:visible />

<!-- Hydrate when browser is idle -->
<ContactForm client:idle />

<!-- Hydrate only on mobile -->
<MobileMenu client:media="(max-width: 768px)" />
```

**Decision tree:**
- Static content (text, images) → Astro component (`.astro`)
- Interactive (forms, modals, state) → React component (`.tsx`) + client directive
- Global UI state → Zustand store

### TypeScript Path Aliases

```typescript
import Button from '@components/common/Button';
import BaseLayout from '@layouts/BaseLayout.astro';
import { useUIStore } from '@stores/uiStore';
import type { Course } from '@types/index';
```

See `tsconfig.json` for full alias list.

### Content Collections

Courses are managed via Astro Content Collections in `src/content/courses/`.

**Schema** (defined in `src/content/config.ts`):
```typescript
{
  title: string;
  description: string;
  price: number;
  currency: string; // default "USD"
  duration: string;
  paymentLink: string; // must be valid URL
  image: string;
  published: boolean; // default true
  order: number; // for sorting, default 0
  features?: string[];
  testimonials?: string[];
}
```

**Creating a course:**

1. Add markdown file to `src/content/courses/mindset-mastery.md`
2. Include frontmatter with required fields
3. Write course content in markdown body
4. Course is automatically available at `/courses/mindset-mastery`

**Fetching courses:**
```typescript
import { getCollection } from 'astro:content';

const courses = await getCollection('courses', ({ data }) => {
  return data.published === true;
});
```

## Performance Requirements

### Image Optimization

**Always use Astro's `<Image>` component** for images:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={1200}
  height={800}
  format="webp"
  quality={85}
  loading="lazy"  // or "eager" for above-fold
/>
```

**Rules:**
- Above-fold images: `loading="eager"` + `fetchpriority="high"`
- Below-fold images: `loading="lazy"`
- Format priority: WebP → AVIF → JPEG/PNG fallback (automatic)
- Max dimensions: Hero 1920x1080, Thumbnails 600x400

### CSS Strategy

- **Tailwind utility-first** - avoid custom CSS unless necessary
- **Critical CSS** automatically inlined in `<head>` by Astro
- **No CSS-in-JS** - Tailwind classes only
- Custom utilities go in `src/styles/global.css` under `@layer utilities`

### JavaScript Constraints

- Keep JS bundle <50KB (gzipped)
- React only for interactive components
- No heavy libraries (moment.js, lodash, etc.)
- Zustand for state management (1KB gzipped)

**Console logs removed in production** (terser config in `astro.config.mjs`).

### Performance Monitoring

**Real User Monitoring (RUM) enabled via Vercel:**

```astro
// src/layouts/BaseLayout.astro
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

<Analytics client:load />        <!-- User behavior tracking -->
<SpeedInsights client:load />    <!-- Core Web Vitals monitoring -->
```

**What is tracked automatically:**
- Page views, unique visitors, top pages
- Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
- Performance by region, device, browser
- Bundle impact: ~3KB total (gzipped)

**Access data:**
- Vercel Dashboard → zhulova-com → Analytics
- Vercel Dashboard → zhulova-com → Speed Insights

## Component Patterns

### Astro Component Structure

```astro
---
// 1. Imports
import type { HTMLAttributes } from 'astro/types';
import { Image } from 'astro:assets';

// 2. Type definitions
interface Props extends HTMLAttributes<'div'> {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

// 3. Props with defaults
const {
  title,
  description,
  variant = 'primary',
  class: className,
  ...rest
} = Astro.props;

// 4. Logic
const variantClasses = {
  primary: 'bg-navy-900 text-white',
  secondary: 'bg-white text-navy-900 border-2 border-navy-900',
};
---

<!-- 5. Template -->
<div class={`${variantClasses[variant]} ${className}`} {...rest}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <slot />
</div>
```

### React Component (Interactive Islands)

```tsx
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800',
    secondary: 'bg-gold-500 text-navy-900 hover:bg-gold-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface StoreState {
  // State
  isOpen: boolean;

  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Usage in React component:
const isOpen = useStore((state) => state.isOpen); // Selective subscription
```

## SEO & Accessibility

### Meta Tags (BaseLayout)

Every page must use `BaseLayout.astro` and provide:
```astro
<BaseLayout
  title="Page Title"
  description="150-160 char description"
  image="/images/og-image.jpg"  // optional, defaults to /images/og-default.jpg
  canonical="https://zhulova.com/page"  // optional
/>
```

### Accessibility Requirements

**Mandatory for all components:**
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Heading hierarchy (single `<h1>`, logical nesting)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators (configured globally in `global.css`)
- Color contrast ≥4.5:1 for text, ≥3:1 for UI elements
- Respect `prefers-reduced-motion`

**Example:**
```astro
<button
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
>
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>
```

## Design System

### Colors (Tailwind Config)

- **Navy** (`navy-{50-900}`): Primary brand color
- **Gold** (`gold-{50-900}`): Accent for CTAs
- **Sage** (`sage-{50-900}`): Secondary accent

### Typography

- **Headings:** `font-serif` (Playfair Display)
- **Body:** `font-sans` (Inter)
- Loaded via Google Fonts in `global.css`

### Spacing

Custom spacing scale: `spacing-{18, 88, 112, 128}` for large layouts.

## Environment Variables

**Required variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=eyJ...         # Public key (safe for client)
SUPABASE_SERVICE_KEY=eyJ...      # Secret key (server only, NEVER expose)

# Resend Configuration (Email Service)
RESEND_API_KEY=re_...            # Secret key (server only)
RESEND_FROM_EMAIL=onboarding@resend.dev  # Sender email (use verified domain in production)
NOTIFICATION_EMAIL=your-email@example.com  # Where form submissions are sent

# Site Configuration
PUBLIC_SITE_URL=https://zhulova.com
```

**Setup:**
1. Copy `.env.example` to `.env`
2. Fill in actual values
3. Add same variables to Vercel Dashboard (Settings → Environment Variables)
4. Download from Vercel: `vercel env pull .env`

**Security rules:**
- ✅ `PUBLIC_*` variables → exposed to client-side
- ❌ Non-public variables → serverless functions only (accessed via `import.meta.env`)
- ❌ Never commit `.env` to Git (already in `.gitignore`)
- ⚠️ **No fallback values** - API will fail-fast if required env vars are missing

## Deployment

**Platform:** Vercel (primary)

**Build output:**
- Static pages in `dist/`
- Serverless functions in `.vercel/output/functions/` (auto-generated from `src/pages/api/`)

**Setup:**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel Dashboard
3. Auto-deploy on push to main branch

**Configuration:**
- `astro.config.mjs` - Astro config with Vercel adapter (`output: 'hybrid'`)
- `vercel.json` - Vercel configuration (headers, regions)
- `.vercel/` - Local Vercel settings (in .gitignore)

**Build command:** `npm run build`
**Output directory:** `dist`
**Serverless functions:** `src/pages/api/**/*.ts` (must have `export const prerender = false`)

**Alternative platforms:**
- Netlify (with Netlify Functions)
- Cloudflare Pages (with Workers)

## Existing Pages

The project currently has the following pages:

### Main Pages
- **`/` (index.astro)** - Home page with hero, trust indicators, case studies, testimonials, consultation form
- **`/courses` (courses.astro)** - Courses catalog with 3 course cards, Footer legal variant
- **`/contacts` (contacts.astro)** - Social media hub with 5 social network cards, consultation CTA

### Course Detail Pages
- **`/courses/my-course`** - "Мій Курс" template (lorem ipsum)
- **`/courses/mindset-mastery`** - "Майстерність Мислення" template (lorem ipsum)
- **`/courses/goals-achievement`** - "Досягнення Цілей" template (lorem ipsum)

### Legal Pages
- **`/privacy-policy`** - Privacy policy (Footer legal variant)
- **`/terms`** - Terms of use (Footer legal variant)

### Utility Pages
- **`/logo-preview`** - Logo showcase (all variants)

### API Routes
- **`/api/submit-lead`** - Serverless function for consultation form (Supabase + Resend)

**Navigation Structure:**
- **Header/MobileMenu**: Про мене, Кейси, Питання, Відгуки, Курси, Контакти
- **Footer**: Same as header
- **Active States**: Menu items highlighted on `/courses/*` and `/contacts` pages

## Common Patterns

### Adding a New Page

1. Create `src/pages/new-page.astro`
2. Use `BaseLayout` with SEO props
3. Structure content semantically
4. Use Tailwind utilities for styling
5. Add to navigation if needed

### Adding an Interactive Component

1. Create React component in `src/components/common/Component.tsx`
2. Import in Astro page
3. Add appropriate `client:*` directive
4. Keep component focused (single responsibility)

### Adding Global State

1. Create store in `src/stores/newStore.ts`
2. Define TypeScript interface for state + actions
3. Use Zustand's `create` with typed state
4. Import and use selectively in React components

### Adding a Serverless Function

1. Create file in `src/pages/api/function-name.ts`
2. Add `export const prerender = false;` (REQUIRED for serverless)
3. Import `APIRoute` from Astro
4. Define Zod validation schema
5. Export `POST` (or `GET`) handler
6. Validate inputs with Zod
7. Access env vars via `import.meta.env.VARIABLE_NAME` (NO fallback values)
8. Interact with Supabase/Resend using server-only env vars
9. Return JSON response
10. Test locally with `npm run dev`

**Example structure:**
```typescript
// src/pages/api/submit-lead.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';

// REQUIRED: Disable prerendering for serverless function
export const prerender = false;

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const POST: APIRoute = async ({ request }) => {
  // Validate environment variables (fail-fast, no fallbacks)
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  const body = await request.json();
  const data = schema.parse(body);

  // Save to Supabase, send email, etc.

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

## What NOT to Do

- ❌ Change `output: 'hybrid'` to `output: 'server'` in `astro.config.mjs` (keep hybrid for static pages + API routes)
- ❌ Use CSS-in-JS libraries (styled-components, emotion)
- ❌ Add heavy npm packages without justification
- ❌ Skip TypeScript types or use `any`
- ❌ Ignore accessibility attributes
- ❌ Use inline styles instead of Tailwind
- ❌ Database queries in Astro components (only in serverless functions)
- ❌ Implement complex payment logic (use external checkout URLs)
- ❌ Client-side fetch for SEO content
- ❌ Expose secret environment variables to client (no `PUBLIC_` prefix for secrets)
- ❌ Skip input validation in API routes
- ❌ Modify or delete `.specify/` or `.claude/commands/` directories (Spec-Kit system files)

## Project-Specific Context

**Site purpose:** Personal brand website for mindset coach targeting entrepreneurs, IT professionals, and experts building personal brands.

**Tone:** Professional, calm, minimalistic, supportive. "Luxury coach" aesthetic.

**Payment model:** External checkout links (Stripe/WayForPay). No backend payment processing.

**Content strategy:** Courses sold via external links, coaching sessions booked via contact form or external scheduler.

## Documentation References

For detailed technical specifications, see:
- `.claude/docs/technical-spec.md` - Performance targets, optimization rules
- `.claude/docs/about.md` - Project requirements, design principles
- `README.md` - Getting started, project structure

For Astro-specific questions, refer to [Astro Docs](https://docs.astro.build).

## Active Technologies
- TypeScript 5.x (strict mode), Astro 4.x + Astro (SSG framework), React 18.x (client-side modal updates only), Tailwind CSS 3.x (styling) (004-legal-pages)
- Static content files in `src/pages/` directory (Astro file-based routing) (004-legal-pages)
- TypeScript 5.x (strict mode), Node.js runtime (Vercel serverless) (005-fix-consultation-api)
- Supabase PostgreSQL with RLS policies (existing `leads` table, schema documented in `specs/002-home-page/data-model.md`) (005-fix-consultation-api)
- Markdown (GitHub-flavored), English language + None (plain text editing) (006-complete-spec-alignment)
- Git version control (files in `specs/005-fix-consultation-api/`) (006-complete-spec-alignment)
- Git version control (files in `specs/004-legal-pages/`) (007-fix-legal-pages-docs)
- Git version control (files in `specs/001-base-infrastructure/`) (008-align-base-infra-docs)
- Markdown (GitHub-flavored), English language + None (plain text editing) + Git version control (files in `specs/002-home-page/`) (009-align-home-page-docs)
- N/A (documentation files only, no code changes) (009-align-home-page-docs)
- TypeScript 5.x (strict mode enabled) + None (native console API only per FR-015) (011-server-error-logging)
- N/A (logs written to stdout/stderr, captured by Vercel infrastructure) (011-server-error-logging)

**Frontend (Static):**
- TypeScript 5.x (strict mode) - Type safety
- Astro 4.x - SSG framework with Islands Architecture
- React 18.x - Interactive islands only
- Tailwind CSS 3.x - Utility-first styling
- Zustand 4.x - Lightweight state management (1KB)

**Backend (Serverless):**
- Vercel Functions - Serverless API routes
- Supabase PostgreSQL - Serverless database with RLS
- Resend - Email service

**Validation & Forms:**
- Zod 3.x - Runtime schema validation with TypeScript inference
- React Hook Form 7.x - Performant form state management

**Analytics & Monitoring:**
- @vercel/analytics - Privacy-friendly user behavior tracking (~2.5KB)
- @vercel/speed-insights - Real User Monitoring for Core Web Vitals (~0.7KB)

**Deployment:**
- Vercel - Hosting + Serverless Functions + Edge Network + Analytics

## Recent Changes

- **010-align-home-design-docs** (2025-11-23): Documentation alignment for feature 003-home-design-refinement completed 2025-11-17
  - **Purpose**: Align specs/003-home-design-refinement documentation with implementation from PRs #9, #10, #11
  - **Changes**:
    - Updated spec.md status from "Draft" to "Completed (2025-11-17)"
    - Added code references to 30 functional requirements (StatsSection, Footer, CaseStudiesSection, QuestionsSection, TestimonialsSection)
    - Converted 6 edge case questions to Q&A format with Answer, Code, Behavior, User Impact fields
    - Added "Monitoring & Verification" section with measurement methods for 10 success criteria
    - Integrated 3+ user feedback quotes from PROGRESS.md: "отлично мне очень нравится" (StatsSection), "отпад" (Footer), "да сейчас супер" (CaseStudies)
    - Added "Design Decisions" section to plan.md (D1: Results-First, D2: Gold Lines, D3: Compact Footer 45% reduction, D4: Carousel Navigation)
    - Marked tasks T005-T009 completed with commit SHAs, documented T010-T012 verification status
  - **Pattern**: Following GitHub Spec-Kit methodology from features 008-align-base-infra-docs and 009-align-home-page-docs

- **View Transitions API** (2025-11-17): ✅ **ENABLED**
  - Added Astro View Transitions for SPA-like navigation
  - Pages no longer reload completely when navigating
  - Smooth fade transitions between pages
  - ~2-3KB JavaScript overhead
  - **How it works**: Pages are pre-rendered (MPA), but navigation feels like SPA
  - **Benefits**: Fast first load + smooth navigation without full page reloads

- **Courses & Contacts Pages** (2025-11-17): ✅ **COMPLETED**
  - **Courses Catalog** (`/courses`): Grid of 3 course cards with icons, descriptions, and links
  - **Course Detail Pages**: 3 template pages (`my-course`, `mindset-mastery`, `goals-achievement`) with lorem ipsum
  - **Contacts Page** (`/contacts`): Social media hub with 5 interactive cards (YouTube, Instagram, Telegram, Facebook, TikTok)
  - **Navigation**: Added "Курси" and "Контакти" links to Header, Footer, MobileMenu
  - **Active States**: Menu items highlighted on `/courses/*` and `/contacts` pages
  - **Modal Integration**: Consultation modal works on contacts page
  - **Scroll Behavior**: Fixed navigation - smooth scroll on home page, normal navigation on other pages

- **Logo & Branding** (2025-11-17): ✅ **COMPLETED**
  - **Logo Design**: Minimalist "VZ" with gold dot accent
    - Desktop: VZ + gold circle (90x50px, h-14)
    - Mobile: Same logo (h-12 for consistency)
    - Files: `/public/logo.svg`, `/public/logo-light.svg`
  - **Favicon System**: VZ square badge retained
    - Source: `/public/favicon.svg` (dark square with white VZ + gold corner)
    - Generated: favicon.ico, favicon-16/32.png, apple-touch-icon.png, icon-192/512.png
    - Script: `npm run favicon:update` (Sharp-based PNG generation)
  - **Header Integration**: Logo integrated in Header.astro
    - Responsive: Same VZ logo on all devices
    - Hover effect: opacity-80 transition
  - **Mobile Fixes**: Hero section padding adjustments
    - Fixed header overlap on low-height screens
    - Updated media queries: `padding-top: 7rem` (landscape), `6rem` (low height)
    - Issue: CSS media queries were overriding Tailwind classes
  - **Preview Page**: Created `/logo-preview` for all logo variants showcase

- **Footer & Navigation Updates** (2025-11-17): ✅ **COMPLETED**
  - **Footer Image Optimization**:
    - Converted `viktoriia2.jpg` (16MB) → `footer-viktoria.webp` (103KB) - **154x compression**
    - Applied **Soft Luxury** styling (same as hero image)
    - Script: `.claude/scripts/convert-footer-image.js` (Sharp-based with SVG overlays)
    - Styling: Subtle color grading, warm tones, soft vignette, gold accent gradient
  - **Footer Branding**: Replaced text "Вікторія Жульова" with white logo (`/logo-light.svg`)
  - **Navigation Labels**: Changed "Головна" → "Про мене" across all components
    - Header (desktop navigation)
    - MobileMenu (mobile drawer)
    - Footer (footer navigation)
  - **Performance Impact**: Footer section now loads 154x faster with optimized WebP image

- **002-home-page** (2025-11-16): ✅ **COMPLETED**
  - **Status**: All core features implemented and deployed to production
  - **All 6 user stories implemented**:
    - US1: Consultation booking with Supabase + Resend (MVP)
    - US2: Credibility section with stats and case studies
    - US3: Problem-solution matching questions
    - US4: Client testimonials and social proof
    - US5: Course preview section
    - US6: Navigation and social media integration
  - **18 components created** (Astro + React + TypeScript)
  - **Serverless API**: /api/submit-lead endpoint with Zod validation
  - **Full SEO optimization**: meta tags, JSON-LD structured data, Ukrainian locale
  - **Accessibility**: WCAG AA compliance, keyboard navigation, ARIA labels
  - **Deployed**: https://zhulova.com (custom domain configured)
  - **Path aliases configured** in tsconfig.json and astro.config.mjs
  - **Analytics**: Vercel Analytics + Speed Insights integrated
  - **Remaining**: Image optimization, end-to-end testing (optional)

- **001-base-infrastructure** (2025-11-14 to 2025-11-16): Initial project setup with TypeScript 5.x (strict mode) + Astro 4.x (SSG framework), React 18.x (interactive islands), Tailwind CSS 3.x (styling), Zustand 4.x (state management)
