# Analytics & Ad Pixels Setup Guide

**Purpose:** Configure all analytics tracking keys for GA4, Google Ads, Meta Pixel, and Microsoft Clarity.

**Time required:** 30-40 minutes total  
**Difficulty:** Easy (mostly copy-paste)  
**Blocked task:** GEO-38 (waiting for these keys)

---

## Overview

Five tracking integrations needed:

| Service | Variable | Format | Status |
|---------|----------|--------|--------|
| Google Analytics 4 | `PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ⏳ Needed |
| Google Ads Conversion | `PUBLIC_GOOGLE_ADS_ID` | `AW-XXXXXXXXX` | ⏳ Needed |
| Google Ads Label | `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | `label/xxxxx` | ⏳ Needed |
| Meta (Facebook) Pixel | `PUBLIC_FB_PIXEL_ID` | Numeric ID | ⏳ Needed |
| Microsoft Clarity | `PUBLIC_CLARITY_PROJECT_ID` | UUID format | ⏳ Needed |

---

## Step 1: Google Analytics 4 (GA4)

### Get Measurement ID

1. Go to **Google Analytics 4** → https://analytics.google.com
2. Select your **property** (or create new one for zhulova.com)
3. Left menu: **Admin** → **Property** → **Data Streams**
4. Click on your **Web** data stream
5. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

**Example:** `G-ABC123XYZ45`

### Store in .env

```bash
PUBLIC_GA4_MEASUREMENT_ID=G-ABC123XYZ45
```

---

## Step 2: Google Ads Conversion Tracking

### Get Conversion ID & Label

1. Go to **Google Ads** → https://ads.google.com
2. Top right: **Tools & Settings** (wrench icon)
3. Left menu: **Measurement** → **Conversions**
4. Find or create **Lead** conversion event
5. Look for:
   - **Conversion ID** (format: `AW-XXXXXXXXX`)
   - **Conversion Label** (format: `label/xxxxx`)

**Where to find:**
- Conversion ID: Usually in the conversion snippet `gtag('config', 'AW-XXXXXXXXX')`
- Label: In the conversion tracking code or conversion settings

### Store in .env

```bash
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=label/xxxxx
```

**Example:**
```bash
PUBLIC_GOOGLE_ADS_ID=AW-123456789
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=label/abc123xyz
```

---

## Step 3: Meta (Facebook) Pixel

### Get Pixel ID

1. Go to **Meta Events Manager** → https://business.facebook.com/events_manager
2. Left menu: **Data Sources**
3. Find your **Pixel** (or create new: "Create Pixel")
4. Copy **Pixel ID** (numeric, e.g., `1234567890123`)

**Steps to create new pixel (if needed):**
1. Click **Create Pixel**
2. Name: "zhulova.com"
3. Website URL: https://zhulova.com
4. Get Pixel ID from Settings

### Store in .env

```bash
PUBLIC_FB_PIXEL_ID=1234567890123
```

---

## Step 4: Microsoft Clarity

### Get Project ID

1. Go to **Microsoft Clarity** → https://clarity.microsoft.com
2. Sign in with Microsoft account (or create)
3. Click **+ Add a project**
4. Fill in:
   - **Project name:** "Zhulova"
   - **Website URL:** https://zhulova.com
