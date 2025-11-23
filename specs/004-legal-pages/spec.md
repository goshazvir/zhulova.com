# Feature Specification: Legal Pages (Terms & Conditions, Privacy Policy)

**Feature Branch**: `004-legal-pages`
**Created**: 2025-11-17
**Status**: Completed (2025-11-17)
**Input**: User description: "Create legal pages (Terms & Conditions and Privacy Policy) with proper Ukrainian content, simple styling consistent with site design, responsive layouts for all devices, and integrate links in footer (copyright left, legal links right) and consultation modal privacy notice"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Privacy Policy Page (Priority: P1) 🎯 MVP

Users need to understand how their personal data is collected, used, and protected when they submit consultation requests through the website.

**Why this priority**: Legal requirement under GDPR and Ukrainian data protection law. Cannot collect user data without a published privacy policy. Blocking issue for legal compliance.

**Independent Test**: Navigate to `/privacy-policy`, verify Ukrainian content is displayed, check responsive layout on mobile/tablet/desktop, confirm all required sections are present (data collection, usage, storage, user rights, contact information).

**Acceptance Scenarios**:

1. **Given** user clicks "політики конфіденційності" link, **When** page loads, **Then** Ukrainian privacy policy content is displayed with proper formatting
2. **Given** user views page on mobile (375px), **When** scrolling through content, **Then** all text is readable without horizontal scroll
3. **Given** user views page on tablet (768px), **When** reading content, **Then** layout is optimized with appropriate line length and spacing
4. **Given** user views page on desktop (1920px), **When** reading content, **Then** content is centered with max-width for readability

---

### User Story 2 - Terms & Conditions Page (Priority: P1) 🎯 MVP

Users need to understand the terms of service for using the coaching services and website features before engaging with the coach.

**Why this priority**: Legal requirement for service providers. Protects both coach and client. Essential for establishing service agreements and liability boundaries.

**Independent Test**: Navigate to `/terms`, verify Ukrainian content is displayed, check responsive layout on all devices, confirm all required sections are present (service description, user obligations, liability limitations, dispute resolution).

**Acceptance Scenarios**:

1. **Given** user clicks "Умови використання" link, **When** page loads, **Then** Ukrainian terms & conditions content is displayed
2. **Given** user reads terms on mobile, **When** scrolling through sections, **Then** all content is readable and properly formatted
3. **Given** user needs specific section, **When** using table of contents navigation, **Then** can jump to relevant section quickly
4. **Given** user views on any device, **When** page loads, **Then** layout matches site's minimal luxury aesthetic

---

### User Story 3 - Footer Legal Links Integration (Priority: P2)

Users need quick access to legal pages from any page of the website through footer links, with clear visual separation from copyright information.

**Why this priority**: Industry standard practice. Improves discoverability of legal pages. Enhances trust and professionalism.

**Independent Test**: Visit any page, scroll to footer, verify copyright is aligned left, legal links ("Політика конфіденційності", "Умови використання") are aligned right, all links work correctly, layout is responsive on all devices.

**Acceptance Scenarios**:

1. **Given** user is on homepage, **When** scrolls to footer, **Then** sees copyright text on left side and legal links on right side
2. **Given** user clicks "Політика конфіденційності" in footer, **When** link is clicked, **Then** navigates to `/privacy-policy` page
3. **Given** user clicks "Умови використання" in footer, **When** link is clicked, **Then** navigates to `/terms` page
4. **Given** user views footer on mobile, **When** screen width < 640px, **Then** copyright and legal links stack vertically with proper spacing
5. **Given** user views footer on tablet/desktop, **When** screen width >= 640px, **Then** copyright (left) and legal links (right) are horizontally aligned

---

### User Story 4 - Consultation Modal Privacy Notice Link (Priority: P2)

Users submitting consultation requests need to easily access the privacy policy directly from the modal to understand how their data will be used.

**Why this priority**: GDPR requirement for explicit consent. Users must be able to review privacy policy before submitting personal data. Improves transparency and trust.

