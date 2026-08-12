/**
 * Gift promo modal configuration.
 * Values are fixed by the Designer's UX research — see docs/architecture/promo-modal.md §6.
 * The `_v1` storage-key suffix is the reset lever for future campaigns.
 */
export const promoConfig = {
  storageKey: 'zh_promo_gift_v1',
  triggerDelayMs: 12_000,
  engagedDelayMs: 6_000,
  engagedScrollDepth: 0.5,
  reshowAfterDismissedMs: 7 * 24 * 60 * 60 * 1000,
  reshowAfterShownMs: 3 * 24 * 60 * 60 * 1000,
  maxLifetimeShows: 3,
  excludedPathPrefixes: ['/quiz', '/courses/opora'],
  excludedPaths: ['/privacy-policy', '/terms', '/oferta', '/404'],
} as const;

export type PromoConfig = typeof promoConfig;
