# Feature Specification: Base Infrastructure & Design System

**Feature Branch**: `001-base-infrastructure`
**Created**: 2025-11-14
**Status**: Completed (2025-11-16)
**Input**: User description: "Базовая инфраструктура проекта: создать BaseLayout с SEO meta tags, настроить Tailwind дизайн-систему (цвета Navy/Gold/Sage, типографию Playfair Display + Inter), создать общие компоненты Header и Footer с навигацией, настроить глобальные стили и accessibility features (focus indicators, prefers-reduced-motion). Должна быть готова основа для всех страниц с правильной семантической структурой HTML5 и WCAG AA compliance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Base Layout with SEO Foundation (Priority: P1)

As a developer, I need a reusable base layout component that automatically handles SEO meta tags, semantic HTML structure, and accessibility requirements, so that every page in the application has consistent, optimized metadata and structure without repetitive code.

**Why this priority**: This is the foundation for all pages. Without it, no page can be built with proper SEO and accessibility. Every subsequent feature depends on this layout existing.

**Independent Test**: Create a test page using BaseLayout, verify it renders with proper HTML5 structure (header, main, footer), includes all required meta tags (title, description, Open Graph, Twitter Cards), has correct canonical URLs, and passes HTML validation.

**Acceptance Scenarios**:

1. **Given** a developer creates a new page, **When** they use BaseLayout with title and description props, **Then** the page renders with proper `<head>` containing title, meta description, Open Graph tags, and Twitter Card tags
2. **Given** a page uses BaseLayout, **When** rendered, **Then** the HTML structure includes semantic tags (`<header>`, `<main>`, `<footer>`) and a single `<h1>` tag
3. **Given** a page with BaseLayout, **When** tested with accessibility tools, **Then** it has proper document structure, lang attribute, and viewport meta tag
4. **Given** a page uses BaseLayout without providing an image prop, **When** rendered, **Then** it uses the default Open Graph image
5. **Given** a page uses BaseLayout with a canonical URL prop, **When** rendered, **Then** the canonical link tag points to the specified URL

---

### User Story 2 - Design System Configuration (Priority: P1)

As a designer and developer, I need a fully configured Tailwind design system with custom colors (Navy, Gold, Sage), typography (Playfair Display for headings, Inter for body text), and spacing scales, so that all UI components have consistent visual styling that matches the brand identity.

**Why this priority**: Design system must be configured before any visual components can be built. Header, Footer, and all future components depend on having the color palette and typography available.

**Independent Test**: Verify Tailwind configuration includes custom colors accessible via utility classes (navy-900, gold-500, sage-300), custom fonts load correctly, and custom spacing utilities are available. Test by creating a sample component using these utilities.

**Acceptance Scenarios**:

1. **Given** the Tailwind configuration, **When** a developer uses color utilities like `bg-navy-900` or `text-gold-500`, **Then** the correct brand colors are applied
2. **Given** the typography configuration, **When** a heading uses `font-serif`, **Then** it renders in Playfair Display font
3. **Given** the typography configuration, **When** body text uses `font-sans`, **Then** it renders in Inter font
4. **Given** the spacing configuration, **When** a developer uses custom spacing utilities like `spacing-88` or `spacing-112`, **Then** the correct spacing values are applied
5. **Given** the fonts are loaded, **When** the page is tested, **Then** there is no flash of unstyled text (FOUT) or layout shift from font loading

---

### User Story 3 - Reusable Header Component (Priority: P2)

As a user visiting any page, I need to see a consistent navigation header with the site logo and main navigation links, so that I can easily navigate between different sections of the website.

**Why this priority**: After the base layout and design system are ready, the header is the next critical component as it provides site-wide navigation. It's needed before building individual pages.

**Independent Test**: Render the Header component on a test page, verify it displays the logo/site name, includes navigation links (Home, About, Courses, Contact), is responsive (mobile menu on small screens), and is keyboard accessible.

**Acceptance Scenarios**:

