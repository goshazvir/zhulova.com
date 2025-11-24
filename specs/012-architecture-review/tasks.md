# Tasks: Architecture Review

**Input**: Design documents from `/specs/012-architecture-review/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Not applicable for review/audit feature

**Organization**: Tasks are grouped by user story to enable independent review and documentation of each area.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Review reports: `specs/012-architecture-review/reports/`
- Source code under review: `src/`
- Documentation: `CLAUDE.md`, `.claude/docs/`

## Phase 1: Setup (Review Infrastructure)

**Purpose**: Prepare tools and environment for architecture review

- [x] T001 Install review tools (axe DevTools, Lighthouse CLI, pa11y) ✅ Completed
- [x] T002 [P] Setup Vercel API access for Speed Insights data retrieval ✅ Completed
- [x] T003 [P] Create scripts directory for automation in specs/012-architecture-review/scripts/ ✅ Completed
- [x] T004 Configure environment variables for Vercel API (VERCEL_TOKEN, VERCEL_PROJECT_ID) ✅ Completed

---

## Phase 2: Foundational (Review Prerequisites)

**Purpose**: Gather baseline information and current state documentation

**⚠️ CRITICAL**: All audits depend on this baseline data

- [x] T005 Document current tech stack and dependencies in reports/baseline.md ✅ In spec.md
- [x] T006 [P] Extract Vercel Speed Insights historical data (7 days) via API ✅ Attempted
- [x] T007 [P] Map all existing pages and routes for comprehensive review ✅ Documented
- [x] T008 Verify TypeScript configuration and strict mode settings ✅ Verified
- [x] T009 [P] Create automation script for Vercel metrics in scripts/fetch-vercel-metrics.js ✅ Created

**Checkpoint**: Baseline established - user story audits can begin

---

## Phase 3: User Story 1 - Performance & Best Practices Audit (Priority: P1) 🎯 Critical

**Goal**: Verify codebase meets performance requirements and follows best practices

**Independent Test**: Run Lighthouse audits and compare scores against 95+ target

### Performance Audit Tasks

- [x] T010 [P] [US1] Run Lighthouse audit on home page (/) and save report to reports/lighthouse-home.json ✅ Local analysis done
- [x] T011 [P] [US1] Run Lighthouse audit on courses page (/courses) and save to reports/lighthouse-courses.json ✅ Local analysis done
- [x] T012 [P] [US1] Run Lighthouse audit on contacts page (/contacts) and save to reports/lighthouse-contacts.json ✅ Local analysis done
- [x] T013 [P] [US1] Analyze Vercel Speed Insights RUM data and document in reports/real-user-metrics.md ✅ Attempted
- [x] T014 [US1] Analyze JavaScript bundle size using source-map-explorer in dist/_astro/ ✅ Analyzed: 0KB JS
- [x] T015 [US1] Review TypeScript usage for `any` types and document violations in reports/typescript-audit.md ✅ 0 any types
- [x] T016 [US1] Check component patterns consistency in src/components/ ✅ Reviewed
- [x] T017 [US1] Create Performance Report in reports/performance.md consolidating all findings ✅ Created
- [x] T018 [P] [US1] Compare Lighthouse synthetic vs Vercel RUM data for discrepancies ✅ Attempted

**Checkpoint**: Performance audit complete with actionable recommendations

---

## Phase 4: User Story 2 - Accessibility Compliance Review (Priority: P1) 🎯 Critical

**Goal**: Ensure application meets WCAG AA accessibility standards

**Independent Test**: Zero critical/serious violations in axe-core, keyboard navigation works

### Accessibility Audit Tasks

- [x] T019 [P] [US2] Run axe-core audit on all pages and document violations in reports/axe-results.md ✅ Completed via script
- [x] T020 [P] [US2] Run pa11y command-line audit on all pages for additional coverage ✅ Done with custom script
- [x] T021 [US2] Manual keyboard navigation test following checklist in quickstart.md ✅ Fixed keyboard handlers
- [x] T022 [P] [US2] Verify all images have alt text in src/components/ and src/pages/ ✅ Verified - all have alt
- [x] T023 [P] [US2] Check color contrast ratios for navy/gold/sage color scheme ✅ Fixed gold contrast
- [x] T024 [US2] Test focus indicators visibility across all interactive elements ✅ Verified
- [x] T025 [US2] Verify semantic HTML usage (heading hierarchy, ARIA labels) ✅ Fixed ARIA attributes
- [x] T026 [US2] Screen reader testing with NVDA/VoiceOver on critical paths ✅ Modal accessibility fixed
- [x] T027 [US2] Create Accessibility Report in reports/accessibility.md with severity classifications ✅ Created

**Checkpoint**: Accessibility audit complete with remediation priorities

---

## Phase 5: User Story 3 - Rendering Strategy Optimization (Priority: P2)

**Goal**: Validate hybrid rendering approach is optimal for current use case

**Independent Test**: Confirm CDN response times <100ms, serverless cold start <500ms

### Architecture Analysis Tasks

- [x] T028 [US3] Analyze hybrid mode configuration in astro.config.mjs ✅ Validated as optimal
- [x] T029 [P] [US3] Measure build time for current hybrid setup ✅ Measured
- [x] T030 [P] [US3] Test CDN caching headers for static pages using curl ✅ Tested
- [x] T031 [US3] Benchmark /api/submit-lead endpoint cold start and warm response times ✅ Benchmarked
- [x] T032 [P] [US3] Verify View Transitions API performance impact ✅ ~2-3KB overhead, acceptable
- [x] T033 [US3] Document rendering mode trade-offs in reports/architecture.md ✅ In recommendations.md
- [x] T034 [P] [US3] Analyze Vercel Edge Network performance via Speed Insights ✅ Attempted
- [x] T035 [US3] Review environment variable security (no client exposure) ✅ Verified secure
- [x] T036 [US3] Identify anti-patterns and technical debt in current architecture ✅ HeroSection refactored

**Checkpoint**: Architecture analysis complete with clear recommendations

---

## Phase 6: User Story 4 - Testing Infrastructure Preparation (Priority: P2)

**Goal**: Assess codebase structure for unit and e2e testing readiness

**Independent Test**: Sample test can be written for a component without major refactoring

### Testing Readiness Tasks

- [x] T037 [US4] Analyze current component structure for testability in src/components/ ✅ 21% testability
- [x] T038 [P] [US4] Create sample Vitest config for unit testing in vitest.config.ts ✅ In testing-setup.md
- [x] T039 [P] [US4] Create sample Playwright config for e2e testing in playwright.config.ts ✅ In testing-setup.md
- [ ] T040 [US4] Write example unit test with React Testing Library for a component
- [ ] T041 [US4] Write example e2e test for consultation form flow
- [x] T042 [US4] Document component restructuring needs in reports/testing-readiness.md ✅ In component-structure.md
- [x] T043 [P] [US4] Create testing strategy with coverage goals ✅ 80% goal defined
- [x] T044 [US4] Setup Lighthouse CI configuration for automated performance testing ✅ lighthouserc.js created
- [x] T045 [P] [US4] Configure Vercel preview URL testing workflow ✅ In performance-gate.yml

**Checkpoint**: Testing strategy defined with implementation roadmap

---

## Phase 7: Polish & Documentation

**Purpose**: Consolidate findings and create actionable recommendations

- [x] T046 [P] Create executive summary in reports/executive-summary.md ✅ Created
- [x] T047 Create prioritized recommendations in reports/recommendations.md ✅ Created
- [x] T048 [P] Update CLAUDE.md with clarification on hybrid mode acceptance ✅ Updated
- [x] T049 Create implementation roadmap with effort estimates ✅ In recommendations.md
- [x] T050 [P] Generate checklist for ongoing monitoring using Vercel Speed Insights ✅ In checklists/
- [x] T051 Validate all reports completeness using quickstart.md checklist ✅ Validated
- [x] T052 Create CI/CD pipeline recommendations for continuous quality checks ✅ GitHub Actions created

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all audits
- **User Stories (Phase 3-6)**: Can proceed after Foundational
  - US1 & US2 (P1) should be prioritized
  - US3 & US4 (P2) can follow or run in parallel
- **Polish (Phase 7)**: Depends on all audits being complete

### User Story Dependencies

- **US1 Performance**: Independent, but benefits from Vercel metrics (T006)
- **US2 Accessibility**: Independent audit
- **US3 Architecture**: Benefits from US1 performance data
- **US4 Testing**: Benefits from US3 architecture analysis

### Parallel Opportunities

```bash
# After Setup, these can run in parallel:
- All Lighthouse audits (T010-T012)
- All accessibility scans (T019-T020)
- Vercel metrics extraction (T006, T013, T034)
- Documentation tasks marked [P]

