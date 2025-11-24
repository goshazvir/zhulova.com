# Implementation Plan: Architecture Review

**Branch**: `012-architecture-review` | **Date**: 2025-11-24 | **Spec**: [link](spec.md)
**Input**: Feature specification from `/specs/012-architecture-review/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Comprehensive architecture review of the Zhulova website to validate compliance with best practices, performance requirements (Lighthouse 95+), WCAG AA accessibility standards, and evaluate the current hybrid rendering approach. The review will assess code quality, identify technical debt, and prepare the codebase for unit and e2e testing implementation.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Astro 4.x, React 18.x
**Primary Dependencies**: Tailwind CSS 3.x, Zustand 4.x, Supabase Client, Resend SDK
**Storage**: Supabase PostgreSQL (serverless), Environment variables in Vercel
**Testing**: Currently none - preparing for Vitest (unit) and Playwright (e2e)
**Target Platform**: Vercel Edge Network (CDN + Serverless Functions)
**Project Type**: web (hybrid static site + serverless API endpoints)
**Performance Goals**: Lighthouse 95+, LCP <2.5s, CLS <0.1, JS bundle <50KB gzipped
**Constraints**: Static-first delivery, WCAG AA compliance, TypeScript strict mode
**Scale/Scope**: 10 pages, 20+ components, 1 API endpoint, multilingual (RU/EN)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Static-First Delivery**: ⚠️ VIOLATION - Currently using `output: 'hybrid'` in astro.config.mjs (needs evaluation)
- **Performance Budgets**: ✓ Targets align with constitution (Lighthouse 95+, Core Web Vitals)
- **Simplicity Over Tooling**: ✓ Review will assess if current stack is justified
- **Accessibility & SEO**: ✓ WCAG AA compliance is review target
- **TypeScript Strict Mode**: ✓ Strict mode verification is included
- **Design System**: ✓ Tailwind-only approach will be validated

**Gate Status**: PROCEED WITH JUSTIFICATION - The hybrid mode violation is the primary subject of this review. We need to determine if it should remain for API endpoints or if a pure static approach with external serverless functions would be better.

## Project Structure

### Documentation (this feature)

```text
specs/012-architecture-review/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - rendering mode analysis
├── data-model.md        # Phase 1 output - N/A (review only)
├── quickstart.md        # Phase 1 output - review process guide
├── contracts/           # Phase 1 output - N/A (no new APIs)
├── checklists/
│   └── requirements.md  # Quality validation checklist
├── reports/
│   ├── performance.md   # Lighthouse audit results
│   ├── accessibility.md # WCAG compliance report
│   ├── architecture.md  # Rendering mode analysis
│   └── recommendations.md # Prioritized improvements
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Current structure to be reviewed:
src/
├── components/
│   ├── common/          # Button, Card, Modal - assess testability
│   ├── layout/          # Header, Footer, Navigation - check a11y
│   └── sections/        # Homepage sections - performance review
├── layouts/
│   └── BaseLayout.astro # SEO meta tags - validate completeness
├── pages/
│   ├── index.astro      # Static pages - check rendering mode
│   ├── courses/         # Dynamic routes - assess strategy
│   └── api/             # Serverless functions - validate approach
├── content/
│   └── courses/         # Content Collections - review structure
├── stores/
│   └── uiStore.ts       # Zustand state - check patterns
├── styles/
│   └── global.css       # Tailwind config - validate setup
├── types/
│   └── index.ts         # TypeScript types - check strictness
└── utils/
    └── helpers.ts       # Utilities - review for anti-patterns

# Testing structure to be proposed:
tests/                   # PROPOSAL: Add test directory
├── unit/
│   ├── components/      # Component tests
│   └── utils/          # Utility tests
├── integration/
│   └── api/            # API endpoint tests
└── e2e/
    ├── user-flows/     # Critical path tests
    └── accessibility/  # A11y validation tests
