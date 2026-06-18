import base from '../tailwind.config.mjs';

// Design-system-scoped Tailwind config: real theme tokens, content limited to
// the design-system components so the emitted CSS contains exactly the
// utilities the cards use.
export default {
  ...base,
  content: ['./src/design-system/**/*.{tsx,ts}', './.design-sync/previews/**/*.tsx'],
};
