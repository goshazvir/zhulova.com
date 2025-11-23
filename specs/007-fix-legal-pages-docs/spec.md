# Feature Specification: Fix Legal Pages Documentation Alignment

**Feature Branch**: `007-fix-legal-pages-docs`
**Created**: 2025-11-23
**Status**: Completed (2025-11-23)
**Input**: User description: "Fix 004-legal-pages documentation to align with actual implementation. Analysis revealed 14 inconsistencies: (CRITICAL) Constitution violation - plan claims output:'static' but codebase uses 'hybrid' mode; Missing table of contents (spec requires FR-024, tasks T003/T010 specify, but not implemented); Section count mismatch - spec requires 16 privacy + 20 terms sections, implementation has 10 + 10 sections. (HIGH) Status outdated - spec shows 'Draft' but feature completed 2025-11-17; Ambiguous requirements - 'minimal luxury aesthetic' has no measurable criteria. (MEDIUM) Duplicate requirements FR-004/FR-009, terminology drift for variant naming, missing validation tasks. Goal: Update spec.md, plan.md, tasks.md, research.md to accurately document what was built (10-section conversational format) OR identify missing implementation work. Documentation-only feature, no code changes unless adding TOC or sections."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Debugging with Accurate Documentation (Priority: P1) 🎯 MVP

A developer needs to understand how legal pages were implemented to debug an issue or add a new feature. They consult the spec documentation to understand the architecture and requirements, but find that the documented requirements don't match the actual code.

**Why this priority**: Critical blocker for development work. Inaccurate documentation causes developers to waste time investigating discrepancies, implement features based on wrong assumptions, and introduce bugs. The constitution violation (claiming static mode when hybrid is used) could lead to architectural mistakes.

**Independent Test**: Can be fully tested by reading spec.md, plan.md, and comparing statements against actual implementation in src/pages/privacy-policy.astro, src/pages/terms.astro, and astro.config.mjs. Verify all claims in documentation match code reality.

**Acceptance Scenarios**:

1. **Given** developer reads plan.md constitution check, **When** they verify astro.config.mjs output mode, **Then** documentation states "hybrid mode for API routes only, legal pages remain static" matching actual configuration
2. **Given** developer reads spec.md FR-024 requiring table of contents, **When** they open privacy-policy.astro, **Then** spec either documents TOC implementation OR explicitly states TOC was descoped (no mismatch)
3. **Given** developer reads spec.md FR-003 stating 16 privacy sections required, **When** they count sections in privacy-policy.astro, **Then** spec states "10-section conversational format" matching implementation
4. **Given** developer reads tasks.md T003 "Implement table of contents", **When** they check implementation, **Then** task is marked as completed with note "Descoped - simple scroll navigation used" OR TOC exists in code

---

### User Story 2 - QA Creating Test Plan from Spec (Priority: P1) 🎯 MVP

A QA engineer creates test cases for legal pages based on spec.md requirements. They write tests to verify "minimal luxury aesthetic" (FR-005, FR-010) but cannot define pass/fail criteria because the requirement is vague. They also test for table of contents (FR-024) which doesn't exist in implementation.

**Why this priority**: Ambiguous requirements block QA from creating actionable test plans. Untestable requirements like "minimal luxury aesthetic" lead to subjective testing and missed bugs. Documented features that don't exist cause wasted QA time and false negatives.

**Independent Test**: Can be tested by extracting all functional requirements from spec.md, attempting to write objective test cases for each, and verifying against actual implementation. Requirements like FR-005 should have measurable criteria (typography, colors, spacing), FR-024 should match implementation reality.

**Acceptance Scenarios**:

1. **Given** QA reads FR-005 "minimal luxury aesthetic", **When** they create test case, **Then** requirement specifies measurable criteria: "Typography: Playfair Display headings, Inter body, navy/gold/sage colors, max-width 4xl, leading-relaxed"
2. **Given** QA reads FR-024 "table of contents for easy navigation", **When** they test privacy-policy page, **Then** spec matches reality: either TOC exists OR FR-024 removed and moved to "Out of Scope - simple scroll navigation"
3. **Given** QA reads FR-003 "16 mandatory sections", **When** they count sections, **Then** spec documents actual 10 sections with explanation: "Conversational format combines related sections for readability"
4. **Given** QA reads spec.md edge cases, **When** they create edge case tests, **Then** all edge cases have implementation answers (not just questions)

