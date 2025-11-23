# Feature Specification: Home Page - Viktoria Zhulova Coaching Website

**Feature Branch**: `002-home-page`
**Created**: 2025-11-16
**Status**: Completed (2025-11-16)
**Input**: User description: "001-home-page: Главная страница для сайта Виктории Жульовой, mindset coach"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immediate Consultation Booking (Priority: P1)

A potential client visits the website and wants to quickly understand what the coach offers and book a consultation session without extensive browsing.

**Why this priority**: This is the primary conversion goal - capturing leads. If a visitor can book a consultation, the website achieves its core business objective.

**Independent Test**: Can be fully tested by visiting the homepage, reading the hero section, clicking "Book a Session" button, filling out the consultation form, and receiving confirmation that the request was submitted.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they view the hero section, **Then** they see the coach's name, credentials, a clear value proposition, and a prominent "Book a Session" button
2. **Given** a visitor clicks "Book a Session" button, **When** the consultation form appears, **Then** they can enter their name, phone, Telegram handle, and email
3. **Given** a visitor fills out the consultation form with valid data, **When** they submit, **Then** the system confirms submission and notifies the coach via email
4. **Given** a visitor submits the form, **When** submission succeeds, **Then** they see a success message confirming their request was received
5. **Given** a visitor submits incomplete form data, **When** required fields are missing, **Then** they see clear validation errors indicating which fields need correction

---

### User Story 2 - Credibility Assessment (Priority: P2)

A potential client wants to verify the coach's credentials, experience, and track record before deciding to book a consultation.

**Why this priority**: Trust is essential for coaching services. Demonstrating credibility increases conversion rates for consultation bookings.

**Independent Test**: Can be tested by scrolling through the homepage and viewing statistics (years of experience, number of clients, hours of practice, tools used) and client transformation case studies with before/after comparisons.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls past the hero section, **When** they reach the statistics section, **Then** they see 4 key metrics: years building high-performing teams, number of clients who achieved goals, number of coaching tools used, and total hours of practice
2. **Given** a visitor continues scrolling, **When** they reach case studies, **Then** they see real client transformations with metrics (time in mentorship, number of sessions, income growth multiplier, career changes)
3. **Given** a visitor reviews a case study, **When** they read the details, **Then** they see "before" state (employment, challenges) and "after" state (achievements, business growth, lifestyle improvements)

---

### User Story 3 - Problem-Solution Matching (Priority: P3)

A visitor has specific personal or business challenges and wants to know if the coach can help with their particular situation.

**Why this priority**: Addressing specific pain points helps visitors self-qualify and understand the coach's expertise areas, increasing booking intent.

**Independent Test**: Can be tested by reviewing two question sections (Personal and Business) that list common client challenges the coach addresses.

**Acceptance Scenarios**:

1. **Given** a visitor has personal challenges, **When** they view the "Personal Questions" section, **Then** they see 15 questions addressing topics like self-discovery, burnout, imposter syndrome, financial ceilings, boundary-setting, and work-life balance
2. **Given** a visitor has business/leadership challenges, **When** they view the "Business Questions" section, **Then** they see 14 questions addressing topics like team management, leadership, delegation, micromanagement, process building, and conflict resolution
3. **Given** a visitor identifies with specific questions, **When** they recognize their challenges in the list, **Then** they feel the coach understands their situation and can provide relevant guidance

---

### User Story 4 - Social Proof Validation (Priority: P4)

A visitor wants to see what other clients say about working with the coach before committing to a consultation.

**Why this priority**: Testimonials provide social proof and reduce booking hesitation, complementing the credibility built by statistics and case studies.

**Independent Test**: Can be tested by viewing client testimonials section displaying quotes from previous clients with their names and roles.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the testimonials section, **When** they view the content, **Then** they see multiple client testimonials with quotes, client names, and professional roles
2. **Given** a visitor reads testimonials, **When** they evaluate credibility, **Then** each testimonial includes specific outcomes or experiences rather than generic praise

---

### User Story 5 - Course Discovery (Priority: P5)

A visitor prefers self-paced learning or wants to explore course offerings before committing to 1-on-1 coaching.

**Why this priority**: Courses provide an alternative revenue stream and entry point for clients not ready for personal coaching. Lower priority than consultation bookings but still valuable.

