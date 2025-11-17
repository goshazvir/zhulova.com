# Pre-Production Checklist: Email Configuration

**Purpose**: Ensure all email addresses are updated from development to production values before deploying to production.

**Current Development Email**: `goshazvir@gmail.com` (temporary testing address)
**Production Email**: *(to be determined - actual business email)*

---

##   CRITICAL: Change Email Before Production Deployment

The following locations contain email addresses that MUST be updated before going live:

---

## Where to Change Email Address

### 1. Local Development Environment

**File**: `.env` (in project root)

**Current Value**:
```bash
NOTIFICATION_EMAIL=goshazvir@gmail.com
```

**Change To** (before production):
```bash
NOTIFICATION_EMAIL=your-production-email@example.com
```

**Steps**:
1. Open `.env` file
2. Find line: `NOTIFICATION_EMAIL=goshazvir@gmail.com`
3. Replace with production email
4. Save file
5. Test locally: `npm run dev:vercel` ’ submit form ’ check email

**Note**: This file is in `.gitignore` and NOT committed to git.

---

### 2. Vercel Production Environment Variables

**Location**: Vercel Dashboard

**Steps**:

1. **Go to Vercel Dashboard**:
   - Open https://vercel.com/dashboard
   - Select project: `zhulova-com`

2. **Navigate to Environment Variables**:
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

3. **Find NOTIFICATION_EMAIL**:
   - Look for variable name: `NOTIFICATION_EMAIL`
   - Current value: `goshazvir@gmail.com` (or empty)

4. **Update Value**:
   - Click "Edit" button
   - Change value to: `your-production-email@example.com`
   - **Important**: Select "Production" environment only
   - Click "Save"

5. **Redeploy** (to apply changes):
   - Go to "Deployments" tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete

**Alternative Method** (via Vercel CLI):
```bash
vercel env add NOTIFICATION_EMAIL production
# Enter: your-production-email@example.com
```

---

## Email Configuration Details

### Required Environment Variables

| Variable | Purpose | Dev Value | Prod Value (to set) |
|----------|---------|-----------|---------------------|
| `NOTIFICATION_EMAIL` | Where lead notifications are sent | `goshazvir@gmail.com` | Business email |
| `RESEND_FROM_EMAIL` | Sender address (FROM field) | Empty (uses Resend default) | Empty or verified domain email |

### About RESEND_FROM_EMAIL

**Current**: Empty (Resend uses default sender: `onboarding@resend.dev`)

**For Production** (optional but recommended):
1. Verify domain `zhulova.com` in Resend dashboard
2. Add DNS records provided by Resend
3. Wait 24-48 hours for verification
4. Set `RESEND_FROM_EMAIL=noreply@zhulova.com`

**If you skip domain verification**:
- Emails will come from `onboarding@resend.dev`
- May be marked as spam
- Less professional appearance
- But functionality will work

---

## Files That Use Email (Auto-Update via Env Vars)

The following files read from environment variables and do NOT need code changes:

### API Endpoint

**File**: `api/submit-lead.ts`

**Code**:
```typescript
const { error } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
  to: process.env.NOTIFICATION_EMAIL || 'admin@example.com',
  // ...
});
```

 **No changes needed** - automatically uses `NOTIFICATION_EMAIL` from environment

### Test Scripts

**Files**:
- `.claude/scripts/test-supabase.js`
- `.claude/scripts/test-consultation-api.js`

 **No hardcoded emails** - use environment variables only

---

## Documentation Files (Examples Only - No Changes Needed)

The following files contain example/placeholder emails for documentation purposes:

### Specification Files

- `specs/005-fix-consultation-api/spec.md`
  - Examples: `olena@example.com`, `test@example.com`
  -  These are fictional examples, no changes needed

- `specs/005-fix-consultation-api/data-model.md`
  - Examples in code blocks only
  -  No changes needed

- `specs/005-fix-consultation-api/quickstart.md`
  - Placeholder: `your-email@example.com`
  -  No changes needed (users substitute their own)

- `specs/002-home-page/data-model.md`
  - Examples only
  -  No changes needed

### Configuration Examples

- `CLAUDE.md`
  - Contains placeholder: `NOTIFICATION_EMAIL`
  -  No changes needed (developer guide)

- `.env.example` (if exists)
  - Placeholder values
  -  No changes needed (template file)

---

## Pre-Deployment Testing Checklist

Before deploying to production, test the new email address:

