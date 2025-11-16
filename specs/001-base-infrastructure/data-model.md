# Data Model: Base Infrastructure & Design System

**Feature**: Base Infrastructure & Design System
**Date**: 2025-11-14
**Spec**: [spec.md](./spec.md)

## Overview

This document defines the data structures, component props interfaces, and configuration schemas for the base infrastructure and design system. Since this is a static site with no database, these models represent TypeScript interfaces for component props, configuration objects, and content schemas.

---

## 1. Layout Components

### BaseLayout Props

```typescript
interface BaseLayoutProps {
  // SEO Meta Tags
  title?: string;                    // Page title (50-60 chars recommended)
  description?: string;               // Meta description (150-160 chars recommended)
  image?: string;                     // Open Graph image URL (defaults to /images/og-default.jpg)
  canonical?: string;                 // Canonical URL (defaults to current page)

  // Page Configuration
  noindex?: boolean;                  // Prevent search engine indexing (default: false)
  type?: 'website' | 'article';       // Open Graph type (default: 'website')

  // Article-specific (for blog/content pages)
  article?: {
    publishedTime?: string;           // ISO 8601 date string
    modifiedTime?: string;            // ISO 8601 date string
    author?: string;                  // Author name
    tags?: string[];                  // Article tags/categories
  };

  // Additional head elements
  additionalMetaTags?: MetaTag[];    // Custom meta tags
  additionalLinkTags?: LinkTag[];    // Custom link tags
}

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}
```

### Component State

```typescript
interface BaseLayoutState {
  isLoading: boolean;                 // Page loading state
  hasError: boolean;                  // Error state
  errorMessage?: string;              // Error details
}
```

---

## 2. Navigation Components

### Header Props

```typescript
interface HeaderProps {
  // Navigation Structure
  navigationItems: NavigationItem[];   // Main navigation links
  currentPath: string;                 // Current page path for active state

  // Branding
  logoSrc?: string;                    // Logo image source
  logoAlt?: string;                    // Logo alt text
  siteName?: string;                   // Site name (if no logo)

  // Mobile Menu
  mobileBreakpoint?: number;           // Breakpoint for mobile menu (default: 768)

  // Styling
  variant?: 'transparent' | 'solid';   // Header style variant
  sticky?: boolean;                    // Sticky header on scroll
  className?: string;                  // Additional CSS classes
}

interface NavigationItem {
  id: string;                          // Unique identifier
  label: string;                       // Display text
  href: string;                        // Link URL
  ariaLabel?: string;                  // Accessibility label
  external?: boolean;                  // External link flag
  icon?: string;                       // Optional icon identifier
  children?: NavigationItem[];         // Nested navigation items
}
```

### Footer Props

```typescript
interface FooterProps {
  // Company Information
  companyName: string;                 // Company/brand name
  copyrightYear?: number;              // Copyright year (defaults to current)

  // Navigation
  navigationGroups?: FooterNavGroup[]; // Footer navigation sections

  // Social Media
  socialLinks?: SocialLink[];          // Social media profiles

  // Legal
  legalLinks?: NavigationItem[];       // Privacy, Terms, etc.

  // Contact
  contactInfo?: ContactInfo;           // Contact details

  // Styling
  className?: string;                  // Additional CSS classes
}

interface FooterNavGroup {
  title: string;                       // Section title
  items: NavigationItem[];             // Navigation links
}

interface SocialLink {
  platform: SocialPlatform;            // Social media platform
  url: string;                         // Profile URL
  ariaLabel: string;                   // Accessibility label
  icon?: string;                       // Custom icon (optional)
}

type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest';

interface ContactInfo {
  email?: string;                      // Contact email
  phone?: string;                      // Phone number
  address?: Address;                   // Physical address
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
```

---

## 3. UI Store Models

### Global UI State

