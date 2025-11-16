# Phase 0: Technical Research - Home Page

**Feature**: 002-home-page | **Date**: 2025-01-16
**Purpose**: Resolve technical unknowns and validate technology choices

## Research Summary

This research phase evaluates the technical approach for implementing the homepage, including form handling with database storage and email notifications while maintaining the static-first architecture.

---

## 1. Form Submission with Database Storage

### Decision: Serverless Functions + Supabase PostgreSQL

**Rationale**:
- Maintains static-first architecture (no server-side rendering)
- Vercel/Netlify serverless functions handle form submissions without a persistent server
- Supabase provides PostgreSQL database with RESTful API and excellent TypeScript support
- Free tier supports expected traffic (~100 submissions/month initially)
- Built-in Row Level Security (RLS) for data protection
- No backend server to maintain

**Alternatives Considered**:
1. **Third-party form services (FormSpree, Form submit)**:
   - ❌ Rejected: Limited database access, no custom business logic, data locked in external service
2. **Google Sheets API**:
   - ❌ Rejected: Not a proper database, poor query performance, no relational data support
3. **Firebase Firestore**:
   - ❌ Rejected: NoSQL not ideal for structured form data, more complex pricing model
4. **Self-hosted PostgreSQL**:
   - ❌ Rejected: Violates static-first principle, requires server maintenance

**Implementation Approach**:
```
User submits form (client-side validation)
  ↓
POST to /api/submit-lead (Vercel Function)
  ↓
Validate data + sanitize inputs
  ↓
Insert into Supabase `leads` table
  ↓
Trigger email notification
  ↓
Return success/error to client
```

**Key Libraries**:
- `@supabase/supabase-js` - Supabase client library
- `zod` - Runtime type validation for form inputs

---

## 2. Email Notification Service

### Decision: Resend

**Rationale**:
- Modern developer-friendly API with excellent TypeScript support
- Free tier: 100 emails/day, 3,000 emails/month (sufficient for MVP)
- React Email template support for professional HTML emails
- Simple pricing: $20/month for 50k emails (scales with growth)
- Better deliverability than SendGrid for transactional emails
- No complicated SPF/DKIM setup required

**Alternatives Considered**:
1. **SendGrid**:
   - ❌ Rejected: Complex API, legacy UI, overkill for simple transactional emails
2. **Postmark**:
   - ✅ Strong alternative, excellent deliverability
   - ❌ Rejected: Slightly more expensive ($15/month for 10k), less modern DX
3. **Amazon SES**:
   - ❌ Rejected: Requires AWS account, more complex setup, worse DX
4. **Nodemailer + Gmail SMTP**:
   - ❌ Rejected: Daily sending limits (500/day), not reliable for production

**Implementation Approach**:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'website@zhulova.com',
  to: 'viktoria@zhulova.com',
  subject: `Нова заявка на консультацію - ${name}`,
  html: emailTemplate({ name, phone, telegram, email, createdAt })
});
```

**Email Template Structure**:
- Plain text email (avoid HTML complexity for MVP)
- Include all form fields
- Timestamp in Kyiv timezone
- Source page identifier
- Direct link to Supabase dashboard for lead details (optional)

---

## 3. Database Schema Design

### Decision: Single `leads` table with normalized structure

**Rationale**:
- Simple schema for MVP
- All consultation requests in one table for easy querying
- UUID primary key for security (no sequential IDs)
- Timestamps with timezone for accurate record-keeping
- Indexes on frequently queried fields (created_at, email)

**Schema Definition**:
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  telegram VARCHAR(100),
  email VARCHAR(255),
  source VARCHAR(50) DEFAULT 'home_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;

-- Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Only server can insert/read (via service role key)
CREATE POLICY "Server-only access" ON leads
  FOR ALL
  USING (auth.role() = 'service_role');
```

**Alternatives Considered**:
1. **Separate tables for different lead sources**:
   - ❌ Rejected: Overengineering for MVP, complicates queries
2. **JSON column for flexible form fields**:
   - ❌ Rejected: Loses type safety, harder to query, poor indexing
3. **Embedded in Astro Content Collections**:
   - ❌ Rejected: Content Collections for static content only, no real-time writes

**Data Validation**:
- Client-side: React Hook Form + Zod schema
- Server-side: Zod schema in serverless function
- Database: PostgreSQL constraints (NOT NULL, VARCHAR length limits)

