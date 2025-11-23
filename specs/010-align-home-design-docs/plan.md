# Implementation Plan: Align Home Design Refinement Documentation

**Branch**: `010-align-home-design-docs` | **Date**: 2025-11-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-align-home-design-docs/spec.md`

## Summary

Align specs/003-home-design-refinement documentation with actual implementation completed on 2025-11-17. Update spec.md status from "Draft" to "Completed", add code references to 30 functional requirements pointing to implementation files (StatsSection.astro, Footer.astro, CaseStudiesSection.astro, QuestionsSection.astro, TestimonialsSection.astro), document 6 edge cases with answers, add measurement methods to 10 success criteria, integrate user feedback from PROGRESS.md, document design rationale in plan.md (Results-First approach, gold vertical line pattern, compact footer redesign, carousel navigation choice), update assumptions to reflect design iterations (user rejection of asymmetric grid, AI-template feedback), and mark tasks T005-T009 as completed with commit references while documenting T010-T012 verification status.

**Technical Approach**: Documentation alignment following GitHub Spec-Kit methodology established in features 008-align-base-infra-docs and 009-align-home-page-docs. Work involves reading implementation files to extract code references, reviewing PROGRESS.md for user feedback quotes, analyzing git history for commit SHAs, and manually editing markdown files to add missing documentation without changing any source code in src/ directory.

---

## Technical Context

**Language/Version**: Markdown (GitHub-Flavored Markdown), English language for all documentation
**Primary Dependencies**:
- Git 2.x (for commit history analysis and version control)
- Text editor (for markdown editing)
- GitHub Spec-Kit template system (`.specify/templates/`)
**Storage**: Plain text files in `specs/003-home-design-refinement/` and `specs/010-align-home-design-docs/` directories
**Testing**: Manual validation using quality checklists (`checklists/requirements.md`), cross-referencing with implementation files
**Target Platform**: GitHub repository documentation system
**Project Type**: Documentation alignment (no source code changes)
**Performance Goals**: N/A (documentation work, not runtime code)
**Constraints**:
- Zero code changes to `src/` directory (documentation-only feature)
- All code references must point to correct line numbers (verified manually)
- No [NEEDS CLARIFICATION] markers allowed in final spec (all 30 FRs must be concrete)
**Scale/Scope**:
- 1 feature to document (003-home-design-refinement)
- 5 components implemented (StatsSection, Footer, CaseStudiesSection, QuestionsSection, TestimonialsSection)
- 30 functional requirements needing code references
- 10 success criteria needing measurement methods
- 6 edge cases needing documentation
- 3 PRs to reference (#9, #10, #11)
- 5 commit SHAs to extract (T005-T009)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static-First Delivery ✅ **N/A (Documentation Only)**

This feature does not involve code implementation, only documentation updates. Constitution principle not applicable.

**Rationale**: Feature 010 is documentation alignment work - editing markdown files in specs/003-home-design-refinement/ to accurately reflect implementation completed in PRs #9, #10, #11. No changes to HTML, CSS, JavaScript, or static assets.

### II. Performance-First Development ✅ **N/A (Documentation Only)**

No impact on Core Web Vitals, Lighthouse scores, or performance budgets. Documentation files do not affect runtime performance.

**Rationale**: Markdown documentation consumed by developers/stakeholders during planning and maintenance, not served to end users. No performance implications.

### III. Simplicity Over Tooling ✅ **PASS**

- ✅ **Minimal Dependencies**: Uses only Git (version control) and text editor - no additional tooling required
- ✅ **No Build Step**: Documentation is plain markdown - no compilation, transpilation, or bundling
- ✅ **Reusable Approach**: Follows same pattern as 008-align-base-infra-docs and 009-align-home-page-docs - proven methodology

**Rationale**: Documentation alignment uses simplest possible approach - manual markdown editing with git for version control. Spec-Kit templates provide structure without introducing complexity.

### IV. Accessibility & SEO Baseline ✅ **N/A (Documentation Only)**

Documentation files consumed by humans via text editors or GitHub web interface, not rendered as web pages requiring WCAG compliance.

**Rationale**: While accessibility is critical for user-facing pages, internal documentation follows markdown best practices (semantic headings, lists, code blocks) which are inherently accessible when rendered by GitHub.

### V. TypeScript Strict Mode & Type Safety ✅ **N/A (Documentation Only)**

No TypeScript code involved - documentation is plain markdown text.

**Rationale**: Type safety not applicable to documentation work. Code references will point to TypeScript files (StatsSection.astro, etc.) but won't modify them.

### VI. Design System Consistency ✅ **N/A (Documentation Only)**

Documentation does not involve UI components or design system implementation.

**Rationale**: While documentation will describe design decisions (minimal luxury aesthetic, gold accent patterns, white space philosophy), it doesn't implement UI components requiring design system adherence.

---

## Project Structure

### Documentation (this feature)

```text
specs/010-align-home-design-docs/
├── spec.md                      # Feature specification (completed)
├── plan.md                      # This file (Phase 0-1 output)
├── research.md                  # Technical decisions documentation (Phase 0)
├── data-model.md                # Documentation structure model (Phase 1)
├── quickstart.md                # Developer guide for documentation alignment (Phase 1)
├── checklists/
│   └── requirements.md          # Quality validation checklist (completed)
└── tasks.md                     # Task breakdown (Phase 2 - /speckit.tasks)
```

### Target Documentation (specs/003-home-design-refinement/)

```text
specs/003-home-design-refinement/
├── spec.md                      # UPDATE: Status, code references, edge cases, user feedback
├── plan.md                      # UPDATE: Design rationale, constitution check clarification
├── tasks.md                     # UPDATE: Mark T005-T009 completed, document T010-T012 status
├── data-model.md                # READ ONLY: Component props documentation (no changes needed)
├── research.md                  # READ ONLY: Design decisions (reference for plan.md updates)
├── quickstart.md                # READ ONLY: Implementation guide (no changes needed)
├── PROGRESS.md                  # READ ONLY: Source of user feedback quotes to integrate
└── checklists/
    └── requirements.md          # UPDATE: Mark all items completed, add validation results
