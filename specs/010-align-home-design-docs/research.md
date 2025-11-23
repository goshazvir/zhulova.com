# Research: Align Home Design Refinement Documentation

**Feature**: 010-align-home-design-docs | **Date**: 2025-11-23 | **Phase**: 0 (Research)

## Overview

This document defines 10 technical decisions for aligning specs/003-home-design-refinement documentation with actual implementation completed 2025-11-17. Research focuses on establishing documentation standards, code reference formats, and validation processes.

## Research Method

**Approach**: Analysis of previous alignment features (008, 009) combined with feature 003 implementation review
- Reference pattern from 008-align-base-infra-docs and 009-align-home-page-docs
- Read specs/003-home-design-refinement/PROGRESS.md for completion evidence
- Review implementation files: StatsSection.astro, Footer.astro, CaseStudiesSection.astro, QuestionsSection.astro, TestimonialsSection.astro
- Check git log for PR history (#9, #10, #11) and commit SHAs
- Analyze spec.md current state (30 FRs, 6 edge cases, 10 SCs)

**Timeline**: Feature 003 completed 2025-11-17, deployed to zhulova.com same date

---

## Technical Decisions

### R1: Code Reference Format

**Decision**: Use `(file.ext:line-range description)` format inline after functional requirements

**Chosen Format**:
```markdown
- **FR-001**: Component MUST display statistical metrics in 2x2 grid layout. *(StatsSection.astro:45-62 - Grid container with responsive columns)*
```

**Rationale**:
- Consistent with features 008 and 009 alignment patterns
- Inline placement keeps code reference close to requirement text
- File:line format is clickable in most IDEs and GitHub
- Description provides context without requiring file navigation
- Line ranges show scope of implementation (single line vs multi-line)

**Format Rules**:
1. Always use parentheses: `*(file.ext:lines)*`
2. Single line: `file.ext:42`
3. Line range: `file.ext:45-62`
4. Add hyphen separator before description: `- Grid container...`
5. Keep description concise (5-10 words max)

**Alternatives Considered**:
- **Option A**: GitHub-style URLs `[code](https://github.com/user/repo/blob/main/file.ext#L10-L20)`
  - **Rejected**: Too verbose, breaks with repository forks, requires full URL
- **Option B**: Function/section references `(StatsSection component - gridLayout function)`
  - **Rejected**: Less precise, functions may be refactored/renamed
- **Option C**: Separate "Code References" section at end of spec
  - **Rejected**: Developers need references inline for quick navigation

**Examples from Feature 003**:
- FR-001 (grid layout): `(StatsSection.astro:45-62 - Grid container with grid-cols-2)`
- FR-010 (footer CTA): `(Footer.astro:18-34 - ConsultationCTA section)`
- FR-020 (carousel scroll): `(CaseStudiesSection.astro:78-95 - Scroll-snap container)`

---

### R2: Edge Case Documentation Structure

**Decision**: Use Q&A format with 4 required fields: Question, Answer, Code, Behavior

**Chosen Format**:
```markdown
**Q1: How does StatsSection grid behave on very narrow mobile screens (<360px)?**
- **Answer**: Grid collapses to single column (grid-cols-1) below 360px breakpoint
- **Code**: `StatsSection.astro:48` - Responsive class `grid-cols-1 sm:grid-cols-2`
- **Behavior**: Stats stack vertically on very small devices, maintaining readability

**User Impact**: Users on iPhone SE or small Android devices see vertical layout instead of cramped 2-column grid
```

**Rationale**:
- Matches pattern from 008-align-base-infra-docs
- 4-field structure provides complete behavior documentation
- "User Impact" field explains real-world consequence
- Code references enable developers to verify behavior
- Q&A format makes edge cases searchable

**Required Fields**:
1. **Question**: Specific scenario phrased as "How does X behave when Y?"
2. **Answer**: Documented behavior based on code implementation
3. **Code**: File reference with line numbers
4. **Behavior**: Additional technical context (optional but recommended)
5. **User Impact**: End-user consequence (NEW - added for 010, improves on 008/009 pattern)

**Alternatives Considered**:
- **Option A**: Table format with columns: Scenario | Behavior | Code
  - **Rejected**: Less readable for complex multi-line behaviors
- **Option B**: Narrative paragraph format without structured fields
  - **Rejected**: Harder to scan, inconsistent structure across edge cases
- **Option C**: Only Question + Answer (no code references)
  - **Rejected**: Doesn't enable developer verification

**Edge Cases for Feature 003** (6 identified in spec.md):
1. Responsive breakpoints for grid layouts (StatsSection, QuestionsSection tabs)
2. Carousel navigation at boundaries (first/last case study)
3. Tab switching behavior when JavaScript disabled
4. White space rendering on ultra-wide screens (>1920px)
5. Footer height consistency across pages
6. Scroll-snap behavior with keyboard navigation

---

### R3: Measurement Method Specification

**Decision**: Document measurement methods with 3 components: Tool name, Metric, Step-by-step procedure

**Chosen Format**:
```markdown
### Monitoring & Verification

- **SC-001**: Lighthouse Performance Score ≥95
  - **Tool**: Chrome DevTools Lighthouse
  - **Metric**: Performance score (0-100 scale)
  - **Method**: Open DevTools → Lighthouse tab → Performance → Generate report → Verify score ≥95
  - **Threshold**: Pass if score ≥95, fail if <95

- **SC-005**: Visual hierarchy measured by contrast ratios
  - **Tool**: Chrome DevTools + axe DevTools
  - **Metric**: Color contrast ratio (WCAG AA standard ≥4.5:1 for text)
  - **Method**:
    1. Open DevTools → Elements → Select text element
    2. Check Computed → Color contrast ratio
    3. Run axe DevTools → Scan for contrast issues
    4. Verify all text meets ≥4.5:1 threshold
  - **Threshold**: Pass if all text ≥4.5:1, fail if any <4.5:1
```

**Rationale**:
- Detailed procedures enable QA engineers to create reliable test plans
- Tool + metric + method provides complete testing specification
- Threshold field makes pass/fail criteria explicit
- Step-by-step procedures reduce testing inconsistency
- Matches pattern from 009-align-home-page-docs

**Detail Level Rules**:
1. **Simple metrics** (Lighthouse scores): 1-line method sufficient
2. **Multi-step validations** (accessibility checks): Numbered procedure
3. **Manual testing** (responsive layouts): Include specific viewport sizes
4. **Performance metrics**: Include acceptable ranges (e.g., "LCP <2.5s")

**Alternatives Considered**:
- **Option A**: Generic "use appropriate tools" guidance
  - **Rejected**: Too vague, leads to inconsistent testing
- **Option B**: Tool name only, no procedures
  - **Rejected**: QA engineers need step-by-step instructions
- **Option C**: Automated test code snippets (e.g., Playwright scripts)
  - **Rejected**: Out of scope for spec documentation (belongs in test suite)

**Success Criteria for Feature 003** (10 measurement methods needed):
- SC-001: Lighthouse Performance ≥95
- SC-002: Lighthouse Accessibility ≥95
- SC-003: Lighthouse SEO ≥95
- SC-004: Core Web Vitals (LCP <2.5s, CLS <0.1, INP <200ms)
- SC-005: Visual hierarchy (contrast ratios ≥4.5:1)
- SC-006: Responsive layout validation (320px, 768px, 1440px viewports)
- SC-007: Component consistency (spacing, colors match design system)
- SC-008: Carousel navigation usability (3 case studies navigable)
- SC-009: Footer CTA visibility (100% viewport height coverage)
- SC-010: Testimonials social proof (3+ testimonials displayed)

---

### R4: User Feedback Integration Strategy

**Decision**: Integrate PROGRESS.md quotes inline within functional requirements descriptions as blockquotes

**Chosen Format**:
```markdown
#### FR-002: Footer Compact Redesign

**Requirement**: Footer MUST be redesigned to reduce vertical height by 40-50% while maintaining all content.

**User Feedback**:
> "отпад" - User approval after compact footer implementation (PROGRESS.md)

**Implementation**: Footer height reduced from 1100-1300px to 600-700px (~45% reduction). *(Footer.astro:1-210)*

**Impact**: Significantly improved page scroll experience, reduced need for excessive scrolling to reach footer content.
```

**Rationale**:
- User feedback placed immediately after requirement provides context
- Blockquote format visually distinguishes user quotes from technical descriptions
- Inline placement connects feedback to specific functional requirement
- Preserves original language (Russian quotes as-is) for authenticity
- Includes PROGRESS.md reference for traceability

**Integration Rules**:
1. Place user feedback between requirement and implementation sections
2. Use blockquote format: `> "quote text" - context (source)`
3. Preserve original language (don't translate Russian to English)
4. Include PROGRESS.md reference in parentheses
5. Only include feedback that directly relates to the FR

**Alternatives Considered**:
- **Option A**: Dedicated "User Feedback" section at end of spec
  - **Rejected**: Feedback disconnected from related requirements
- **Option B**: Footnotes with reference markers [1], [2]
  - **Rejected**: Requires jumping between sections, disrupts reading flow
- **Option C**: Translate Russian feedback to English
  - **Rejected**: Loses authenticity, original wording provides cultural context
- **Option D**: Separate user-feedback.md file
  - **Rejected**: Creates fragmentation, feedback should be in spec.md

**User Feedback from PROGRESS.md** (3+ quotes to integrate):
1. StatsSection: "отлично мне очень нравится" ✅
2. Footer: "отпад" ✅ (approval of compact redesign)
3. CaseStudiesSection: "да сейчас супер" ✅ (approval of carousel navigation)
4. Design iterations: "нет мне не нравится" → "отлично" (asymmetric grid rejection, final grid approval)

---

### R5: Design Rationale Placement

**Decision**: Document design rationale in plan.md "Design Decisions" section, NOT in research.md

**Chosen Approach**:
- **plan.md**: Add dedicated "Design Decisions" section after "Project Structure" section
- **research.md**: Reference design decisions but don't duplicate rationale
- **spec.md**: Reference design decisions in FR descriptions where relevant

**Rationale**:
- Plan.md is implementation planning document - appropriate place for architectural decisions
- Research.md is for technical alignment decisions (formats, processes) not feature design decisions
- Spec.md is user-facing - should describe WHAT, not WHY (design rationale is implementation detail)
- Separating concerns: spec (what) → plan (how/why) → research (alignment process)

**Design Rationale Location**:
```markdown
<!-- In plan.md, after Project Structure section -->

## Design Decisions

### D1: Results-First Approach (StatsSection)

**Decision**: Place statistical metrics (3,500+ hours, 200+ clients) at top of page

**Rationale**:
- User testing showed visitors want credibility proof before reading philosophy
- Metrics provide immediate trust signals
- Reduces bounce rate by front-loading social proof

**User Feedback**: "отлично мне очень нравится" (PROGRESS.md - StatsSection approval)

**Alternatives Considered**:
- Place stats after hero section → Rejected (delays credibility signals)
- Integrate stats into hero → Rejected (clutters hero messaging)
```

**Alternatives Considered**:
- **Option A**: Document design rationale in research.md
  - **Rejected**: Research.md is for alignment process decisions, not feature design decisions
- **Option B**: Create separate design-decisions.md file
  - **Rejected**: Adds unnecessary file, plan.md already serves this purpose
- **Option C**: Don't document design rationale anywhere
  - **Rejected**: Future developers/architects need context for architectural choices

**Design Decisions to Document in plan.md** (4 identified):
1. **D1: Results-First Approach** - StatsSection placement at top
2. **D2: Gold Vertical Line Pattern** - Minimal luxury visual accent
3. **D3: Compact Footer Redesign** - 45% height reduction strategy
4. **D4: Carousel vs Grid Navigation** - Horizontal scroll choice for case studies

---

### R6: Task Status Documentation

**Decision**: Use checkmark format with commit SHA reference: `✅ T005 - commit 2ef355c`

**Chosen Format**:
```markdown
### Implementation Tasks

#### Phase 2: Component Development (Completed 2025-11-17)

- ✅ **T005**: Implement StatsSection with 2x2 grid layout - `commit 2ef355c`
- ✅ **T006**: Redesign Footer with compact layout (45% height reduction) - `commit c9f87fb`
- ✅ **T007**: Implement CaseStudiesSection with carousel navigation - `commit a0cdc30`
- ✅ **T008**: Implement QuestionsSection with tab interface - `commit 9120e13`
- ✅ **T009**: Implement TestimonialsSection with background styling - `commit 1bfe29a`

#### Phase 3: Verification (In Progress)

- ⏳ **T010**: Lighthouse performance testing - Pending verification
- ⏳ **T011**: Accessibility validation (WCAG AA) - Pending verification
- ⏳ **T012**: Responsive layout testing (320px-1920px) - Pending verification
```

**Rationale**:
- Checkmark emoji (✅) provides clear visual completion indicator
- Commit SHA enables git history navigation: `git show 2ef355c`
- Hourglass emoji (⏳) indicates pending/in-progress tasks
- Task ID prefix (T005-T012) enables cross-referencing from spec.md
- Separating by phase shows implementation sequence

**Status Emoji Key**:
- ✅ Completed with git commit evidence
- ⏳ In progress or pending verification
- ❌ Blocked or failed (if applicable)
- 🔄 Rework required (if applicable)

**Alternatives Considered**:
- **Option A**: GitHub-style checkboxes `[x]` and `[ ]`
  - **Rejected**: Less visually distinctive than emoji
- **Option B**: Text status `COMPLETED (2ef355c)` or `PENDING`
  - **Rejected**: Less scannable, harder to quickly assess completion status
- **Option C**: Commit SHA only, no emoji
  - **Rejected**: Requires reading SHA to determine status (not scannable)
- **Option D**: Full git log format with date and author
  - **Rejected**: Too verbose, unnecessary detail for task tracking

**Tasks for Feature 003** (T005-T012 identified in plan.md):
- T005-T009: Core component implementations (all completed 2025-11-17)
- T010-T012: Verification tasks (status to be determined via git log analysis)

---

### R7: Line Number Precision

**Decision**: Use exact line ranges for implementation blocks; single lines acceptable for configuration or import statements

**Precision Rules**:
1. **Multi-line implementation blocks**: Exact range `file.ext:45-62`
   - Example: Component JSX template, function body, CSS block
2. **Single-line statements**: Single line `file.ext:42`
   - Example: Import statement, configuration value, type definition
3. **Approximate sections**: Acceptable for large blocks with comment markers
   - Example: `file.ext:100-150 (entire component)` when referencing whole component

**Rationale**:
- Exact line numbers enable precise IDE navigation (Cmd+G in most editors)
- Range precision shows implementation scope (small vs large changes)
- Single lines appropriate when statement is atomic
- Flexibility for large sections prevents excessive granularity

**Validation Process**:
1. Open implementation file
2. Navigate to line number
3. Verify content matches functional requirement description
4. If content doesn't match, update line numbers
5. Document in code reference description if line range is approximate

**Examples**:
- ✅ Good: `StatsSection.astro:45-62` (exact grid container implementation)
- ✅ Good: `Footer.astro:18` (single import statement)
- ✅ Acceptable: `CaseStudiesSection.astro:50-150 (carousel component)` (large block with context)
- ❌ Bad: `QuestionsSection.astro:~80` (tilde indicates uncertainty - must verify exact line)

**Alternatives Considered**:
- **Option A**: Always use approximate ranges with tilde `~80-100`
  - **Rejected**: Reduces navigation precision, harder to verify
- **Option B**: Function/method names instead of line numbers `getStats()`
  - **Rejected**: Functions may be renamed during refactoring
- **Option C**: Git blob URLs with line numbers (GitHub-specific)
  - **Rejected**: Breaks when repository is forked, requires internet access

---

### R8: Git History Analysis Approach

**Decision**: Use `git log --oneline --grep` to extract commit SHAs, cross-reference with PROGRESS.md for validation

**Chosen Method**:
```bash
# Step 1: Search git log for feature 003 commits
git log --oneline --all --grep="003" --grep="home-design" --grep="StatsSection" --grep="Footer" --grep="CaseStudies"

# Step 2: Identify PR merge commits
git log --oneline --merges --grep="003"

# Step 3: Cross-reference commit SHAs with PROGRESS.md
# Verify commits mentioned in PROGRESS.md match git log results

# Step 4: Extract commit SHAs for T005-T009
# Assign each commit to corresponding task based on commit message
```

**Rationale**:
- `git log --oneline` provides concise SHA + message format
- `--grep` enables keyword-based filtering for feature 003 commits
- `--merges` flag identifies PR merge commits (#9, #10, #11)
- PROGRESS.md cross-reference validates commit completeness
- Double-verification (git log + PROGRESS.md) prevents missing commits

**Validation Rules**:
1. Each commit SHA must be 7+ characters (short SHA format)
2. Commit message must clearly indicate which task (T005-T009) it implements
3. PROGRESS.md completion status must match git log evidence
4. PR merge commits (#9, #10, #11) should cover all tasks

**Alternatives Considered**:
- **Option A**: Manual GitHub web UI commit browsing
  - **Rejected**: Time-consuming, requires internet, hard to script/document
- **Option B**: `git blame` to attribute lines to commits
  - **Rejected**: Overly granular, doesn't show task-level completion
- **Option C**: Trust PROGRESS.md without git verification
  - **Rejected**: Risk of PROGRESS.md being outdated or incorrect
- **Option D**: `git log --since=2025-11-15 --until=2025-11-18`
  - **Considered**: Time-based filtering
  - **Rejected as primary**: May miss commits outside date range, less precise than keyword filtering

**Expected Commits** (based on PROGRESS.md):
- PR #9: StatsSection implementation
- PR #10: Footer compact redesign
- PR #11: CaseStudiesSection, QuestionsSection, TestimonialsSection

---

### R9: Verification Evidence Documentation

**Decision**: Mark pending verification tasks with ⏳ status and "Pending verification" note; document verification criteria explicitly

**Chosen Format**:
```markdown
#### Phase 3: Verification (In Progress)

- ⏳ **T010**: Lighthouse performance testing - Pending verification
  - **Criteria**: Performance score ≥95, LCP <2.5s, CLS <0.1
  - **Evidence Needed**: Lighthouse report screenshot or JSON export
  - **Blocked By**: None (can be run immediately)

- ⏳ **T011**: Accessibility validation (WCAG AA) - Pending verification
  - **Criteria**: Lighthouse Accessibility ≥95, zero axe violations
  - **Evidence Needed**: axe DevTools scan results
  - **Blocked By**: None (can be run immediately)

- ⏳ **T012**: Responsive layout testing - Pending verification
  - **Criteria**: No layout breaks at 320px, 768px, 1440px, 1920px
  - **Evidence Needed**: Manual testing checklist completion
  - **Blocked By**: None (can be run immediately)
```

**Rationale**:
- ⏳ emoji clearly indicates "not yet completed" status
- "Pending verification" phrase is searchable across all specs
- Explicit criteria defines what "done" means for verification tasks
- "Evidence Needed" field clarifies what documentation is required
- "Blocked By" field shows dependencies (if any)

**Rules for Pending Tasks**:
1. Never mark verification task as ✅ completed without evidence
2. Include verification criteria (what to test)
3. Document evidence requirement (screenshot, report, checklist)
4. Note blocking dependencies if task cannot be started
5. Add estimated effort if known (optional)

**Alternatives Considered**:
- **Option A**: Mark as completed and add "assumed verified" note
  - **Rejected**: Dishonest, creates technical debt if verification reveals issues
- **Option B**: Omit verification tasks from tasks.md entirely
  - **Rejected**: Verification is part of implementation, must be tracked
- **Option C**: Create separate "Future Work" section for pending tasks
  - **Rejected**: These aren't future work - they're incomplete current work
- **Option D**: Use ❓ emoji for "status unknown"
  - **Rejected**: Less clear than ⏳ which implies "in progress"

**Verification Tasks for Feature 003** (T010-T012):
- T010: Lighthouse performance testing
- T011: Accessibility validation (WCAG AA)
- T012: Responsive layout testing (320px-1920px)

**Evidence Collection Strategy**:
- If verification evidence exists: Update task to ✅ and reference evidence location
- If verification can be run: Execute verification, collect evidence, mark ✅
- If verification cannot be run: Keep ⏳ status, document blocker

---

### R10: Cross-Reference Validation

**Decision**: Manual spot-check validation for all code references; document validation checklist in research.md

**Validation Process**:
```markdown
### Code Reference Validation Checklist

For EACH code reference in spec.md:

1. **Open File**: Navigate to implementation file in IDE
2. **Go to Line**: Use Cmd+G (or Ctrl+G) to jump to exact line number
3. **Verify Content**: Confirm code at line number matches FR description
4. **Check Range**: If line range (e.g., 45-62), verify entire block is relevant
5. **Update if Wrong**: If line number incorrect, find correct line and update reference
6. **Document Drift**: If significant drift (>10 lines), note in validation log

### Validation Results

| FR | Code Reference | Status | Notes |
|----|----------------|--------|-------|
| FR-001 | StatsSection.astro:45-62 | ✅ Validated | Grid container implementation confirmed |
| FR-002 | Footer.astro:18-34 | ✅ Validated | CTA section confirmed |
| FR-003 | Footer.astro:50-120 | ⚠️ Drift | Actual range 55-125 (5-line drift, updated) |
| ... | ... | ... | ... |

### Validation Statistics
- Total code references: 30 (FR-001 to FR-030)
- Validated: 30/30 (100%)
- Corrections needed: 3/30 (10% drift rate)
- Average line drift: 2.3 lines
```

**Rationale**:
- Manual validation most reliable for ensuring accuracy
- Spot-checking catches line number drift from code edits
- Validation log documents corrections for transparency
- Checklist provides repeatable validation process
- Statistics show validation quality

**Validation Rules**:
1. **100% Coverage**: Validate ALL code references before marking spec complete
2. **Document Drift**: If line numbers incorrect, document in validation log
3. **Update References**: Immediately fix incorrect line numbers
4. **Accept Minor Drift**: ±2 lines acceptable if code still identifiable
5. **Flag Major Drift**: >10 lines may indicate wrong file or refactored code

**Alternatives Considered**:
- **Option A**: Automated link checking tool
  - **Rejected**: No tool exists for file:line format; would require custom script
- **Option B**: Trust line numbers without validation
  - **Rejected**: High risk of incorrect references if code was edited
- **Option C**: Use git blame to auto-generate references
  - **Rejected**: Overly complex, doesn't validate accuracy
- **Option D**: Periodic re-validation (quarterly)
  - **Rejected**: Validation should be done during initial documentation alignment

**Risk Mitigation**:
- **Risk**: Code changes after documentation alignment make references stale
- **Mitigation**: Add note in spec.md: "Code references accurate as of 2025-11-23; may drift with future edits"
- **Future Process**: Re-validate references when major refactoring occurs

**Validation Priority**:
1. **High Priority**: FR code references (30 items) - block spec completion
2. **Medium Priority**: Edge case code references (6 items)
3. **Low Priority**: Success criteria measurement tool references (10 items)

---

## Research Summary

**Total Decisions Documented**: 10/10 (100% complete)

**Key Findings**:
1. **Code Reference Format**: Inline `(file.ext:line-range description)` pattern from 008/009
2. **Edge Case Structure**: 5-field Q&A format (Question, Answer, Code, Behavior, User Impact)
3. **Measurement Methods**: 4-component format (Tool, Metric, Method, Threshold)
4. **User Feedback**: Inline blockquotes within FR descriptions, preserve Russian
5. **Design Rationale**: Document in plan.md "Design Decisions" section, not research.md
6. **Task Status**: Emoji format (✅ completed, ⏳ pending) with commit SHAs
7. **Line Number Precision**: Exact ranges for implementations, single lines for statements
8. **Git History**: Use `git log --oneline --grep` cross-referenced with PROGRESS.md
9. **Verification Evidence**: ⏳ status with explicit criteria, evidence requirements, blockers
10. **Cross-Reference Validation**: Manual spot-check with validation log, 100% coverage

**Implementation Strategy**:
- All 10 decisions provide actionable guidance for Phase 1 (data model) and implementation
- Validation processes documented for quality assurance
- Consistent pattern alignment with features 008 and 009

**Reference Materials**:
- `specs/008-align-base-infra-docs/research.md` - Edge case Q&A pattern
- `specs/009-align-home-page-docs/research.md` - Priority-based issue structure
- `specs/003-home-design-refinement/PROGRESS.md` - User feedback quotes
- Git log (PRs #9, #10, #11) - Commit SHA evidence

**Validation Method**: All decisions cross-referenced with 008/009 precedents and validated against feature 003 requirements

---

## Alternatives Considered

### Alternative 1: Create New Documentation Format (Not Follow 008/009)

**Considered**: Design custom format optimized specifically for feature 003

**Rejected Because**:
- Consistency across features is more valuable than optimization for single feature
- Developers expect same documentation structure across all specs
- Recreating patterns wastes time and increases learning curve
- 008/009 patterns proven successful (merged and validated)

### Alternative 2: Automated Code Reference Generation

**Considered**: Write script to auto-generate code references using AST parsing or grep

**Rejected Because**:
- Manual references provide better context (human-written descriptions)
- Automation risk: incorrect line attribution for complex components
- One-time documentation effort doesn't justify automation investment
- Manual validation required regardless, negating automation benefit

### Alternative 3: Skip User Feedback Integration

**Considered**: Document implementation without PROGRESS.md feedback quotes

**Rejected Because**:
- User feedback provides valuable context for design decisions
- Spec.md should explain WHY decisions were made, not just WHAT
- PROGRESS.md contains explicit user approvals/rejections worth preserving
- Future developers benefit from understanding user preferences

### Alternative 4: Combine research.md and data-model.md

**Considered**: Single file for both research decisions and data model entities

**Rejected Because**:
- Separation of concerns: research = process decisions, data-model = entity structures
- Spec-Kit methodology expects separate files for Phase 0 and Phase 1
- Consistency with 008/009 (both have separate research.md and data-model.md)

---

## Risk Assessment

### Low Risk Items

1. **Code Reference Line Drift**: Implementation files may be edited after documentation alignment
   - **Mitigation**: Add "as of 2025-11-23" timestamp, re-validate on major refactors
   - **Impact**: Minor - developers can grep for content if line numbers incorrect

2. **User Feedback Interpretation**: Russian quotes may be misinterpreted
   - **Mitigation**: Preserve original language, add context in parentheses
   - **Impact**: Low - quotes are short and context-appropriate

3. **Missing Commit SHAs**: Some tasks may not have explicit commit evidence
   - **Mitigation**: Use PR merge commits as fallback, reference PROGRESS.md completion dates
   - **Impact**: Low - task completion verifiable through deployed code

### Medium Risk Items

1. **Verification Task Status Uncertainty**: T010-T012 may or may not be completed
   - **Mitigation**: Check git log for verification evidence, mark ⏳ if none found
   - **Impact**: Medium - affects spec completion percentage, but doesn't block documentation alignment

2. **Design Rationale Completeness**: May miss important design decisions
   - **Mitigation**: Review PROGRESS.md thoroughly, cross-reference with git commit messages
   - **Impact**: Medium - missing rationale reduces architectural context but doesn't invalidate spec

### Resolved Questions

**Q: Should we translate Russian user feedback to English?**
**A**: No - preserve original language for authenticity. Add English context in parentheses if needed.

**Q: How precise should line number ranges be?**
**A**: Exact for implementations (±0 lines), approximate acceptable for large components (with note).

**Q: What if verification tasks (T010-T012) were never completed?**
**A**: Mark as ⏳ pending, document criteria, note "can be run immediately" - don't fabricate completion.

**Q: Should plan.md design decisions reference user feedback?**
**A**: Yes - each design decision should include user feedback quote if available from PROGRESS.md.

---

## Implementation Checklist

Based on research findings, the Phase 1 (data model + quickstart) and implementation phases must:

**Phase 1: Data Model & Quickstart**
- [ ] Create data-model.md with 4 entity definitions (Documentation Inconsistency, Design Decision, Code Reference, Measurement Method)
- [ ] Create quickstart.md with 9-step developer guide
- [ ] Update CLAUDE.md Recent Changes section with 010 feature entry
- [ ] Re-validate constitution check in plan.md (already complete, but verify)

**Implementation Phase: Spec Updates**
- [ ] Update specs/003-home-design-refinement/spec.md:
  - [ ] Change status from "Draft" to "Completed (2025-11-17)"
  - [ ] Add code references to FR-001 through FR-030 (30 items)
  - [ ] Convert 6 edge case questions to Q&A format with code references
  - [ ] Add "Monitoring & Verification" section with 10 SC measurement methods
  - [ ] Integrate 3+ user feedback quotes from PROGRESS.md
- [ ] Update specs/003-home-design-refinement/plan.md:
  - [ ] Add "Design Decisions" section with D1-D4 documented
  - [ ] Update constitution check if needed (verify static-first with hybrid mode)
- [ ] Update specs/003-home-design-refinement/tasks.md:
  - [ ] Mark T005-T009 completed with commit SHAs (✅)
  - [ ] Document T010-T012 verification status (⏳ or ✅ based on evidence)
  - [ ] Add validation checklist results

**Validation Phase**
- [ ] Run code reference validation checklist for all 30 FRs
- [ ] Document validation results in validation log
- [ ] Fix any incorrect line numbers discovered
- [ ] Verify all user feedback quotes accurate from PROGRESS.md
- [ ] Cross-check commit SHAs against git log

---

## Research Quality Metrics

- **Coverage**: 10/10 research decisions documented (100%)
- **Decisions Documented**:
  - R1: Code Reference Format ✅
  - R2: Edge Case Documentation Structure ✅
  - R3: Measurement Method Specification ✅
  - R4: User Feedback Integration Strategy ✅
  - R5: Design Rationale Placement ✅
  - R6: Task Status Documentation ✅
  - R7: Line Number Precision ✅
  - R8: Git History Analysis Approach ✅
  - R9: Verification Evidence Documentation ✅
  - R10: Cross-Reference Validation ✅
- **Alternatives Considered**: 4 major alternatives with rejection rationale
- **Validation Method**: Cross-reference with 008/009 alignment patterns + feature 003 implementation review
- **Stakeholder Impact**: Developers (FR code references), QA (SC measurement methods), PM (task completion tracking), Architect (design rationale), Technical Writer (consistent documentation format)

---

## Next Phase

Research phase complete. Ready for Phase 1:

1. ✅ **Phase 0 Complete**: All 10 technical decisions documented in research.md
2. **Next: Phase 1 - Data Model**: Create data-model.md with 4 entity definitions
3. **Next: Phase 1 - Quickstart**: Create quickstart.md with 9-step implementation guide
4. **Next: Phase 1 - Agent Context**: Update CLAUDE.md with feature 010 entry

All technical decisions resolved. Implementation phase can proceed with confidence. Zero NEEDS CLARIFICATION items remaining.