---

### User Story 3 - PM Measuring Success Criteria (Priority: P2)

A project manager reviews spec.md success criteria to measure feature completion. They see SC-008 "users report understanding their data rights after reading privacy policy" but this qualitative feedback was never collected. They also see spec status "Draft" but implementation was completed 2025-11-17.

**Why this priority**: Outdated success criteria prevent accurate project completion measurement. PM cannot report feature status or measure actual outcomes. Misaligned metrics cause confusion about what "done" means.

**Independent Test**: Can be tested by reviewing all success criteria (SC-001 to SC-010), checking if each has a measurement method, and verifying spec status matches git history (commit d7b17fd shows completion date 2025-11-17).

**Acceptance Scenarios**:

1. **Given** PM reads spec.md status field, **When** they check git log, **Then** status shows "Completed (2025-11-17)" matching actual commit date
2. **Given** PM reviews SC-001 to SC-010, **When** they check if metrics were collected, **Then** spec includes "Monitoring & Verification" section explaining how each criterion is measured
3. **Given** PM reads SC-008 about user feedback, **When** they check implementation, **Then** criterion is marked "Future Enhancement" OR measurement method is documented
4. **Given** PM reads success criteria, **When** they verify technology-agnosticism, **Then** all criteria avoid implementation details (no "Astro pages", "React components" mentions)

---

### User Story 4 - Technical Writer Maintaining Consistent Terminology (Priority: P2)

A technical writer updates legal pages documentation and notices terminology drift: spec mentions "Header/Footer with legal navigation variant" but doesn't define what "legal variant" means functionally in requirements. Footer.astro uses `variant='main'|'legal'` but spec FR sections don't document this behavior.

**Why this priority**: Inconsistent terminology causes confusion and makes documentation harder to maintain. Undefined variants lead to implementation guesswork. Duplicate requirements (FR-004/FR-009 both state responsive viewport specifications) bloat spec unnecessarily.

**Independent Test**: Can be tested by searching spec.md for terminology patterns (variant, responsive, styling), identifying duplicates, and verifying all component behaviors are documented in functional requirements.

**Acceptance Scenarios**:

1. **Given** writer searches spec.md for "variant", **When** they check functional requirements, **Then** new FR-025 documents: "Legal pages MUST use Header variant='legal' (simplified menu: Home, Privacy, Terms) and Footer variant='legal' (no CTA section)"
2. **Given** writer reads FR-004 and FR-009, **When** they compare text, **Then** duplicate responsive requirements are consolidated: FR-004 becomes "Both legal pages MUST be responsive...", FR-009 removed
3. **Given** writer reviews FR-005 and FR-010, **When** they check for duplication, **Then** duplicate "consistent styling" requirements are merged into single FR with measurable criteria
4. **Given** writer validates terminology, **When** they search for inconsistencies, **Then** zero instances of undefined terms or unexplained component behaviors

---

### User Story 5 - Architect Reviewing Constitution Compliance (Priority: P3)

An architect reviews plan.md constitution check to verify feature complies with project principles. They find plan claims `output: 'static'` but actual codebase uses `output: 'hybrid'` mode (confirmed in CLAUDE.md and astro.config.mjs). This violates constitution principle "Zero SSR or hybrid output modes".

**Why this priority**: Constitution violations risk architectural integrity of entire project. If plan incorrectly claims static mode compliance, future features might make same mistake. However, hybrid mode is acceptable for API routes only (serverless functions) - constitution just needs clarification.

**Independent Test**: Can be tested by reading plan.md constitution check section, verifying astro.config.mjs configuration, checking constitution.md rules, and confirming legal pages are actually static (not SSR).

**Acceptance Scenarios**:

1. **Given** architect reads plan.md constitution check, **When** they verify astro.config.mjs, **Then** plan states: "Hybrid mode permitted exclusively for /api/* routes; all pages remain static"
2. **Given** architect checks constitution.md principle I, **When** they review prohibited items, **Then** constitution includes exception: "Hybrid mode allowed when ALL pages are static and ONLY /api/* routes use serverless functions"
3. **Given** architect validates legal pages, **When** they check build output, **Then** privacy-policy.astro and terms.astro are pre-rendered at build time (not SSR)
4. **Given** architect reviews compliance, **When** they check all 6 constitution principles, **Then** plan.md accurately reflects compliance status with proper justifications