**Independent Test**: Can be tested by viewing the courses preview section and navigating to the full courses catalog.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the courses section, **When** they view the content, **Then** they see at least one featured course ("Mini Course - Money Every Day") with a brief description
2. **Given** a visitor is interested in courses, **When** they click "Learn More", **Then** they navigate to a dedicated courses catalog page
3. **Given** a visitor views a course preview, **When** they evaluate its relevance, **Then** they see the course title and a compelling description of what it offers

---

### User Story 6 - Navigation and Social Connection (Priority: P6)

A visitor wants to explore different sections of the website or connect with the coach on social media platforms.

**Why this priority**: Provides alternative engagement channels and improves user experience, but is supporting functionality rather than primary conversion goal.

**Independent Test**: Can be tested by using the navigation menu to jump to different page sections and clicking social media icons to visit external profiles.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they view the header, **Then** they see navigation links (Home, About Me, Courses, Testimonials, Contacts) and social media icons (YouTube, Instagram)
2. **Given** a visitor clicks a navigation link, **When** navigation occurs, **Then** they are taken to the corresponding page section or separate page
3. **Given** a visitor scrolls down the page, **When** the header remains visible, **Then** the active menu item is highlighted based on the current section
4. **Given** a visitor clicks a social media icon, **When** the link opens, **Then** they are taken to the coach's YouTube or Instagram profile in a new tab
5. **Given** a visitor reaches the footer, **When** they view contact options, **Then** they see social media links (Facebook, Instagram, YouTube, TikTok) and a "Book Diagnostic Session" button

---

### Edge Cases

**Q1: What happens when user submits form with invalid email format?**
- **Answer**: Zod validation catches invalid email before API call, displays inline error message (Ukrainian: "Введіть коректну email адресу"), prevents form submission. Validation happens client-side in React Hook Form before network request.
- **Code**: `src/types/consultationForm.ts:32-37` (Zod email schema), `ConsultationModal.tsx:16-23` (React Hook Form with zodResolver)
- **Behavior**: User sees immediate feedback on invalid email, no API call made until validation passes.

**Q2: What happens when /api/submit-lead endpoint fails due to database connection error?**
- **Answer**: API returns 500 error with generic message, form displays error toast (Ukrainian: "Щось пішло не так. Спробуйте пізніше."), lead data not saved to Supabase. User can retry submission after fixing connection.
- **Code**: `src/pages/api/submit-lead.ts:110-130` (Supabase insert error handling), `ConsultationModal.tsx:52-55` (error state handling)
- **Behavior**: Form remains filled, user can retry, no data lost locally. API logs error to Vercel Function Logs for debugging.

**Q3: What happens when multiple users submit consultation forms simultaneously?**
- **Answer**: Each submission handled independently by separate serverless function invocation (Vercel Serverless Functions auto-scale). Database uses UUID primary key + timestamp to prevent conflicts. No rate limiting between different users. Concurrent writes safe via PostgreSQL ACID guarantees.
- **Code**: `src/pages/api/submit-lead.ts:6` (stateless serverless function), `specs/002-home-page/data-model.md:15` (UUID primary key in leads table)
- **Behavior**: Multiple users can submit simultaneously without conflicts. Each gets unique UUID, separate email notification sent.

**Q4: What happens when Resend email delivery fails but database save succeeds?**
- **Answer**: User sees success message (form submitted successfully), lead saved in Supabase for manual follow-up, but admin doesn't receive immediate email notification. API doesn't fail the request even if email fails - prioritizes data persistence over notification delivery. Error logged to Vercel logs.
- **Code**: `src/pages/api/submit-lead.ts:117-159` (email sending with try-catch), `ConsultationModal.tsx:44-51` (success state after API 200 response)
- **Behavior**: Acceptable failure mode - coach can manually check Supabase dashboard for new leads if emails stop arriving. No data loss occurs.

**Q5: What happens when same user submits consultation form multiple times in quick succession?**
- **Answer**: No rate limiting implemented. Each submission creates separate lead record in database and sends new email notification. Client-side prevents double-click during active submission (button disabled), but user can submit multiple times after modal resets (3 seconds auto-close). No server-side duplicate detection or IP-based rate limiting.
- **Code**: `ConsultationModal.tsx:163` (disabled button during submit), `src/pages/api/submit-lead.ts:110-114` (insert without duplicate check)
- **Behavior**: Multiple submissions from same user create multiple database records and emails. Acceptable for low-traffic scenarios and legitimate re-submissions, but vulnerable to spam/abuse if becomes problem.
- **Recommendation**: If duplicate submissions become issue, implement rate limiting (see Future Enhancements section for 3-tier protection strategy)

