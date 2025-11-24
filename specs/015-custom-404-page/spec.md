# Feature Specification: Custom 404 Error Page

**Feature Branch**: `015-custom-404-page`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "Create custom 404 error page for luxury coach personal brand website with minimalist elegant design, empathetic Ukrainian messaging, responsive layout, and WCAG AA accessibility compliance"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lost Visitor Recovery (Priority: P1)

A visitor navigates to a non-existent page (mistyped URL, outdated link, or deleted content) and needs clear guidance to return to valuable content on the site.

**Why this priority**: This is the core purpose of the 404 page - recovering lost visitors before they leave the site entirely. Every other enhancement builds on this foundation.

**Independent Test**: Can be fully tested by visiting any invalid URL (e.g., `/nonexistent-page`) and verifying the user can navigate back to the home page within 2 clicks.

**Acceptance Scenarios**:

1. **Given** a visitor enters an invalid URL, **When** the page loads, **Then** they see a clear "404" indicator with empathetic messaging in Ukrainian explaining the page doesn't exist
2. **Given** a visitor is on the 404 page, **When** they click "На головну", **Then** they are redirected to the home page
3. **Given** a visitor is on the 404 page, **When** they view the page, **Then** the browser returns HTTP status code 404 (not 200)

---

### User Story 2 - Brand Experience Continuity (Priority: P2)

A visitor encountering a 404 error should experience the same visual quality and brand aesthetic as the rest of the site, reinforcing trust and professionalism.

**Why this priority**: Brand consistency builds trust. A generic or broken-looking 404 page damages the luxury coach brand perception.

**Independent Test**: Can be tested by comparing the 404 page styling against the home page - same colors, fonts, and visual language should be apparent.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the 404 page, **When** they view the design, **Then** they see the site's navy and gold color scheme with Playfair Display typography
2. **Given** a visitor views the 404 page, **When** the page loads, **Then** a subtle fade-in animation creates a smooth, polished experience
3. **Given** a visitor views the 404 page, **When** they read the messaging, **Then** the tone is warm, empathetic, and aligned with the coaching brand voice

---

### User Story 3 - Mobile Visitor Experience (Priority: P2)

A mobile visitor on the 404 page should have an equally excellent experience with properly sized touch targets and readable content.

**Why this priority**: Mobile traffic represents a significant portion of visitors. Poor mobile experience directly impacts bounce rate.

**Independent Test**: Can be tested on a mobile device by verifying all buttons are easily tappable and content is readable without zooming.

**Acceptance Scenarios**:

1. **Given** a mobile visitor lands on the 404 page, **When** they view the layout, **Then** all content is properly sized for mobile screens without horizontal scrolling
2. **Given** a mobile visitor wants to navigate, **When** they tap any button, **Then** the touch target is at least 48px in height/width
3. **Given** a tablet visitor lands on the 404 page, **When** they view the layout, **Then** content is appropriately scaled between mobile and desktop views

---

### User Story 4 - Conversion Opportunity (Priority: P3)

A visitor on the 404 page should have easy access to high-value pages (courses, consultation) to convert the error into an opportunity.

**Why this priority**: While secondary to core recovery, offering paths to courses and consultation can turn a negative experience into a conversion.

**Independent Test**: Can be tested by verifying secondary CTAs are visible and functional, leading to the correct pages.

**Acceptance Scenarios**:

1. **Given** a visitor is on the 404 page, **When** they click "Курси", **Then** they are redirected to the courses page
2. **Given** a visitor is on the 404 page, **When** they click "Консультація", **Then** they are redirected to the contacts page

---

### User Story 5 - Accessible Experience (Priority: P2)

A visitor using assistive technology (screen reader, keyboard navigation) should be able to fully use the 404 page.

**Why this priority**: WCAG AA compliance is a project requirement and ensures the site is usable by all visitors.

**Independent Test**: Can be tested using keyboard-only navigation and screen reader to verify all content is accessible and navigable.

**Acceptance Scenarios**:

