# Zhulova Design System — conventions for building

A small, presentational React component library for a mindset-coach personal
brand. Aesthetic: "minimal luxury coach" — calm, editorial, navy + gold on
generous white space. Build with these real components; don't reinvent them.

## Setup & wrapping

- **No provider, no context, no client-side state.** Every component is
  presentational — render them directly. There is nothing to wrap the app in.
- **Styling is Tailwind utility classes.** The components ship their styling as
  Tailwind utilities; the compiled output is in `styles.css` (which `@import`s
  `_ds_bundle.css`). Include `styles.css` and the bundle and components look
  correct. Fonts (Playfair Display, Inter) load via a remote `@import` in
  `styles.css`.

## Styling idiom

Style through each component's **props first**, then Tailwind utilities for your
own layout glue. Every component also accepts `className` to extend it.

The theme vocabulary (real token families — use these names, don't invent):

- **Colors:** `navy-{50–900}` (primary brand), `gold-{50–900}` (accent / CTA),
  `sage-{50–900}` (secondary). e.g. `bg-navy-900`, `text-gold-600`, `bg-sage-50`.
- **Fonts:** `font-serif` = Playfair Display (headings), `font-sans` = Inter (body).

Component prop vocabulary (see each `<Name>.d.ts`):

- `Button` — `variant: 'primary' | 'secondary' | 'outline'`, `size: 'sm' | 'md' | 'lg'`
- `Card` — `variant: 'default' | 'bordered' | 'elevated'`, `padding: 'sm' | 'md' | 'lg'`
- `Heading` — `level: 1 | 2 | 3 | 4`; `Text` — `size: 'sm' | 'md' | 'lg'`, `tone: 'default' | 'muted' | 'gold'`
- `Section` — `spacing: 'sm' | 'md' | 'lg'`, `background: 'none' | 'navy' | 'sage'`; `Container` — centered max-width wrapper
- `Badge` — `variant: 'navy' | 'gold' | 'sage'`, `size: 'sm' | 'md'`; `Stat` — `value`, `label`
- `Input` — `label` (required), `error`, `helperText`; `Modal` — `isOpen`, `onClose`, `title`

## Where the truth lives

Read `styles.css` (and the `_ds_bundle.css` it imports) for the compiled token
and component styles, and each component's `<Name>.d.ts` + `<Name>.prompt.md`
for its exact API.

## Idiomatic example

```tsx
import { Section, Container, Heading, Text, Button, Badge } from 'zhulova';

<Section spacing="lg" background="sage">
  <Container>
    <Badge variant="gold">Now enrolling</Badge>
    <Heading level={2} className="mt-4">Transform your mindset</Heading>
    <Text tone="muted" className="mt-3">
      Personalized coaching for entrepreneurs and experts building a personal brand.
    </Text>
    <Button variant="primary" className="mt-6">Book a consultation</Button>
  </Container>
</Section>
```