1. **Given** a user visits any page, **When** the page loads, **Then** the header is visible at the top with site branding and navigation links
2. **Given** a user on desktop, **When** viewing the header, **Then** all navigation links are visible in a horizontal layout
3. **Given** a user on mobile, **When** viewing the header, **Then** navigation is collapsed into a hamburger menu icon
4. **Given** a user clicks the mobile menu icon, **When** the menu opens, **Then** navigation links are displayed vertically and are accessible
5. **Given** a keyboard user, **When** tabbing through the header, **Then** all navigation links receive focus with visible focus indicators
6. **Given** a user on the current page, **When** viewing the header, **Then** the current page's navigation link is visually highlighted

---

### User Story 4 - Reusable Footer Component (Priority: P2)

As a user visiting any page, I need to see a consistent footer with copyright information, social media links, and legal/contact links, so that I can access supplementary information and connect with the brand.

**Why this priority**: Footer provides important secondary navigation and legal information. It's needed for a complete page structure but is less critical than the header for initial navigation.

**Independent Test**: Render the Footer component on a test page, verify it displays copyright text, social media icons/links, and supplementary navigation links, is responsive, and meets accessibility standards.

**Acceptance Scenarios**:

1. **Given** a user visits any page, **When** scrolling to the bottom, **Then** the footer is visible with copyright information and the current year
2. **Given** the footer is rendered, **When** viewed, **Then** it includes links to social media profiles (if provided) with appropriate icons
3. **Given** the footer includes icons, **When** rendered, **Then** icons have proper `aria-label` attributes for screen readers
4. **Given** a user on mobile, **When** viewing the footer, **Then** content is stacked vertically and remains readable
5. **Given** a keyboard user, **When** tabbing through the footer, **Then** all links receive focus with visible indicators

---

### User Story 5 - Global Accessibility Styles (Priority: P1)

As a user with disabilities or specific accessibility needs, I need the website to have proper focus indicators, respect reduced motion preferences, and provide high contrast, so that I can navigate and use the site effectively regardless of my abilities.

**Why this priority**: Accessibility is non-negotiable per project constitution (WCAG AA compliance). These global styles must be in place before any interactive components are built.

**Independent Test**: Test with keyboard navigation to verify visible focus indicators on all interactive elements, test with `prefers-reduced-motion` enabled to verify animations are disabled, test color contrast with accessibility tools to ensure WCAG AA compliance.

**Acceptance Scenarios**:

1. **Given** a user navigates with keyboard, **When** an interactive element receives focus, **Then** a visible focus ring or outline appears with sufficient contrast
2. **Given** a user has `prefers-reduced-motion` enabled, **When** the page loads, **Then** all animations and transitions are disabled or significantly reduced
3. **Given** any text on the site, **When** tested with contrast checkers, **Then** color contrast ratios are at least 4.5:1 for normal text and 3:1 for large text
4. **Given** a user with reduced motion preferences, **When** hovering over elements, **Then** hover effects use opacity/color changes instead of movement
5. **Given** global styles are applied, **When** any form element is focused, **Then** it has a consistent, visible focus indicator across the entire site

---

### Edge Cases

**Q1: What happens when BaseLayout is used without required props (title, description)?**
- **Answer**: TypeScript compilation fails with type error. Props interface defines `title` and `description` as required (no optional modifiers).
- **Code**: `BaseLayout.astro:7-12`
- **Behavior**: Build-time validation prevents missing props, not runtime error.

**Q2: How does the header navigation behave on tablets (between mobile and desktop breakpoints)?**
- **Answer**: Uses `md:` breakpoint (768px). Below 768px shows hamburger menu, 768px+ shows horizontal desktop navigation.
- **Code**: `Header.astro:17-147`
- **Tablet Behavior**: iPad portrait (768px) shows desktop nav, smaller tablets show mobile menu.

**Q3: What happens if custom fonts fail to load (font fallback strategy)?**
- **Answer**: Browser falls back to system fonts via fallback stacks: Headings use `['Playfair Display', 'serif']` → Georgia, Times New Roman. Body uses `['Inter', 'sans-serif']` → Helvetica, Arial.
- **Code**: `tailwind.config.mjs:6-8`, `global.css:1`
- **Strategy**: Google Fonts loaded with `display=swap` parameter ensures fallback fonts display immediately.