**Independent Test**: Open consultation modal, verify privacy notice text is present, click "політики конфіденційності" link, confirm it opens privacy policy page in new tab, verify styling matches modal design.

**Acceptance Scenarios**:

1. **Given** user opens consultation modal, **When** viewing form footer, **Then** sees privacy notice text with linked "політики конфіденційності" phrase
2. **Given** user clicks privacy policy link in modal, **When** link is clicked, **Then** privacy policy page opens in new tab (target="_blank")
3. **Given** user reads privacy notice, **When** hovering over link, **Then** link color changes to gold-600 (consistent with site styling)
4. **Given** user on mobile, **When** views modal footer, **Then** privacy notice text wraps properly and link is easily tappable

---

### Edge Cases

- What happens when user navigates directly to `/privacy-policy` or `/terms` via URL? → Page loads with full header/footer navigation
- How does system handle deep linking to specific sections (e.g., `/terms#refund-policy`)? → Page scrolls to anchor section
- What happens if content is very long (>5000 words)? → Page remains scrollable, no max-height restrictions, smooth scroll behavior
- How does layout handle missing translations? → All content is in Ukrainian only (no English fallback needed for legal compliance). **Implementation**: If content file missing, Astro build fails (static generation error); if text empty, page renders with layout but no content body
- What happens when user uses browser back button from legal page? → Returns to previous page correctly
- How do legal pages appear in sitemap? → Included in sitemap.xml for SEO

## Requirements *(mandatory)*

### Functional Requirements

**Privacy Policy Page:**
- **FR-001**: Privacy policy page MUST be accessible at `/privacy-policy` route
- **FR-002**: Privacy policy page MUST be written in Ukrainian language
- **FR-003**: Privacy policy page MUST include 10 conversational sections combining related topics for readability: data collection methods, data usage purposes, data storage and security, user rights (access, deletion, correction), cookie policy, contact information for data inquiries
- **FR-004**: Both legal pages MUST be responsive on mobile (375px), tablet (768px), and desktop (1920px+) viewports
- **FR-005**: Page MUST use consistent styling with measurable criteria: Typography: Playfair Display headings (font-serif class), Inter body text (font-sans class); Colors: navy-900 text, gold-500 accents, sage-50 backgrounds from existing palette; Layout: max-width-4xl container, leading-relaxed line height, prose formatting

**Terms & Conditions Page:**
- **FR-006**: System MUST provide `/terms` route that displays terms & conditions content
- **FR-007**: Terms & conditions MUST be written in Ukrainian language
- **FR-008**: Terms & conditions MUST include 10 conversational sections covering all required legal topics: service description, user obligations, payment terms, refund policy, intellectual property, liability limitations, termination conditions, dispute resolution, contact information
- **FR-010**: Page MUST use consistent styling with same measurable criteria as FR-005 (Playfair Display headings, Inter body text, navy-900/gold-500/sage-50 palette, max-width-4xl, leading-relaxed)

**Footer Integration:**
- **FR-011**: Footer MUST display copyright text aligned to left side
- **FR-012**: Footer MUST display legal links ("Політика конфіденційності", "Умови використання") aligned to right side
- **FR-013**: Footer layout MUST be responsive: horizontal (left/right) on desktop/tablet, vertical stacked on mobile
- **FR-014**: Legal links MUST navigate to `/privacy-policy` and `/terms` routes
- **FR-015**: Legal links MUST have hover states consistent with site styling (gold-400 hover)

**Consultation Modal Integration:**
- **FR-016**: Consultation modal MUST display privacy notice text above submit button
- **FR-017**: Privacy notice MUST include clickable link to privacy policy page
- **FR-018**: Privacy policy link MUST open in new tab (target="_blank", rel="noopener noreferrer")
- **FR-019**: Privacy notice styling MUST match modal design (text-xs, text-navy-600, gold-600 link color)

