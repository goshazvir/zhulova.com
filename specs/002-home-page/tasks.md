# Tasks: Home Page - Viktoria Zhulova Coaching Website

**Input**: Design documents from `/specs/002-home-page/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Manual testing only per quickstart.md (no automated tests in MVP scope)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Web application (static frontend + serverless backend)
- **Structure**: Single project with `src/` at repository root
- **Frontend**: `src/components/`, `src/pages/`, `src/layouts/`
- **Backend**: `src/pages/api/` (Astro file-based serverless functions)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify environment variables in `.env` file (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, RESEND_API_KEY, PUBLIC_SITE_URL)
- [X] T002 Verify database schema in Supabase (leads table with constraints, indexes, RLS policies)
- [X] T003 [P] Create TypeScript types for consultation form in src/types/consultationForm.ts
- [X] T004 [P] Create TypeScript types for lead entity in src/types/lead.ts
- [X] T005 [P] Create static content data file in src/data/homePageContent.ts
- [X] T006 [P] Create Zustand UI store in src/stores/uiStore.ts
- [X] T007 [P] Create scroll animations utility in src/utils/scrollAnimations.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create BaseLayout component in src/layouts/BaseLayout.astro with SEO meta tags, Analytics, Speed Insights
- [X] T009 Create Header component in src/components/layout/Header.astro with navigation menu
- [X] T010 Create Footer component in src/components/layout/Footer.astro with social links and CTA
- [X] T011 [P] Create Button component in src/components/common/Button.tsx
- [X] T012 [P] Create Modal component in src/components/common/Modal.tsx
- [X] T013 [P] Create Input component in src/components/common/Input.tsx
- [X] T014 Create MobileMenu component in src/components/layout/MobileMenu.tsx with Zustand state integration

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Immediate Consultation Booking (Priority: P1) 🎯 MVP

**Goal**: Enable visitors to quickly understand what the coach offers and book a consultation session without extensive browsing

**Independent Test**: Visit homepage, read hero section, click "Book a Session", fill form with valid data, receive confirmation

### Implementation for User Story 1

- [X] T015 [P] [US1] Create HeroSection component in src/components/sections/HeroSection.astro with hero image, title, value proposition, CTA button
- [X] T016 [P] [US1] Create ConsultationModal component in src/components/forms/ConsultationModal.tsx with React Hook Form and Zod validation
- [X] T017 [US1] Implement serverless function in src/pages/api/submit-lead.ts with Zod validation, Supabase insert, Resend email notification
- [X] T018 [US1] Integrate ConsultationModal with Header and Footer CTA buttons using Zustand state
- [X] T019 [US1] Add form validation error messages in Ukrainian in ConsultationModal component
- [X] T020 [US1] Add success/error toast notifications in ConsultationModal component
- [X] T021 [US1] Test complete flow: open modal → fill form → submit → verify database record → verify email notification ✅ Verified in production 2025-11-16

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Visitor can book consultation from hero section.

---

## Phase 4: User Story 2 - Credibility Assessment (Priority: P2)

**Goal**: Enable potential clients to verify the coach's credentials, experience, and track record

**Independent Test**: Scroll through homepage and view statistics section (4 metrics) and client transformation case studies with before/after comparisons

### Implementation for User Story 2

- [X] T022 [P] [US2] Create StatsSection component in src/components/sections/StatsSection.astro displaying 4 key metrics from homePageContent.ts
- [X] T023 [P] [US2] Create CaseStudiesSection component in src/components/sections/CaseStudiesSection.astro with client transformations
- [X] T024 [US2] Add statistics data to src/data/homePageContent.ts (10 years teams, 200+ clients, 4 tools, 12000+ hours)
- [X] T025 [US2] Add case studies data to src/data/homePageContent.ts with before/after states, metrics, achievements
- [X] T026 [US2] Integrate StatsSection and CaseStudiesSection into homepage (src/pages/index.astro)
- [X] T027 [US2] Add scroll animations to stats and case studies using Intersection Observer

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Visitor can assess credibility and book consultation.

---

## Phase 5: User Story 3 - Problem-Solution Matching (Priority: P3)

**Goal**: Help visitors with specific personal or business challenges understand if the coach can help their situation

**Independent Test**: Review Personal and Business question sections listing common client challenges

### Implementation for User Story 3

- [X] T028 [P] [US3] Create QuestionsSection component in src/components/sections/QuestionsSection.astro with personal and business tabs
- [X] T029 [US3] Add 15 personal development questions to src/data/homePageContent.ts (self-discovery, burnout, purpose, etc.)
- [X] T030 [US3] Add 14 business/leadership questions to src/data/homePageContent.ts (entrepreneurship, team management, etc.)
- [X] T031 [US3] Integrate QuestionsSection into homepage (src/pages/index.astro) after StatsSection
- [X] T032 [US3] Add responsive grid layout for questions (2 columns desktop, 1 column mobile)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Visitor can identify with challenges and book consultation.

---

## Phase 6: User Story 4 - Social Proof Validation (Priority: P4)

**Goal**: Display client testimonials to provide social proof and reduce booking hesitation

**Independent Test**: View testimonials section displaying quotes from previous clients with names and roles

### Implementation for User Story 4

- [X] T033 [P] [US4] Create TestimonialsSection component in src/components/sections/TestimonialsSection.astro
- [X] T034 [US4] Add testimonials data to src/data/homePageContent.ts with quotes, client names, and professional roles
- [X] T035 [US4] Integrate TestimonialsSection into homepage (src/pages/index.astro) after CaseStudiesSection
- [X] T036 [US4] Add responsive grid layout for testimonials (2-3 columns desktop, 1 column mobile)

**Checkpoint**: All user stories should now be independently functional except courses and navigation.

---

## Phase 7: User Story 5 - Course Discovery (Priority: P5)

**Goal**: Provide alternative entry point for clients preferring self-paced learning over 1-on-1 coaching

**Independent Test**: View courses preview section and navigate to full courses catalog

### Implementation for User Story 5

- [X] T037 [P] [US5] Create CoursesPreview component in src/components/sections/CoursesPreview.astro
- [X] T038 [US5] Add featured course data to src/data/homePageContent.ts (МІНІ КУРС - ГРОШІ КОЖЕН ДЕНЬ)
- [X] T039 [US5] Integrate CoursesPreview into homepage (src/pages/index.astro) after TestimonialsSection
- [X] T040 [US5] Create placeholder courses catalog page in src/pages/courses/index.astro (stub for future implementation) ✅ Implemented /courses page
- [X] T041 [US5] Add "Learn More" CTA button linking to courses catalog

**Checkpoint**: All main user stories complete. Only navigation remains.

---

## Phase 8: User Story 6 - Navigation and Social Connection (Priority: P6)

**Goal**: Enable visitors to explore different sections and connect on social media platforms

**Independent Test**: Use navigation menu to jump to sections, click social media icons to visit external profiles

### Implementation for User Story 6

- [X] T042 [US6] Add navigation links to Header component (Home, About Me, Courses, Testimonials, Contacts)
- [X] T043 [US6] Add social media icons and links to Header component (YouTube, Instagram)
- [X] T044 [US6] Add social media icons and links to Footer component (Facebook, Instagram, YouTube, TikTok)
- [X] T045 [US6] Implement smooth scroll behavior for anchor links to sections
- [X] T046 [US6] Add active section highlighting in navigation menu
- [X] T047 [US6] Test mobile menu open/close functionality ✅ Verified in production
- [X] T048 [US6] Test keyboard navigation (Tab, Enter, Escape) ✅ Verified in production

**Checkpoint**: All user stories complete. Homepage fully functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T049 [P] Add MotivationalQuote component in src/components/sections/MotivationalQuote.astro
- [X] T050 [P] Optimize images for hero, case studies, footer (WebP format, responsive sizes) ✅ Images optimized
- [X] T051 [P] Add alt text to all images (hero photo, case study photos, footer photo) ✅ Alt text added
- [X] T052 Integrate homepage into src/pages/index.astro with all sections in correct order
- [X] T053 Add focus indicators for keyboard navigation (configure in src/styles/global.css)
- [X] T054 Add prefers-reduced-motion support for scroll animations
- [X] T055 Verify color contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for UI) - Navy on white = 15.8:1 ✅
- [X] T056 Test form accessibility (ARIA labels, screen reader support) ✅ Verified - WCAG AA compliant
- [X] T057 Run Lighthouse audit and verify scores ≥95 (Performance, Accessibility, SEO, Best Practices) ✅ Verified - scores ≥95
- [X] T058 Test responsive design on mobile (320px-767px), tablet (768px-1199px), desktop (1200px+) ✅ Verified in production
- [X] T059 Verify homepage loads in <2.5 seconds on 3G connection ✅ Verified - LCP <2.5s
- [X] T060 Test consultation form submission end-to-end with Vercel dev server (vercel dev) ✅ Verified - form works
- [X] T061 Update CLAUDE.md documentation with any new patterns or decisions - Path aliases configured
- [X] T062 Run complete quickstart.md validation checklist ✅ Feature deployed 2025-11-16

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent of previous stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Independent of previous stories
- **User Story 6 (P6)**: Can start after Foundational (Phase 2) - Integrates with all sections but independently testable

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Data preparation before component integration
- Component creation before integration into homepage
- Manual testing after each story completion (per quickstart.md)

### Parallel Opportunities

#### Phase 1: Setup
All tasks marked [P] can run in parallel (T003, T004, T005, T006, T007)

#### Phase 2: Foundational
All tasks marked [P] can run in parallel after T008-T010 complete (T011, T012, T013)

#### User Stories (after Foundational complete)
- US1 tasks T015-T016 can run in parallel
- US2 tasks T022-T023 can run in parallel
- US3 task T028 independent
- US4 task T033 independent
- US5 task T037 independent
- All user stories (US1-US6) can be worked on in parallel by different team members

#### Phase 9: Polish
Tasks T049, T050, T051 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks for User Story 1:
Task T015: "Create HeroSection component in src/components/sections/HeroSection.astro"
Task T016: "Create ConsultationModal component in src/components/forms/ConsultationModal.tsx"

# Then sequential tasks:
Task T017: "Implement serverless function in src/pages/api/submit-lead.ts"
Task T018: "Integrate ConsultationModal with Header and Footer CTAs"
Task T019: "Add form validation error messages"
Task T020: "Add success/error toast notifications"
Task T021: "Test complete flow end-to-end"
```

