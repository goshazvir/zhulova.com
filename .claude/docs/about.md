# Project Specification: Viktoria Zhulova Personal Brand Website

**Stack:** Astro + TypeScript + Tailwind CSS
**Site Type:** Static Multi-Page Website
**Domain:** zhulova.com

---

## 1. Project Overview

Build a static personal brand website for **Viktoria Zhulova**, a mindset coach.

### Goals:
- Present the coach and her services
- Showcase courses with purchase capability
- Enable session booking
- Convert visitors into clients

### Final Product Requirements:
- Fast, clean, minimalistic design
- "Luxury coach" aesthetic
- Optimized for clarity, trust, and conversions
- 100% static generation (no server-side rendering)

---

## 2. Tech Stack

### ✅ Core Technologies:
- **Astro** (v4+) — SSG framework with Islands Architecture
- **TypeScript** (v5+) — strict mode enabled
- **Tailwind CSS** (v3+) — all styling (utility-first approach)
- **React** (v18+) — interactive components only
- **Zustand** (v4+) — state management

### ✅ Backend Services (Serverless):
- **Vercel Functions** — serverless API routes
- **Supabase PostgreSQL** — database for form submissions
- **Resend** — email service

### ✅ Validation & Forms:
- **Zod** (v3+) — schema validation
- **React Hook Form** (v7+) — form state management

### ❌ Must NOT Use:
- Material UI or any component libraries
- Heavy JavaScript frameworks for static content
- Server-side rendering (SSR) for pages
- Direct database queries in page components

### Build Output:
- Static HTML/CSS/JS files (all pages pre-rendered)
- Serverless functions for form submissions
- Deployable to Vercel (primary), Netlify, or Cloudflare Pages

---

## 3. Target Audience & Tone

### Primary Audiences:

**A. Young Entrepreneurs & Small Business Owners**
- Experiencing confusion, burnout, lack of direction
- Seeking mentorship for stability and clarity
- Age: 25-40

**B. IT Professionals (Mid/Senior Level)**
- High income but career fatigue
- Want growth, income increase, or transition to independent projects
- Previously tried therapy; seeking practical coaching

**C. Experts Building Personal Brands**
- Fear public visibility
- Need confidence, structure, and guidance
- Want consistent growth and income

### Tone of Voice:
**Professional · Calm · Minimalistic · Supportive**

**Avoid:** "Instagram glam", overly casual language, hype

---

## 4. Required Pages

### Initial Scope:

| Page | Purpose | Status |
|------|---------|--------|
| **Home** | Main landing, hero, services overview, social proof | Required |
| **About** | Coach bio, credentials, philosophy | Required |
| **Courses** | List of available courses | Required |
| **Course Page** | Individual course landing (dynamic template) | Required |
| **Reviews** | Testimonials (section on homepage initially) | Phase 1 |
| **Contacts** | Contact form or booking link | Required |
| **Thank You** | Post-purchase confirmation | Required |

### Page Generation:
- All pages must be static (generated at build time)
- Use Astro's file-based routing
- Course pages should use dynamic routes (`[slug].astro`)

---

## 5. Design System

### Style: "Minimal Luxury Coach"

**Color Palette:**
- Light backgrounds (white, off-white, soft beige)
- 2-3 accent colors maximum (suggest: muted gold/sage green + deep navy)
- High contrast for accessibility

**Typography:**
- **Headings:** Elegant serif (e.g., Playfair Display, Cormorant)
- **Body:** Clean sans-serif (e.g., Inter, DM Sans)
- Excellent readability (min 16px body, 1.6 line-height)

**Spacing:**
- Large whitespace (generous padding/margins)
- Breathing room around elements
- Mobile-first responsive design

**Visual Hierarchy:**
1. Coach's professional photo
2. Strong headline/value proposition
3. Clear CTAs ("Choose a Course", "Book a Session")

**Animations:**
- Simple, subtle only (fade-in, slide-up on scroll)
- No distracting effects
- Respect `prefers-reduced-motion`

---

## 6. Technical Requirements

### Performance:
- Lighthouse score 90+ (all categories)
- Optimized images (Astro Image component)
- Lazy loading for below-fold content
- Minimal JavaScript

### Accessibility:
- Semantic HTML5
- ARIA labels where needed
- Logical heading hierarchy (h1 → h2 → h3)
- Keyboard navigation
- Focus states

### SEO:
- Meta tags (title, description) for all pages
- Open Graph images
- Structured data (JSON-LD for Person/Organization)
- Sitemap.xml
- robots.txt

### Content Management:
- Use Astro Content Collections for courses
- Markdown for long-form content (About page, course descriptions)
- TypeScript interfaces for type safety