5. After creation, go to **Settings** (bottom left)
6. Copy **Project ID** (UUID format, e.g., `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

### Store in .env

```bash
PUBLIC_CLARITY_PROJECT_ID=a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6
```

---

## Step 5: Update .env Files

### Local Development (.env)

Add all five keys to `/Users/goshazvir/Documents/github/zhulova/.env`:

```bash
# ============================================
# Analytics & Ad Pixels
# ============================================

# Google Analytics 4 - GA4 measurement ID
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Ads conversion tracking
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=label/xxxxx

# Meta (Facebook) Pixel ID
PUBLIC_FB_PIXEL_ID=your-pixel-id-here

# Microsoft Clarity project ID
PUBLIC_CLARITY_PROJECT_ID=your-clarity-project-id-here
```

### Production Setup (.env.example)

Already updated with placeholder comments. Verify it has all five variables documented.

---

## Step 6: Add to Vercel Environment Variables

### Via Vercel Dashboard

1. Go to **Vercel Dashboard** → Select **zhulova-com** project
2. **Settings** → **Environment Variables**
3. Add each variable to:
   - Production
   - Preview
   - Development

### Via Vercel CLI (Recommended)

Run these commands:

```bash
# GA4
printf 'G-XXXXXXXXXX\n' | vercel env add PUBLIC_GA4_MEASUREMENT_ID production
printf 'G-XXXXXXXXXX\n' | vercel env add PUBLIC_GA4_MEASUREMENT_ID preview
printf 'G-XXXXXXXXXX\n' | vercel env add PUBLIC_GA4_MEASUREMENT_ID development

# Google Ads ID
printf 'AW-XXXXXXXXX\n' | vercel env add PUBLIC_GOOGLE_ADS_ID production
printf 'AW-XXXXXXXXX\n' | vercel env add PUBLIC_GOOGLE_ADS_ID preview
printf 'AW-XXXXXXXXX\n' | vercel env add PUBLIC_GOOGLE_ADS_ID development

# Google Ads Label
printf 'label/xxxxx\n' | vercel env add PUBLIC_GOOGLE_ADS_CONVERSION_LABEL production
printf 'label/xxxxx\n' | vercel env add PUBLIC_GOOGLE_ADS_CONVERSION_LABEL preview
printf 'label/xxxxx\n' | vercel env add PUBLIC_GOOGLE_ADS_CONVERSION_LABEL development

# Meta Pixel
printf '1234567890123\n' | vercel env add PUBLIC_FB_PIXEL_ID production
printf '1234567890123\n' | vercel env add PUBLIC_FB_PIXEL_ID preview
printf '1234567890123\n' | vercel env add PUBLIC_FB_PIXEL_ID development

# Clarity
printf 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6\n' | vercel env add PUBLIC_CLARITY_PROJECT_ID production
printf 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6\n' | vercel env add PUBLIC_CLARITY_PROJECT_ID preview
printf 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6\n' | vercel env add PUBLIC_CLARITY_PROJECT_ID development
```

Then redeploy:
```bash
vercel deploy --prod
```

---

## Step 7: Verify Setup

### Test in Browser

After deployment:

1. Open https://zhulova.com in Chrome
2. Open **DevTools** (F12) → **Network** tab
3. Filter by:
   - `ga.js` or `analytics` (GA4)
   - `facebook.com/en_US/fbevents.js` (Meta Pixel)
   - `clarity.ms` (Microsoft Clarity)
4. Verify requests are being sent

### Check Analytics Dashboards

1. **GA4:** Visit https://analytics.google.com → Check "Real-time" → Load zhulova.com
2. **Google Ads:** Check Conversion Tracking → Verify events firing
3. **Meta:** Events Manager → Check data flow
4. **Clarity:** Dashboard → Verify page views

---

## Troubleshooting

### GA4 not showing events
- Verify `PUBLIC_GA4_MEASUREMENT_ID` is correct (starts with `G-`)
- Check in GA4 Real-time tab while browsing site
- May take up to 24 hours to appear in reports

### Meta Pixel not firing
- Verify pixel ID is numeric only
- Check Pixel Settings → Conversions are enabled
- Events Manager should show new events within minutes

### Google Ads conversions not tracking
- Verify both ID and Label are correct
- Check Google Ads Help Center for current tracking method
- May need conversion tracking tag on thank-you page

### Clarity not showing heatmaps
- Verify Project ID format (should be UUID)
- Clarity dashboard should show page views immediately
- Heatmaps appear after ~100 sessions

---

## Next Steps After Setup

1. **GEO-38:** Frontend Dev implements tracking code
2. **Testing:** Verify all pixels fire on:
   - Page load
   - Form submission
   - Quiz completion
3. **Launch ads:** Once verified, ready for paid campaigns

---

## References

- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9539747)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722054)
- [Meta Pixel Setup](https://www.facebook.com/business/help/952192354843755)
- [Microsoft Clarity Docs](https://clarity.microsoft.com/docs)

---

**Status:** Ready for implementation  
**Owner:** Backend/Frontend Dev  
**Blocked by:** Getting the five keys from services above