---

### Edge Cases

- **What happens if spec claims feature exists but implementation doesn't have it?** → Document as "Descoped" in Out of Scope section with rationale, OR create implementation task to add missing feature
- **How does system handle ambiguous requirements like "minimal luxury aesthetic"?** → Replace with measurable criteria (typography, colors, spacing) that QA can verify objectively
- **What happens when multiple spec documents conflict (spec.md requires 16 sections, research.md says 16 sections, but implementation has 10)?** → Choose one source of truth (implementation), update all documents to match, document rationale in spec.md notes
- **How does documentation reflect evolution from planning to implementation?** → Spec shows final "as-built" state, plan.md notes any deviations from original design, tasks.md marks completed/descoped status
- **What happens when constitution principle is violated in plan but implementation is actually compliant?** → Update plan.md to accurately describe architecture (e.g., "hybrid for API only"), clarify constitution exception
- **How does spec handle requirements that are partially implemented?** → Split into "Implemented" (with actual behavior) and "Future Enhancements" (with descoped features)

## Requirements *(mandatory)*

### Functional Requirements

**Critical Issue Fixes:**

- **FR-001**: plan.md constitution check section MUST state "Hybrid mode permitted exclusively for /api/* serverless functions; all pages including legal pages remain pre-rendered static" to match actual astro.config.mjs configuration
- **FR-002**: spec.md FR-024 table of contents requirement MUST either document actual TOC implementation in privacy-policy.astro and terms.astro OR be removed and moved to "Out of Scope" section with note "Simple scroll navigation used instead of TOC"
- **FR-003**: spec.md FR-003 MUST state "Privacy policy MUST include 10 conversational sections combining related topics for readability" instead of claiming 16 mandatory sections (actual implementation: 10 sections)
- **FR-004**: spec.md FR-008 MUST state "Terms & conditions MUST include 10 conversational sections covering all required legal topics" instead of claiming 20 mandatory sections (actual implementation: 10 sections)
- **FR-005**: research.md privacy policy sections MUST document actual 10-section structure with rationale: "Conversational format combines Ukrainian Law 2297-VI + GDPR requirements into 10 readable sections instead of formal 16-section structure"
- **FR-006**: research.md terms & conditions sections MUST document actual 10-section structure with rationale: "User-friendly format combines Ukrainian consumer protection law requirements into 10 accessible sections"

**High Priority Issue Fixes:**

- **FR-007**: spec.md status field MUST show "Completed (2025-11-17)" instead of "Draft" to reflect actual completion date from git commit d7b17fd
- **FR-008**: spec.md FR-005 and FR-010 "minimal luxury aesthetic" MUST be replaced with measurable criteria: "Typography: Playfair Display headings (font-serif), Inter body text (font-sans); Colors: navy-900/gold-500/sage-50 palette; Layout: max-width 4xl, leading-relaxed line height"
- **FR-009**: tasks.md T003 and T010 "Implement table of contents" MUST either show completion evidence OR be marked with note: "Descoped - simple scroll navigation used, no TOC anchor links implemented"
- **FR-010**: spec.md edge case "How does layout handle missing translations?" MUST include implementation answer: "If content file missing, Astro build fails (static generation error); if text empty, page renders with layout but no content body"
- **FR-011**: spec.md MUST add "Monitoring & Verification" section documenting how to measure each success criterion (SC-001 to SC-010) with specific tools and methods

**Medium Priority Issue Fixes:**

- **FR-012**: spec.md FR-004 and FR-009 duplicate responsive requirements MUST be consolidated: FR-004 becomes "Both legal pages MUST be responsive on mobile (375px), tablet (768px), desktop (1920px+)", FR-009 removed
- **FR-013**: spec.md MUST add new requirement FR-025: "Legal pages MUST use Header variant='legal' (simplified menu: Home, Privacy, Terms) and Footer variant='legal' (no CTA section)" to document actual component behavior
- **FR-014**: tasks.md MUST add validation task: "Validate all documented sections are present in privacy-policy.astro and terms.astro against updated FR-003 and FR-008 requirements"
- **FR-015**: spec.md FR-023 "Last Updated date" MUST specify format: "MUST use Ukrainian locale format: 'Останнє оновлення: 17 листопада 2025 р.'"

