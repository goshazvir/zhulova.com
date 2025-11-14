# Viktoria Zhulova - Personal Brand Website

A high-performance static website built with Astro, React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Astro** v4+ - Static Site Generator
- **React** v18+ - Interactive components (Islands Architecture)
- **TypeScript** v5+ - Type safety (strict mode)
- **Tailwind CSS** v3+ - Utility-first styling
- **Zustand** v4+ - Lightweight state management

## 📦 Project Structure

```
/
├── public/              # Static assets
│   ├── images/
│   └── fonts/
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # UI components (Button, Card)
│   │   ├── layout/      # Header, Footer, Navigation
│   │   └── sections/    # Homepage sections
│   ├── content/         # Content Collections
│   │   ├── config.ts    # Content schema definitions
│   │   └── courses/     # Course markdown files
│   ├── layouts/         # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/           # File-based routing
│   │   ├── index.astro  # Homepage
│   │   └── courses/
│   ├── stores/          # Zustand stores
│   │   └── uiStore.ts   # UI state management
│   ├── styles/          # Global styles
│   │   └── global.css
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start dev server at `localhost:4321`             |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview built site locally                       |
| `npm run astro ...`       | Run Astro CLI commands                           |

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:4321`

## 📝 Creating Content

### Adding a Course

Create a new markdown file in `src/content/courses/`:

```markdown
---
title: "Mindset Mastery"
description: "Transform your thinking patterns and unlock your potential"
price: 297
currency: "USD"
duration: "6 weeks"
paymentLink: "https://buy.stripe.com/..."
image: "/images/courses/mindset-mastery.jpg"
published: true
order: 1
features:
  - "Weekly 1:1 sessions"
  - "Lifetime access to materials"
  - "Private community access"
---

## Course Overview

Your course content goes here...
```

## ⚡ Performance

This site is optimized for maximum performance:

- **Lighthouse Score Target:** 95+ across all metrics
- **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
- **Static-first:** All pages pre-rendered at build time
- **Islands Architecture:** Interactive components hydrate on-demand
- **Optimized Images:** Automatic WebP/AVIF conversion

## ♿ Accessibility

Built with WCAG AA compliance:

- Semantic HTML5
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios meet standards
- Respects `prefers-reduced-motion`

## 🎨 Design System

### Colors

- **Navy:** Primary brand color
- **Gold:** Accent color for CTAs
- **Sage:** Secondary accent

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
PUBLIC_SITE_URL=https://zhulova.com
```

### TypeScript Paths

Path aliases are configured in `tsconfig.json`:

```typescript
import Button from '@components/common/Button';
import BaseLayout from '@layouts/BaseLayout.astro';
import { useUIStore } from '@stores/uiStore';
```

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🚀 Deployment

This static site can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**

Build command: `npm run build`
Output directory: `dist/`

## 📄 License

Copyright © 2025 Viktoria Zhulova. All rights reserved.
