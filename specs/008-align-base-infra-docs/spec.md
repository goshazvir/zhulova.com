# Feature Specification: Align Base Infrastructure Documentation

**Feature Branch**: `008-align-base-infra-docs`
**Created**: 2025-11-23
**Status**: Completed (2025-11-23)
**Input**: User description: "Align 001-base-infrastructure specification with actual implementation completed 2025-11-16. Fix 11 inconsistencies: (CRITICAL) Status shows 'Draft' but feature completed and deployed; Constitution violation - plan claims output:'static' but codebase uses 'hybrid' mode for API routes; 6 edge cases have no answers (BaseLayout without required props, header navigation on tablets, custom fonts fail to load, mobile menu long labels, footer without social links, browsers without modern CSS); Incorrect creation date in CLAUDE.md (shows 2025-01-14 instead of 2025-11-14). (HIGH) Success criteria SC-001 to SC-010 lack measurement methods; FR-011 claims breakpoint 768px but implementation may differ; No code references in functional requirements. (MEDIUM) Duplicate accessibility requirements FR-016/FR-017/FR-018; Ambiguous success criteria without measurement tools; Missing tasks.md file in spec directory; Assumptions don't reflect actual domain setup timeline (zhulova.com connected later). Goal: Update spec.md, plan.md to accurately document what was built (BaseLayout with SEO, Header with responsive menu, Footer with social links, Tailwind design system with Navy/Gold/Sage colors) OR identify missing implementation. Documentation-only feature, no code changes to src/ files."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Understanding Infrastructure (Priority: P1)

A new developer joins the team and needs to understand the base infrastructure (BaseLayout, Header, Footer, design system) by reading the 001 specification. They expect the spec to accurately reflect what was actually built, not aspirational or outdated requirements.

**Why this priority**: Inaccurate documentation is a critical blocker for developer onboarding and maintenance. If the spec claims features don't exist or misrepresents architecture (static vs hybrid mode), developers will make wrong assumptions, waste time investigating discrepancies, and potentially introduce bugs.

**Independent Test**: Can be fully tested by reading specs/001-base-infrastructure/spec.md and plan.md, then verifying every claim against actual implementation files (src/layouts/BaseLayout.astro, src/components/layout/Header.astro, src/components/layout/Footer.astro, tailwind.config.mjs, astro.config.mjs). All documented behavior must match code reality.

**Acceptance Scenarios**:

1. **Given** developer reads spec.md status field, **When** they check git history, **Then** status shows "Completed (2025-11-16)" matching actual completion date from git log
2. **Given** developer reads plan.md constitution check, **When** they verify astro.config.mjs output mode, **Then** plan states "Hybrid mode permitted exclusively for /api/* serverless functions; all pages including legal/home/courses remain pre-rendered static"
3. **Given** developer reads spec.md FR-011 claiming 768px breakpoint, **When** they check Header.astro/MobileMenu.tsx code, **Then** spec documents actual breakpoint used in implementation
4. **Given** developer reads edge cases section, **When** they look for answers to 6 edge case questions, **Then** all questions have documented answers based on actual component behavior (not unanswered questions)

---

### User Story 2 - QA Creating Test Plan from Spec (Priority: P1)

A QA engineer creates test cases for base infrastructure by reading functional requirements and success criteria. They need concrete, testable requirements with measurement methods, not ambiguous claims like "achieve Lighthouse 95+" without knowing where/how to measure.

**Why this priority**: Ambiguous requirements block QA from creating actionable test plans. Success criteria without measurement tools lead to subjective testing and missed validation. Missing code references make it impossible to verify requirements match implementation.

**Independent Test**: Can be tested by extracting all functional requirements (FR-001 to FR-020) and success criteria (SC-001 to SC-010) from spec.md, attempting to create objective test cases for each, and verifying each requirement has code reference showing where it's implemented.

**Acceptance Scenarios**:

1. **Given** QA reads SC-001 "Pages using BaseLayout achieve Lighthouse SEO score 95+", **When** they check spec for measurement method, **Then** spec includes "Monitoring & Verification" section explaining: "Run npm run build && npm run preview, then audit https://localhost:4321 with Chrome DevTools Lighthouse"
2. **Given** QA reads FR-001 about BaseLayout props, **When** they create test case, **Then** requirement includes code reference: "BaseLayout.astro:7-12 defines interface Props with title, description, image, canonical"
3. **Given** QA reads FR-016 about focus indicators, **When** they test accessibility, **Then** requirement references global.css:line showing actual focus styling implementation
4. **Given** QA reads success criteria SC-005 about font loading, **When** they measure CLS, **Then** spec documents tool: "Vercel Speed Insights dashboard → Page Speed → CLS metric"