**Low Priority Issue Fixes:**

- **FR-016**: spec.md FR-001 to FR-003 wording MUST be standardized: all start with "Privacy policy page MUST..." for consistency (currently FR-001 says "System MUST provide route")
- **FR-017**: tasks.md task descriptions MUST be concise: T002 simplified to "Add Ukrainian privacy policy content with 10 sections per updated research.md" (remove 150+ character section list from parentheses)

**Coverage and Validation:**

- **FR-018**: All 24 functional requirements (FR-001 to FR-024) MUST have corresponding task in tasks.md OR be marked in "Out of Scope" section with rationale
- **FR-019**: All tasks in tasks.md (T001-T021) MUST map to at least one functional requirement OR user story from spec.md
- **FR-020**: spec.md success criteria (SC-001 to SC-010) MUST be technology-agnostic: zero mentions of "Astro", "React", "Tailwind", or other implementation details
- **FR-021**: All [NEEDS CLARIFICATION] markers in spec.md MUST be resolved with concrete answers OR removed if no longer applicable

### Key Entities

- **Documentation Artifact**: Represents a specification document (spec.md, plan.md, tasks.md, research.md)
  - Attributes: filePath (string), lastUpdated (date), status (Draft|Completed), requirementCount (number), issueCount (number)
  - Relationships: References other documentation artifacts (plan references spec, tasks references plan)
  - Lifecycle: Created during planning, updated during implementation, finalized after deployment

- **Documentation Issue**: Represents a discrepancy between spec and implementation
  - Attributes: issueId (string), category (Constitutional|Content|Ambiguity|Coverage), severity (Critical|High|Medium|Low), location (file path + line number), summary (string), recommendation (string)
  - Relationships: Linked to functional requirement fix (FR-001 to FR-021)
  - Lifecycle: Identified during analysis, resolved via documentation update, verified via testing

- **Functional Requirement**: Represents a documented capability or constraint
  - Attributes: requirementId (string, e.g., FR-003), description (string), implementation status (Implemented|Partial|Not Implemented), source (spec.md line number)
  - Relationships: Maps to tasks (one FR → many tasks), validates against implementation (code files)
  - Lifecycle: Defined in spec, validated against implementation, updated when misaligned

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of critical issues (C1-C3) are resolved - plan.md shows accurate hybrid mode explanation, spec.md documents actual 10-section format, FR-024 removed OR TOC implemented
- **SC-002**: 100% of high priority issues (H1-H5) are resolved - spec status updated to Completed, "minimal luxury aesthetic" replaced with measurable criteria, edge cases have implementation answers
- **SC-003**: Zero duplicate requirements - FR-004/FR-009 consolidated, FR-005/FR-010 merged, no verbatim repetition across functional requirements
- **SC-004**: All 24 functional requirements have at least one corresponding task OR documented in "Out of Scope" section - coverage tracking shows 100% mapping
- **SC-005**: All success criteria (SC-001 to SC-010) have documented measurement methods in "Monitoring & Verification" section with specific tools and locations
- **SC-006**: Constitution compliance accurately documented - plan.md constitution check reflects actual hybrid mode usage with proper justification for API routes
- **SC-007**: Spec status reflects reality - "Completed (2025-11-17)" matches git commit d7b17fd completion date
- **SC-008**: All implementation claims are verifiable - developer can verify every statement in spec.md by reading corresponding code files (no false documentation)
- **SC-009**: All ambiguous requirements replaced with testable criteria - QA can create objective test cases for 100% of functional requirements
- **SC-010**: Terminology consistency achieved - zero undefined terms, all component behaviors documented in functional requirements, variant usage explained

## Scope *(optional)*

### In Scope

