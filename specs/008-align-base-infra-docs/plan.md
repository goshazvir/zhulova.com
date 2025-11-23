# Implementation Plan: Align Base Infrastructure Documentation

**Branch**: `008-align-base-infra-docs` | **Date**: 2025-11-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-align-base-infra-docs/spec.md`

## Summary

Documentation-only feature to align 001-base-infrastructure specification with actual implementation completed 2025-11-16. Fix 11 critical inconsistencies between spec documents (spec.md, plan.md) and deployed code (BaseLayout.astro, Header.astro, Footer.astro, tailwind.config.mjs). Primary changes: update status to "Completed", clarify constitution compliance for hybrid mode, document edge case answers, add code references to functional requirements, create monitoring verification section for success criteria. All changes are markdown edits - zero code modifications.

**Technical Approach**: Direct editing of markdown files in specs/001-base-infrastructure/ directory using text editor or IDE. Validate changes by cross-referencing implementation files in src/ directory. Use git log to verify dates. No build process, no testing framework - validation is manual comparison of documentation claims against actual code.

## Technical Context

**Language/Version**: Markdown (GitHub-flavored), English language
**Primary Dependencies**: None (plain text editing)
**Storage**: Git version control (files in `specs/001-base-infrastructure/`)
**Testing**: Manual verification - compare spec claims against implementation files
**Target Platform**: Documentation (markdown files rendered in GitHub)
**Project Type**: Documentation maintenance (not a software feature)
**Performance Goals**: N/A (documentation has no runtime performance)
**Constraints**: Must not modify implementation code in src/ directory
**Scale/Scope**: 2 files to update (spec.md, plan.md), ~15-20 edits total, affects 001-base-infrastructure docs only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Validation ✅

- ✅ **I. Static-First Delivery**: N/A - documentation-only feature, no code changes
- ✅ **II. Performance-First Development**: N/A - markdown editing has no performance impact
- ✅ **III. Simplicity Over Tooling**: N/A - using text editor only, no dependencies added
- ✅ **IV. Accessibility & SEO**: N/A - documentation maintenance, not user-facing feature
- ✅ **V. TypeScript Strict Mode**: N/A - no TypeScript code involved
- ✅ **VI. Design System Consistency**: N/A - no UI components modified

**Rationale**: This is a documentation-only feature. All constitution principles apply to code implementation, not to specification document maintenance. The feature ensures documentation accurately reflects implemented code that already passes constitution checks.

### Post-Phase 1 Validation ✅

- ✅ **No violations introduced**: Documentation edits do not affect code architecture, performance, or accessibility
- ✅ **Constitution authority preserved**: Updated docs will accurately reflect that base infrastructure (001) complies with all principles
- ✅ **Hybrid mode clarification**: plan.md will document that hybrid mode is acceptable when used exclusively for /api/* serverless functions

**Gate Status**: ✅ **PASSED** - No constitution violations. Documentation alignment work does not trigger any compliance concerns.

## Project Structure

### Documentation (this feature)

```text
specs/008-align-base-infra-docs/
├── spec.md              # Feature specification (COMPLETED)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0 output (PENDING)
├── data-model.md        # Phase 1 output (PENDING)
├── quickstart.md        # Phase 1 output (PENDING)
├── checklists/
│   └── requirements.md  # Spec quality checklist (COMPLETED)
└── tasks.md             # Phase 2 output from /speckit.tasks (NOT YET CREATED)
```

### Target Files (to be updated)

```text
specs/001-base-infrastructure/
├── spec.md              # UPDATE: status, edge cases, FRs, success criteria, assumptions
├── plan.md              # UPDATE: constitution check, assumptions
├── research.md          # READ ONLY: reference for decisions made
├── data-model.md        # READ ONLY: reference for validation rules
└── quickstart.md        # READ ONLY: reference for verification steps

CLAUDE.md                # UPDATE: fix creation date for 001 (2025-01-14 → 2025-11-14)
```

### Source Code (reference only - NO modifications)

```text
src/
├── layouts/
│   └── BaseLayout.astro         # REFERENCE: verify props interface, SEO meta tags
├── components/
│   └── layout/
│       ├── Header.astro          # REFERENCE: verify responsive breakpoints
│       ├── Footer.astro          # REFERENCE: verify social links handling
│       └── MobileMenu.tsx        # REFERENCE: verify mobile menu behavior
├── styles/
│   └── global.css                # REFERENCE: verify accessibility styles
└── stores/
    └── uiStore.ts                # REFERENCE: verify mobile menu state