### Step 1: Test Locally

- [ ] Update `.env` with production email
- [ ] Start server: `npm run dev:vercel`
- [ ] Open: `http://localhost:3000`
- [ ] Submit consultation form
- [ ] **Verify**: Email arrives at production address
- [ ] **Verify**: Email content is correct (name, phone, etc.)
- [ ] Delete test records from Supabase

### Step 2: Test on Vercel Preview

- [ ] Push code to GitHub (email in `.env` won't be pushed - it's gitignored)
- [ ] Create pull request
- [ ] Vercel creates preview deployment
- [ ] Update `NOTIFICATION_EMAIL` for Preview environment in Vercel
- [ ] Test form submission on preview URL
- [ ] **Verify**: Email arrives at production address
- [ ] Delete test records

### Step 3: Production Deployment

- [ ] Update `NOTIFICATION_EMAIL` in Vercel (Production environment)
- [ ] Merge PR to main branch
- [ ] Vercel auto-deploys to production
- [ ] Wait for deployment complete
- [ ] Test on `https://zhulova.com`
- [ ] Submit test form
- [ ] **Verify**: Email arrives
- [ ] **Verify**: Database record created
- [ ] Delete test records

### Step 4: Monitor First Real Submissions

- [ ] Keep email inbox open for first 24 hours
- [ ] Verify all lead emails are received
- [ ] Check Supabase dashboard for records
- [ ] Confirm no errors in Vercel function logs

---

## Troubleshooting Email Issues

### Emails Not Arriving

**Check**:
1. **Email address typo**:
   - Verify correct spelling in Vercel env vars
   - No extra spaces

2. **Spam folder**:
   - Check spam/junk folder
   - Add `onboarding@resend.dev` to safe senders

3. **Resend account status**:
   - Go to https://resend.com/emails
   - Check recent sends
   - Look for "Delivered" or "Bounced"

4. **Vercel function logs**:
   - Vercel Dashboard ’ Deployments ’ Function Logs
   - Search for: `[API] Email send`
   - Look for error messages

5. **Environment variable not set**:
   - Vercel Dashboard ’ Settings ’ Environment Variables
   - Verify `NOTIFICATION_EMAIL` exists
   - Verify it's assigned to "Production" environment
   - Try redeploying after setting

### Emails Go to Wrong Address

**Cause**: Old environment variable still cached

**Solution**:
1. Vercel Dashboard ’ Deployments
2. Redeploy latest deployment
3. Environment variables update on redeploy

### Emails Marked as Spam

**Cause**: Using `onboarding@resend.dev` sender address

**Solution**:
1. Verify domain in Resend (see section above)
2. Update `RESEND_FROM_EMAIL` to verified domain
3. Redeploy

---

## Quick Reference

### Summary: Where to Change Email

| Location | Steps | Notes |
|----------|-------|-------|
| **Local `.env`** | Edit file, change `NOTIFICATION_EMAIL` | For local testing only, not committed to git |
| **Vercel Production** | Dashboard ’ Env Vars ’ Edit ’ Redeploy | **MOST IMPORTANT** - this is what production uses |

### Environment Variable Names

- `NOTIFICATION_EMAIL` - **WHERE** lead emails are sent (recipient)
- `RESEND_FROM_EMAIL` - **FROM** address in email (sender)
- `RESEND_API_KEY` - Resend authentication (don't change)

### Commands

```bash
# Test locally
npm run dev:vercel

# Test database
npm run test:supabase

# Update Vercel env var (CLI)
vercel env add NOTIFICATION_EMAIL production

# Pull env vars from Vercel
vercel env pull .env
```

---

## After Production Launch

### Monitor Email Delivery

**Week 1**:
- Check email inbox daily for lead notifications
- Verify all emails arriving correctly
- Monitor Resend dashboard for delivery status

**Ongoing**:
- Set up email forwarding rules if needed
- Consider upgrading Resend plan if volume increases
- Monitor Vercel function logs for errors

### Backup Plan

If emails stop working:
1. Check Resend dashboard for account issues
2. Verify Vercel environment variables unchanged
3. Check Vercel function logs for errors
4. Test with `npm run dev:vercel` locally
5. Contact Resend support if needed

---

**Last Updated**: 2025-11-17
**Related Files**: `.env`, `api/submit-lead.ts`, Vercel configuration

**Questions?** Check `CLAUDE.md` or `.claude/docs/technical-spec.md` for more details.