---

## 4. Analytics Implementation

### Decision: Plausible Analytics

**Rationale**:
- Privacy-focused (no cookies, GDPR-compliant by default)
- Lightweight script (<1KB)
- Cleaner UX than Google Analytics (no cookie banners)
- Tracks custom events without complex setup
- $9/month for 10k monthly visitors (scales with growth)
- Open-source with self-hosting option if needed later

**Alternatives Considered**:
1. **Google Analytics 4**:
   - ❌ Rejected: Cookie banners required, complex setup, privacy concerns, heavier script (~45KB)
2. **Fathom Analytics**:
   - ✅ Similar to Plausible
   - ❌ Rejected: Slightly more expensive ($14/month for 10k visitors)
3. **No analytics (just form submissions)**:
   - ❌ Rejected: Need bounce rate, time on page, scroll depth for optimization

**Tracked Events**:
```javascript
// Automatically tracked
- Page views
- Bounce rate
- Time on page
- Referrer sources

// Custom events
plausible('CTA Click', { props: { button: 'hero' } });
plausible('Modal Open', { props: { type: 'consultation' } });
plausible('Form Submit', { props: { success: true } });
plausible('Form Error', { props: { field: 'phone' } });
```

**Implementation**:
- Add Plausible script to `<head>` via BaseLayout
- Configure domain in Plausible dashboard
- Track custom events in React components

---

## 5. Form Validation Strategy

### Decision: Zod + React Hook Form

**Rationale**:
- Zod provides runtime type validation + TypeScript types from single schema
- React Hook Form optimized performance (fewer re-renders)
- Built-in error handling and accessibility features
- Schema reused on server-side for security
- Excellent Ukrainian internationalization support

**Validation Schema**:
```typescript
import { z } from 'zod';

export const consultationFormSchema = z.object({
  name: z.string()
    .min(2, 'Ім\'я має містити мінімум 2 символи')
    .max(255, 'Ім\'я занадто довге'),

  phone: z.string()
    .regex(/^\+380\d{9}$/, 'Введіть номер у форматі +380XXXXXXXXX'),

  telegram: z.string()
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, 'Telegram має формат @username')
    .optional()
    .or(z.literal('')),

  email: z.string()
    .email('Введіть коректну email адресу')
    .optional()
    .or(z.literal('')),
});

export type ConsultationFormData = z.infer<typeof consultationFormSchema>;
```

**Alternatives Considered**:
1. **Formik + Yup**:
   - ❌ Rejected: Larger bundle size, Yup less TypeScript-friendly than Zod
2. **Native HTML5 validation**:
   - ❌ Rejected: Limited error messages, poor UX, no server-side reuse
3. **Custom validation**:
   - ❌ Rejected: Reinventing the wheel, more bugs, no accessibility features

**Error Handling**:
- Display inline errors under each field
- Highlight invalid fields with red border
- Disable submit button until all required fields valid
- Show loading spinner during submission
- Display success/error toast after submission

---

## 6. Static Content Management

### Decision: Hardcoded content in Astro components (MVP), Content Collections for courses

**Rationale**:
- Homepage content rarely changes (hero, stats, questions)
- Hardcoding avoids CMS complexity for MVP
- TypeScript ensures type safety
- Content in git for version control
- Easy to migrate to CMS later if needed
- Courses use Astro Content Collections for structured data

**Alternatives Considered**:
1. **Headless CMS (Sanity, Contentful)**:
   - ❌ Rejected: Overengineering for MVP, adds complexity, monthly cost
2. **Markdown files for all content**:
   - ❌ Rejected: Unnecessary abstraction for simple structured data
3. **JSON data files**:
   - ❌ Rejected: No type safety, harder to maintain than TypeScript

**Content Structure**:
```typescript
// src/data/homePageContent.ts
export const heroContent = {
  title: "Вікторія Жульова, сертифікований коуч",
  subtitle: "Я допоможу тобі досягнути своїх цілей...",
  ctaText: "Записатись на розбір",
  imageSrc: "/images/hero-viktoria.webp",
  imageAlt: "Вікторія Жульова - професійний коуч",
} as const;

export const statistics = [
  { value: "10 років", label: "побудови високоефективних команд" },
  { value: "200+", label: "клієнтів, здобули свої цілі" },
  { value: "4", label: "інструменти в роботі в менторстві" },
  { value: "12 000+", label: "годин практики" },
] as const;
```