# Configuration files (reference only)
tailwind.config.mjs               # REFERENCE: verify color palette, fonts, spacing
astro.config.mjs                  # REFERENCE: verify output mode (hybrid vs static)
```

**Structure Decision**: This is a documentation maintenance task. All work happens in specs/ directory. Source code in src/ is read-only for verification purposes - we validate documentation accuracy by comparing claims against actual implementation files.

## Complexity Tracking

> No violations - documentation-only feature has zero impact on code architecture or constitution compliance.

This feature aligns existing documentation with already-implemented code that passes all constitution checks. No new complexity introduced.

## Phase 0: Research & Analysis

**Objective**: Identify exact line numbers and content to update in spec.md and plan.md for 001-base-infrastructure

### Research Tasks

**R1: Analyze Current 001 Spec Status**
- Read specs/001-base-infrastructure/spec.md lines 1-10 (metadata section)
- Identify current status value (expected: "Draft")
- Find git commit date for 001 completion: `git log --grep="001-base-infrastructure" --oneline --date=short | head -5`
- **Output**: Actual completion date for status update

**R2: Analyze Edge Cases Section**
- Read specs/001-base-infrastructure/spec.md lines 103-108 (edge cases)
- Document all 6 unanswered questions
- For each question, read corresponding implementation file:
  - Q1 (BaseLayout without props) → src/layouts/BaseLayout.astro:7-12
  - Q2 (Header tablet navigation) → src/components/layout/Header.astro + MobileMenu.tsx
  - Q3 (Font fallback) → tailwind.config.mjs fonts section
  - Q4 (Mobile menu long labels) → src/components/layout/MobileMenu.tsx
  - Q5 (Footer without social links) → src/components/layout/Footer.astro
  - Q6 (Browser compatibility) → browserslist config or README
- **Output**: 6 edge case answers with code references (file:line)

**R3: Analyze Constitution Check in Plan**
- Read specs/001-base-infrastructure/plan.md lines 22-41 (constitution section)
- Read astro.config.mjs to verify actual output mode setting
- Compare plan claim ("Static-First: ✅ all components pre-rendered") with reality
- **Output**: Corrected constitution check text explaining hybrid mode exception

**R4: Analyze Functional Requirements Code References**
- Read specs/001-base-infrastructure/spec.md lines 114-134 (FR-001 to FR-020)
- For each FR, identify corresponding implementation file/line:
  - FR-001 (BaseLayout props) → BaseLayout.astro:7-12
  - FR-002 (HTML5 structure) → BaseLayout.astro:26-97
  - FR-003 (SEO meta tags) → BaseLayout.astro:36-66
  - FR-006 (Tailwind colors) → tailwind.config.mjs:colors
  - FR-007 (Tailwind fonts) → tailwind.config.mjs:fonts
  - FR-009 (Global CSS fonts) → src/styles/global.css:1-30
  - FR-010 to FR-015 (Header/Footer) → components/layout/*.astro
  - FR-016 to FR-020 (Accessibility) → src/styles/global.css
- **Output**: Code reference mapping for all 20 FRs

**R5: Analyze Success Criteria Measurement**
- Read specs/001-base-infrastructure/spec.md lines 148-158 (SC-001 to SC-010)
- For each success criterion, determine measurement tool:
  - SC-001, SC-002 (Lighthouse SEO/Accessibility) → Chrome DevTools Lighthouse
  - SC-003, SC-004 (Focus indicators, keyboard nav) → Manual testing + axe DevTools
  - SC-005 (Font loading CLS) → Vercel Speed Insights dashboard
  - SC-006 (Responsive Header/Footer) → Browser DevTools responsive mode
  - SC-007 (Color contrast) → WAVE or axe Accessibility Checker
  - SC-008 (prefers-reduced-motion) → Browser DevTools media query emulation
  - SC-009 (HTML validation) → W3C HTML Validator
  - SC-010 (Tailwind utilities) → Manual code inspection
- **Output**: Measurement method for each SC

**R6: Analyze CLAUDE.md Dates**
- Read CLAUDE.md "Recent Changes" section
- Find 001-base-infrastructure entry (expected: shows "2025-01-14")
- Verify correct date range from git log: `git log --all --date=short --format="%cd %s" | grep "001-base"`
- **Output**: Correct date range for CLAUDE.md update

**R7: Analyze Assumptions Accuracy**
- Read specs/001-base-infrastructure/spec.md lines 136-142 (Assumptions section)
- Verify each assumption against reality:
  - Navigation structure (compare with actual pages)
  - Site domain (check when zhulova.com was connected vs initial vercel subdomain)
  - OG default image path (verify /images/og-default.jpg exists)
  - Social media links (check if provided as config)
  - Browser support (verify browserslist or package.json)
  - Font loading (verify Google Fonts CDN usage)
- **Output**: Updated assumptions reflecting actual implementation timeline

## Phase 1: Data Model & Contracts

### Data Model

**Entities**: Documentation artifacts and their relationships to implementation files

**Entity: DocumentationArtifact**
- **Purpose**: Represents a specification document that describes implementation
- **Attributes**:
  - `filePath` (string): Absolute path to markdown file (e.g., "specs/001-base-infrastructure/spec.md")
  - `artifactType` (enum): "spec" | "plan" | "research" | "data-model" | "quickstart" | "tasks"
  - `status` (enum): "Draft" | "Completed (YYYY-MM-DD)" | "Outdated"
  - `lastUpdated` (date): ISO date of last modification
  - `requirementCount` (number): Total FR count in spec
  - `issueCount` (number): Number of identified alignment issues
- **Relationships**:
  - References ImplementationFile (many-to-many): Which code files implement this spec
  - Contains DocumentationIssue (one-to-many): Issues found during alignment analysis
- **Validation Rules**:
  - `filePath` must be valid file system path
  - `status` "Completed" must include date in format (YYYY-MM-DD)
  - `lastUpdated` must not be in future
  - `requirementCount` must match actual FR-### count in file
- **State Lifecycle**:
  - **Draft** → written but not implemented
  - **Completed (date)** → implementation finished and deployed
  - **Outdated** → implementation changed but docs not updated (red flag)

**Entity: DocumentationIssue**
- **Purpose**: Specific discrepancy between spec claim and actual implementation
- **Attributes**:
  - `issueId` (string): Unique ID (e.g., "C1", "H2", "M3")
  - `category` (enum): "Critical" | "High" | "Medium" | "Low"
  - `location` (string): File path + line number (e.g., "spec.md:5")
  - `problem` (string): What is incorrect (e.g., "Status shows 'Draft' but feature completed")
  - `actualBehavior` (string): What implementation actually does
  - `recommendation` (string): How to fix documentation
  - `codeReference` (string): Implementation file:line proving actual behavior
- **Relationships**:
  - BelongsTo DocumentationArtifact (many-to-one): Which spec has this issue
  - MapsTo FunctionalRequirement (many-to-one): Which FR needs updating
- **Validation Rules**:
  - `category` determines priority: Critical blocks developers, High blocks QA, Medium is tech debt
  - `location` must reference actual line number in file
  - `codeReference` must point to existing implementation file
- **State Lifecycle**:
  - **Identified** → found during analysis
  - **Resolved** → documentation updated to match implementation
  - **Verified** → manual check confirms documentation now accurate

**Entity: FunctionalRequirement**
- **Purpose**: Testable capability or constraint documented in spec.md
- **Attributes**:
  - `requirementId` (string): FR-### format (e.g., "FR-001", "FR-016")
  - `description` (string): What system must do (e.g., "BaseLayout MUST accept props for title, description")
  - `implementationStatus` (enum): "Implemented" | "Partial" | "Not Implemented"
  - `codeReference` (string): file:line where implemented (e.g., "BaseLayout.astro:7-12")
  - `verificationMethod` (string): How to test (e.g., "Inspect BaseLayout.astro Props interface")
- **Relationships**:
  - BelongsTo DocumentationArtifact (many-to-one): Which spec defines this requirement
  - ValidatedBy ImplementationFile (many-to-many): Code files implementing this requirement
  - HasIssues DocumentationIssue (one-to-many): Problems with this requirement's documentation
- **Validation Rules**:
  - `requirementId` must be unique within spec
  - `codeReference` required if implementationStatus is "Implemented"
  - `verificationMethod` must be concrete and actionable
- **State Lifecycle**:
  - **Defined** → written in spec during planning
  - **Implemented** → code exists matching requirement
  - **Documented** → code reference added to spec
  - **Verified** → manual check confirms code matches spec description

**Entity: ImplementationFile**
- **Purpose**: Source code file that implements documented requirements
- **Attributes**:
  - `filePath` (string): Relative path from repo root (e.g., "src/layouts/BaseLayout.astro")
  - `fileType` (enum): "component" | "layout" | "config" | "style" | "utility"
  - `primaryPurpose` (string): Main responsibility (e.g., "Provides base page structure with SEO meta tags")
  - `lineCount` (number): Total lines in file
- **Relationships**:
  - Implements FunctionalRequirement (many-to-many): Which FRs are realized in this file
  - ValidatesFor DocumentationArtifact (many-to-many): Which specs reference this file
- **Validation Rules**:
  - `filePath` must exist in repository
  - `fileType` inferred from path and extension
- **State Lifecycle**: N/A (implementation files are stable, only documentation changes)

### Validation Rules Summary

**Documentation Alignment Validation**:
1. Every FR in spec.md MUST have codeReference OR be in "Out of Scope" section
2. Every edge case question MUST have answer with code reference
3. Every success criterion MUST have measurement method documented
4. Status field MUST match git log completion date
5. Constitution check MUST accurately describe astro.config.mjs output mode
6. All dates (CLAUDE.md, spec.md, plan.md) MUST match git history

**Code Reference Format**:
- Pattern: `filename.ext:startLine-endLine` or `filename.ext:line`
- Example: "BaseLayout.astro:7-12", "tailwind.config.mjs:30"
- Must reference actual lines - validator can grep file to verify

### Contracts

**N/A** - This is a documentation maintenance feature with no API endpoints, no data exchange, no external integrations. All work is markdown file editing.

### Quickstart Guide

See `quickstart.md` (generated in Phase 1).

## Verification & Testing Strategy

**Manual Verification Process**:

1. **Status Accuracy Check**:
   ```bash
   # Verify completion date
   git log --grep="001-base-infrastructure" --oneline --date=short | head -1
   # Check spec.md:5 shows matching date
   head -10 specs/001-base-infrastructure/spec.md | grep "Status"
   ```

2. **Code Reference Validation**:
   ```bash
   # For each FR code reference, verify line exists
   grep -n "interface Props" src/layouts/BaseLayout.astro  # Should match FR-001 reference
   ```

3. **Edge Case Answer Verification**:
   ```bash
   # Verify each edge case answer matches actual code behavior
   cat src/layouts/BaseLayout.astro | head -20  # Check Props interface for Q1
   grep "md:flex" src/components/layout/Header.astro  # Check breakpoint for Q2
   ```

4. **Constitution Check Verification**:
   ```bash
   # Verify astro.config.mjs output mode
   grep "output:" astro.config.mjs  # Should show 'hybrid'
   # Check plan.md documents this correctly
   grep -A 5 "Static-First" specs/001-base-infrastructure/plan.md
   ```

5. **Success Criteria Measurement Verification**:
   - Run Lighthouse audit: Chrome DevTools → Lighthouse → Generate report
   - Check Vercel Speed Insights: https://vercel.com/dashboard → Speed Insights
   - Test keyboard navigation: Tab through page, verify focus indicators
   - Validate HTML: https://validator.w3.org/

**Acceptance Criteria**:
- ✅ All 14 FR requirements from spec.md have been addressed (status updated, edge cases answered, code references added, monitoring section created)
- ✅ Zero [NEEDS CLARIFICATION] markers remain in updated documentation
- ✅ All code references validate (lines exist in referenced files)
- ✅ All dates match git history (no inconsistencies)
- ✅ Constitution check accurately describes hybrid mode with /api/* clarification

## Rollout & Deployment

**Deployment**: N/A - documentation changes are immediately visible in Git repository once committed. No build process, no production deployment.

**Rollback Plan**: Git revert if documentation changes introduce errors or inaccuracies.

**Monitoring**: N/A - documentation has no runtime behavior to monitor.

## Post-Implementation

**Success Metrics** (from spec.md SC-001 to SC-010):
- Developer can read 001 spec and understand base infrastructure without finding contradictions
- QA can create test plan from updated spec with all requirements testable
- PM can verify feature completion using documented measurement methods
- Architect can confirm constitution compliance by reading plan.md
- Technical writer can maintain docs without finding duplicate requirements

**Follow-up Work**:
- Apply same alignment process to 002-home-page (feature 009)
- Apply same alignment process to 003-home-design-refinement (feature 010)
- Consider creating automated spec validation script (future enhancement)

## Dependencies & Risks

**Dependencies**:
- Access to specs/001-base-infrastructure/ directory (read/write)
- Access to src/ implementation files (read-only for verification)
- Git history access for date verification
- Text editor or IDE for markdown editing

**Risks**:
- **Low Risk**: Incorrect code reference (file:line points to wrong location)
  - Mitigation: Manual verification by opening each referenced file
- **Low Risk**: Missing an edge case question
  - Mitigation: Use grep to find all "?" in edge cases section
- **Low Risk**: Constitution check still inaccurate after update
  - Mitigation: Read astro.config.mjs to confirm actual output mode before writing

**Assumptions**:
- Implementation in src/ is correct (documentation conforms to code, not vice versa)
- Git commit history is accurate
- No concurrent edits to 001 spec by other developers
