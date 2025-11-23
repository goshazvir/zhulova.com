# Data Model: Align Home Design Refinement Documentation

**Feature**: 010-align-home-design-docs | **Date**: 2025-11-23 | **Phase**: 1 (Design)

## Overview

This document defines the structure of documentation entities modified during feature 010. This is a **documentation alignment feature** - the "data model" represents the structure of markdown specification files and their required content, NOT database schemas.

**Scope**: Aligning specs/003-home-design-refinement documentation with implementation completed 2025-11-17.

---

## Entity 1: Feature Specification Document (spec.md)

**File**: `specs/003-home-design-refinement/spec.md`

**Purpose**: Primary specification document describing feature requirements, user stories, success criteria for home page design refinement

**Fields**:

| Field Name | Type | Required | Validation Rules | Current Value | Target Value |
|------------|------|----------|------------------|---------------|--------------|
| title | string | Yes | Must be "Feature Specification: [Feature Name]" | ✅ "Feature Specification: Home Design Refinement" | (no change) |
| featureBranch | string | Yes | Must match git branch pattern: `###-feature-name` | ✅ "003-home-design-refinement" | (no change) |
| created | date | Yes | Must be ISO date format YYYY-MM-DD | ✅ "2025-11-15" | (no change) |
| status | enum | Yes | One of: "Draft", "Completed (YYYY-MM-DD)", "In Progress" | ❌ "Draft" | ✅ "Completed (2025-11-17)" |
| userScenarios | array | Yes | 1-10 user stories with acceptance scenarios | ✅ 5 user stories | (no change - already complete) |
| edgeCases | array | Yes | 4-10 edge case Q&A with code references | ❌ 6 questions without answers | ✅ 6 Q&A with Answer, Code, Behavior, User Impact |
| requirements | array | Yes | 10-30 functional requirements with code references | ❌ 30 FRs without code references | ✅ 30 FRs with code references (file.ext:line-range) |
| successCriteria | array | Yes | 5-15 measurable outcomes | ✅ 10 success criteria | (no change - already complete) |
| monitoringVerification | section | Yes | Measurement method for each success criterion | ❌ Missing section | ✅ Add section with 10 SC measurement methods |
| assumptions | array | Yes | 3-20 documented assumptions | ⚠️ 17 assumptions (may need updates) | ✅ Update assumptions to reflect design iterations |
| userFeedback | integration | Yes | PROGRESS.md quotes integrated into FRs | ❌ Not integrated | ✅ 3+ quotes integrated as blockquotes |

**Relationships**:
- **References** → Implementation files (StatsSection.astro, Footer.astro, CaseStudiesSection.astro, QuestionsSection.astro, TestimonialsSection.astro)
- **Referenced by** → plan.md (links to spec.md)
- **Validated by** → checklists/requirements.md
- **User Feedback Source** → PROGRESS.md

**State Transitions**:
```
Draft (current) → Completed (2025-11-17) (target)
```

**Validation Rules**:

1. **Status Update**: Change from "Draft" to "Completed (2025-11-17)" (based on PROGRESS.md completion date and git log)

2. **Code References Format**: All functional requirements MUST include code reference in format:
   ```markdown
   - **FR-001**: Component MUST display stats in 2x2 grid. *(StatsSection.astro:45-62 - Grid container)*
   ```

3. **Edge Cases Format**: Each edge case MUST use 5-field Q&A format:
   ```markdown
   **Q1: How does StatsSection grid behave on very narrow mobile screens (<360px)?**
   - **Answer**: Grid collapses to single column (grid-cols-1) below 360px breakpoint
   - **Code**: `StatsSection.astro:48` - Responsive class `grid-cols-1 sm:grid-cols-2`
   - **Behavior**: Stats stack vertically on very small devices, maintaining readability
   - **User Impact**: Users on iPhone SE or small Android devices see vertical layout instead of cramped 2-column grid
   ```

4. **Success Criteria Measurement**: Add "Monitoring & Verification" section after Success Criteria:
   ```markdown
   ### Monitoring & Verification

   - **SC-001**: Lighthouse Performance Score ≥95
     - **Tool**: Chrome DevTools Lighthouse
     - **Metric**: Performance score (0-100 scale)
     - **Method**: Open DevTools → Lighthouse tab → Performance → Generate report → Verify score ≥95
     - **Threshold**: Pass if score ≥95, fail if <95
   ```

