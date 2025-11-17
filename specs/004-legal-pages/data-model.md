# Data Model: Legal Pages Feature

**Feature**: 004-legal-pages
**Date**: 2025-11-17
**Phase**: Phase 1 (Design)

## Overview

This feature introduces two static legal pages and modifies two existing components. No database entities are required - all content is static and pre-rendered at build time.

---

## 1. Legal Page Entity (Static Content)

### Description

Represents a static legal document page (Privacy Policy or Terms & Conditions) rendered via Astro file-based routing.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `route` | `string` | Yes | URL path (e.g., `/privacy-policy`, `/terms`) |
| `title` | `string` | Yes | Page title for SEO and H1 heading |
| `description` | `string` | Yes | Meta description (150-160 chars) |
| `lastUpdated` | `string` | Yes | Last modified date (format: "YYYY-MM-DD") |
| `sections` | `Section[]` | Yes | Array of content sections |
| `tableOfContents` | `TocItem[]` | Yes | Navigation structure for anchor links |

### Section Sub-Entity

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | Anchor ID for linking (e.g., `data-collection`) |
| `heading` | `string` | Yes | Section heading text |
| `level` | `2 \| 3 \| 4` | Yes | Heading hierarchy level (H2, H3, H4) |
| `content` | `string` | Yes | HTML content for section body |

### TocItem Sub-Entity

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `label` | `string` | Yes | Display text in table of contents |
| `href` | `string` | Yes | Fragment identifier (e.g., `#data-collection`) |
| `level` | `2 \| 3` | Yes | Nesting level (H2 = top-level, H3 = nested) |

### Implementation

Static Astro pages in `src/pages/`:
- `src/pages/privacy-policy.astro` - Privacy Policy page
- `src/pages/terms.astro` - Terms & Conditions page

No database storage - content is hardcoded in Astro component markup.

### Example Structure

```typescript
// Conceptual representation (not actual code)
interface LegalPage {
  route: '/privacy-policy' | '/terms';
  title: 'Політика конфіденційності' | 'Умови використання';
  description: string; // SEO meta description
  lastUpdated: '2025-11-17';
  sections: Array<{
    id: string;
    heading: string;
    level: 2 | 3 | 4;
    content: string; // HTML content
  }>;
  tableOfContents: Array<{
    label: string;
    href: string;
    level: 2 | 3;
  }>;
}
```

---

## 2. Footer Component Entity (UI Component)

### Description

Modified `Footer.astro` component with new legal links section and updated layout.

### Attributes (Props)

Footer is a static component with no props - content is hardcoded.

### Layout Structure

| Element | Type | Alignment | Description |
|---------|------|-----------|-------------|
| `copyright` | `<p>` | Left (desktop), Center (mobile) | Copyright text: "© 2025 Вікторія Жульова" |
| `legalNav` | `<nav>` | Right (desktop), Center (mobile) | Legal page links |

### Legal Navigation Items

| Label | Href | Aria Label |
|-------|------|-----------|
| `Політика конфіденційності` | `/privacy-policy` | `Перейти до політики конфіденційності` |
| `Умови використання` | `/terms` | `Перейти до умов використання` |

### Responsive Behavior

- **Desktop/Tablet (≥640px)**: Flexbox row, `justify-between` (copyright left, links right)
- **Mobile (<640px)**: Flexbox column, stacked vertically, center-aligned

### Styling

- Link hover: `text-gold-400` (matches site hover states)
- Font size: `text-sm` (consistent with existing footer)
- Gap: `gap-6` (horizontal), `gap-4` (vertical)

### Implementation

File: `src/components/layout/Footer.astro`

No state management required - purely presentational component.

---

## 3. Consultation Modal Entity (React Component)

### Description

Modified `ConsultationModal.tsx` React component with new privacy notice text and link.

### Existing Props (No Changes)