---

## Parallel Example: Multiple User Stories

```bash
# After Foundational phase completes, launch user stories in parallel:
Developer A: User Story 1 (T015-T021) → MVP consultation booking
Developer B: User Story 2 (T022-T027) → Credibility statistics and case studies
Developer C: User Story 3 (T028-T032) → Problem-solution questions

# Each story completes independently and integrates into homepage
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test consultation booking flow independently
5. Deploy/demo if ready

**MVP Scope**: Homepage with hero section, navigation, and working consultation form. Visitor can book session.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (credibility added)
4. Add User Story 3 → Test independently → Deploy/Demo (problem-solution matching added)
5. Add User Story 4 → Test independently → Deploy/Demo (social proof added)
6. Add User Story 5 → Test independently → Deploy/Demo (courses preview added)
7. Add User Story 6 → Test independently → Deploy/Demo (navigation complete)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (consultation booking)
   - Developer B: User Story 2 (credibility stats)
   - Developer C: User Story 3 (questions sections)
3. Stories complete and integrate independently
4. Continue with US4, US5, US6 as capacity allows

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing per quickstart.md after each story completion
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Lighthouse audit mandatory before production deployment
- Vercel dev server (`vercel dev`) required for testing serverless functions
- Environment variables must be configured in `.env` and Vercel Dashboard
- Database migration must be run in Supabase before testing User Story 1

---

## Task Count Summary

- **Total tasks**: 62
- **Setup (Phase 1)**: 7 tasks
- **Foundational (Phase 2)**: 7 tasks
- **User Story 1 (P1)**: 7 tasks
- **User Story 2 (P2)**: 6 tasks
- **User Story 3 (P3)**: 5 tasks
- **User Story 4 (P4)**: 4 tasks
- **User Story 5 (P5)**: 5 tasks
- **User Story 6 (P6)**: 7 tasks
- **Polish (Phase 9)**: 14 tasks

**Parallel opportunities**: 15 tasks marked [P] across all phases

**Independent test criteria**: Each user story has clear validation steps in quickstart.md

**Suggested MVP scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 21 tasks

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description`
✅ All task IDs sequential (T001-T062)
✅ All [P] markers indicate parallelizable tasks
✅ All user story tasks have [Story] labels (US1-US6)
✅ All tasks include specific file paths
✅ All dependencies clearly documented
✅ Independent test criteria provided for each user story
