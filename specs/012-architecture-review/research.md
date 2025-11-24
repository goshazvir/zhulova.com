# Architecture Review Research

**Feature**: Architecture Review
**Date**: 2025-11-24
**Branch**: `012-architecture-review`

## Executive Summary

Research conducted to evaluate the current architecture against best practices, performance requirements, and prepare for testing implementation. Key finding: **Hybrid mode is justified** for this project due to serverless API requirements.

## Rendering Mode Analysis

### Current Implementation: Hybrid Mode

**Decision**: Keep `output: 'hybrid'` in astro.config.mjs
**Rationale**:
- Enables serverless functions alongside static pages in single deployment
- Simplifies infrastructure (no separate API deployment needed)
- Vercel adapter optimizes both static and serverless automatically
- API routes (`/api/*`) require server-side execution for security

**Alternatives Considered**:
1. **Pure Static + Separate API**
   - Rejected: Increases deployment complexity, requires CORS configuration
   - Would need separate Vercel project or different platform for API

2. **Pure Static + Edge Functions**
   - Rejected: Edge functions have limitations (no Node.js APIs)
   - Supabase and Resend SDKs require full Node.js environment

3. **Full Server Mode**
   - Rejected: Loses CDN benefits for static content
   - Unnecessarily increases server load for static pages

### Constitution Alignment Resolution

While the constitution specifies "Static-First Delivery", the hybrid mode implementation actually achieves this:
- All pages (`/`, `/courses`, `/contacts`, etc.) are pre-rendered at build time
- Only `/api/*` routes are serverless functions
- Pages are served from CDN exactly as in pure static mode
- The `hybrid` output mode with `export const prerender = true` (default) makes pages static

**Recommendation**: Update CLAUDE.md to clarify that hybrid mode with static pages is acceptable when API endpoints are required.

## Performance Optimization Strategy

### Current State Assessment

**Strengths**:
- Images already using Astro's `<Image>` component with WebP format
- Tailwind CSS with purging configured
- Minimal React hydration (only interactive components)
- View Transitions API for smooth navigation

**Areas for Improvement**:
1. Bundle size monitoring not automated
2. No performance budget enforcement in CI/CD
3. Missing resource hints (preconnect, prefetch)
4. Font loading strategy could be optimized

### Testing Infrastructure Requirements

**Decision**: Adopt folder-based component structure
**Rationale**:
- Co-locates tests with components
- Scales better for larger codebases
- Industry standard pattern
- Easier to maintain test coverage

**Proposed Structure**:
```
src/components/
├── Button/
│   ├── index.tsx
│   ├── Button.test.tsx
│   └── Button.stories.tsx (optional)
```

**Migration Strategy**:
- Gradual migration as components are modified
- Start with new components
- Migrate existing components when adding tests

## Accessibility Compliance Strategy

### Required Tooling

1. **Automated Testing**:
   - axe-core for development (via browser extension)
   - @axe-core/playwright for CI/CD integration
   - pa11y for command-line audits

2. **Manual Testing Protocol**:
   - Keyboard navigation checklist
   - Screen reader testing (NVDA/JAWS on Windows, VoiceOver on Mac)
   - Color contrast validation

### Common Issues to Address

Based on typical Astro/React projects:
- Missing skip links
- Insufficient focus indicators
- Heading hierarchy violations
- Missing ARIA labels on interactive elements
- Color contrast in gold accent color

## TypeScript Strictness Validation

### Current Configuration Review

**Verified Settings**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Additional Recommendations**:
- Add `noUnusedLocals: true`
- Add `noUnusedParameters: true`
- Add `noImplicitReturns: true`
- Add `noFallthroughCasesInSwitch: true`

## Testing Framework Selection

### Unit Testing

**Decision**: Vitest
**Rationale**:
- Native ESM support (works with Astro)
- Fast execution (uses esbuild)
- Jest-compatible API
- TypeScript support out of the box
- Excellent DX with hot module replacement

### E2E Testing

**Decision**: Playwright
**Rationale**:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Built-in accessibility testing
- Network interception for API mocking
- Visual regression testing capabilities
- Parallel test execution

### Component Testing

**Decision**: Storybook (optional, for design system)
**Rationale**:
- Visual component documentation
- Isolated component development
- Accessibility testing integration
- Useful for design system components

## Best Practices Validation

### Code Organization

**Current Issues**:
1. No clear separation of concerns in some components
2. Missing error boundaries for React components
3. Inconsistent file naming (some .ts, some .tsx for non-JSX files)

**Recommendations**:
1. Adopt consistent naming: `.tsx` only for JSX, `.ts` for everything else
2. Add error boundaries for all React islands
3. Extract business logic from components into hooks/utilities

### Performance Best Practices

**To Implement**:
1. Add `<link rel="preconnect">` for Google Fonts
2. Use `font-display: swap` for web fonts
3. Implement image lazy loading with native loading attribute
4. Add CSP headers in vercel.json
5. Enable brotli compression (verify Vercel setting)

### Security Considerations

**Current State**: Generally secure
**Improvements Needed**:
1. Add Content Security Policy headers
2. Implement rate limiting for API endpoint
3. Add request validation middleware
4. Set security headers (X-Frame-Options, X-Content-Type-Options)

## Infrastructure Recommendations

### CI/CD Pipeline Enhancements

1. **Pre-commit hooks** (using Husky):
   - TypeScript checking
   - ESLint/Prettier
   - Lighthouse CI assertions

2. **GitHub Actions workflow**:
   - Build verification
   - Type checking
   - Accessibility testing
   - Performance budgets

3. **Monitoring**:
   - Vercel Analytics (already configured)
   - Error tracking (consider Sentry)
   - Uptime monitoring

## Migration Path

### Phase 1: Quick Wins (1 day)
- Add security headers
- Optimize font loading
- Add preconnect hints
- Fix any TypeScript `any` usage

### Phase 2: Structure (3-5 days)
- Migrate to folder-based components (gradual)
- Add error boundaries
- Implement CSP

### Phase 3: Testing Setup (1 week)
- Configure Vitest
- Add first unit tests
- Setup Playwright
- Create test utilities

### Phase 4: Automation (3 days)
- Setup pre-commit hooks
- Configure CI/CD pipeline
- Add performance budgets
- Implement monitoring

## Conclusions

1. **Hybrid mode is correct** for this project - provides best of both worlds
2. **Performance targets are achievable** with current architecture
3. **Component restructuring recommended** but not critical
4. **Testing infrastructure** can be added without major refactoring
5. **Accessibility compliance** requires minor fixes, mostly good
6. **Security posture** is adequate, can be enhanced with headers

## Next Steps

1. Run actual Lighthouse audits to establish baseline
2. Perform accessibility audit with axe-core
3. Create detailed task list for improvements
4. Prioritize based on impact vs effort
5. Begin implementation with quick wins