**Q6: What happens when user closes modal/navigates away before form submission completes?**
- **Answer**: API request may complete in background (serverless function continues execution), but user won't see success/error message. If submission succeeds, lead saved in database but user unaware. No automatic retry mechanism or abort signal implemented.
- **Code**: `ConsultationModal.tsx:25-56` (submission handler without AbortController), browser fetch behavior (continues after navigation)
- **Behavior**: Edge case for impatient users - data may or may not be saved depending on timing. User should wait for success message before closing modal.

## Requirements *(mandatory)*

### Functional Requirements

#### Content Display Requirements

- **FR-001**: Homepage MUST display the coach's full name "Вікторія Жульова" and professional title "сертифікований коуч" prominently in the hero section
- **FR-002**: Homepage MUST display a value proposition explaining the coach helps clients achieve goals using coaching, meditation, NLP, and reprogramming old patterns
- **FR-003**: Homepage MUST display exactly 4 statistical achievements: 10 years building high-performance teams, 200+ clients who achieved goals, 4 mentorship tools, and 12,000+ hours of individual coaching practice
- **FR-004**: Homepage MUST display 15 personal development questions in a dedicated "Personal" section covering self-discovery, burnout, purpose, energy, relationships, priorities, imposter syndrome, financial ceilings, confidence, and boundaries
- **FR-005**: Homepage MUST display 14 business/leadership questions in a dedicated "Business" section covering entrepreneurship, team organization, leadership, communication, meeting effectiveness, people management, task delegation, accountability, process building, micromanagement, work-life balance, and conflict resolution
- **FR-006**: Homepage MUST display a motivational quote emphasizing the value of time and encouraging immediate action
- **FR-007**: Homepage MUST display at least one client case study showing transformation metrics: time in mentorship, number of sessions, income growth, career change, and before/after state comparison
- **FR-008**: Each case study MUST include a "Before" state (employment, challenges) and "After" state (achievements like agency creation, team growth, income increase, lifestyle improvements)
- **FR-009**: Homepage MUST display client testimonials section with quotes from previous clients including their names and professional roles
- **FR-010**: Homepage MUST feature at least one course preview titled "МІНІ КУРС - ГРОШІ КОЖЕН ДЕНЬ" with a call-to-action to learn more
- **FR-011**: Homepage MUST display the coach's professional photo in the hero section
- **FR-012**: Homepage MUST display the coach's photo in the footer section

#### Navigation Requirements

- **FR-013**: Homepage MUST provide a navigation menu with links to: Головна (Home), Про мене (About Me), Курси (Courses), Відгуки (Testimonials), Контакти (Contacts)
- **FR-014**: Navigation MUST remain visible when the visitor scrolls down the page
- **FR-015**: Navigation MUST highlight the currently active section or page
- **FR-016**: Navigation MUST adapt to mobile devices by providing a menu for small screens
- **FR-017**: Homepage MUST provide social media links to YouTube and Instagram in the header
- **FR-018**: Footer MUST provide social media links to Facebook, Instagram, YouTube, and TikTok

#### Consultation Booking Requirements

