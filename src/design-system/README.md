# Zhulova Design System

Code-based design system for zhulova.com. Single source of truth for reusable UI primitives.

## Tokens

Defined in `tailwind.config.mjs` (do not duplicate here):

- **Colors:** `navy` (primary), `gold` (accent/CTA), `sage` (secondary) — 9 shades each (50–900).
- **Fonts:** `font-serif` = Playfair Display (headings), `font-sans` = Inter (body).
- **Spacing:** custom scale `18`, `88`, `112`, `128`.

## Components

Import from `@design-system`:

- **Button** — `variant: primary | secondary | outline`, `size: sm | md | lg`.
- **Input** — labelled text input with `error` / `helperText`, accessible.
- **Modal** — accessible dialog.
- **Heading** — serif heading, `level: 1 | 2 | 3 | 4`.
- **Text** — body text, `size: sm | md | lg`, `tone: default | muted | gold`.
- **Card** — `variant: default | bordered | elevated`, `padding: sm | md | lg`.
- **Section** — vertical rhythm, `spacing: sm | md | lg`, `background: none | navy | sage`.
- **Container** — max-width + horizontal padding wrapper.
- **Badge** — `variant: navy | gold | sage`, `size: sm | md`.
- **Stat** — large serif number + caption.

## Principles

- Presentational only (no hooks/state) — preserves the site's 0KB-JS target.
- Tailwind classes only, no CSS-in-JS.
- TypeScript strict, props extend `ComponentProps<'element'>`.

## Sync to Claude Design

Run `/design-sync` from the repo root — it reads the tokens (`tailwind.config.mjs`) and these React components directly.
