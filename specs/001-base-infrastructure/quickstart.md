# Quickstart Guide: Base Infrastructure & Design System

**Feature**: Base Infrastructure & Design System
**Branch**: `001-base-infrastructure`

This guide provides step-by-step instructions for setting up and using the base infrastructure and design system components.

---

## Prerequisites

- Node.js 18+ and npm installed
- Git configured
- Text editor with TypeScript support (VS Code recommended)

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/zhulova.git
cd zhulova

# Checkout the feature branch
git checkout 001-base-infrastructure

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm run dev
# Server runs at http://localhost:4321
```

### 3. Verify Installation

Open http://localhost:4321 in your browser. You should see the base layout with:
- Header with navigation
- Main content area
- Footer with links and copyright

---

## Using BaseLayout

The BaseLayout component provides the foundation for all pages with SEO, accessibility, and consistent structure.

### Basic Usage

```astro
---
// src/pages/example.astro
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Title"
  description="Page description for SEO (150-160 characters)"
>
  <h1>Your Page Content</h1>
  <p>Page content goes here...</p>
</BaseLayout>
```

### Advanced Usage with All Options

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

const pageProps = {
  title: 'About Viktoria Zhulova',
  description: 'Learn about Viktoria Zhulova, a professional mindset coach helping entrepreneurs achieve clarity and growth.',
  image: '/images/about-og.jpg',
  canonical: 'https://zhulova.com/about',
  type: 'website',
  noindex: false,
};
---

<BaseLayout {...pageProps}>
  <!-- Your content -->
</BaseLayout>
```

### SEO Verification

View page source to verify meta tags are properly rendered:
- `<title>` tag with your title
- `<meta name="description">` with your description
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URL

---

## Using the Design System

### Colors

The Tailwind configuration provides custom brand colors:

```html
<!-- Navy (Primary) -->
<div class="bg-navy-900 text-white">Dark navy background</div>
<div class="bg-navy-500 text-white">Medium navy</div>
<div class="text-navy-900">Navy text on light background</div>

<!-- Gold (Accent) -->
<button class="bg-gold-500 text-navy-900 hover:bg-gold-400">
  Gold CTA Button
</button>

<!-- Sage (Secondary) -->
<div class="bg-sage-100 border-sage-300">
  Sage accent box
</div>
```

### Typography

```html
<!-- Headings use Playfair Display (serif) -->
<h1 class="font-serif text-4xl">Main Heading</h1>
<h2 class="font-serif text-3xl">Subheading</h2>

<!-- Body text uses Inter (sans-serif) -->
<p class="font-sans text-base">
  Body text in Inter font...
</p>

<!-- Font weights -->
<p class="font-normal">Regular (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
```

### Spacing

Custom spacing values for large layouts:

```html
<!-- Custom spacing utilities -->
<section class="py-18">       <!-- 72px vertical padding -->
<div class="mt-88">           <!-- 352px top margin -->
<div class="gap-112">          <!-- 448px gap -->
<div class="h-128">            <!-- 512px height -->
```

### Responsive Design

Mobile-first responsive utilities:

```html
<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Column 1</div>
  <div class="w-full md:w-1/2">Column 2</div>
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
  Desktop only content
</div>

<!-- Different text sizes per breakpoint -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>
```

---

## Creating Components

### Static Astro Component

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
  link?: string;
}

const { title, description, image, link } = Astro.props;
---

<article class="bg-white rounded-lg shadow-md overflow-hidden">
  {image && (
    <img src={image} alt="" class="w-full h-48 object-cover" />
  )}
  <div class="p-6">
    <h3 class="font-serif text-xl mb-2">{title}</h3>
    {description && <p class="text-navy-700 mb-4">{description}</p>}
    {link && (
      <a href={link} class="text-gold-500 hover:text-gold-600 font-medium">
        Learn more →
      </a>
    )}
  </div>
</article>
```

### Interactive React Component

```tsx
// src/components/Button.tsx
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors';

  const variantClasses = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800',
    secondary: 'bg-gold-500 text-navy-900 hover:bg-gold-400',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

Using the React component in Astro:

```astro
---
import Button from '@components/Button';
---

<!-- Static button (no JavaScript) -->
<Button>Static Button</Button>

<!-- Interactive button (hydrated) -->
<Button client:idle onClick={() => console.log('Clicked!')}>
  Interactive Button
</Button>
```

---

## Navigation Components

### Using the Header

```astro
---
// src/pages/index.astro
import Header from '@components/layout/Header.astro';
import BaseLayout from '@layouts/BaseLayout.astro';

const navigationItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

const currentPath = Astro.url.pathname;
---

<BaseLayout title="Home">
  <Header
    navigationItems={navigationItems}
    currentPath={currentPath}
    siteName="Viktoria Zhulova"
    sticky={true}
  />

  <main>
    <!-- Page content -->
  </main>
</BaseLayout>
```

### Using the Footer

