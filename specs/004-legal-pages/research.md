# Research Findings: Legal Pages Feature

**Feature**: 004-legal-pages
**Date**: 2025-11-17
**Status**: Complete

## Overview

This document consolidates research findings for implementing legally compliant privacy policy and terms & conditions pages for the Zhulova coaching website, operating under Ukrainian jurisdiction with GDPR alignment.

---

## 1. Ukrainian Privacy Policy Requirements (GDPR + Law 2297-VI)

### Decision: Privacy Policy Structure

The privacy policy includes 10 conversational sections combining related topics for readability, while maintaining full compliance with Ukrainian Law № 2297-VI "On Personal Data Protection" and GDPR transparency requirements.

**Rationale**: Conversational format combines Ukrainian Law 2297-VI + GDPR requirements into 10 readable sections instead of formal 16-section structure. This approach improves user experience while covering all mandatory disclosure requirements.

### Required Sections

1. **Data Controller Identity** - Full business name, address, email, phone (GDPR Art. 13(1)(a))
2. **Purpose of Processing** - Explicit purposes for data collection (consultation requests)
3. **Legal Basis** - Lawful basis under Ukrainian Law 2297-VI (consent for coaching services)
4. **Categories of Data** - Name, email, phone, consultation preferences
5. **Retention Period** - Specific timeframe (e.g., 2 years or until withdrawal)
6. **Third-Party Recipients** - Supabase (database), Resend (email service)
7. **Right to Access** - 30-day response time, free of charge
8. **Right to Rectification** - Correct inaccurate data within 30 days
9. **Right to Erasure** - Delete data upon request
10. **Right to Withdraw Consent** - Opt-out anytime
11. **Right to Complaint** - Ukrainian Parliament Commissioner for Human Rights contact
12. **Data Security Measures** - Technical/organizational protections
13. **Contact for Inquiries** - Specific email/form for data subject rights
14. **Policy Updates** - Notification method for material changes
15. **Data Transfer** (if applicable) - Cross-border safeguards
16. **Automated Decisions** (if applicable) - Profiling disclosures

### Rationale

Ukraine is aligning with EU data protection standards as an EU candidate country. Draft Law No. 8153 (adopted Nov 2024) harmonizes Ukrainian law with GDPR, making these sections future-proof.

### Sources

- Ukrainian Law № 2297-VI "On Personal Data Protection" (2010)
- GDPR Articles 12-14 (Transparency Requirements)
- ICLG Data Protection Laws Report 2025 - Ukraine
- DLA Piper Data Protection Laws of the World

---

## 2. Ukrainian Terms & Conditions Requirements

### Decision: Terms & Conditions Structure

The terms & conditions include 10 conversational sections covering all required legal topics, complying with Ukrainian consumer protection law (Law 1023-XII and new Law 3153-IX effective July 2024) and EU Directives 2011/83/EU and 93/13/EEC.

**Rationale**: User-friendly format combines Ukrainian consumer protection law requirements into 10 accessible sections instead of formal 20-section structure. This approach maintains full legal compliance while improving readability and user comprehension.

### Required Sections

1. **Service Provider Identity** - Legal name, registration number, address, phone, email
2. **Service Description** - Coaching methodology, session details, expected outcomes, limitations
3. **Price & Payment** - Total price in hryvnia, payment schedule, methods, currency
4. **Duration & Timeline** - Program length, session frequency, start/end dates
5. **Withdrawal & Cancellation** - 14-day cooling-off period for distance contracts
6. **Liability Limitations** - Cannot exclude liability for death/injury from negligence
7. **Service Quality** - Warranty obligations and remedies for substandard service
8. **Intellectual Property** - Ownership of materials, confidentiality, testimonial use
9. **Personal Data Protection** - Privacy policy reference, data rights summary
10. **Prohibition of Unfair Terms** - No one-sided obligations or excessive penalties
11. **Health Disclaimers** - Not medical/psychological treatment, consult professionals
12. **Force Majeure** - War, disasters, government actions exemptions
13. **Dispute Resolution** - Ukrainian law jurisdiction, ADR options
14. **Refund Procedures** - 7-day refund timeline, remedies for non-performance
15. **Modification & Termination** - 7-day notice minimum, no unilateral termination
16. **Professional Qualifications** - Coach credentials, experience, certifications
17. **Session Cancellation** - 24-48 hour notice policy, rescheduling options
18. **Client Responsibility** - Results depend on client action, coach not liable for outcomes
19. **Clear Language** - Ukrainian language, accessible format, readable font
20. **Consumer Rights Summary** - Key rights overview, State Service contact info

### Critical Legal Constraints

- **Cannot exclude liability** for health/safety harm from coach negligence (Art. 18)
- **Must offer 14-day withdrawal** for online coaching with full refund
- **Unfair terms are void** if creating significant imbalance favoring provider
- **Good faith obligation** per Ukrainian Civil Code Article 3
- **Refunds within 7 days** per Ukrainian consumer protection law

### Rationale

New Law 3153-IX (July 2024) aligns Ukraine with EU consumer protection standards. Coaching services must balance professional disclaimers with mandatory consumer protections.

### Sources

- Law of Ukraine "On Consumer Rights Protection" No. 1023-XII (1991)
- Law of Ukraine No. 3153-IX (2024, pending martial law termination)
- EU Directive 2011/83/EU (Consumer Rights)
- EU Directive 93/13/EEC (Unfair Contract Terms)
- Sayenko Kharenko Law Firm analysis (sk.ua)

---

