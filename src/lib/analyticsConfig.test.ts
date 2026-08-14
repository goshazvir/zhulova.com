import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  getAnalyticsConfig,
  isGa4Enabled,
  isGoogleAdsEnabled,
  isMetaPixelEnabled,
  isClarityEnabled,
} from './analyticsConfig';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getAnalyticsConfig', () => {
  it('reads all five PUBLIC_ env vars into a config object', () => {
    vi.stubEnv('PUBLIC_GA4_MEASUREMENT_ID', 'G-TEST123');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', 'AW-TEST456');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', 'abcDEF');
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '1234567890');
    vi.stubEnv('PUBLIC_CLARITY_PROJECT_ID', 'abc123xyz');

    expect(getAnalyticsConfig()).toEqual({
      ga4MeasurementId: 'G-TEST123',
      googleAdsId: 'AW-TEST456',
      googleAdsConversionLabel: 'abcDEF',
      fbPixelId: '1234567890',
      clarityProjectId: 'abc123xyz',
    });
  });

  it('returns undefined for each var that is unset (no-op-safe stub, spec §2)', () => {
    vi.stubEnv('PUBLIC_GA4_MEASUREMENT_ID', '');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', '');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', '');
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '');
    vi.stubEnv('PUBLIC_CLARITY_PROJECT_ID', '');

    expect(getAnalyticsConfig()).toEqual({
      ga4MeasurementId: undefined,
      googleAdsId: undefined,
      googleAdsConversionLabel: undefined,
      fbPixelId: undefined,
      clarityProjectId: undefined,
    });
  });
});

describe('isGa4Enabled — AC1 (spec §11.1)', () => {
  it('is false when PUBLIC_GA4_MEASUREMENT_ID is unset', () => {
    vi.stubEnv('PUBLIC_GA4_MEASUREMENT_ID', '');
    expect(isGa4Enabled()).toBe(false);
  });

  it('is true when PUBLIC_GA4_MEASUREMENT_ID is set', () => {
    vi.stubEnv('PUBLIC_GA4_MEASUREMENT_ID', 'G-TEST123');
    expect(isGa4Enabled()).toBe(true);
  });
});

describe('isGoogleAdsEnabled', () => {
  it('is false when PUBLIC_GOOGLE_ADS_ID is unset', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', '');
    expect(isGoogleAdsEnabled()).toBe(false);
  });

  it('is true when PUBLIC_GOOGLE_ADS_ID is set', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', 'AW-TEST456');
    expect(isGoogleAdsEnabled()).toBe(true);
  });
});

describe('isMetaPixelEnabled', () => {
  it('is false when PUBLIC_FB_PIXEL_ID is unset', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '');
    expect(isMetaPixelEnabled()).toBe(false);
  });

  it('is true when PUBLIC_FB_PIXEL_ID is set', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '1234567890');
    expect(isMetaPixelEnabled()).toBe(true);
  });
});

describe('isClarityEnabled', () => {
  it('is false when PUBLIC_CLARITY_PROJECT_ID is unset', () => {
    vi.stubEnv('PUBLIC_CLARITY_PROJECT_ID', '');
    expect(isClarityEnabled()).toBe(false);
  });

  it('is true when PUBLIC_CLARITY_PROJECT_ID is set', () => {
    vi.stubEnv('PUBLIC_CLARITY_PROJECT_ID', 'abc123xyz');
    expect(isClarityEnabled()).toBe(true);
  });
});