```astro
---
import Footer from '@components/layout/Footer.astro';

const footerProps = {
  companyName: 'Viktoria Zhulova',
  copyrightYear: new Date().getFullYear(),
  socialLinks: [
    {
      platform: 'instagram',
      url: 'https://instagram.com/zhulova',
      ariaLabel: 'Follow on Instagram',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/zhulova',
      ariaLabel: 'Connect on LinkedIn',
    },
  ],
  legalLinks: [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
    { id: 'terms', label: 'Terms of Service', href: '/terms' },
  ],
};
---

<Footer {...footerProps} />
```

---

## Global State Management

### Setting Up the UI Store

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({
    isMobileMenuOpen: !state.isMobileMenuOpen
  })),
}));
```

### Using the Store in React Components

```tsx
// src/components/MobileMenu.tsx
import { useUIStore } from '@stores/uiStore';

export default function MobileMenu() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        className="md:hidden"
      >
        Menu
      </button>

      {isMobileMenuOpen && (
        <nav className="mobile-menu">
          {/* Navigation items */}
        </nav>
      )}
    </>
  );
}
```

---

## Accessibility Features

### Focus Management

All interactive elements have visible focus indicators:

```html
<!-- Focus indicators work automatically -->
<button class="px-6 py-3 bg-navy-900 text-white">
  Tab to me to see focus ring
</button>

<a href="/about" class="text-gold-500">
  Links also have focus indicators
</a>
```

### Skip to Main Content

The BaseLayout includes a skip link for keyboard users:

```html
<!-- Automatically included in BaseLayout -->
<!-- Visible only when focused with Tab key -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Reduced Motion

Animations are automatically disabled for users who prefer reduced motion:

```css
/* In global.css - already configured */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testing Your Implementation

### 1. Performance Testing

```bash
# Build the site
npm run build

# Preview production build
npm run preview

# Run Lighthouse audit
npx lighthouse http://localhost:4321 --view
```

Target scores:
- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

### 2. Accessibility Testing

```bash
# Install Pa11y for accessibility testing
npm install --save-dev pa11y

# Run accessibility audit
npx pa11y http://localhost:4321
```

### 3. Manual Testing Checklist

- [ ] Navigate entire site using only keyboard (Tab, Enter, Escape)
- [ ] All interactive elements have visible focus indicators
- [ ] Mobile menu works on small screens
- [ ] Colors have sufficient contrast (use Chrome DevTools)
- [ ] Page works without JavaScript enabled
- [ ] Meta tags appear in page source
- [ ] Images load properly with WebP format

---

## Common Patterns

### Creating a New Page

```astro
---
// src/pages/new-page.astro
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';

// Import navigation config
import { navigationItems } from '@lib/navigation';
---

<BaseLayout
  title="New Page Title"
  description="Description for SEO"
>
  <Header
    navigationItems={navigationItems}
    currentPath={Astro.url.pathname}
    siteName="Viktoria Zhulova"
  />

  <main id="main-content" class="min-h-screen">
    <div class="container mx-auto px-4 py-18">
      <h1 class="font-serif text-4xl mb-8">New Page</h1>
      <!-- Your content here -->
    </div>
  </main>

  <Footer companyName="Viktoria Zhulova" />
</BaseLayout>
```

### Hero Section

```astro
---
// src/components/sections/Hero.astro
interface Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

const { title, subtitle, ctaText, ctaHref } = Astro.props;
---

<section class="bg-navy-900 text-white py-88">
  <div class="container mx-auto px-4 text-center">
    <h1 class="font-serif text-5xl mb-6">{title}</h1>
    {subtitle && <p class="text-xl mb-8">{subtitle}</p>}
    {ctaText && ctaHref && (
      <a
        href={ctaHref}
        class="inline-block px-8 py-4 bg-gold-500 text-navy-900 font-medium rounded-lg hover:bg-gold-400 transition-colors"
      >
        {ctaText}
      </a>
    )}
  </div>
</section>
```

---

## Troubleshooting

### Common Issues

**Styles not applying:**
- Ensure Tailwind classes are complete strings (not concatenated)
- Check that global.css is imported in BaseLayout
- Verify npm run dev is running

**Focus indicators not visible:**
- Check that global.css includes focus-visible styles
- Try Tab key navigation (mouse clicks don't show focus-visible)

**Fonts not loading:**
- Verify Google Fonts link in global.css
- Check network tab for font requests
- Ensure font-display: swap is set

**Mobile menu not working:**
- Verify client:load directive on interactive component
- Check that Zustand store is properly imported
- Ensure React hydration is working

---

## Next Steps

1. **Add Content**: Create pages for About, Courses, Contact
2. **Customize Design**: Adjust colors, spacing, typography to match brand
3. **Add Features**: Newsletter signup, contact form, course listings
4. **Optimize Images**: Add hero images, optimize with Astro Image component
5. **Deploy**: Build and deploy to Vercel, Netlify, or other static hosts

---

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

## Support

For issues or questions:
- Check the [troubleshooting section](#troubleshooting)
- Review the [project documentation](../)
- Open an issue in the repository