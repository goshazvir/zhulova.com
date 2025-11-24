# Feature Specification: Fix Navigation Bugs

**Feature Branch**: `014-fix-navigation-bugs`
**Created**: 2024-11-24
**Completed**: 2024-11-24
**Status**: ✅ Completed
**Commit**: `516fac2 fix: resolve View Transitions navigation bugs`
**Input**: User description: "Fix navigation bugs: footer logo not linking to home from internal pages, mobile menu not opening on /courses, modal not opening after page navigation with View Transitions"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logo Links to Home from Internal Pages (Priority: P1)

A user visiting any internal page (courses, contacts, legal pages) clicks on the site logo in the header, footer, or mobile menu and expects to be navigated to the home page. Currently, the footer logo is not a link at all, and header/mobile menu logos should not self-link when already on home page.

**Why this priority**: Logo as home navigation is a fundamental UX pattern. Users expect to return home by clicking the logo - this is broken on all internal pages for footer, causing navigation frustration.

**Independent Test**: Can be tested by visiting /courses or /contacts and clicking each logo (header, footer, mobile menu) to verify navigation to home page.

**Acceptance Scenarios**:

1. **Given** user is on `/courses` page, **When** user clicks footer logo, **Then** user is navigated to home page (`/`)
2. **Given** user is on `/contacts` page, **When** user clicks header logo, **Then** user is navigated to home page (`/`)
3. **Given** user is on home page (`/`), **When** user views footer logo, **Then** logo is NOT a link (no self-referential link)
4. **Given** user is on home page (`/`), **When** user views header logo, **Then** logo is NOT a link (no self-referential link)
5. **Given** user is on any internal page, **When** user opens mobile menu and clicks logo in header, **Then** user is navigated to home page

---

### User Story 2 - Mobile Menu Opens on All Pages (Priority: P1)

A mobile user on the /courses page (or any internal page) taps the hamburger menu button and expects the mobile navigation drawer to open. Currently, the mobile menu button does not respond on /courses and other internal pages.

**Why this priority**: Mobile navigation is critical - without it, mobile users cannot navigate the site from internal pages. This is a complete navigation blocker for mobile users.

**Independent Test**: Can be tested by visiting /courses on mobile viewport, clicking hamburger button, and verifying mobile menu opens.

**Acceptance Scenarios**:

1. **Given** user is on `/courses` page on mobile, **When** user taps hamburger menu button, **Then** mobile navigation drawer opens
2. **Given** user is on `/contacts` page on mobile, **When** user taps hamburger menu button, **Then** mobile navigation drawer opens
3. **Given** user is on any course detail page (`/courses/*`) on mobile, **When** user taps hamburger menu button, **Then** mobile navigation drawer opens
4. **Given** user is on legal pages (`/privacy-policy`, `/terms`) on mobile, **When** user taps hamburger menu button, **Then** mobile navigation drawer opens
5. **Given** mobile menu is open, **When** user navigates to another page, **Then** mobile menu button continues to work on the new page

---

### User Story 3 - Modal Opens After Page Navigation (Priority: P1)

A user navigates from home page to /contacts, then back to home page, and clicks any "Записатись на розбір" (consultation) button. The consultation modal should open. Currently, after View Transitions navigation, the modal buttons stop working.

**Why this priority**: Consultation booking is the primary conversion action. If users cannot open the consultation modal after navigating, the entire conversion funnel is broken.

**Independent Test**: Can be tested by navigating home → /contacts → home, then clicking any CTA button to verify modal opens.

**Acceptance Scenarios**:

1. **Given** user navigates from home to `/contacts` then back to home, **When** user clicks any consultation CTA button, **Then** consultation modal opens
2. **Given** user navigates from home to `/courses` then back to home, **When** user clicks hero section CTA button, **Then** consultation modal opens
3. **Given** user navigates through multiple pages and returns to home, **When** user clicks footer CTA button, **Then** consultation modal opens
4. **Given** user refreshes the home page, **When** user clicks any CTA button, **Then** consultation modal opens (regression check)
5. **Given** user navigates to internal page and clicks CTA there (if available), **When** CTA is clicked, **Then** modal opens correctly

---

### Edge Cases

- What happens when user rapidly navigates between pages? Modal and menu should remain functional.
- What happens when user uses browser back/forward buttons? All interactive elements should work.
- What happens when user clicks logo while on home page? No navigation should occur (avoid page reload).
- What happens when accessibility tools are used? Logo links should have proper ARIA labels, menu should be keyboard-accessible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST wrap footer logo in a link to home page (`/`) when user is NOT on home page
- **FR-002**: System MUST NOT wrap footer logo in a link when user IS on home page (avoid self-referential links)
- **FR-003**: System MUST wrap header logo in a link to home page (`/`) when user is NOT on home page
- **FR-004**: System MUST NOT wrap header logo in a link when user IS on home page
- **FR-005**: System MUST re-initialize mobile menu event listeners after View Transitions page navigation
- **FR-006**: System MUST re-initialize consultation modal event listeners after View Transitions page navigation
- **FR-007**: System MUST ensure mobile menu opens on all pages including `/courses`, `/contacts`, `/courses/*`, `/privacy-policy`, `/terms`
- **FR-008**: System MUST ensure all consultation CTA buttons work after any page navigation sequence
- **FR-009**: System MUST maintain ARIA attributes for logo links (`aria-label` for accessibility)
- **FR-010**: System MUST use Astro's `astro:page-load` event for script re-initialization with View Transitions

### Key Entities

- **Logo Component**: Visual brand element that conditionally renders as link or static image based on current page
- **Mobile Menu Button**: Hamburger button that triggers mobile menu state change
- **Consultation CTA Buttons**: Multiple buttons (hero, stats section, footer) that open consultation modal
- **UI State Store (Zustand)**: Centralized state management for mobile menu and modal visibility

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate to home page from footer logo on 100% of internal pages
- **SC-002**: Mobile menu opens successfully on 100% of pages (home, courses, contacts, legal pages, course detail pages)
- **SC-003**: Consultation modal opens successfully after any navigation sequence (direct, View Transitions, browser back/forward)
- **SC-004**: Zero regression in existing functionality - all current working features remain functional
- **SC-005**: All E2E tests pass including new tests for these specific scenarios
- **SC-006**: No accessibility violations introduced (WCAG AA compliance maintained)

## Assumptions

- View Transitions are enabled and should remain enabled (they provide better UX)
- Zustand state persists across View Transitions (only event listeners need re-initialization)
- The fix should work with Astro 4.x View Transitions API
- Browser support matches current project requirements (modern browsers)
