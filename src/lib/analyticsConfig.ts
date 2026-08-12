/**
 * Analytics vendor IDs, read once from PUBLIC_ env vars (spec §2 / §10).
 * Every vendor is no-op-safe: an unset var disables that vendor entirely
 * instead of throwing, so the site builds and runs with zero credentials.
 */
export interface AnalyticsConfig {
  ga4MeasurementId: string | undefined;
  googleAdsId: string | undefined;
  googleAdsConversionLabel: string | undefined;
  fbPixelId: string | undefined;
  clarityProjectId: string | undefined;
}

function readPublicEnv(name: string): string | undefined {
  const value = import.meta.env[name];
  return value ? value : undefined;
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    ga4MeasurementId: readPublicEnv('PUBLIC_GA4_MEASUREMENT_ID'),
    googleAdsId: readPublicEnv('PUBLIC_GOOGLE_ADS_ID'),
    googleAdsConversionLabel: readPublicEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL'),
    fbPixelId: readPublicEnv('PUBLIC_FB_PIXEL_ID'),
    clarityProjectId: readPublicEnv('PUBLIC_CLARITY_PROJECT_ID'),
  };
}

export function isGa4Enabled(): boolean {
  return Boolean(getAnalyticsConfig().ga4MeasurementId);
}

export function isGoogleAdsEnabled(): boolean {
  return Boolean(getAnalyticsConfig().googleAdsId);
}

export function isMetaPixelEnabled(): boolean {
  return Boolean(getAnalyticsConfig().fbPixelId);
}

export function isClarityEnabled(): boolean {
  return Boolean(getAnalyticsConfig().clarityProjectId);
}