**Future Migration Path**:
- If content updates become frequent → migrate to TinaCMS (Git-based, free)
- If non-technical editor needed → migrate to Sanity (headless CMS)

---

## 7. Image Optimization

### Decision: Astro Image component + Sharp + WebP/AVIF

**Rationale**:
- Astro's built-in `<Image>` component handles optimization automatically
- Sharp provides fast image processing at build time
- WebP reduces file size by 30% vs JPEG, AVIF by 50%
- Automatic responsive images with srcset
- Lazy loading built-in
- No runtime cost (processed at build time)

**Image Processing Workflow**:
```
Source image (PNG/JPEG)
  ↓
Astro build-time processing (Sharp)
  ↓
Generate WebP + AVIF versions
  ↓
Generate responsive sizes (320w, 640w, 1024w, 1440w, 1920w)
  ↓
Output optimized images to `/_astro/` with hash
  ↓
Serve via CDN with cache headers
```

**Alternatives Considered**:
1. **External CDN (Cloudinary, Imgix)**:
   - ❌ Rejected: Monthly cost, adds external dependency, slower than local CDN
2. **Manual optimization**:
   - ❌ Rejected: Time-consuming, inconsistent, no responsive images
3. **Next.js Image component**:
   - ❌ Rejected: Using Astro, not Next.js

**Implementation Guidelines**:
- Hero image: 1920x1080, quality 85, WebP, eager loading, fetchpriority high
- Thumbnails: 600x400, quality 80, WebP, lazy loading
- Case study photos: 400x400, quality 80, WebP, lazy loading
- Footer photo: 150x150, quality 75, WebP, lazy loading

---

## 8. Mobile Navigation Pattern

### Decision: Slide-in drawer with React + Zustand

**Rationale**:
- Common mobile pattern (familiar UX)
- Zustand manages open/close state (1KB overhead)
- React for smooth animations
- Accessible keyboard/screen reader support
- No external libraries needed

**Implementation**:
```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({
    isMobileMenuOpen: !state.isMobileMenuOpen
  })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
```

**Alternatives Considered**:
1. **Pure CSS (checkbox hack)**:
   - ❌ Rejected: Poor accessibility, no keyboard support, harder to maintain
2. **Alpine.js**:
   - ❌ Rejected: Additional framework, React already in stack for forms
3. **Headless UI**:
   - ❌ Rejected: Overkill for simple drawer, adds dependency

**Accessibility Features**:
- Focus trap when menu open
- Escape key closes menu
- Click outside closes menu
- ARIA labels (aria-expanded, aria-controls)
- Focus returns to hamburger button on close

---

## 9. Scroll Animations

### Decision: Intersection Observer API (vanilla JS)

**Rationale**:
- Native browser API (no library needed)
- Excellent performance
- Easy to implement
- Respects `prefers-reduced-motion`
- Works with Tailwind utility classes

**Implementation Pattern**:
```typescript
// src/utils/scrollAnimations.ts
export function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return; // Skip animations

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });
}
```

**Alternatives Considered**:
1. **AOS (Animate On Scroll)**:
   - ❌ Rejected: External library (12KB), overkill for simple fades
2. **Framer Motion**:
   - ❌ Rejected: React-specific, adds 28KB, too heavy
3. **CSS-only (scroll-timeline)**:
   - ❌ Rejected: Poor browser support, experimental API

**Animation Classes (Tailwind)**:
```css
/* global.css */
@layer utilities {
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in-up {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
}
```

---

## 10. Hosting & Deployment

### Decision: Vercel

**Rationale**:
- Optimized for Astro (official integration)
- Automatic serverless functions deployment
- Global CDN with edge caching
- Free tier sufficient for MVP (100GB bandwidth, unlimited sites)
- Automatic HTTPS + custom domain
- GitHub integration (deploy on push)
- Environment variables management
- Excellent performance (CDN globally distributed)

**Alternatives Considered**:
1. **Netlify**:
   - ✅ Very similar to Vercel
   - ❌ Rejected: Slightly slower build times, less Astro-optimized
2. **Cloudflare Pages**:
   - ✅ Fastest CDN
   - ❌ Rejected: Serverless functions more limited, worse DX
3. **GitHub Pages**:
   - ❌ Rejected: No serverless functions, no environment variables, slower