```

**Structure Decision**: Review current flat component structure vs folder-based structure with tests. Evaluate if components should be reorganized as `ComponentName/index.tsx` + `ComponentName.test.tsx` pattern for better test co-location.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `output: 'hybrid'` in astro.config.mjs | Required for `/api/submit-lead` serverless function | Pure static would require separate deployment for API, increasing complexity |
| Potential: Component folder restructure | Test file co-location and better organization | Current flat structure works but may not scale for testing |

## Phase 0: Research & Analysis

### Rendering Mode Investigation

**Objective**: Determine if hybrid mode is optimal for current use case

1. **Task 1**: Analyze current hybrid configuration impact
   - Measure build time difference vs pure static
   - Check bundle size implications
   - Verify CDN caching behavior

2. **Task 2**: Evaluate alternatives
   - Pure static + external serverless (Vercel Functions)
   - Pure static + edge functions
   - Keep hybrid for API routes

3. **Task 3**: Research View Transitions API compatibility
   - Verify smooth navigation works with chosen approach
   - Test performance impact

### Performance Baseline

**Objective**: Establish current performance metrics

1. **Task 4**: Run Lighthouse audits on all pages
   - Home page (critical)
   - Course pages (dynamic routes)
   - Contact page (forms)

2. **Task 5**: Analyze JavaScript bundle
   - Check tree-shaking effectiveness
   - Identify unused code
   - Verify code splitting

### Accessibility Audit

**Objective**: Validate WCAG AA compliance

1. **Task 6**: Automated testing with axe-core
   - Run on all pages
   - Document violations by severity

2. **Task 7**: Manual keyboard navigation test
   - Test all interactive elements
   - Verify focus indicators
   - Check skip links

### Testing Readiness Assessment

**Objective**: Evaluate codebase testability

1. **Task 8**: Component structure analysis
   - Assess current organization
   - Propose folder structure if needed
   - Identify tightly coupled components

2. **Task 9**: Test framework research
   - Vitest for unit tests (Astro compatible)
   - Playwright for e2e tests
   - Coverage requirements

## Phase 1: Design & Documentation

**Prerequisites**: Phase 0 research complete

### Reports Generation

1. **Performance Report** (`reports/performance.md`)
   - Lighthouse scores per page
   - Core Web Vitals metrics
   - Bundle size analysis
   - Optimization opportunities

2. **Accessibility Report** (`reports/accessibility.md`)
   - WCAG violations list
   - Severity classification
   - Remediation requirements
   - Keyboard navigation issues

3. **Architecture Analysis** (`reports/architecture.md`)
   - Rendering mode recommendation
   - Component structure assessment
   - Anti-patterns identified
   - Technical debt inventory

4. **Recommendations** (`reports/recommendations.md`)
   - Priority-ranked improvements
   - Effort estimates
   - Quick wins vs long-term changes
   - Testing strategy proposal

### Review Process Guide

Create `quickstart.md` with:
- How to run audits
- Interpreting results
- Making improvements
- Validation process

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- Review process documentation
- Performance monitoring approach
- Testing preparation notes

## Phase 2: Task Planning

**Note**: Tasks will be generated by `/speckit.tasks` command after plan approval

### Expected Task Categories

1. **Critical Fixes** (P0)
   - Accessibility violations
   - Performance blockers
   - Security issues

2. **Performance Optimizations** (P1)
   - Image optimization
   - Bundle size reduction
   - Cache improvements

3. **Code Quality** (P2)
   - TypeScript strictness
   - Component refactoring
   - Pattern consistency

4. **Testing Preparation** (P3)
   - Folder restructuring
   - Test utilities setup
   - Mock data creation

## Success Metrics

- All pages achieve Lighthouse 95+ score
- Zero critical accessibility violations
- Clear recommendation on rendering mode with data
- Component structure supports 80% test coverage goal
- Documentation enables team to maintain standards

## Timeline Estimate

**Phase 0 (Research)**: Immediate execution
**Phase 1 (Documentation)**: Following research completion
**Phase 2 (Tasks)**: To be determined based on findings

## Risk Mitigation

- **Risk**: Changing hybrid mode breaks API
  - **Mitigation**: Test thoroughly before any changes

- **Risk**: Component restructure is disruptive
  - **Mitigation**: Incremental migration if needed

- **Risk**: Performance improvements affect functionality
  - **Mitigation**: Feature flag for rollback

## Notes

- This is a review/audit feature, not implementation
- All findings will be documented before any changes
- Constitution violation (hybrid mode) is intentional subject of review
- Testing setup is preparatory only - actual implementation separate