**Content Requirements:**
- **FR-020**: Privacy policy content MUST comply with GDPR requirements
- **FR-021**: Privacy policy content MUST comply with Ukrainian Law on Personal Data Protection
- **FR-022**: Terms & conditions content MUST comply with Ukrainian consumer protection laws
- **FR-023**: Legal pages MUST include "Last Updated" date at top of content using Ukrainian locale format: "Останнє оновлення: 17 листопада 2025 р."
- **FR-024**: Legal pages MUST use Header variant='legal' (simplified menu: Home, Privacy Policy, Terms) and Footer variant='legal' (no CTA section) to maintain focused navigation without marketing elements

### Key Entities

- **Legal Page**: Represents a static legal document page (Privacy Policy or Terms & Conditions)
  - Attributes: route (URL path), title (Ukrainian), content (structured markdown/HTML), lastUpdated (date), sections (array of content sections)
  - Relationships: Referenced by footer links and modal privacy notice

- **Footer Legal Links**: Navigation elements in footer
  - Attributes: label (Ukrainian text), href (route), position (left for copyright, right for legal links)
  - Relationships: Links to Legal Page entities

- **Privacy Notice**: Text and link in consultation modal
  - Attributes: noticeText (Ukrainian), linkText (highlighted portion), linkHref (privacy policy route), linkTarget (_blank)
  - Relationships: References Privacy Policy page

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Legal pages load in under 2 seconds on 3G connection
- **SC-002**: Legal page content is readable on all viewport sizes (375px to 1920px+) without horizontal scroll
- **SC-003**: Users can navigate to privacy policy from footer and modal in under 3 clicks
- **SC-004**: Legal pages pass WCAG AA accessibility standards (color contrast ≥4.5:1, keyboard navigation, screen reader compatible)
- **SC-005**: Footer layout correctly displays copyright (left) and legal links (right) on 100% of tested devices (mobile, tablet, desktop)
- **SC-006**: Privacy policy link in consultation modal opens in new tab 100% of the time
- **SC-007**: Legal page text content is properly formatted with headings, paragraphs, and lists for readability
- **SC-008**: Users report understanding their data rights after reading privacy policy (qualitative feedback) - **Future Enhancement**: Feedback collection mechanism not currently implemented
- **SC-009**: Legal pages maintain consistent visual design with rest of site (minimal luxury aesthetic verified through design review)
- **SC-010**: All internal links within legal pages (table of contents anchors) work correctly

## Monitoring & Verification

This section documents how to measure each success criterion with specific tools and methods.

### Performance Monitoring (SC-001)

**Tool**: Lighthouse CI or WebPageTest
**Method**:
- Run Lighthouse audit on `/privacy-policy` and `/terms` pages
- Use "Fast 3G" throttling preset
- Verify LCP (Largest Contentful Paint) < 2000ms
- Command: `npx lighthouse https://zhulova.com/privacy-policy --throttling-method=devtools --preset=desktop`

### Responsive Layout Testing (SC-002, SC-005)

**Tool**: Browser DevTools + Manual Testing
**Method**:
- Test viewports: 375px (mobile), 768px (tablet), 1920px (desktop)
- Verify no horizontal scroll at any breakpoint
- Check footer alignment: copyright left, legal links right on ≥640px
- Check footer stacking: vertical layout on <640px
- Command: Browser DevTools → Responsive Design Mode

### Navigation Testing (SC-003, SC-006)

**Tool**: Manual Click Testing
**Method**:
- **Footer Links**: Click "Політика конфіденційності" and "Умови використання" from footer on any page → verify navigation to `/privacy-policy` and `/terms`
- **Modal Link**: Open consultation modal → click privacy policy link → verify opens in new tab (target="_blank")
- **Click Count**: Maximum 3 clicks from any page to reach privacy policy

### Accessibility Audit (SC-004)

**Tool**: axe DevTools + WAVE + Lighthouse
**Method**:
- Run axe DevTools browser extension on legal pages
- Verify 0 violations for WCAG AA
- Check color contrast: navy-900 on white ≥4.5:1
- Test keyboard navigation: Tab through all links, verify focus indicators
- Test screen reader: VoiceOver (Mac) or NVDA (Windows) - verify heading structure, link descriptions
- Command: `npx @axe-core/cli https://zhulova.com/privacy-policy`

### Content Formatting (SC-007)