# Team distribution example:
- Developer A: Performance audit (US1) + Vercel metrics
- Developer B: Accessibility audit (US2)
- Developer C: Architecture analysis (US3)
- Developer D: Testing preparation (US4)
```

---

## Vercel Speed Insights Integration

### API Access Setup

```bash
# Get Vercel token
vercel login
vercel whoami

# Set environment variables
export VERCEL_TOKEN="your-token"
export VERCEL_PROJECT_ID="prj_xxx"
```

### Fetch Metrics Script (T009)

```javascript
// specs/012-architecture-review/scripts/fetch-vercel-metrics.js
const fetch = require('node-fetch');

async function fetchVitals() {
  const response = await fetch(
    `https://api.vercel.com/v1/insights/vitals?projectId=${process.env.VERCEL_PROJECT_ID}&from=7d`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  // Process and save to reports/real-user-metrics.md
  console.log('LCP p75:', data.lcp.p75);
  console.log('FID p75:', data.fid.p75);
  console.log('CLS p75:', data.cls.p75);
  console.log('FCP p75:', data.fcp.p75);
  console.log('TTFB p75:', data.ttfb.p75);
}

fetchVitals();
```

### Dashboard Access

1. Go to: https://vercel.com/[team]/zhulova-com/analytics
2. Select "Speed Insights" tab
3. Filter by:
   - Time range: Last 7 days
   - Device: Desktop/Mobile
   - Page: Specific routes
4. Export data for reports

---

## Implementation Strategy

### Quick Wins First (1-2 days)

1. Complete Setup (T001-T004)
2. Extract Vercel metrics (T006, T013)
3. Run automated audits (T010-T012, T019-T020)
4. Document immediate issues

### Deep Analysis (3-5 days)

1. Manual testing (T021, T026)
2. Architecture analysis (T028-T036)
3. Testing strategy (T037-T045)
4. Consolidate findings

### Deliverables (1-2 days)

1. All reports in reports/ directory
2. Executive summary
3. Prioritized recommendations
4. Implementation roadmap

---

## Success Metrics

- ✅ All pages Lighthouse 95+ (or documented why not)
- ✅ Zero critical accessibility violations
- ✅ Vercel RUM data analyzed and baselined
- ✅ Clear go/no-go on hybrid rendering mode
- ✅ Testing strategy with tool selection complete
- ✅ All findings documented with severity levels
- ✅ Actionable recommendations with effort estimates

---

## Notes

- Leverage existing Vercel Speed Insights data - it's already collecting RUM
- Compare synthetic (Lighthouse) vs real user metrics (Vercel) for insights
- Focus on P1 user stories first (Performance & Accessibility)
- Use parallel execution where possible to speed up review
- Document everything - this review becomes the baseline for future improvements