---

### User Story 3 - PM Measuring Feature Completion (Priority: P2)

A project manager reviews spec.md to verify feature 001 completion status and measure success criteria. They need accurate status ("Completed" vs "Draft") and documented methods to verify each success criterion was achieved.

**Why this priority**: Outdated status prevents accurate project tracking. Success criteria without verification methods are aspirational, not measurable. PM cannot report completion confidence or demonstrate value without measurement tools.

**Independent Test**: Can be tested by checking spec.md status matches git log completion date, reviewing all success criteria (SC-001 to SC-010) have documented verification methods referencing specific tools (Lighthouse, Vercel Analytics, HTML validator).

**Acceptance Scenarios**:

1. **Given** PM reads spec.md status, **When** they verify completion date, **Then** status shows "Completed (2025-11-16)" matching git commit date from feature merge
2. **Given** PM reviews SC-002 "Lighthouse Accessibility score 95+", **When** they check how to measure, **Then** spec documents: "Chrome DevTools → Lighthouse → Accessibility audit shows score ≥95"
3. **Given** PM validates SC-006 "Header/Footer consistent across screen sizes", **When** they verify this criterion, **Then** spec documents: "Test at 320px, 768px, 1440px viewports - all navigation elements remain accessible"
4. **Given** PM reads all 10 success criteria, **When** checking measurement methods, **Then** every SC-001 to SC-010 has documented tool/location for verification

---

### User Story 4 - Architect Reviewing Constitution Compliance (Priority: P2)

An architect reviews plan.md constitution check to verify base infrastructure complies with project principles. They find plan claims `output: 'static'` but actual codebase uses `output: 'hybrid'` mode (confirmed in astro.config.mjs and CLAUDE.md). This appears to violate constitution principle "Static-First Delivery".