- **FR-019**: Homepage MUST provide a "Записатись на розбір" (Book a Session) button in the hero section *(`src/components/sections/HeroSection.astro:25-32` CTA button with onClick handler)*
- **FR-020**: Homepage MUST provide a "Записатись на діагностику" (Book Diagnostic Session) button in the footer *(`src/components/layout/Footer.astro:40-47` CTA button)*
- **FR-021**: Clicking either booking button MUST open a consultation request form *(`src/stores/uiStore.ts:8-10` openConsultationModal action, `ConsultationModal.tsx:11-12` isOpen state)*
- **FR-022**: Consultation form MUST collect the following information: Name (required), Phone number (required), Telegram handle (optional), Email address (optional) *(`src/types/consultationForm.ts:7-38` Zod schema, `ConsultationModal.tsx:102-157` form inputs)*
- **FR-023**: Consultation form MUST validate required fields before allowing submission *(`ConsultationModal.tsx:16-23` React Hook Form with zodResolver, `src/types/consultationForm.ts:8-20` name/phone required validation)*
- **FR-024**: Phone number field MUST provide visual formatting guidance *(`ConsultationModal.tsx:116-123` Input component with placeholder "+380XXXXXXXXX")*
- **FR-025**: Telegram field MUST support handles starting with @ symbol *(`src/types/consultationForm.ts:26-30` transform function auto-prefixes @)*
- **FR-026**: Consultation form MUST display validation errors clearly for incomplete or invalid data *(`ConsultationModal.tsx:112, 123, 133, 143` error prop in Input components bound to React Hook Form errors object)*
- **FR-027**: Consultation form MUST show a loading state while submission is processing *(`ConsultationModal.tsx:13, 26` submitStatus state, `ConsultationModal.tsx:163` button disabled={submitStatus === 'submitting'})*
- **FR-028**: System MUST store submitted consultation requests in a persistent database with: submission ID, name, phone, Telegram handle, email, source page ("home_page"), and submission timestamp *(`src/pages/api/submit-lead.ts:110-114` Supabase insert, `specs/002-home-page/data-model.md:13-31` leads table schema)*
- **FR-029**: System MUST send an email notification to the coach when a consultation request is submitted *(`src/pages/api/submit-lead.ts:117-159` Resend email sending with HTML template)*
- **FR-030**: Email notification MUST include: client name, phone number, Telegram handle, email address, submission date/time, and source page *(`src/pages/api/submit-lead.ts:126-153` email HTML template with all fields)*
- **FR-031**: Consultation form MUST display a success message after successful submission *(`ConsultationModal.tsx:70-99` success state rendering with checkmark icon and gold gradient animation)*
- **FR-032**: Consultation form MUST display an error message if submission fails *(`ConsultationModal.tsx:52-55` error handling, `ConsultationModal.tsx:159-173` error state rendering)*
- **FR-033**: Success message MUST confirm the request was received *(`ConsultationModal.tsx:85-91` Ukrainian success message "Ваш запит успішно надіслано!")*
- **FR-034**: Consultation form MUST be closable via a close button or keyboard shortcut *(`ConsultationModal.tsx:58-66` handleClose function, `Modal.tsx` Escape key handling)*
- **FR-035**: Consultation form MUST prevent interaction with background content while open *(`Modal.tsx` overlay with pointer-events blocking background)*

#### Responsive Design Requirements

- **FR-036**: Homepage MUST be fully functional on desktop screens (1200px and wider)
- **FR-037**: Homepage MUST be fully functional on tablet screens (768px - 1199px)
- **FR-038**: Homepage MUST be fully functional on mobile screens (320px - 767px)
- **FR-039**: Hero section MUST display text and image side-by-side on desktop and stacked on mobile
- **FR-040**: Questions sections MUST display in two columns on desktop and single column on mobile
- **FR-041**: Case studies MUST display in a grid on desktop and adapt for mobile viewing
- **FR-042**: Testimonials MUST display in 2-3 columns on desktop and adapt to smaller screens
- **FR-043**: All interactive elements MUST be easily tappable on touch devices (minimum 44x44 pixel touch targets)

#### Performance Requirements

- **FR-044**: Homepage MUST load the initial content (hero section) in under 2.5 seconds on a 3G connection
- **FR-045**: Images MUST be optimized to reduce file size
- **FR-046**: Below-the-fold images MUST load after initial page content
- **FR-047**: Hero image MUST load with high priority
- **FR-048**: Page layout MUST not shift visually while content loads

#### Accessibility Requirements

- **FR-049**: Homepage MUST use semantic HTML elements (header, nav, main, section, article, footer)
- **FR-050**: All interactive elements MUST have appropriate labels
- **FR-051**: All images MUST have descriptive alternative text
- **FR-052**: Consultation form MUST be fully navigable using keyboard only (Tab, Enter, Escape keys)
- **FR-053**: All interactive elements MUST have visible focus indicators when navigated via keyboard
- **FR-054**: Text MUST have sufficient color contrast (minimum 4.5:1 for body text, 3:1 for large text)
- **FR-055**: Page MUST respect user's motion preferences and reduce animations if requested

#### SEO Requirements

- **FR-056**: Homepage MUST have a unique page title: "Вікторія Жульова - Сертифікований коуч | Коучинг для підприємців та IT-спеціалістів"
- **FR-057**: Homepage MUST have a meta description: "Допоможу досягти ваших цілей за допомогою коучингу, медитацій, НЛП. 10+ років досвіду, 200+ клієнтів, 12 000+ годин практики. Запишіться на безкоштовний розбір."
- **FR-058**: Homepage MUST include meta tags for social media sharing with professional photo (1200x630px)
- **FR-059**: Homepage MUST have a canonical URL pointing to the production domain