```typescript
interface UIStore {
  // Mobile Menu State
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Modal State
  isModalOpen: boolean;
  modalContent: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;

  // Toast Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Theme (future enhancement)
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // Accessibility
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (value: boolean) => void;
}

interface ModalContent {
  title: string;
  body: React.ReactNode | string;
  actions?: ModalAction[];
  size?: 'small' | 'medium' | 'large';
  closable?: boolean;
}

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;                   // Auto-dismiss after ms (default: 5000)
  dismissible?: boolean;               // Can be manually dismissed
}
```

---

## 4. Design System Configuration

### Tailwind Configuration Schema

```typescript
interface TailwindConfig {
  theme: {
    extend: {
      colors: ColorPalette;
      fontFamily: FontFamilies;
      spacing: CustomSpacing;
      screens?: ScreenBreakpoints;
      animation?: CustomAnimations;
    };
  };
  plugins: TailwindPlugin[];
}

interface ColorPalette {
  navy: ColorScale;                    // Primary brand color
  gold: ColorScale;                    // Accent color
  sage: ColorScale;                    // Secondary accent
}

interface ColorScale {
  50: string;                          // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;                         // Base
  600: string;
  700: string;
  800: string;
  900: string;                         // Darkest
  950?: string;                        // Ultra-dark (optional)
}

interface FontFamilies {
  serif: string[];                     // Heading font stack
  sans: string[];                      // Body font stack
  mono?: string[];                     // Code font stack
}

interface CustomSpacing {
  '18': string;                        // 4.5rem / 72px
  '88': string;                        // 22rem / 352px
  '112': string;                       // 28rem / 448px
  '128': string;                       // 32rem / 512px
  [key: string]: string;                // Additional custom values
}

interface ScreenBreakpoints {
  xs?: string;                         // Extra small
  sm: string;                          // Small (default: 640px)
  md: string;                          // Medium (default: 768px)
  lg: string;                          // Large (default: 1024px)
  xl: string;                          // Extra large (default: 1280px)
  '2xl': string;                       // 2X large (default: 1536px)
}

interface CustomAnimations {
  [key: string]: {
    keyframes: Record<string, any>;
    animation: string;
  };
}
```

---

## 5. Site Configuration

### Global Site Settings

```typescript
interface SiteConfig {
  // Site Identity
  siteName: string;                    // Site/brand name
  siteUrl: string;                     // Production URL
  siteDescription: string;             // Default meta description
  siteLanguage: string;                // Language code (e.g., 'en')

  // SEO Defaults
  defaultOgImage: string;              // Default Open Graph image
  twitterHandle?: string;              // Twitter @username
  facebookAppId?: string;              // Facebook App ID

  // Navigation
  mainNavigation: NavigationItem[];    // Primary navigation structure
  footerNavigation: FooterNavGroup[];  // Footer navigation structure

  // Social Media
  socialProfiles: SocialProfile[];     // Social media accounts

  // Contact
  contactEmail: string;                // Primary contact email
  contactPhone?: string;               // Contact phone
  businessAddress?: Address;           // Physical address

  // Features
  features: {
    newsletter: boolean;                // Enable newsletter signup
    contactForm: boolean;               // Enable contact form
    search: boolean;                    // Enable site search
    analytics: boolean;                 // Enable analytics
  };

  // Integrations
  integrations?: {
    googleAnalyticsId?: string;         // GA tracking ID
    googleTagManagerId?: string;        // GTM container ID
    facebookPixelId?: string;           // Facebook Pixel ID
  };
}

interface SocialProfile {
  platform: SocialPlatform;
  url: string;
  username?: string;                   // Username/handle
}
```

---

## 6. Content Schemas

### Page Frontmatter

```typescript
interface PageFrontmatter {
  // Required
  title: string;                       // Page title
  description: string;                 // Meta description

  // Optional SEO
  image?: string;                      // OG image override
  canonical?: string;                  // Canonical URL override
  noindex?: boolean;                   // Prevent indexing

  // Page Settings
  layout?: string;                     // Layout template
  draft?: boolean;                     // Draft status
  publishedAt?: string;                // Publication date
  updatedAt?: string;                  // Last update date

  // Navigation
  order?: number;                      // Sort order in navigation
  parent?: string;                     // Parent page (for hierarchy)

  // Custom Fields
  [key: string]: any;                  // Extensible for custom needs
}
```