```

### Source Code (repository root - READ ONLY)

```text
# NO CHANGES TO SOURCE CODE - READ ONLY FOR CODE REFERENCES

src/components/sections/
├── StatsSection.astro           # READ: Extract line numbers for grid, dividers, hover
├── Footer.astro                 # READ: Extract line numbers for CTA, layout, padding
├── CaseStudiesSection.astro     # READ: Extract line numbers for carousel, scroll-snap
├── QuestionsSection.astro       # READ: Extract line numbers for tabs, gold underline
└── TestimonialsSection.astro    # READ: Extract line numbers for background, cards

.git/
└── [commit history]             # READ: Extract commit SHAs for T005-T009 (git log)
```

**Structure Decision**: Documentation alignment project modifying markdown files in specs/003-home-design-refinement/ directory. Source code in src/components/sections/ is read-only for creating code references. No Option 1/2/3 applies - this is documentation work, not application development.

---

## Complexity Tracking

**No constitution violations** - Feature is documentation-only work with no code implementation, build process, or deployment requirements.

---

## Phase Summaries

### Phase 0: Research ✅ **READY TO EXECUTE**

**Output**: `research.md` documenting 10 technical decisions for documentation alignment process

**Key Decisions To Document**:
1. **Code Reference Format**: Decide exact syntax for linking functional requirements to implementation (e.g., `(file.ext:line-range description)` vs `[file.ext#L10-L20](url)`)
2. **Edge Case Documentation Structure**: Define Q&A format with required fields (Question, Expected Behavior, Code Reference, User Impact)
3. **Measurement Method Specification**: Determine level of detail for success criteria tools (e.g., "Chrome DevTools" vs "Chrome DevTools → Elements → Computed → Check contrast ratio")
4. **User Feedback Integration Strategy**: Decide where to place PROGRESS.md quotes (inline in FR descriptions, dedicated section, footnotes)
5. **Design Rationale Placement**: Define whether design decisions go in plan.md or research.md (or both)
6. **Task Status Documentation**: Establish format for marking completed tasks (e.g., "✅ T005 - commit 2ef355c" vs "[x] T005 (2ef355c)")
7. **Line Number Precision**: Determine acceptable range precision (exact line vs line range vs function/section reference)
8. **Git History Analysis Approach**: Decide methodology for extracting commit SHAs (git log, GitHub web UI, git blame)
9. **Verification Evidence Documentation**: Define how to document pending verification tasks (explicit "Pending" vs TODO markers vs omit until completed)
10. **Cross-Reference Validation**: Establish process for ensuring code references remain valid (manual spot-checks vs automated link checking)

**Validation**: Research complete when all 10 decisions documented with rationale and examples. No NEEDS CLARIFICATION markers remaining.

### Phase 1: Design & Contracts ✅ **READY TO EXECUTE**

**Output**:
- `data-model.md` - Structure of documentation entities (Documentation Inconsistency, Design Decision, Code Reference, Measurement Method)
- `quickstart.md` - Step-by-step guide for developers performing documentation alignment
- Agent context updated in `CLAUDE.md` (if applicable)

**Data Model Key Entities**:
1. **Documentation Inconsistency**: Type (CRITICAL/HIGH/MEDIUM), affected file, mismatch description, remediation steps
2. **Design Decision**: Topic, rationale, user feedback, alternatives, final choice, impact
3. **Code Reference**: Requirement ID, file path, line range, description, relationship
4. **Measurement Method**: Success criterion ID, tool name, metric, threshold, procedure

**Quickstart Content**:
- Prerequisites (git access, text editor, familiarity with feature 003)
- Step 1: Read implementation files to understand component structure
- Step 2: Extract code references using file line numbers
- Step 3: Review PROGRESS.md for user feedback quotes
- Step 4: Analyze git history for commit SHAs (git log --oneline)
- Step 5: Update spec.md with code references, edge cases, feedback
- Step 6: Update plan.md with design rationale
- Step 7: Update tasks.md with completion status
- Step 8: Validate using checklists/requirements.md
- Step 9: Commit changes with descriptive message

**Agent Context**: Update CLAUDE.md "Recent Changes" section with:
- "**010-align-home-design-docs** (2025-11-23): Documentation alignment for feature 003-home-design-refinement completed 2025-11-17"

**Validation**: Phase 1 complete when quickstart.md provides clear step-by-step instructions and data-model.md defines all entity structures.

---

## Next Steps

**This plan is complete.** To proceed with implementation:

1. **Execute Phase 0 (Research)**: Create `research.md` with 10 technical decisions
2. **Execute Phase 1 (Design)**: Create `data-model.md`, `quickstart.md`, update agent context
3. **Run `/speckit.tasks`**: Generate task breakdown (`tasks.md`) for implementation
4. **Run `/speckit.implement`**: Execute tasks (optional - can be done manually)

**Critical Dependencies Before Starting**:
- [x] Feature 003-home-design-refinement completed and merged (PRs #9, #10, #11) ✅
- [x] PROGRESS.md available with user feedback ✅
- [x] Implementation files accessible in src/components/sections/ ✅
- [x] Git history available for commit SHA extraction ✅
- [x] Previous alignment examples available (008, 009) for reference ✅

**Estimated Effort**: 4-6 hours (1 developer, manual documentation work)

**Success Criteria Reminder**:
- 30/30 functional requirements have code references or implementation evidence
- 6/6 edge cases documented with Q&A format
- 10/10 success criteria have measurement methods
- 3+ user feedback quotes integrated from PROGRESS.md
- Tasks T005-T009 marked completed with commit SHAs
- Spec status updated to "Completed (2025-11-17)"

---

**Plan Status**: ✅ **COMPLETE - READY FOR PHASE 0**
**Next Command**: Execute research phase to document 10 technical decisions
**Constitution Compliance**: ✅ No violations (documentation-only feature)