**Why this priority**: Constitution violations risk architectural integrity. If plan incorrectly claims static mode compliance when hybrid is used, future features might inherit this misunderstanding. However, hybrid mode is acceptable when ALL pages remain static and ONLY /api/* routes use serverless functions - constitution just needs clarification.

**Independent Test**: Can be tested by reading plan.md constitution check section, verifying astro.config.mjs configuration shows `output: 'hybrid'`, checking that all pages (home, courses, contacts, privacy, terms) are pre-rendered at build time, and confirming only /api/* routes are serverless.

**Acceptance Scenarios**:

1. **Given** architect reads plan.md constitution check Principle I, **When** they verify astro.config.mjs, **Then** plan states: "Hybrid mode permitted exclusively for /api/* serverless functions; all pages including home/courses/contacts/privacy/terms remain pre-rendered static at build time"
2. **Given** architect validates build output, **When** they run npm run build, **Then** dist/ folder contains static HTML for all pages, .vercel/output/functions/ contains only /api/* serverless functions
3. **Given** architect checks constitution compliance, **When** reviewing all 5 principles, **Then** plan.md accurately reflects compliance status with proper justifications (no false claims)
4. **Given** architect reads assumptions, **When** checking domain setup, **Then** assumptions document actual timeline: "zhulova.com domain configured 2025-11-17, initially deployed to zhulova-com.vercel.app"

---

### User Story 5 - Technical Writer Fixing Documentation Debt (Priority: P3)

A technical writer updates 001 specification and notices duplicate accessibility requirements (FR-016, FR-017, FR-018 all mention different aspects of accessibility), inconsistent terminology, and missing CLAUDE.md accuracy (shows 2025-01-14 creation date but git log shows 2025-11-14).

**Why this priority**: Duplicate requirements create maintenance burden and sync risk. Inconsistent dates reduce trust in documentation. While lower priority than developer/QA blockers, these issues accumulate as technical debt.

**Independent Test**: Can be tested by searching spec.md for duplicate FR patterns, verifying all dates match git history, checking CLAUDE.md "Recent Changes" section accuracy.

**Acceptance Scenarios**:

1. **Given** writer searches spec.md for accessibility requirements, **When** reviewing FR-016, FR-017, FR-018, **Then** requirements are consolidated into single FR-016: "Global CSS MUST implement WCAG AA accessibility: focus indicators (2px outline, high contrast), prefers-reduced-motion support (disable animations), color contrast ≥4.5:1 for text"
2. **Given** writer checks CLAUDE.md "Recent Changes", **When** finding 001-base-infrastructure entry, **Then** date shows "2025-11-14 to 2025-11-16" matching actual git commit range
3. **Given** writer validates spec.md FR requirements, **When** checking for code references, **Then** each FR includes file:line reference (e.g., "FR-001: BaseLayout.astro:7-12", "FR-009: src/styles/global.css:15-25")
4. **Given** writer reviews assumptions section, **When** checking factual accuracy, **Then** all assumptions reflect actual implementation decisions, not outdated planning assumptions

---

### Edge Cases

**Current State**: spec.md lines 103-108 list 6 edge cases as questions. Below are answers based on actual implementation:

1. **What happens when BaseLayout is used without required props (title, description)?**
   - **Answer**: TypeScript compilation fails with error "Property 'title' is required but was not provided"
   - **Code**: BaseLayout.astro:7-12 defines Props interface without optional modifiers for title/description
   - **Behavior**: Build-time validation, not runtime error

2. **How does header navigation behave on tablets (between mobile and desktop breakpoints)?**
   - **Answer**: Header uses md:flex breakpoint (768px) - below 768px shows hamburger menu, 768px+ shows horizontal desktop navigation
   - **Code**: Header.astro:line (responsive classes), MobileMenu.tsx (mobile menu component)
   - **Tablet behavior**: iPad portrait (768px) shows desktop nav, smaller tablets show mobile menu

3. **What happens if custom fonts fail to load (font fallback strategy)?**
   - **Answer**: Browser falls back to system fonts - serif for headings (Georgia, Times New Roman), sans-serif for body (Helvetica, Arial)
   - **Code**: tailwind.config.mjs font-serif and font-sans definitions include fallback stacks
   - **User experience**: Content remains readable, slight visual difference until fonts load

4. **How does mobile menu handle very long navigation labels?**
   - **Answer**: Labels use truncate utility class - text truncates with ellipsis if exceeds container width
   - **Code**: MobileMenu.tsx navigation items have responsive text sizing
   - **Fallback**: Text wraps on very small screens (<360px)

5. **What happens if social media links are not provided to Footer component?**
   - **Answer**: Social media section is conditionally rendered - if no links provided, section is omitted from DOM
   - **Code**: Footer.astro uses conditional rendering for social links section
   - **Visual impact**: Footer displays only navigation and copyright when social links absent

6. **How does site handle browsers without modern CSS features (CSS Grid, custom properties)?**
   - **Answer**: Site targets last 2 versions of major browsers (per browserslist config) - no polyfills for legacy browsers
   - **Code**: No IE11 support, no CSS Grid fallbacks, no custom property polyfills
   - **Recommendation**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Requirements *(mandatory)*

### Functional Requirements

**Critical Issue Fixes:**

- **FR-001**: spec.md status field MUST show "Completed (2025-11-16)" instead of "Draft" to reflect actual completion date from git commit merge to master
- **FR-002**: plan.md constitution check Principle I MUST state "Hybrid mode permitted exclusively for /api/* serverless functions; all pages including home/courses/contacts/privacy/terms remain pre-rendered static at build time" to match astro.config.mjs configuration
- **FR-003**: spec.md edge cases section (lines 103-108) MUST replace 6 unanswered questions with documented answers based on actual implementation in BaseLayout.astro, Header.astro, Footer.astro, MobileMenu.tsx
- **FR-004**: CLAUDE.md "Recent Changes" section MUST show correct 001-base-infrastructure date range "2025-11-14 to 2025-11-16" instead of incorrect "2025-01-14"

**High Priority Issue Fixes:**

- **FR-005**: spec.md MUST add "Monitoring & Verification" section documenting how to measure each success criterion (SC-001 to SC-010) with specific tools and commands (e.g., "npm run build && lighthouse https://localhost:4321")
- **FR-006**: All functional requirements (FR-001 to FR-020 in original spec) MUST include code references using file:line pattern (e.g., "BaseLayout.astro:7-12", "tailwind.config.mjs:30-45")
- **FR-007**: spec.md FR-011 MUST document actual mobile menu breakpoint from Header.astro/MobileMenu.tsx implementation (verify if 768px or different)
- **FR-008**: All success criteria (SC-001 to SC-010) MUST specify measurement location and tool (e.g., "Chrome DevTools Lighthouse", "Vercel Speed Insights dashboard", "HTML W3C Validator")

**Medium Priority Issue Fixes:**

- **FR-009**: spec.md accessibility requirements (FR-016, FR-017, FR-018) MUST be consolidated into single requirement FR-016: "Global CSS MUST implement WCAG AA accessibility: focus indicators (2px outline, high contrast ratio ≥3:1), prefers-reduced-motion media query (disable/reduce animations), text color contrast ≥4.5:1 for normal text and ≥3:1 for large text" with code reference to global.css
- **FR-010**: spec.md assumptions section MUST update domain setup assumption to: "zhulova.com custom domain configured 2025-11-17, initially deployed to zhulova-com.vercel.app subdomain"
- **FR-011**: specs/001-base-infrastructure/ directory SHOULD create tasks.md file documenting implementation tasks for completeness (optional but recommended for consistency with other features)

**Coverage and Validation:**

- **FR-012**: All 20 functional requirements from original 001 spec MUST have corresponding code reference OR be marked in "Out of Scope" section with rationale if not implemented
- **FR-013**: All edge case answers MUST reference specific implementation files and line numbers where behavior is defined
- **FR-014**: plan.md assumptions section MUST reflect actual implementation decisions, not outdated planning assumptions

### Key Entities

- **Documentation Artifact**: Represents a specification document (spec.md, plan.md)
  - Attributes: filePath (string), lastUpdated (date), status (Draft | Completed), requirementCount (number), issueCount (number)
  - Relationships: References implementation files (BaseLayout.astro, Header.astro, Footer.astro, tailwind.config.mjs)
  - Lifecycle: Created during planning, updated during implementation, finalized after deployment

- **Documentation Issue**: Represents a discrepancy between spec and implementation
  - Attributes: issueId (string), category (Critical | High | Medium), location (file path + line number), summary (string), recommendation (string)
  - Relationships: Linked to functional requirement fix (FR-001 to FR-014)
  - Lifecycle: Identified during analysis, resolved via documentation update, verified via testing

- **Functional Requirement**: Represents a documented capability or constraint in spec.md
  - Attributes: requirementId (string, e.g., FR-003), description (string), implementation status (Implemented | Partial | Not Implemented), codeReference (string, file:line)
  - Relationships: Maps to implementation files, validates against actual code behavior
  - Lifecycle: Defined in spec, validated against implementation, updated when misaligned

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of critical issues (FR-001 to FR-004) are resolved - spec status updated to Completed, plan constitution check clarified, edge cases answered, CLAUDE.md dates corrected
- **SC-002**: 100% of high priority issues (FR-005 to FR-008) are resolved - monitoring section added, code references included, breakpoint verified, success criteria have measurement tools
- **SC-003**: All accessibility requirements consolidated - FR-016/FR-017/FR-018 merged into single FR-016 with comprehensive WCAG AA criteria and code reference to global.css
- **SC-004**: All 20 original functional requirements have code references OR documented in "Out of Scope" section - coverage tracking shows 100% mapping
- **SC-005**: All success criteria (SC-001 to SC-010 from original 001 spec) have documented measurement methods in "Monitoring & Verification" section with specific tools and locations
- **SC-006**: Constitution compliance accurately documented - plan.md reflects actual hybrid mode usage with proper justification for /api/* routes only
- **SC-007**: Spec status reflects reality - "Completed (2025-11-16)" matches git commit merge date
- **SC-008**: All edge case answers are verifiable - developer can verify every statement by reading corresponding code files (BaseLayout.astro:line, Header.astro:line)
- **SC-009**: Zero ambiguous requirements - QA can create objective test cases for 100% of functional requirements using code references
- **SC-010**: Date accuracy achieved - CLAUDE.md, spec.md, plan.md all show consistent, factually correct dates matching git history

### Monitoring & Verification

How to verify each success criterion:

- **SC-001**: Read specs/001-base-infrastructure/spec.md:5 (status field), plan.md:28-44 (constitution check), spec.md:103-115 (edge cases), CLAUDE.md:line (Recent Changes) - verify all show corrected values
- **SC-002**: Read spec.md Monitoring & Verification section, FR-001 to FR-020 for code references, plan.md for breakpoint documentation - verify all present
- **SC-003**: Search spec.md for "FR-016", "FR-017", "FR-018" - verify only FR-016 exists with consolidated content
- **SC-004**: Create mapping table of FR-001 to FR-020 → implementation files - verify 100% have code reference or Out of Scope note
- **SC-005**: Read spec.md Monitoring & Verification section - verify SC-001 to SC-010 each have tool/location documented
- **SC-006**: Read plan.md constitution check - verify accurate hybrid mode description with /api/* clarification
- **SC-007**: Run `git log --grep="001-base-infrastructure" --oneline --date=short` - verify spec.md status matches merge date
- **SC-008**: For each edge case answer, verify code reference exists and matches actual implementation behavior
- **SC-009**: Extract all FR from spec.md - verify each has testable criteria and code reference
- **SC-010**: Run `git log --all --date=short --format="%cd %s" | grep 001-base` - verify dates in docs match git history

## Scope *(optional)*

### In Scope

- Update spec.md status to "Completed (2025-11-16)"
- Fix plan.md constitution check to acknowledge hybrid mode for /api/* routes only
- Document edge case answers based on actual BaseLayout/Header/Footer/MobileMenu implementation
- Add "Monitoring & Verification" section for success criteria with specific tools/commands
- Consolidate duplicate accessibility requirements (FR-016/FR-017/FR-018)
- Add code references (file:line) to all functional requirements
- Fix CLAUDE.md date from 2025-01-14 to 2025-11-14
- Update assumptions section to reflect actual domain setup timeline
- Verify and document actual mobile menu breakpoint from code

### Out of Scope

- Creating tasks.md file for 001 (optional, not critical for alignment)
- Modifying implementation code in src/ directory (documentation-only feature)
- Adding missing features to BaseLayout/Header/Footer (feature complete, only fixing docs)
- Changing constitution.md principles (document accurate compliance, don't change rules)
- Implementing new functional requirements (align docs with existing implementation only)
- Creating monitoring tools or dashboards (spec documents how to measure, doesn't build tools)

### Future Enhancements

- **Automated spec validation script**: Create tool that compares spec claims against actual code implementation files
- **Requirement traceability matrix**: Build automated mapping of FR → code files → git commits
- **Documentation linting**: Add pre-commit hook checking for missing code references in FR requirements

## Assumptions *(optional)*

- **A-001**: Implementation in src/layouts/BaseLayout.astro, src/components/layout/Header.astro, src/components/layout/Footer.astro is correct and complete - documentation conforms to code, not vice versa
- **A-002**: No code changes are permitted in this feature - this is documentation-only alignment work
- **A-003**: Git commit history is accurate source of truth for dates and completion status
- **A-004**: Constitution.md principle I allows hybrid mode exception for /api/* routes (feature 005 already set precedent)
- **A-005**: Edge case behaviors documented reflect current implementation reality, not ideal/future behavior
- **A-006**: Monitoring tools mentioned (Chrome DevTools Lighthouse, Vercel Speed Insights, HTML validator) are already accessible to team
- **A-007**: Future enhancements (duplicate detection, retry logic) are out of scope and belong in separate feature specs
- **A-008**: Stakeholders (developers, QA, PM) prefer accurate documentation over preserving outdated requirements
- **A-009**: Base infrastructure is production-ready and deployed (zhulova.com) - no missing implementation to document

## Dependencies *(optional)*

- **D-001**: Access to implementation files: src/layouts/BaseLayout.astro, src/components/layout/Header.astro, src/components/layout/Footer.astro, src/components/layout/MobileMenu.tsx
- **D-002**: Access to configuration files: tailwind.config.mjs, astro.config.mjs, src/styles/global.css
- **D-003**: Access to existing spec documentation in specs/001-base-infrastructure/ (spec.md, plan.md, research.md, data-model.md, quickstart.md)
- **D-004**: Access to git history to verify completion dates and commit timeline
- **D-005**: Access to CLAUDE.md to verify project documentation accuracy

## Constraints *(optional)*

- **Documentation-only changes**: MUST NOT modify implementation code in src/ directory (BaseLayout.astro, Header.astro, Footer.astro, MobileMenu.tsx)
- **Preserve git history**: MUST NOT rewrite commits, amend messages, or alter existing git log (documentation references commits as-is)
- **Constitution authority**: Constitution.md principles are non-negotiable - cannot claim compliance if implementation violates, must document accurate status
- **Single source of truth**: When spec.md, plan.md conflict with implementation, code is authoritative - update all documents to match
- **No retroactive planning**: Cannot change what was originally planned, only update documentation to reflect what was actually built
- **Backward compatibility**: Updated documentation must not break references from other features (002, 003 may reference 001 infrastructure)

## Open Questions *(optional)*

None - all implementation is complete and correct; documentation alignment has clear remediation path based on actual code.