---

## 7. Form Models

### Contact Form Data

```typescript
interface ContactFormData {
  // Personal Information
  name: string;                        // Full name
  email: string;                       // Email address
  phone?: string;                      // Phone number (optional)

  // Message
  subject: string;                     // Message subject
  message: string;                     // Message content

  // Preferences
  preferredContactMethod?: 'email' | 'phone';
  preferredContactTime?: string;       // Best time to contact

  // Metadata
  submittedAt: string;                 // ISO 8601 timestamp
  source: string;                      // Form location/page

  // Anti-spam
  honeypot?: string;                   // Hidden field (should be empty)
  captchaToken?: string;               // reCAPTCHA token
}

interface ContactFormValidation {
  name: ValidationRule[];
  email: ValidationRule[];
  phone?: ValidationRule[];
  subject: ValidationRule[];
  message: ValidationRule[];
}

interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;                         // Rule-specific value
  message: string;                     // Error message
}
```

### Newsletter Subscription

```typescript
interface NewsletterSubscription {
  email: string;                       // Subscriber email
  name?: string;                       // Subscriber name (optional)
  subscribedAt: string;                // ISO 8601 timestamp
  source: string;                      // Subscription source/page
  tags?: string[];                     // Interest tags
  confirmed: boolean;                  // Email confirmation status
}
```

---

## 8. Error Models

### Error Handling

```typescript
interface AppError {
  code: string;                        // Error code
  message: string;                     // User-friendly message
  details?: any;                       // Additional error details
  timestamp: string;                   // When error occurred
  path?: string;                       // Page/component path
  stack?: string;                      // Stack trace (dev only)
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: React.ErrorInfo | null;
}
```

---

## 9. Analytics Events

### Event Tracking

```typescript
interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  referrer?: string;
}

type EventCategory =
  | 'navigation'
  | 'form'
  | 'cta'
  | 'video'
  | 'download'
  | 'social'
  | 'error';

interface PageViewEvent {
  url: string;
  title: string;
  referrer?: string;
  timestamp: string;
  loadTime?: number;                   // Page load time in ms
  sessionId: string;
}
```

---

## 10. Type Utilities

### Common Types

```typescript
// Utility types for component development
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

// HTML attribute extensions
type HTMLAttributesWithoutRef<T> = React.HTMLAttributes<T> & {
  ref?: never;
};

// Component prop helpers
type PropsWithClassName = {
  className?: string;
};

type PropsWithChildren = {
  children?: React.ReactNode;
};

// Astro component props
interface AstroComponentProps {
  class?: string;                      // Note: 'class' not 'className' in Astro
  'class:list'?: any;                  // Astro's conditional classes
  [key: string]: any;                  // Pass-through props
}
```

---

## Usage Examples

### BaseLayout Usage

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

const layoutProps: BaseLayoutProps = {
  title: 'About Viktoria Zhulova',
  description: 'Learn about Viktoria Zhulova, professional mindset coach',
  canonical: 'https://zhulova.com/about',
};
---

<BaseLayout {...layoutProps}>
  <!-- Page content -->
</BaseLayout>
```

### UI Store Usage

```typescript
import { useUIStore } from '@stores/uiStore';

// In component
const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
```

### Navigation Structure

```typescript
const mainNavigation: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'courses', label: 'Courses', href: '/courses' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];
```

---

## Data Validation

All data models should be validated at build time using TypeScript's type system and optionally at runtime using libraries like Zod for user input:

```typescript
import { z } from 'zod';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
});

type ContactFormData = z.infer<typeof contactFormSchema>;
```

---

## Notes

1. All timestamps use ISO 8601 format for consistency
2. Optional fields use `?` notation in TypeScript
3. Enums are defined as union types for better type inference
4. Component props extend appropriate HTML element interfaces where applicable
5. All models are designed for static site generation (no runtime database)