1. **Given** a keyboard user lands on the 404 page, **When** they press Tab, **Then** focus moves logically through all interactive elements with visible focus indicators
2. **Given** a screen reader user lands on the 404 page, **When** they navigate, **Then** all content is announced correctly with proper heading hierarchy
3. **Given** a user with motion sensitivity lands on the 404 page, **When** they have `prefers-reduced-motion` enabled, **Then** the fade-in animation is disabled

---

### Edge Cases

- What happens when a visitor lands on 404 with JavaScript disabled? → Page should be fully functional without JavaScript
- How does the page handle extremely long invalid URLs? → URL should not be displayed on the page (only in browser address bar)
- What happens on very small screens (< 320px)? → Content should remain readable with graceful degradation
- How does the page behave when View Transitions API is active? → 404 should participate in smooth page transitions

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST return HTTP status code 404 for non-existent pages
- **FR-002**: System MUST display "404" as a prominent visual indicator using serif typography (Playfair Display)
- **FR-003**: System MUST display empathetic Ukrainian messaging explaining the page was not found
- **FR-004**: System MUST provide a primary CTA button labeled "На головну" linking to the home page
- **FR-005**: System MUST provide secondary CTA links "Курси" and "Консультація" linking to respective pages
- **FR-006**: System MUST implement responsive design supporting mobile (< 640px), tablet (640px-1023px), and desktop (1024px+) viewports
- **FR-007**: System MUST ensure all interactive elements have minimum touch target size of 48px × 48px
- **FR-008**: System MUST implement a subtle fade-in animation on page load
- **FR-009**: System MUST respect `prefers-reduced-motion` media query by disabling animations
- **FR-010**: System MUST meet WCAG AA accessibility standards including 4.5:1 color contrast ratio for text
- **FR-011**: System MUST provide visible focus indicators for keyboard navigation with minimum 3:1 contrast
- **FR-012**: System MUST use proper heading hierarchy with a single `<h1>` element
- **FR-013**: System MUST include SEO meta tags (`<title>`, `<meta description>`) in Ukrainian
- **FR-014**: Page MUST NOT include `rel="canonical"` or `noindex` meta tags (404 status handles SEO correctly)
- **FR-015**: System MUST use navy-900 and gold color palette consistent with site design system
- **FR-016**: System MUST function correctly without JavaScript enabled

### Key Entities

- **404 Page**: Single static page that serves as error page for all non-existent routes
- **Navigation Links**: Primary CTA (home), Secondary CTAs (courses, contacts) - all existing site pages
- **Meta Information**: Title, description in Ukrainian for consistent branding

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visits to non-existent URLs display the custom 404 page (not browser default or Vercel default)
- **SC-002**: Page achieves Lighthouse accessibility score of 90+
- **SC-003**: Page achieves Lighthouse performance score of 85+ (consistent with site standards)
- **SC-004**: All interactive elements are reachable via keyboard in logical tab order
- **SC-005**: Page renders correctly across mobile, tablet, and desktop viewports without horizontal scrolling
- **SC-006**: Page load time under 1 second on standard 4G connection
- **SC-007**: Zero WCAG AA violations as measured by automated accessibility testing (axe-core)
- **SC-008**: All buttons have minimum 48px touch target size (verified via DevTools)

## Assumptions

- Ukrainian language is appropriate for the 404 page (consistent with rest of site)
- The existing BaseLayout component provides necessary SEO meta tag infrastructure
- The existing Button component supports the required styling variants
- View Transitions are already implemented site-wide and will work with 404 page
- Vercel adapter correctly serves custom 404.astro as the error page in static mode

## Out of Scope

- Analytics tracking of 404 errors (can be added in future iteration)
- "Report broken link" form functionality
- Search functionality on 404 page
- Dynamic suggestions based on attempted URL
- Multi-language support (beyond Ukrainian)

## Dependencies

- BaseLayout.astro component for page structure and meta tags
- Button component for CTA styling
- Tailwind CSS for responsive design utilities
- Existing color tokens (navy, gold) in Tailwind config
- Playfair Display and Inter fonts already loaded in global.css