**Q4: How does the mobile menu handle very long navigation labels?**
- **Answer**: Text wraps naturally within 256px menu width. No truncation utilities applied - long labels display fully across multiple lines.
- **Code**: `MobileMenu.tsx:30-41`
- **CSS Classes**: `block w-full text-left px-4 py-3` (no `truncate` or `line-clamp`).

**Q5: What happens if social media links are not provided to the Footer component?**
- **Answer**: Footer always renders social media section regardless of links provided. Icons imported from `@/data/homePageContent` - if data missing, href attributes would be empty/undefined.
- **Code**: `Footer.astro:96-162`
- **Risk**: No conditional rendering logic - could create non-functional anchor tags.

**Q6: How does the site handle browsers without modern CSS features (CSS Grid, custom properties)?**
- **Answer**: No polyfills or fallbacks provided. Site requires modern browser support for: CSS Grid (`grid grid-cols-*`), CSS Custom Properties (Tailwind color tokens), Flexbox (`flex`, `items-center`), Modern CSS transitions.
- **Code**: `astro.config.mjs:14-17` (no browserslist config), `tailwind.config.mjs` (modern CSS)
- **Target**: Last 2 versions of major browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: BaseLayout component MUST accept props for page title, meta description, optional Open Graph image, and optional canonical URL *(BaseLayout.astro:7-12)*
- **FR-002**: BaseLayout component MUST render a complete HTML5 document structure with `<html>`, `<head>`, `<body>`, and semantic content sections *(BaseLayout.astro:26-97)*
- **FR-003**: BaseLayout component MUST include all required SEO meta tags: title, description, Open Graph (og:title, og:description, og:image, og:url), Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image) *(BaseLayout.astro:36-65)*
- **FR-004**: BaseLayout component MUST include a canonical link tag that defaults to the current page URL if not explicitly provided *(BaseLayout.astro:21-22, 42)*
- **FR-005**: BaseLayout component MUST include viewport meta tag, charset meta tag, and language attribute on the html element *(BaseLayout.astro:26-30)*
- **FR-006**: Tailwind configuration MUST define custom color palette with Navy shades (50-900), Gold shades (50-900), and Sage shades (50-900) *(tailwind.config.mjs:10-46)*
- **FR-007**: Tailwind configuration MUST define custom font families: `font-serif` mapped to Playfair Display with serif fallback, `font-sans` mapped to Inter with sans-serif fallback *(tailwind.config.mjs:6-9)*
- **FR-008**: Tailwind configuration MUST include custom spacing values: spacing-18, spacing-88, spacing-112, spacing-128 *(tailwind.config.mjs:48-53)*
- **FR-009**: Global CSS file MUST load Google Fonts for Playfair Display and Inter with appropriate font weights and display swap strategy *(global.css:1)*
- **FR-010**: Header component MUST display site branding (logo or site name) and primary navigation links *(Header.astro:17-40, 44-82)*
- **FR-011**: Header component MUST be responsive: horizontal navigation on desktop, hamburger menu on mobile (breakpoint at 768px) *(Header.astro:44, 71, 130-141)*
- **FR-012**: Header component MUST highlight the current page in the navigation *(Header.astro:12-14, 59, 65, 190-196)*
- **FR-013**: Footer component MUST display copyright text with dynamic current year *(Footer.astro:166-171)*
- **FR-014**: Footer component MUST accept optional social media links and render them with accessible labels *(Footer.astro:96-162)*
- **FR-015**: Footer component MUST include supplementary navigation links (if provided) *(Footer.astro:74-93, 174-189)*
- **FR-016**: Global CSS MUST implement WCAG AA accessibility: (1) visible focus indicators for all interactive elements with minimum 2px outline and high contrast color ≥3:1, (2) `prefers-reduced-motion` media query that disables or significantly reduces all animations and transitions, (3) text color contrast ratios ≥4.5:1 for normal text and ≥3:1 for large text *(global.css:29-32, 43-55; Navy/Gold design system meets WCAG AA contrast)*
- **FR-019**: All components MUST use semantic HTML elements (header, nav, main, footer, article, section) where appropriate *(Semantic HTML throughout: header, nav, footer, main)*
- **FR-020**: All interactive elements MUST be keyboard accessible with logical tab order *(Keyboard accessible: semantic elements, proper tab order)*