```typescript
interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### New Element: Privacy Notice

| Element | Type | Position | Description |
|---------|------|----------|-------------|
| `privacyNotice` | `<p>` | Form footer, above submit button | Privacy notice with linked policy |

### Privacy Notice Structure

**Text**: "Натискаючи кнопку, ви погоджуєтесь з нашою [політики конфіденційності]."

**Link Attributes**:
- `href`: `/privacy-policy`
- `target`: `_blank`
- `rel`: `noopener noreferrer`
- `className`: `text-gold-600 hover:text-gold-400 underline`
- `aria-label`: `Прочитати політику конфіденційності (відкривається в новій вкладці)`

### Styling

- Text: `text-xs text-navy-600`
- Link: `text-gold-600 hover:text-gold-400 underline`
- Margin: `mt-4 mb-6` (spacing above submit button)

### Implementation

File: `src/components/forms/ConsultationModal.tsx`

Privacy notice is static markup - no state or interactivity required.

---

## Entity Relationships

```
BaseLayout (existing)
    │
    ├──> PrivacyPolicyPage (new)
    │       └──> TableOfContents (inline)
    │       └──> Sections[] (inline)
    │
    ├──> TermsPage (new)
    │       └──> TableOfContents (inline)
    │       └──> Sections[] (inline)
    │
    ├──> Footer (modified)
    │       └──> LegalLinks[]
    │               ├──> Link to PrivacyPolicyPage
    │               └──> Link to TermsPage
    │
    └──> ConsultationModal (modified)
            └──> PrivacyNotice
                    └──> Link to PrivacyPolicyPage
```

**Relationship Type**: Navigational links (one-way references, no data dependencies)

---

## State Management

### No State Required

- Legal pages are **static content** - no user state, no form state, no interactive state
- Footer links are **static navigation** - no hover state management (CSS-only)
- Modal privacy notice is **static markup** - no dynamic behavior

### Zustand Store

**No changes to existing stores.** Feature is purely static and does not require global state management.

---

## Validation Rules

### Legal Page Content Validation (Manual Review)

| Rule | Description |
|------|-------------|
| **Language** | All content MUST be in Ukrainian language |
| **Legal Compliance** | Privacy Policy MUST include all 16 mandatory sections (see research.md) |
| **Legal Compliance** | Terms MUST include all 20 mandatory sections (see research.md) |
| **Accessibility** | Heading hierarchy MUST be valid (single H1, nested H2-H6) |
| **Accessibility** | All anchor IDs MUST be unique and descriptive |
| **SEO** | Meta description MUST be 150-160 characters |
| **Content** | Last updated date MUST match actual publication date |

### Footer Validation

| Rule | Description |
|------|-------------|
| **Links** | All legal links MUST navigate to correct routes |
| **Accessibility** | Links MUST have descriptive aria-label attributes |
| **Responsive** | Layout MUST switch to vertical stack on mobile (<640px) |

### Modal Privacy Notice Validation

| Rule | Description |
|------|-------------|
| **Link Target** | Privacy policy link MUST open in new tab (`target="_blank"`) |
| **Security** | Link MUST include `rel="noopener noreferrer"` |
| **Accessibility** | Link MUST have aria-label indicating new tab behavior |

---

## Performance Considerations

### Static Content Benefits

- **Zero runtime cost** - Legal pages pre-rendered at build time
- **No database queries** - Content is hardcoded in Astro components
- **Minimal JavaScript** - Legal pages are pure HTML/CSS (0KB JS)
- **CDN-friendly** - Static HTML served directly from edge network

### Estimated Page Weight

| Asset | Size (Gzipped) |
|-------|----------------|
| HTML (Privacy Policy) | ~35KB |
| HTML (Terms) | ~40KB |
| CSS (Shared Tailwind) | ~15KB (existing) |
| JavaScript | 0KB (no JS on legal pages) |
| **Total per page** | **~50-55KB** |

**Target**: Under 100KB per page ✅ (well within budget)

---

## SEO & Accessibility Metadata

### Required for Each Legal Page

| Metadata | Example Value |
|----------|---------------|
| `<title>` | "Політика конфіденційності - Вікторія Жульова" |
| `<meta name="description">` | 150-160 char summary in Ukrainian |
| `<html lang="uk">` | Ukrainian language declaration |
| `<link rel="canonical">` | Full URL to page |
| `<meta property="og:title">` | Same as title |
| `<meta property="og:description">` | Same as description |
| `<meta property="og:type">` | "website" |
| Heading hierarchy | Single H1, nested H2-H6 |
| Anchor IDs | Descriptive kebab-case (e.g., `data-collection`) |

**BaseLayout Component** handles all SEO metadata automatically when provided with `title` and `description` props.

---

## Implementation Files Summary

| File | Type | Status | Description |
|------|------|--------|-------------|
| `src/pages/privacy-policy.astro` | New | Create | Privacy Policy page |
| `src/pages/terms.astro` | New | Create | Terms & Conditions page |
| `src/components/layout/Footer.astro` | Modified | Update | Add legal links, responsive layout |
| `src/components/forms/ConsultationModal.tsx` | Modified | Update | Add privacy notice with link |

**No database migrations, no API endpoints, no new dependencies required.**