### Key Entities *(include if feature involves data)*

- **Consultation Request**: Represents a potential client's request to book a coaching session. Attributes include: unique identifier, client name, phone number, Telegram handle (optional), email address (optional), source page identifier, timestamp of submission.

- **Client Case Study**: Represents a real client's transformation story used for social proof. Attributes include: time in mentorship, number of sessions completed, income growth multiplier, career change summary, "before" state description, "after" state description with specific achievements.

- **Client Testimonial**: Represents feedback from a previous client. Attributes include: testimonial text/quote, client name, client professional role or title.

- **Course Preview**: Represents a coaching course offered for self-paced learning. Attributes include: course title, brief description, link to full course details page.

- **Coach Statistics**: Represents quantifiable achievements and credentials. Attributes include: years of experience, total number of clients served, number of coaching tools, total hours of practice.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can view all homepage content within 10 seconds of initial page load on a standard broadband connection
- **SC-002**: At least 5% of homepage visitors submit a consultation request form
- **SC-003**: 95% of consultation form submissions are successfully stored without errors
- **SC-004**: 95% of consultation form submissions trigger an email notification within 1 minute
- **SC-005**: Visitors can complete the consultation form in under 1 minute
- **SC-006**: Page achieves a Lighthouse Performance score of 95 or higher
- **SC-007**: Page achieves a Lighthouse Accessibility score of 95 or higher
- **SC-008**: Page achieves a Lighthouse SEO score of 95 or higher
- **SC-009**: 100% of interactive elements are accessible via keyboard navigation
- **SC-010**: Page loads hero content (largest contentful paint) in under 2.5 seconds
- **SC-011**: Page layout remains stable with cumulative layout shift under 0.1
- **SC-012**: First user input is processed in under 100 milliseconds
- **SC-013**: 100% of images have appropriate alternative text for screen readers
- **SC-014**: Page functions correctly on all screen sizes from 320px to 1920px width
- **SC-015**: Mobile navigation menu opens within 300 milliseconds of user interaction
- **SC-016**: Consultation modal opens within 300 milliseconds of clicking booking button
- **SC-017**: At least 70% of visitors scroll past the hero section to view additional content
- **SC-018**: Average time on page is at least 2 minutes
- **SC-019**: Bounce rate is below 60%
- **SC-020**: Form validation errors display within 200 milliseconds

### Monitoring & Verification

How to measure each success criterion:

- **SC-001**: Tool: **Chrome DevTools Network tab** | Method: Open DevTools → Network tab → Reload page → Check "Load" time in bottom status bar → Verify <10 seconds on standard broadband
- **SC-002**: Tool: **Vercel Analytics or Google Analytics** | Method: Open Analytics dashboard → Navigate to Conversions → Calculate (form submissions / total visitors) × 100 → Verify ≥5%
- **SC-003**: Tool: **Supabase Dashboard** | Method: Open Supabase project → Navigate to leads table → Query: `SELECT COUNT(*) FROM leads` → Compare with form submission attempts → Verify success rate ≥95%
- **SC-004**: Tool: **Resend Dashboard + Vercel Function Logs** | Method: Resend Dashboard → Check delivery metrics → Cross-reference with Vercel logs → Verify ≥95% emails sent within 1 minute
- **SC-005**: Tool: **Manual timing test** | Method: Open consultation modal → Start timer → Fill all required fields (name, phone) → Click submit → Stop timer → Verify <1 minute
- **SC-006**: Tool: **Chrome DevTools Lighthouse** | Method: Open DevTools → Lighthouse tab → Select "Performance" → Generate report → Verify score ≥95
- **SC-007**: Tool: **Chrome DevTools Lighthouse** | Method: Open DevTools → Lighthouse tab → Select "Accessibility" → Generate report → Verify score ≥95
- **SC-008**: Tool: **Chrome DevTools Lighthouse** | Method: Open DevTools → Lighthouse tab → Select "SEO" → Generate report → Verify score ≥95
- **SC-009**: Tool: **Manual keyboard navigation test** | Method: Close mouse/trackpad → Press Tab repeatedly → Navigate through all interactive elements (CTA buttons, form inputs, navigation links) → Verify all receive focus
- **SC-010**: Tool: **Chrome DevTools Lighthouse (LCP metric)** | Method: Run Lighthouse Performance audit → Check "Largest Contentful Paint" value in metrics → Verify <2.5 seconds
- **SC-011**: Tool: **Chrome DevTools Lighthouse (CLS metric)** | Method: Run Lighthouse Performance audit → Check "Cumulative Layout Shift" value in metrics → Verify <0.1
- **SC-012**: Tool: **Chrome DevTools Lighthouse (FID/TBT metric)** | Method: Run Lighthouse Performance audit → Check "Total Blocking Time" → Verify <100ms (FID proxy metric)
- **SC-013**: Tool: **axe DevTools or WAVE extension** | Method: Install browser extension → Run accessibility scan → Check "Images" section → Verify all have alt text → Verify 100% coverage
- **SC-014**: Tool: **Chrome DevTools Responsive mode** | Method: Open DevTools → Toggle device toolbar → Test widths: 320px (mobile), 768px (tablet), 1440px (desktop), 1920px (large desktop) → Verify layout intact
- **SC-015**: Tool: **Chrome DevTools Performance tab** | Method: Record performance → Click mobile menu button → Stop recording → Check interaction timing → Verify <300ms
- **SC-016**: Tool: **Chrome DevTools Performance tab** | Method: Record performance → Click "Записатись на розбір" CTA → Stop recording → Check modal render timing → Verify <300ms
- **SC-017**: Tool: **Vercel Analytics or Google Analytics** | Method: Analytics dashboard → Behavior → Scroll depth report → Check % of users scrolling past hero section → Verify ≥70%
- **SC-018**: Tool: **Vercel Analytics or Google Analytics** | Method: Analytics dashboard → Behavior → Average session duration → Filter for homepage → Verify ≥2 minutes
- **SC-019**: Tool: **Vercel Analytics or Google Analytics** | Method: Analytics dashboard → Behavior → Bounce rate for homepage → Verify <60%
- **SC-020**: Tool: **Chrome DevTools Performance tab + Manual test** | Method: Record performance → Submit form with invalid data → Stop recording → Check error message display timing → Verify <200ms

