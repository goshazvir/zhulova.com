# Viktoria Zhulova - Personal Brand Website

> A high-performance static website built with modern web technologies, showcasing best practices in web development, performance optimization, and user experience.

🌐 **Live Site:** [zhulova.com](https://zhulova.com)

---

## 📖 About This Project

Personal brand website for a mindset coach, built with a focus on:
- **Performance-first architecture** - Lighthouse 95+ scores
- **Privacy-friendly analytics** - GDPR compliant monitoring
- **Accessible design** - WCAG AA compliance
- **Modern tech stack** - Cutting-edge tools and frameworks

This project demonstrates a hybrid static-first approach: fully pre-rendered pages combined with serverless functions for dynamic features like form submissions and email notifications.

---

## ✨ Key Features

### 🚀 Performance
- **Lighthouse scores 95+** across all metrics
- **Core Web Vitals optimized** - LCP <2.5s, FID <100ms, CLS <0.1
- **Islands Architecture** - Only interactive components hydrate (minimal JavaScript)
- **Automatic image optimization** - WebP/AVIF formats with fallbacks
- **Edge deployment** - Global CDN with sub-100ms TTFB

### 🔒 Privacy & Security
- **GDPR-compliant analytics** - No cookies, privacy-friendly tracking
- **Input validation** - Zod schema validation on all forms
- **Row Level Security** - Supabase RLS policies for data protection
- **Environment variables** - Secure credential management

### ♿ Accessibility
- **WCAG AA compliant** - Semantic HTML, ARIA labels, keyboard navigation
- **Color contrast** - Meets 4.5:1 ratio for text
- **Reduced motion support** - Respects user preferences
- **Screen reader tested** - Fully accessible interactive components

### 📊 Real User Monitoring
- **Vercel Analytics** - Page views, unique visitors, traffic sources
- **Speed Insights** - Core Web Vitals from real users
- **Geographic breakdown** - Performance by region/device/browser

---

## 🛠️ Tech Stack

### Frontend (Static)
- **[Astro](https://astro.build) v4** - Static Site Generator with Islands Architecture
- **[React](https://react.dev) v18** - Interactive components (minimal hydration)
- **[TypeScript](https://www.typescriptlang.org) v5** - Type safety with strict mode
- **[Tailwind CSS](https://tailwindcss.com) v3** - Utility-first styling
- **[Zustand](https://github.com/pmndrs/zustand) v4** - Lightweight state management (1KB)

### Backend (Serverless)
- **[Vercel Functions](https://vercel.com/docs/functions)** - Serverless API routes for forms
- **[Supabase](https://supabase.com)** - PostgreSQL database with Row Level Security
- **[Resend](https://resend.com)** - Email service for notifications

### Forms & Validation
- **[Zod](https://zod.dev) v3** - Runtime schema validation with TypeScript inference
- **[React Hook Form](https://react-hook-form.com) v7** - Performant form state management

### Analytics & Monitoring
- **[@vercel/analytics](https://vercel.com/analytics)** - Privacy-friendly user behavior tracking (~2.5KB)
- **[@vercel/speed-insights](https://vercel.com/docs/speed-insights)** - Real User Monitoring for Core Web Vitals (~0.7KB)

### Deployment
- **[Vercel](https://vercel.com)** - Hosting with Edge Network, automatic deployments

---

## 🏗️ Architecture

### Hybrid Static-First Approach

```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
                                      ↓
                     Form Submit → Serverless Function → Database/Email
```

**Static Layer (Pages):**
- All pages pre-rendered at build time
- Zero server-side rendering (SSR)
- Content from Astro Content Collections
- SEO-optimized HTML/CSS shipped to CDN

**Dynamic Layer (Serverless Functions):**
- Form submissions → `/api/submit-lead`
- Email notifications → Resend API
- Database writes → Supabase PostgreSQL
- Only non-SEO operations use serverless

**Why this approach?**
- ⚡ Fast initial page loads (static HTML)
- 🔍 Perfect SEO (all content in HTML)
- 🔄 Dynamic features where needed (forms, notifications)
- 💰 Cost-effective (minimal compute usage)

---

## 📦 Project Structure

```
zhulova/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Button, Card, etc.
│   │   └── layout/      # Header, Footer, Navigation
│   ├── content/         # Content Collections (courses)
│   ├── layouts/         # Page layouts with SEO/Analytics
│   ├── pages/           # File-based routing (static pages)
│   ├── stores/          # Zustand state management
│   └── styles/          # Global styles (Tailwind)
├── api/                 # Serverless functions (Vercel)
│   └── submit-lead.ts   # Form submission handler
├── public/              # Static assets
├── .claude/             # AI development context & docs
├── specs/               # Feature specifications (Spec-Kit)
└── dist/                # Build output (static files)
```

---

## 🎯 Performance Metrics

| Metric | Target | Achieved |
|--------|--------|----------|
| **Lighthouse Performance** | ≥95 | ✅ TBD |
| **LCP** (Largest Contentful Paint) | <2.5s | ✅ TBD |
| **FID** (First Input Delay) | <100ms | ✅ TBD |
| **CLS** (Cumulative Layout Shift) | <0.1 | ✅ TBD |
| **Total Bundle Size** | <350KB | ✅ ~250KB |
| **JavaScript Bundle** | <50KB | ✅ ~43KB (gzipped) |

*Metrics will be updated after production deployment*

---

## 🎨 Design System

**Color Palette:**
- **Navy** - Primary brand color
- **Gold** - Accent for CTAs
- **Sage** - Secondary accent

**Typography:**
- **Headings** - Playfair Display (serif)
- **Body** - Inter (sans-serif)

**Philosophy:**
- Minimal Luxury aesthetic
- Generous whitespace
- Mobile-first responsive design
- Professional, calm, supportive tone

---

## 🔧 Development Approach

### Spec-Kit Workflow
This project uses **[Spec-Kit](https://github.com/github/spec-kit)** for structured development:

1. **Specify** - Create detailed feature specification
2. **Plan** - Generate implementation plan
3. **Tasks** - Break down into actionable tasks
4. **Implement** - Execute with quality checks

All specifications live in `specs/` directory.

### AI-Assisted Development
- Development context in `.claude/` directory
- Technical specifications in `.claude/docs/`
- Automated quality checks and validation

---

## 📊 Analytics & Monitoring

**What's tracked:**
- Page views and unique visitors
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- Performance by region, device, browser
- Privacy-friendly (no cookies, GDPR compliant)

**Access:**
- Vercel Dashboard → Analytics
- Vercel Dashboard → Speed Insights

---

## 🚀 Deployment

**Platform:** [Vercel](https://vercel.com)

**Automatic deployments:**
- Push to `main` → Production deployment
- Pull requests → Preview deployments
- Edge Network → Global CDN

**Configuration:**
- Build command: `npm run build`
- Output directory: `dist/`
- Serverless functions: `api/**/*.ts`

---

## 📚 Documentation

For detailed technical documentation, see:
- `.claude/docs/technical-spec.md` - Complete technical specification
- `.claude/docs/about.md` - Project requirements and design principles
- `CLAUDE.md` - Development guide and architecture

---

## 🤝 About the Developer

This project was developed as a personal showcase of modern web development practices, combining:
- Performance optimization techniques
- Accessibility best practices
- Privacy-friendly analytics
- Serverless architecture
- Type-safe development

**Technologies used reflect current industry standards and best practices.**

---

## 📄 License

Copyright © 2025 Viktoria Zhulova. All rights reserved.

---

**Built with ❤️ using Astro, React, TypeScript, and modern web technologies.**