**Example Content Collection Structure:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const coursesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string(),
    duration: z.string(),
    paymentLink: z.string().url(),
    image: z.string(),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  courses: coursesCollection,
};
```

---

## 7. Payment & Form Integration

### Payment Requirements:
- External checkout only (Stripe Checkout, WayForPay, LiqPay, etc.)
- No payment processing on the website itself
- Pages remain 100% static (pre-rendered)

### Payment Implementation:
1. Course pages include "Purchase" CTA button
2. Button links to external payment URL (configured in frontmatter)
3. After payment, redirect to:
   - Static "Thank You" page (`/thank-you`)
   - OR external course platform URL

### Form Submissions (Consultation Requests):
- **Consultation form** saves leads to Supabase PostgreSQL database
- Email notifications sent via Resend service
- Implemented using **serverless functions** (Vercel Functions)
- Form validation with Zod schema
- No database queries for page rendering (pages stay static)

### AI Instructions:
- Create data structure for payment links (URL field in course schema)
- Design CTA button component with external link support
- Build static Thank You page
- **DO NOT** implement payment APIs or webhooks
- **DO** implement serverless API routes for form submissions only
- **DO** validate all form inputs with Zod
- **DO NOT** use database queries in Astro components (only in API routes)

---

## 8. Project Structure

### Recommended File Organization:

```
zhulova/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── CourseCard.astro
│   │   ├── CTAButton.astro
│   │   └── TestimonialCard.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── courses/
│   │       ├── course-1.md
│   │       └── course-2.md
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro (Home)
│   │   ├── about.astro
│   │   ├── courses/
│   │   │   ├── index.astro (Courses list)
│   │   │   └── [slug].astro (Course page)
│   │   ├── contact.astro
│   │   └── thank-you.astro
│   ├── styles/
│   │   └── global.css
│   └── types/
│       └── index.ts
├── public/
│   ├── images/
│   └── fonts/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 9. Component Guidelines

### All Components Must:
- Use TypeScript for props
- Be fully responsive (mobile-first)
- Follow Tailwind utility classes (no inline styles)
- Include proper semantic HTML
- Have accessible markup

**Example Component:**
```astro
---
// src/components/CTAButton.astro
interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

const { href, variant = 'primary', external = false } = Astro.props;
const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";
const variantClasses = {
  primary: "bg-navy-900 text-white hover:bg-navy-800",
  secondary: "bg-white text-navy-900 border border-navy-900 hover:bg-navy-50"
};
---

<a
  href={href}
  class={`${baseClasses} ${variantClasses[variant]}`}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
>
  <slot />
</a>
```

---

## 10. AI Agent Instructions

### When Building This Project:

#### ✅ DO:
- Create Astro pages using TypeScript
- Style exclusively with Tailwind CSS utility classes
- Build mobile-first responsive layouts
- Optimize images using Astro's `<Image>` component
- Write clean, readable, well-commented code
- Use Astro Content Collections for courses
- Implement proper SEO meta tags
- Create reusable components
- Follow accessibility best practices
- Keep dependencies minimal

#### ❌ DON'T:
- Add unnecessary npm packages
- Use CSS-in-JS or styled-components
- Implement backend logic
- Add database integrations
- Use complex state management
- Create overly animated UI
- Ignore TypeScript strict mode
- Skip semantic HTML
- Forget mobile responsiveness
- Add Material UI or component libraries

#### Code Quality Standards:
- TypeScript strict mode enabled
- ESLint + Prettier configured
- No unused imports
- Descriptive variable names
- Comments for complex logic only
- DRY principle (Don't Repeat Yourself)

---

## 11. Analytics & Monitoring

**Already Integrated:**
- ✅ **Vercel Analytics** - Privacy-friendly page view tracking (no cookies, GDPR compliant)
- ✅ **Vercel Speed Insights** - Real User Monitoring for Core Web Vitals (LCP, FID, CLS)

**Access:**
- Vercel Dashboard → Project → Analytics
- Vercel Dashboard → Project → Speed Insights
- Automatic tracking in production (no configuration needed)

---

## 12. Optional Future Enhancements

*Not in initial scope, but architecture should support:*

- Full testimonials page
- Blog/articles section
- Multi-language support (EN/UA/RU)
- Newsletter signup
- Contact form with FormSubmit/Formspree

---

## 13. Success Criteria

The project is complete when:

- [ ] All required pages are built and static
- [ ] Lighthouse scores 90+ across the board
- [ ] Mobile and desktop responsive
- [ ] Course pages display correctly with purchase CTAs
- [ ] External payment links work
- [ ] SEO meta tags present on all pages
- [ ] Accessible keyboard navigation works
- [ ] No console errors
- [ ] Fast load times (<2s FCP)
- [ ] Professional, calm, luxury aesthetic achieved

---

**Document Version:** 1.2
**Last Updated:** 2025-01-16
**For AI Agent Use:** This specification should guide all development decisions. When in doubt, prioritize simplicity, performance, and user experience.

**Changelog:**
- v1.2 (2025-01-16): Added Vercel Analytics and Speed Insights for user behavior and performance monitoring
- v1.1 (2025-01-16): Added serverless backend services (Vercel Functions, Supabase, Resend), form submission architecture, validation tools
- v1.0 (2025-01-14): Initial specification