### Assumptions

- Navigation structure includes Home page with integrated "About Me" section (anchor #about), plus dedicated Courses and Contact pages. There is no separate /about page; the about content is part of the home page's StatsSection component.
- Site domain is zhulova.com (for canonical URLs and Open Graph), configured on 2025-11-17. Initially deployed to zhulova-com.vercel.app subdomain.
- Default Open Graph image will be provided at `/images/og-default.jpg`
- Social media links will be provided as configuration (not hard-coded)
- The site targets modern browsers (last 2 versions of major browsers). Browserslist is not explicitly configured; the project relies on Tailwind and PostCSS defaults (typically: "> 0.5%, last 2 versions, Firefox ESR, not dead").
- Font loading uses Google Fonts CDN (as specified in project documentation)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pages using BaseLayout achieve Lighthouse SEO score of 95 or higher
- **SC-002**: Pages using BaseLayout achieve Lighthouse Accessibility score of 95 or higher
- **SC-003**: All interactive elements have visible focus indicators with color contrast ratio of at least 3:1 against their background
- **SC-004**: When tested with keyboard navigation, users can access all interactive elements in logical order without using a mouse
- **SC-005**: Font loading completes within 3 seconds on 3G connection without causing layout shift (CLS < 0.1)
- **SC-006**: Header and Footer components render consistently across all screen sizes (mobile 320px, tablet 768px, desktop 1440px)
- **SC-007**: Color contrast testing shows 100% compliance with WCAG AA standards for all text and UI elements
- **SC-008**: When `prefers-reduced-motion` is enabled, page load and interactions do not trigger any motion-based animations
- **SC-009**: HTML validation shows zero errors in document structure
- **SC-010**: All custom Tailwind utilities (colors, fonts, spacing) are functional and usable in components

### Monitoring & Verification

How to measure each success criterion:

- **SC-001**: Tool: **Chrome DevTools Lighthouse** | Method: Open DevTools → Lighthouse tab → Select "SEO" category → Run audit → Verify score ≥95
- **SC-002**: Tool: **Chrome DevTools Lighthouse** | Method: Open DevTools → Lighthouse tab → Select "Accessibility" category → Run audit → Verify score ≥95
- **SC-003**: Tool: **axe DevTools + Manual contrast check** | Method: Install axe DevTools extension → Run accessibility scan → Check focus indicators section → Verify contrast ratio ≥3:1 for all interactive elements
- **SC-004**: Tool: **Manual Tab testing** | Method: Close mouse/trackpad → Press Tab key repeatedly → Verify all interactive elements (links, buttons) receive focus in logical order → Check no elements are unreachable
- **SC-005**: Tool: **Vercel Speed Insights dashboard** | Method: Open Vercel Dashboard → Select project → Navigate to Speed Insights tab → Check CLS metric → Verify value <0.1 for font loading
- **SC-006**: Tool: **Chrome DevTools Responsive mode** | Method: Open DevTools → Toggle device toolbar → Test at 320px (mobile), 768px (tablet), 1440px (desktop) → Verify Header/Footer render correctly at all sizes
- **SC-007**: Tool: **WAVE or axe DevTools** | Method: Install WAVE extension → Run scan → Check "Contrast Errors" section → Verify zero contrast failures → Confirm all text meets 4.5:1 (normal) or 3:1 (large text)
- **SC-008**: Tool: **Chrome DevTools Media Queries** | Method: Open DevTools → Settings (⚙️) → Rendering tab → Emulate CSS media feature "prefers-reduced-motion: reduce" → Reload page → Verify no motion animations trigger
- **SC-009**: Tool: **W3C HTML Validator** | Method: Visit https://validator.w3.org/ → Enter page URL or upload HTML → Run validation → Verify zero errors in document structure
- **SC-010**: Tool: **Manual code inspection** | Method: Open component files → Verify Tailwind utilities work: `bg-navy-900`, `text-gold-500`, `font-serif`, `spacing-88` → Check styles apply correctly in browser DevTools