## Assumptions

1. **Email Service**: A reliable email delivery service is available for sending consultation request notifications
2. **Database Storage**: A database solution is available for persisting consultation requests
3. **Image Assets**: High-quality professional photos of the coach and clients (with permission) are available
4. **Content Language**: All content is in Ukrainian language
5. **Target Audience**: Primary audience includes entrepreneurs, IT professionals, and personal brand builders in Ukraine
6. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) from the last 2 years are supported
7. **Mobile-First Design**: Most visitors will access the site from mobile devices
8. **Social Media Presence**: Coach has active profiles on YouTube, Instagram, Facebook, and TikTok
9. **Course Catalog**: A separate page exists for the full courses catalog
10. **Payment Processing**: Course purchases are handled through external checkout links
11. **Analytics Tracking**: A web analytics solution is available for tracking user behavior
12. **Hosting Environment**: Website hosting supports serverless functions for form processing
13. **Data Privacy**: Consultation requests comply with data protection regulations
14. **Content Updates**: Coach can provide updated testimonials, case studies, and statistics as needed
15. **Form Field Requirements**: Consultation form collects exactly 4 fields - Name (required, 2-255 characters), Phone (required, 7-20 characters with format validation), Telegram (optional, 3-32 characters with @ prefix), Email (optional, valid email format)
16. **Form Validation**: Client-side validation using Zod schema with Ukrainian error messages provides immediate feedback before submission; server-side validation with identical Zod schema ensures data integrity even if client validation bypassed
17. **Contact Method Flexibility**: Users must provide at least one contact method (phone required), but can optionally provide additional methods (telegram/email) to accommodate different communication preferences

## Out of Scope

1. **User Authentication**: No user accounts, login, or password management
2. **Payment Processing**: No direct payment integration on homepage
3. **Live Chat**: No real-time chat widget
4. **Blog Section**: No blog posts on homepage
5. **Multi-Language Support**: Only Ukrainian language
6. **Admin Dashboard**: No content management system for updating homepage content
7. **Client Portal**: No secure area for existing clients
8. **Appointment Scheduling**: No calendar integration or automatic scheduling
9. **Email Marketing**: No newsletter signup or email campaign management
10. **Video Embedding**: No embedded videos on homepage
11. **Search Functionality**: No site search feature
12. **Cookie Consent**: No cookie banner (may be required separately)
13. **A/B Testing**: No built-in experimentation features
14. **Personalization**: No dynamic content based on visitor behavior
15. **Offline Support**: No progressive web app features