## 3. WCAG AA Accessibility for Legal Pages

### Decision: Accessibility Implementation Strategy

Legal pages will implement WCAG 2.1 Level AA compliance with specific focus on long-form text navigation, keyboard accessibility, and screen reader compatibility.

### Key Requirements

**Text & Typography:**
- ✅ 4.5:1 contrast ratio for body text (navy-900 on white)
- ✅ Support text spacing adjustments (line-height 1.5x, letter-spacing 0.12x)
- ✅ Allow 200% text resize without horizontal scrolling
- ✅ Reflow content at 320px width without 2D scrolling
- ✅ Declare language: `<html lang="uk">` for Ukrainian

**Navigation & Structure:**
- ✅ Skip links to bypass header and jump to content
- ✅ Unique page titles: "Privacy Policy - Zhulova Coaching"
- ✅ Logical focus order: table of contents → sections → anchor links
- ✅ Descriptive headings: single H1, nested H2-H6 hierarchy
- ✅ Consistent navigation across both legal pages
- ✅ Table of contents with anchor links at page top

**Keyboard & Screen Reader:**
- ✅ All functionality via keyboard (Tab, Enter, arrow keys)
- ✅ No keyboard traps in navigation
- ✅ Visible focus indicators (`:focus-visible` with 2px border)
- ✅ Focus not obscured by sticky headers
- ✅ Semantic HTML: `<a>` elements with descriptive text (not "click here")
- ✅ Meaningful anchor IDs: `<h2 id="data-collection">2. Data Collection</h2>`

**Long-Form Content Best Practices:**
- ✅ Line length: 60-80 characters (max-width: 65ch)
- ✅ Paragraph spacing: margin-bottom ≥ 1.5em
- ✅ Heading navigation for screen readers (H key)
- ✅ Link navigation for screen readers (K key)
- ✅ Abbreviations expanded on first use

### Testing Checklist

- [ ] Lighthouse Accessibility score ≥95
- [ ] Keyboard-only navigation (no mouse)
- [ ] WebAIM contrast checker validation
- [ ] NVDA/VoiceOver screen reader testing
- [ ] Browser zoom to 200% (no horizontal scroll)
- [ ] W3C HTML validator
- [ ] Manual WCAG 2.1 AA audit

### Rationale

Long-form legal documents require robust navigation for users with disabilities. Table of contents with anchor links significantly improves usability for screen reader users and keyboard navigators.

### Sources

- W3C WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM Contrast Checker
- NVDA Screen Reader Documentation

---

## 4. Footer Layout Patterns (Implementation Guidance)

### Decision: Flexbox Responsive Footer

The footer will use Tailwind CSS flexbox utilities for responsive copyright (left) + legal links (right) layout.

### Implementation Pattern

**Desktop/Tablet (≥640px):**
```astro
<footer class="flex justify-between items-center">
  <p class="text-sm">© 2025 Вікторія Жульова</p>
  <nav class="flex gap-6">
    <a href="/privacy-policy">Політика конфіденційності</a>
    <a href="/terms">Умови використання</a>
  </nav>
</footer>
```

**Mobile (<640px):**
```astro
<footer class="flex flex-col gap-4">
  <p class="text-sm text-center">© 2025 Вікторія Жульова</p>
  <nav class="flex flex-col gap-2 text-center">
    <a href="/privacy-policy">Політика конфіденційності</a>
    <a href="/terms">Умови використання</a>
  </nav>
</footer>
```

### Rationale

Standard pattern across professional websites. Flexbox provides clean responsive behavior without media query complexity. Tailwind's `sm:` breakpoint (640px) handles mobile-first stacking.

---

## Technology Decisions

### Content Format: Static Astro Pages

**Decision**: Store legal content as inline HTML in Astro `.astro` files (not markdown files).

**Alternatives Considered:**
- ❌ Astro Content Collections - Overkill for 2 static pages, adds query overhead
- ❌ External markdown files - Requires import/parsing, less maintainable than inline
- ❌ CMS integration - Out of scope, content rarely changes

**Rationale**: Inline HTML in Astro components provides best performance (no parsing), easiest maintenance (single file per page), and clearest structure for long-form legal text.

### Styling: Tailwind Utility Classes

**Decision**: Use existing Tailwind design tokens (navy, gold, sage, font-serif, font-sans).

**Rationale**: No custom CSS needed. Legal pages match site aesthetic with utilities: `text-navy-900`, `font-serif`, `prose`, `max-w-4xl`.

### SEO Metadata: BaseLayout Component

**Decision**: Wrap legal pages with existing `BaseLayout.astro` component.

**Rationale**: Reuses meta tags, Open Graph, structured data infrastructure. Ensures consistency with existing pages.

---

## Unknowns Resolved

All "NEEDS CLARIFICATION" items from Technical Context have been resolved:

✅ **Privacy Policy Sections** - 10 conversational sections combining Ukrainian Law + GDPR requirements
✅ **Terms & Conditions Sections** - 10 conversational sections covering Ukrainian consumer law requirements
✅ **Accessibility Requirements** - WCAG AA checklist with long-form content best practices
✅ **Footer Layout Pattern** - Flexbox responsive design confirmed

---

## Phase 1 Readiness

**Status**: ✅ Ready to proceed to Phase 1 (Design & Contracts)

All research is complete. Next steps:
1. Create `data-model.md` (entities for legal pages, footer, modal)
2. Generate API contracts (N/A for static pages)
3. Create `quickstart.md` (developer implementation guide)
4. Update agent context with legal compliance requirements
