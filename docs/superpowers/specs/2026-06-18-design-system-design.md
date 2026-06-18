# Zhulova Design System — Design

**Date:** 2026-06-18
**Status:** Approved
**Goal:** Build a reusable, code-based design system for zhulova.com that Claude Design's `/design-sync` can read directly (tokens + React components), usable for generating new designs.

## Context

- High-performance static site (Astro + React islands + Tailwind, 0KB JS target).
- Design tokens already live in `tailwind.config.mjs`: `navy`/`gold`/`sage` palettes (9 shades each), fonts (Playfair Display serif, Inter sans), custom spacing.
- Existing React primitives: `Button`, `Input`, `Modal` in `src/components/common/` (each with a colocated test). `ConsultationModal` (feature component) consumes them.
- `/design-sync` reads tokens + React components from the directory where `claude` runs. It will be run from the repo root, so it sees both `tailwind.config.mjs` tokens and the design-system React components.

## Decisions

- **Scope:** zhulova.com only. No standalone repo — avoids duplicating tokens.
- **Single source of truth:** the design system owns the reusable primitives. `Button`/`Input`/`Modal` physically move into `src/design-system/`; the app imports them from there.
- **System boundary:** design system = reusable primitives only. Feature components (e.g. `ConsultationModal` — form + API call) stay in the app and are composed *from* design-system primitives.
- **Tokens are not duplicated:** components use existing Tailwind classes (`navy-*`, `gold-*`, `sage-*`, `font-serif`, `font-sans`). `tailwind.config.mjs` remains the token source.

## Architecture

New folder `src/design-system/`:

```
src/design-system/
├── index.ts                 # single entry point — re-exports all components
├── Button/    index.tsx + Button.test.tsx    (moved from common/)
├── Input/     index.tsx + Input.test.tsx     (moved from common/)
├── Modal/     index.tsx + Modal.test.tsx     (moved from common/)
├── Typography/index.tsx     # Heading, Text                (new)
├── Card/index.tsx           # Card                         (new)
├── Section/index.tsx        # Section + Container          (new)
├── Badge/index.tsx          # Badge, Stat                  (new)
└── README.md                # tokens + component catalog for design-sync
```

New path alias `@design-system` added to `tsconfig.json` and `astro.config.mjs`.

## Components

All new components follow the existing `Button` idiom: `variant`/`size` props, `baseClasses` + lookup-map objects, default or named exports, props extending `ComponentProps<'element'>`, className merge, no `any`.

- **Typography**
  - `Heading` — `font-serif`, `level: 1 | 2 | 3 | 4` mapped to sizes; renders matching `<h1>`–`<h4>`.
  - `Text` — `font-sans`, `size: sm | md | lg`, `tone: default | muted | gold`.
- **Card** — `variant: default | bordered | elevated`, optional `padding`; renders children via slot.
- **Section** — vertical rhythm via `spacing: sm | md | lg`, optional background; semantic `<section>`.
- **Container** — max-width + horizontal padding wrapper.
- **Badge** — `variant: navy | gold | sage`, `size: sm | md`.
- **Stat** — large serif number + caption label.

## Migration Steps

1. Create `src/design-system/`; move `Button`/`Input`/`Modal` (+ their tests) from `src/components/common/`.
2. Add `@design-system` alias in `tsconfig.json` and `astro.config.mjs`.
3. Update the 3 imports in `src/components/forms/ConsultationModal/index.tsx` to `@design-system`.
4. Write the new components (Typography, Card, Section, Badge/Stat) in the `Button` idiom.
5. Create `index.ts` (re-export all) and `README.md` (token + component catalog).
6. **Verification:** `npm run test:run` and `npm run build` must pass green.

## Principles

- 0KB JS preserved: presentational components, no hooks/state; if used on the live site, rendered statically (no `client:*` directive).
- TypeScript strict, no `any`; props extend `ComponentProps<'...'>`.
- Tailwind classes only, no CSS-in-JS.

## Out of Scope (YAGNI)

- Rewriting existing Astro sections.
- Separate repo / npm package.
- Storybook, stateful behavior, animations.
- Moving feature components (`ConsultationModal`) into the design system.

## Success Criteria

- `src/design-system/` exists with the 7 primitives + `index.ts` + `README.md`.
- App imports primitives from `@design-system`; no dangling `common/` imports.
- `npm run test:run` and `npm run build` pass.
- Running `/design-sync` from repo root surfaces the tokens and React components.
