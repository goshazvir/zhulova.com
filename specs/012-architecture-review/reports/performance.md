# Local Performance Analysis Report

**Generated**: 2025-11-24T10:18:12.859Z
**Type**: Local Build Analysis

## 📦 Bundle Size Analysis

### JavaScript Bundles

| File | Size | Gzipped |
|------|------|---------||

**Total JS**: 0.0KB gzipped
**Status**: ✅ Within 50KB limit

### CSS Bundles

| File | Size | Gzipped |
|------|------|---------||
| client/_astro/contacts.BkfZtnQC.css | 33.2KB | 6.4KB |
| client/_astro/index.CUggIgTI.css | 10.9KB | 2.4KB |

**Total CSS**: 8.8KB gzipped

### HTML Pages

| Page | Size | Scripts | Styles | Images | Features |
|------|------|---------|--------|--------|----------|

**Total Assets**: 8.8KB (JS + CSS)

## 🔍 TypeScript Analysis

| Check | Result |
|-------|--------|
| TypeScript Errors | ✅ None |
| Strict Mode | ✅ Enabled |

## 📊 Code Quality Metrics

| Metric | Count | Status |
|--------|-------|--------|
| 'any' type usage | 0 | ✅ |
| console.log statements | 1 | ⚠️ |
| TODO/FIXME comments | 0 | ✅ |
| Large components (>300 lines) | 1 | ⚠️ |

### Large Components

- src/components/sections/HeroSection.astro: 758 lines

## ✅ Performance Checklist

- [x] JS Bundle < 50KB
- [x] TypeScript strict mode
- [x] No TypeScript errors
- [x] No "any" types
- [ ] View Transitions enabled
- [ ] Images lazy loading

**Overall Score**: 67%

## 💡 Recommendations

- **Refactor large components**: 1 components exceed 300 lines
  - Split into smaller components
  - Extract logic into hooks/utilities