- Update spec.md to document actual 10-section conversational format (not 16+20 sections)
- Fix plan.md constitution check to acknowledge hybrid mode for API routes
- Consolidate duplicate requirements (FR-004/FR-009, FR-005/FR-010)
- Replace ambiguous "minimal luxury aesthetic" with measurable typography/color criteria
- Update spec.md status to "Completed (2025-11-17)"
- Add FR-025 documenting Header/Footer variant behavior
- Document edge case implementation answers
- Add "Monitoring & Verification" section for success criteria
- Update tasks.md to reflect descoped TOC or mark as completed
- Standardize requirement wording for consistency
- Update research.md to match actual 10-section implementation

### Out of Scope

- Implementing table of contents in privacy-policy.astro and terms.astro (code change, not documentation fix)
- Adding missing 6 privacy sections or 10 terms sections to meet original 16+20 requirement (implementation work, not documentation)
- Changing constitution.md to prohibit hybrid mode entirely (too broad, affects other features like 005-fix-consultation-api)
- Creating new legal content (feature complete, only fixing documentation accuracy)
- Updating git commit messages or history (documentation references commits as-is)
- Implementing missing validation tasks (documentation describes what should exist, doesn't execute tasks)
- Creating monitoring tools or dashboards (spec documents how to measure, doesn't build tools)

### Future Enhancements

- **Automated spec validation**: Create script that compares spec claims against actual code implementation
- **Requirement traceability matrix**: Build tool that automatically maps FR → tasks → code files
- **Documentation linting**: Add pre-commit hook that checks for ambiguous words ("minimal", "scalable", "fast") in requirements
- **Spec version control**: Track spec.md changes alongside code commits to show evolution

## Assumptions *(optional)*

- **A-001**: Analysis report from `/speckit.analyze` is accurate and complete (14 issues identified are valid)
- **A-002**: Implementation in src/pages/privacy-policy.astro and src/pages/terms.astro is correct and should not be changed (documentation conforms to code, not vice versa)
- **A-003**: 10-section conversational format was intentional design decision, not incomplete implementation (commits show deliberate structuring)
- **A-004**: Legal compliance is maintained with 10 sections (research.md will document how conversational format meets Ukrainian Law 2297-VI + GDPR)
- **A-005**: Constitution.md principle I allows hybrid mode exception for API routes (feature 005 already set precedent)
- **A-006**: Table of contents was descoped during implementation due to short page length (simple scroll navigation deemed sufficient)
- **A-007**: "Minimal luxury aesthetic" was placeholder wording during planning, real criteria are documented in design system (Tailwind config, CLAUDE.md)
- **A-008**: Git commit d7b17fd is final implementation (no subsequent changes to legal pages)
- **A-009**: Spec status "Draft" was never updated post-implementation (oversight, not intentional)
- **A-010**: All stakeholders (developers, QA, PM) prefer accurate documentation over preserving original requirements (alignment > consistency with outdated plan)

## Dependencies *(optional)*

- **D-001**: Access to existing spec documentation in specs/004-legal-pages/ (spec.md, plan.md, tasks.md, research.md, data-model.md)
- **D-002**: Access to implementation files: src/pages/privacy-policy.astro, src/pages/terms.astro, src/components/layout/Footer.astro, src/components/layout/Header.astro
- **D-003**: Access to constitution.md to verify principle I compliance rules
- **D-004**: Access to git history to confirm completion date (commit d7b17fd)
- **D-005**: Analysis report from `/speckit.analyze` command showing 14 identified issues with severity levels

## Constraints *(optional)*

- **Documentation-only changes**: MUST NOT modify implementation code (privacy-policy.astro, terms.astro, Footer.astro, Header.astro) unless explicitly adding descoped features
- **Preserve git history**: MUST NOT rewrite commits, amend messages, or alter existing git log (documentation references commits as-is)
- **Constitution authority**: Constitution.md principles are non-negotiable within documentation scope - cannot claim compliance if implementation violates, must document accurate status
- **Single source of truth**: When spec.md, plan.md, tasks.md, research.md conflict, implementation is authoritative - update all documents to match code
- **No retroactive planning**: Cannot change what was originally planned, only update documentation to reflect what was actually built
- **Backward compatibility**: Updated documentation must not break references from other features (e.g., if 005-fix-consultation-api references 004 spec)

## Open Questions *(optional)*

None - all issues identified in analysis have clear remediation paths. Implementation is complete and correct; documentation just needs alignment.
