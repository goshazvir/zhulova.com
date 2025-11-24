# Component Structure Analysis Report

**Generated**: 2025-11-24T10:38:23.793Z

## 📊 Current Structure

**Total Components**: 14
**Structure Type**: Flat (files in category folders)

### Component Distribution

| Category | Count | Components |
|----------|-------|------------|
| common | 3 | Button, Input, Modal |
| layout | 3 | Footer, Header, MobileMenu |
| sections | 7 | CaseStudiesSection, CoursesPreview, HeroSection (+4 more) |
| forms | 1 | ConsultationModal |

### ⚠️ Large Components (>300 lines)

- **HeroSection**: 758 lines (Astro)

## 🧪 Testability Analysis

**Current Testability Score**: 21%
**Expected After Migration**: 85%

### Blockers

- HeroSection: Too large (758 lines) - needs splitting

## 🏗️ Proposed Folder-Based Structure

### Benefits

- ✅ Co-located tests with components
- ✅ Better organization and discoverability
- ✅ Easier to maintain and scale
- ✅ Supports Storybook stories
- ✅ Clear separation of concerns
- ✅ Enables code splitting per component
- ✅ Facilitates component documentation

### Example Structure

```
src/components/
├── common/
│   ├── Button/
│   │   ├── index.tsx           # Component
│   │   ├── Button.test.tsx     # Unit tests
│   │   └── Button.stories.tsx  # Storybook
│   └── Modal/
│       ├── index.tsx
│       └── Modal.test.tsx
├── layout/
│   ├── Header/
│   │   ├── index.astro
│   │   └── Header.test.ts
│   └── Footer/
│       ├── index.astro
│       └── Footer.test.ts
└── forms/
    └── ConsultationModal/
        ├── index.tsx
        ├── ConsultationModal.test.tsx
        └── validation.ts        # Co-located utilities
```

## 📈 Migration Plan

**Total Effort Score**: 28 points
**Estimated Time**: 3 days

### Migration Priority

1. **Phase 1** (Day 1): Common components (Button, Modal, Input)
2. **Phase 2** (Day 2): Form components (ConsultationModal, ContactForm)
3. **Phase 3** (Day 3): Layout components (Header, Footer, Navigation)
4. **Phase 4** (Day 4-5): Section components (split large ones first)

## 🎯 Testing Strategy

### Unit Testing Stack

- **Framework**: Vitest
- **React Testing**: @testing-library/react
- **Astro Testing**: @astrojs/testing-library
- **Coverage Goal**: 80%

### Test File Conventions

- React components: `ComponentName.test.tsx`
- Astro components: `ComponentName.test.ts`
- Integration tests: `tests/integration/*.test.ts`
- E2E tests: `tests/e2e/*.spec.ts`

## 💡 Recommendations

1. **Start with new components** - Use folder structure for any new components
2. **Migrate incrementally** - One category at a time
3. **Split large components** - Before migration, refactor components >300 lines
4. **Add tests during migration** - Write at least one test per component
5. **Update imports gradually** - Use path aliases to simplify imports
6. **Document as you go** - Add JSDoc comments and README files