5. **User Feedback Integration**: Integrate PROGRESS.md quotes as blockquotes after requirement description:
   ```markdown
   **User Feedback**:
   > "отлично мне очень нравится" - User approval after StatsSection implementation (PROGRESS.md)
   ```

6. **Assumption Updates**: Update assumptions to reflect:
   - User rejection of asymmetric grid design
   - AI-template feedback leading to final grid choice
   - Design iteration process (3 attempts to final approval)

**Inconsistencies to Fix** (6 identified):
1. Status shows "Draft" but feature completed 2025-11-17
2. 30 functional requirements lack code references
3. 6 edge cases have questions but no answers
4. No "Monitoring & Verification" section for 10 success criteria
5. User feedback from PROGRESS.md not integrated into spec
6. Assumptions don't reflect design iterations

---

## Entity 2: Implementation Plan Document (plan.md)

**File**: `specs/003-home-design-refinement/plan.md`

**Purpose**: Technical implementation plan with constitution compliance check and design rationale

**Fields**:

| Field Name | Type | Required | Validation Rules | Current Status | Target Status |
|------------|------|----------|------------------|----------------|---------------|
| title | string | Yes | Must be "Implementation Plan: [Feature Name]" | ✅ Present | (no change) |
| branch | string | Yes | Must match spec.md featureBranch | ✅ "003-home-design-refinement" | (no change) |
| date | date | Yes | Should match spec.md created date | ✅ Present | (verify consistency) |
| summary | string | Yes | 2-4 sentences describing approach | ✅ Present | (no change) |
| technicalContext | object | Yes | 9 required fields (Language, Dependencies, etc.) | ✅ Present | (verify accuracy) |
| constitutionCheck | object | Yes | Pre-Phase 0 validation for all 6 principles | ⚠️ May need clarification | ✅ Clarify hybrid mode if needed |
| projectStructure | object | Yes | Documentation + source code trees | ✅ Present | (no change) |
| designDecisions | section | **NEW** | Document design rationale for key choices | ❌ Missing | ✅ Add section with D1-D4 |

**Relationships**:
- **Links to** → spec.md
- **Validated by** → constitution.md
- **Informs** → tasks.md
- **References** → PROGRESS.md (for design iteration context)

**New Section: Design Decisions**

Must add dedicated section after "Project Structure" with 4 documented design decisions:

**D1: Results-First Approach (StatsSection Placement)**
- Decision: Place statistical metrics at top of page
- Rationale: User testing showed visitors want credibility proof before philosophy
- User Feedback: "отлично мне очень нравится" (PROGRESS.md)
- Alternatives: Stats after hero (rejected - delays credibility)
- Impact: Reduced bounce rate, immediate trust signals

**D2: Gold Vertical Line Pattern**
- Decision: Use gold vertical accent lines for minimal luxury aesthetic
- Rationale: Aligns with "Minimal Luxury Coach" design system
- User Feedback: Implicit approval in final designs
- Alternatives: Full gold backgrounds (rejected - too heavy)
- Impact: Sophisticated visual accent without overwhelming content

**D3: Compact Footer Redesign**
- Decision: Reduce footer height by 45% (1100-1300px → 600-700px)
- Rationale: Original footer too tall, excessive scrolling
- User Feedback: "отпад" (PROGRESS.md - strong approval)
- Alternatives: Keep original height (rejected by user)
- Impact: Significantly improved page scroll experience

**D4: Carousel vs Grid Navigation (CaseStudiesSection)**
- Decision: Horizontal scroll carousel with scroll-snap
- Rationale: Better mobile experience, focus on one case study at a time
- User Feedback: "да сейчас супер" (PROGRESS.md)
- Alternatives: Grid layout (considered but carousel chosen for storytelling flow)
- Impact: Improved mobile navigation, clearer case study presentation

**Validation Rules**:
1. **Constitution Compliance**: All 6 principles MUST have checkmark (✅) or justified exception
2. **Server Mode Clarification**: If constitution mentions hybrid mode, MUST explain pages remain static
3. **Design Decisions**: Each decision MUST have: Decision, Rationale, User Feedback (if available), Alternatives, Impact
4. **Date Consistency**: plan.md date should align with spec.md created date

---

## Entity 3: Tasks Document (tasks.md)

**File**: `specs/003-home-design-refinement/tasks.md`

**Purpose**: Task breakdown with completion status and commit references

**Fields**:

| Field Name | Type | Required | Validation Rules | Current Status | Target Status |
|------------|------|----------|------------------|----------------|---------------|
| taskList | array | Yes | 10-70 tasks organized by phase | ⚠️ Unknown (need to check) | ✅ T005-T009 marked completed |
| completedTasks | array | Yes | Tasks with ✅ status and commit SHA | ❌ Unknown (need verification) | ✅ 5 core tasks with commits |
| pendingTasks | array | Optional | Tasks with ⏳ status | ❌ Unknown (need verification) | ✅ T010-T012 documented |
| taskPhases | array | Yes | Logical grouping of related tasks | ✅ Should exist | (verify completeness) |

**Relationships**:
- **Implements** → spec.md functional requirements
- **Tracks** → Git commits (PRs #9, #10, #11)
- **References** → PROGRESS.md (for completion evidence)

**Task Status Format**:

```markdown
#### Phase 2: Component Development (Completed 2025-11-17)

- ✅ **T005**: Implement StatsSection with 2x2 grid layout - `commit 2ef355c`
- ✅ **T006**: Redesign Footer with compact layout (45% height reduction) - `commit c9f87fb`
- ✅ **T007**: Implement CaseStudiesSection with carousel navigation - `commit a0cdc30`
- ✅ **T008**: Implement QuestionsSection with tab interface - `commit 9120e13`
- ✅ **T009**: Implement TestimonialsSection with background styling - `commit 1bfe29a`

#### Phase 3: Verification (Status To Be Determined)

- ⏳ **T010**: Lighthouse performance testing - Pending verification
  - **Criteria**: Performance score ≥95, LCP <2.5s, CLS <0.1
  - **Evidence Needed**: Lighthouse report screenshot or JSON export

- ⏳ **T011**: Accessibility validation (WCAG AA) - Pending verification
  - **Criteria**: Lighthouse Accessibility ≥95, zero axe violations
  - **Evidence Needed**: axe DevTools scan results

- ⏳ **T012**: Responsive layout testing - Pending verification
  - **Criteria**: No layout breaks at 320px, 768px, 1440px, 1920px
  - **Evidence Needed**: Manual testing checklist completion
```

**Validation Rules**:
1. **Completed Task Format**: `✅ **T###**: Description - commit SHA`
2. **Pending Task Format**: `⏳ **T###**: Description - Pending verification` with criteria, evidence, blockers
3. **Commit SHA Extraction**: Use `git log --oneline --grep` to find exact commits for T005-T009
4. **Verification Status**: Determine T010-T012 status from git log (look for "test", "lighthouse", "accessibility" commits)

**Git History Analysis** (to extract commit SHAs):
```bash
# Method 1: Search by keyword
git log --oneline --all --grep="StatsSection" --grep="Footer" --grep="CaseStudies"

# Method 2: Search by PR merge
git log --oneline --merges --grep="003"

# Method 3: Date range filtering
git log --oneline --since="2025-11-15" --until="2025-11-18"
```

**Expected Commits** (from PROGRESS.md):
- PR #9: StatsSection implementation
- PR #10: Footer compact redesign
- PR #11: CaseStudiesSection, QuestionsSection, TestimonialsSection

---

## Entity 4: User Feedback Document (PROGRESS.md)

**File**: `specs/003-home-design-refinement/PROGRESS.md`

**Purpose**: Source of truth for user feedback quotes and completion evidence

**Fields**:

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| componentStatus | array | Yes | Completion status for each component | "✅ StatsSection - Complete" |
| userFeedback | array | Yes | Russian quotes from user | "отлично мне очень нравится" |
| completionEvidence | object | Yes | Metrics proving completion | "Footer height: 1100-1300px → 600-700px (~45% reduction)" |
| implementationDate | date | Yes | When feature completed | "2025-11-17" |

**Relationships**:
- **Feeds into** → spec.md (user feedback quotes)
- **Feeds into** → plan.md (design decisions rationale)
- **Feeds into** → tasks.md (completion evidence)

**User Feedback Quotes to Extract** (minimum 3):
1. **StatsSection**: "отлично мне очень нравится" ✅
2. **Footer**: "отпад" ✅ (approval of compact redesign)
3. **CaseStudiesSection**: "да сейчас супер" ✅
4. **Design iterations**: "нет мне не нравится" → "отлично" (asymmetric grid rejection → final grid approval)

**Completion Evidence to Reference**:
- 5/5 components completed (100%)
- Footer height reduction: ~45% (1100-1300px → 600-700px)
- Implementation date: 2025-11-17
- PRs merged: #9, #10, #11

**Validation Rules**:
1. **Quote Preservation**: User feedback MUST be quoted in original Russian, not translated
2. **Context Required**: Each quote MUST include context in parentheses: `(PROGRESS.md - StatsSection approval)`
3. **Completion Evidence**: Metrics (like footer height reduction) MUST be referenced in spec.md

---

## Entity 5: CLAUDE.md Recent Changes Entry

**File**: `CLAUDE.md` (root directory)

**Purpose**: Project-wide changelog documenting feature completion dates

**Fields**:

| Field Name | Type | Required | Validation Rules | Current Value | Target Value |
|------------|------|----------|------------------|---------------|--------------|
| featureName | string | Yes | Format: "###-feature-name" | ❓ (check if exists) | "003-home-design-refinement" |
| completionDate | date | Yes | Format: (YYYY-MM-DD) in parentheses | ❓ (check if exists) | "(2025-11-17)" |
| status | enum | Yes | One of: "✅ COMPLETED", "🚧 IN PROGRESS" | ❓ (check if exists) | "✅ COMPLETED" |
| description | string | Yes | 1-3 sentences summarizing implementation | ❓ (check if exists) | "Home page design refinement with 5 components redesigned" |
| technologies | array | Optional | List of tech stack used | ❓ (check if exists) | ["Astro 4.x", "React 18.x", "Tailwind CSS 3.x"] |

**Relationships**:
- **Validates** → spec.md status consistency
- **References** → All features in "Recent Changes" section

**Expected Entry Format**:
```markdown
- **003-home-design-refinement** (2025-11-17): ✅ **COMPLETED**
  - **Status**: 5/5 components redesigned (StatsSection, Footer, CaseStudiesSection, QuestionsSection, TestimonialsSection)
  - **Highlights**: Compact footer redesign (45% height reduction), carousel navigation for case studies, results-first approach with stats at top
  - **User Feedback**: "отлично мне очень нравится" (StatsSection), "отпад" (Footer), "да сейчас супер" (CaseStudies)
  - **PRs**: #9, #10, #11
```

**Validation Rules**:
1. **Date Consistency**: CLAUDE.md completion date MUST match spec.md status date and PROGRESS.md completion date
2. **Status Accuracy**: Entry MUST exist if feature completed and merged
3. **Technology List**: Should match technologies actually used in implementation

---

## Validation Rules Summary

### Documentation Alignment Validation Checklist

**Rule 1: Status Consistency Across All Files**
- spec.md status = "Completed (2025-11-17)"
- PROGRESS.md completion date = 2025-11-17
- CLAUDE.md entry date = (2025-11-17)
- Git merge commit date ≈ 2025-11-17

**Rule 2: Code Reference Completeness**
- All 30 functional requirements MUST have code references
- Format: `*(file.ext:line-range description)*`
- Validation: Open each file, verify line numbers match implementation

**Rule 3: Edge Case Answer Completeness**
- All 6 edge cases MUST have 5-field Q&A format
- Required fields: Question, Answer, Code, Behavior, User Impact
- No "TODO" or "NEEDS INVESTIGATION" markers allowed

**Rule 4: Success Criteria Measurement**
- All 10 success criteria MUST have measurement method in "Monitoring & Verification" section
- Required fields: Tool, Metric, Method, Threshold
- Methods must be actionable (step-by-step procedures)

**Rule 5: User Feedback Integration**
- Minimum 3 user feedback quotes from PROGRESS.md
- Quotes MUST be in original Russian with English context
- Format: `> "quote" - context (PROGRESS.md)`
- Placement: Inline within relevant functional requirement or design decision

**Rule 6: Task Completion Evidence**
- Tasks T005-T009 MUST have ✅ status with commit SHA
- Extract commit SHAs using: `git log --oneline --grep="003"`
- Cross-reference with PROGRESS.md and PR merge commits (#9, #10, #11)

**Rule 7: Design Rationale Documentation**
- plan.md MUST have "Design Decisions" section with D1-D4
- Each decision MUST have: Decision, Rationale, User Feedback, Alternatives, Impact
- Design decisions should reference PROGRESS.md user feedback where applicable

**Rule 8: Assumption Updates**
- Assumptions in spec.md MUST reflect design iterations
- Document user rejection of asymmetric grid
- Document AI-template feedback leading to final choice
- Update any assumptions invalidated during implementation

---

## Code Reference Format Specification

### Format Pattern

```markdown
*(filename.ext:startLine-endLine description)*
```

**OR**

```markdown
*(filename.ext:line description)*
```

### Examples

| Component | FR | Code Reference Example |
|-----------|----|-----------------------|
| StatsSection | FR-001 | `*(StatsSection.astro:45-62 - Grid container with grid-cols-2)*` |
| Footer | FR-010 | `*(Footer.astro:18-34 - ConsultationCTA section)*` |
| CaseStudiesSection | FR-020 | `*(CaseStudiesSection.astro:78-95 - Scroll-snap carousel container)*` |
| QuestionsSection | FR-025 | `*(QuestionsSection.astro:50-120 - Tab interface with gold underline)*` |
| TestimonialsSection | FR-028 | `*(TestimonialsSection.astro:30-80 - Background styling and card layout)*` |

### Validation Method

```bash
# Verify line range exists and content matches FR description
sed -n '45,62p' src/components/sections/StatsSection.astro

# Verify single line exists
sed -n '18p' src/components/sections/Footer.astro

# Count total lines (verify endLine ≤ total)
wc -l src/components/sections/CaseStudiesSection.astro
```

### Invalid Examples

| Invalid Format | Reason | Correct Format |
|----------------|--------|----------------|
| `StatsSection.astro` | No line number | `StatsSection.astro:45-62` |
| `src/components/sections/StatsSection.astro:45-62` | Full path | `StatsSection.astro:45-62` (component name sufficient) |
| `StatsSection:45` | Missing file extension | `StatsSection.astro:45` |
| `StatsSection.astro:~50` | Tilde indicates uncertainty | `StatsSection.astro:50` (verify exact line) |

---

## Entity Relationship Diagram

```
┌─────────────────────────┐
│   spec.md               │
│   (Feature Spec)        │
│   - Status: Draft       │
│   - 30 FRs (no refs)    │
│   - 6 edge cases (Qs)   │
└───────┬─────────────────┘
        │ references
        │ (30 FRs → 5 components)
        ▼
┌─────────────────────────┐      completed by      ┌─────────────────────┐
│  Implementation Files   │◄──────────────────────│   tasks.md          │
│  - StatsSection.astro   │                        │   - T005-T009 ✅    │
│  - Footer.astro         │                        │   - T010-T012 ⏳    │
│  - CaseStudiesSection   │                        └──────────┬──────────┘
│  - QuestionsSection     │                                   │
│  - TestimonialsSection  │                                   │ documented in
└───────┬─────────────────┘                                   │
        │ documented in                                       │
        │                                                     │
        ▼                                                     ▼
┌─────────────────────────┐                        ┌─────────────────────┐
│   plan.md               │                        │   PROGRESS.md       │
│   - Design Decisions    │◄───────────────────────│   - User Feedback   │
│   - D1: Results-First   │   informs design       │   - "отлично"       │
│   - D2: Gold Lines      │   rationale            │   - "отпад"         │
│   - D3: Compact Footer  │                        │   - "супер"         │
│   - D4: Carousel Nav    │                        │   - Completion      │
└─────────────────────────┘                        └─────────────────────┘
        │
        │ consistency check
        ▼
┌─────────────────────────┐
│   CLAUDE.md             │
│   - Recent Changes      │
│   - 003 entry           │
│   - Date: 2025-11-17    │
└─────────────────────────┘
```

**Explanation**:
1. **spec.md** references 5 implementation files (StatsSection, Footer, CaseStudiesSection, QuestionsSection, TestimonialsSection)
2. **tasks.md** tracks implementation completion with commit SHAs for T005-T009
3. **PROGRESS.md** provides user feedback quotes and completion evidence
4. **plan.md** documents design decisions informed by PROGRESS.md feedback
5. **CLAUDE.md** provides cross-project validation that feature completed

---

## Transformation Rules

### Markdown → Structured Data Extraction

**Extract User Feedback from PROGRESS.md**:
```bash
# Find all user feedback quotes (Russian text in quotes)
grep -E '"[а-яА-Я]+"' specs/003-home-design-refinement/PROGRESS.md

# Expected output:
# "отлично мне очень нравится"
# "отпад"
# "да сейчас супер"
# "нет мне не нравится"
```

**Extract Commit SHAs for Tasks**:
```bash
# Method 1: Search git log by grep
git log --oneline --all --grep="Stats" --grep="Footer" --grep="Case"

# Method 2: Find PR merge commits
git log --oneline --merges | grep -E "#9|#10|#11"

# Method 3: Date range for feature 003
git log --oneline --since="2025-11-15" --until="2025-11-18"
```

**Extract Functional Requirements from spec.md**:
```bash
# Find all FR-### patterns
grep -n "^\*\*FR-" specs/003-home-design-refinement/spec.md

# Count total FRs
grep -c "^\*\*FR-" specs/003-home-design-refinement/spec.md

# Expected: 30
```

**Validate Code Reference Format**:
```bash
# Find all code references in spec.md
grep -E '\*\([A-Za-z]+\.astro:[0-9]+-?[0-9]*' specs/003-home-design-refinement/spec.md

# Count code references
grep -cE '\*\([A-Za-z]+\.astro:[0-9]+-?[0-9]*' specs/003-home-design-refinement/spec.md

# Expected: 30 (one per FR)
```

---

## Non-Functional Considerations

### Performance

**N/A** - Documentation has no runtime performance. Markdown parsing is instant.

### Security

**N/A** - No sensitive data. All documentation is plain text versioned in Git.

### Scalability

**N/A** - Documentation size is bounded. Feature 003 spec is ~350 lines, alignment adds ~100-150 lines.

### Maintainability

**MEDIUM IMPORTANCE**: Documentation must remain synchronized with code.

**Strategy**:
- Code references (file:line) allow manual validation
- PROGRESS.md serves as completion audit trail
- Git commit SHAs provide implementation evidence
- User feedback quotes preserved for historical context

**Risk Mitigation**:
- Add timestamp in spec.md: "Code references accurate as of 2025-11-23"
- Re-validate references if components are refactored
- Use git log to detect when referenced files change significantly

---

## Testing Strategy

**No automated tests** - This is a documentation feature.

**Manual Verification**:
1. Read updated spec.md - verify all changes make sense
2. For each of 30 code references, open file and verify line numbers
3. Run git log to confirm commit SHAs for T005-T009
4. Compare spec claims against PROGRESS.md completion evidence
5. Verify user feedback quotes match PROGRESS.md exactly

**Validation Checklist**: See `quickstart.md` for step-by-step verification process.

---

## Glossary

| Term | Definition |
|------|------------|
| **Code Reference** | File:line pointer showing where requirement is implemented (e.g., `StatsSection.astro:45-62`) |
| **Design Decision** | Architectural choice documented in plan.md with rationale, user feedback, alternatives |
| **Edge Case** | Boundary condition or error scenario requiring documented Q&A answer |
| **Functional Requirement (FR)** | Testable capability documented in spec.md (FR-001, FR-002, etc.) |
| **Measurement Method** | Specific tool and procedure for validating success criterion (Tool + Metric + Method + Threshold) |
| **PROGRESS.md** | Implementation progress log with user feedback quotes and completion evidence |
| **Success Criterion (SC)** | Measurable outcome defining feature success (SC-001, SC-002, etc.) |
| **User Feedback** | Russian language quotes from user approving/rejecting design choices |

---

## Summary

This data model defines 5 documentation entities for feature 010:

1. **spec.md** - Feature specification (30 FRs need code references, 6 edge cases need answers, 10 SCs need measurement methods, status needs update to "Completed (2025-11-17)")
2. **plan.md** - Implementation plan (needs "Design Decisions" section with D1-D4 documented)
3. **tasks.md** - Task tracking (needs T005-T009 marked ✅ with commit SHAs, T010-T012 status documented)
4. **PROGRESS.md** - User feedback source (extract 3+ quotes, reference completion evidence)
5. **CLAUDE.md** - Project changelog (verify 003 entry exists with correct date)

**Key Validation Rules**:
- All 30 FRs need code references (file.ext:line-range format)
- All 6 edge cases need 5-field Q&A answers
- All 10 SCs need measurement methods (Tool, Metric, Method, Threshold)
- Status must match git history and PROGRESS.md (2025-11-17)
- User feedback integrated (minimum 3 quotes from PROGRESS.md)
- Design rationale documented (4 decisions in plan.md)
- Task completion tracked (commit SHAs for T005-T009)

**Next Step**: See `quickstart.md` for step-by-step implementation guide.