**Tool**: Manual Visual Review
**Method**:
- Verify H1 heading present (page title)
- Verify H2 headings for each section (10 sections each)
- Verify paragraphs have `leading-relaxed` (line-height: 1.625)
- Verify max-width-4xl container (896px max width)
- Verify typography: Playfair Display headings (font-serif), Inter body (font-sans)

### User Feedback (SC-008)

**Tool**: Qualitative User Interviews (Future Enhancement)
**Method**: Not currently implemented - would require user feedback collection mechanism
**Status**: Marked for future implementation

### Visual Design Consistency (SC-009)

**Tool**: Manual Design Review
**Method**:
- Compare legal pages against homepage design
- Verify color palette: navy-900, gold-500, sage-50
- Verify typography: Playfair Display headings, Inter body text
- Verify spacing: consistent padding/margin with other pages
- Verify layout: BaseLayout component used (same header/footer as rest of site)

### Internal Links Testing (SC-010)

**Tool**: Manual Link Testing
**Method**:
- **Note**: Table of contents descoped - no internal anchor links to test
- Verify footer links navigate correctly
- Verify modal privacy link navigates correctly
- Command: `curl -I https://zhulova.com/privacy-policy` (verify 200 status)

## Scope *(optional)*

### In Scope

- Creation of two static legal pages: Privacy Policy and Terms & Conditions
- Ukrainian language content for both pages (legally compliant)
- Simple, clean page styling consistent with site's minimal luxury aesthetic
- Responsive layouts for mobile, tablet, desktop
- Footer layout modification (copyright left, legal links right)
- Privacy notice with link in consultation modal
- "Last Updated" date display on legal pages

### Out of Scope

- **Table of contents navigation**: Simple scroll navigation used instead - pages are short enough (~10 sections each) that TOC anchor links are unnecessary. Users can scroll or use browser find (Ctrl+F) to locate specific sections.
- English translations of legal pages (Ukrainian only)
- Interactive consent management (cookie banners, consent toggles)
- Version history or changelog for legal documents
- PDF download options for legal pages
- Email notifications when legal pages are updated
- Admin panel for editing legal page content (static content in codebase)
- Multilingual legal page routing
- Analytics tracking for legal page views
- Print-optimized styling for legal pages

## Assumptions *(optional)*

- Legal content will be provided in Ukrainian and is already reviewed by legal expert (AI will generate draft content following Ukrainian law and GDPR, but final review by legal expert is recommended)
- Site already uses Astro static site generator with Tailwind CSS (no additional styling frameworks needed)
- Footer component exists and can be modified (`src/components/layout/Footer.astro`)
- Consultation modal exists (`src/components/forms/ConsultationModal.tsx`)
- Site already has established color palette (navy, gold, sage) and typography (Playfair Display, Inter)
- No cookie consent banner is required (site doesn't use tracking cookies beyond basic analytics)
- Legal pages are static content (no CMS integration needed)
- Privacy policy applies to consultation form data only (no e-commerce, no user accounts)
- Terms & conditions apply to coaching services only (no product sales, no subscriptions)

## Dependencies *(optional)*

- Existing footer component must be accessible and modifiable
- Existing consultation modal component must be accessible and modifiable
- Astro routing system for creating new static pages
- Tailwind CSS configuration with current design tokens (navy, gold, sage colors)
- Ukrainian legal text content (GDPR compliant, Ukrainian law compliant)

## Constraints *(optional)*

- Legal content MUST be in Ukrainian (legal requirement for Ukrainian business)
- Legal content MUST comply with GDPR and Ukrainian data protection laws
- Changes to footer layout MUST NOT break existing mobile navigation
- Privacy notice in modal MUST NOT obscure form submit button
- Legal pages MUST maintain minimal luxury aesthetic (no generic template look)
- File size constraints: Legal pages should load quickly (< 100KB total per page)
- Accessibility requirement: WCAG AA compliance mandatory
- Legal pages MUST be indexable by search engines (no noindex meta tag)

## Open Questions *(optional, use [NEEDS CLARIFICATION: ...] format)*

[None - all requirements are clear based on user description and industry best practices]