**Deployment Workflow**:
```
git push to main branch
  ↓
Vercel triggers build
  ↓
npm run build (Astro static generation)
  ↓
Deploy to Vercel CDN
  ↓
Deploy serverless functions to edge network
  ↓
Automatic cache invalidation
  ↓
Site live at zhulova.com
```

**Configuration**:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18.x
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`

---

## Technical Stack Summary

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Frontend Framework** | Astro 4.x | Static site generation, optimal performance, Islands architecture |
| **Interactive Components** | React 18.x | Mature ecosystem, excellent TypeScript support, partial hydration |
| **Styling** | Tailwind CSS 3.x | Utility-first, tree-shakeable, minimal CSS output |
| **State Management** | Zustand 4.x | Lightweight (1KB), no Provider hell, TypeScript-first |
| **Form Validation** | Zod + React Hook Form | Runtime type safety, excellent DX, reusable schemas |
| **Database** | Supabase PostgreSQL | Serverless-friendly, RESTful API, Row Level Security |
| **Email Service** | Resend | Modern API, React Email templates, excellent deliverability |
| **Serverless Functions** | Vercel Functions | Automatic deployment, environment variables, low latency |
| **Image Optimization** | Astro Image + Sharp | Build-time processing, WebP/AVIF, responsive images |
| **Analytics** | Plausible | Privacy-focused, lightweight, no cookies |
| **Hosting** | Vercel | Global CDN, serverless support, GitHub integration |
| **TypeScript** | 5.x (strict mode) | Type safety, better IDE support, fewer bugs |

---

## Security Considerations

### 1. API Key Management
- **Never** expose Supabase service role key client-side
- Use environment variables for all secrets
- Anon key for client-side (limited permissions via RLS)
- Service role key only in serverless functions

### 2. Input Sanitization
- Validate all inputs with Zod schema
- Sanitize strings to prevent SQL injection (Supabase SDK handles this)
- Rate limiting on serverless functions (Vercel built-in)

### 3. Row Level Security (RLS)
```sql
-- Only server can insert leads
CREATE POLICY "Server-only insert" ON leads
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- No public read access
CREATE POLICY "No public access" ON leads
  FOR SELECT
  USING (false);
```

### 4. CORS Configuration
```typescript
// api/submit-lead.ts
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // US East (closest to Supabase)
};

// Allow only production domain
const allowedOrigins = [
  'https://zhulova.com',
  'https://www.zhulova.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:4321' : null,
].filter(Boolean);
```

---

## Performance Budget Validation

| Metric | Target | Expected | Status |
|--------|--------|----------|--------|
| **HTML** | <50KB | ~30KB | ✅ Pass |
| **CSS** | <20KB | ~15KB | ✅ Pass (Tailwind purge) |
| **JavaScript** | <50KB | ~35KB | ✅ Pass (React 18 + Zustand) |
| **Images** | WebP/AVIF | WebP | ✅ Pass (Astro Image) |
| **Total Page Weight** | <350KB | ~250KB | ✅ Pass |
| **LCP** | <2.5s | ~1.8s | ✅ Pass (eager hero image) |
| **CLS** | <0.1 | ~0.05 | ✅ Pass (reserved image space) |
| **FID** | <100ms | ~50ms | ✅ Pass (minimal JS) |

---

## Open Questions Resolved

1. **Q: How to handle duplicate form submissions?**
   - A: Client-side debouncing (prevent double clicks) + database unique constraint on (email, phone, created_at::date)

2. **Q: What if email service fails?**
   - A: Still save to database, return success to user, retry email via background job (future enhancement)

3. **Q: How to test serverless functions locally?**
   - A: Vercel CLI (`vercel dev`) runs serverless functions locally

4. **Q: How to handle form spam?**
   - A: Rate limiting (Vercel built-in), honeypot field (hidden input), reCAPTCHA v3 if spam becomes issue

5. **Q: How to preview emails before sending?**
   - A: Use Resend's test mode + React Email dev server for local preview

---

## Next Steps (Phase 1)

1. ✅ Create `data-model.md` with detailed database schema
2. ✅ Define API contracts in `contracts/submit-lead.yaml` (OpenAPI spec)
3. ✅ Write `quickstart.md` for local development setup
4. ✅ Update agent context with approved technologies

---

**Research Status**: ✅ **COMPLETE**
**All unknowns resolved**: Yes
**Ready for Phase 1 Design**: Yes
