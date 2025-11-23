# Quickstart: Testing Consultation API Fix

**Feature**: 005-fix-consultation-api
**Purpose**: Verify that the consultation form submission works end-to-end

---

## Prerequisites

### 1. Environment Variables

Ensure `.env` file exists in project root with:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...  # Server-side only

# Resend Configuration
RESEND_API_KEY=re_...

# Email Configuration
NOTIFICATION_EMAIL=your-email@example.com
RESEND_FROM_EMAIL=noreply@zhulova.com  # Required for email notifications
```

**Get values**:
- Supabase: Dashboard → Project Settings → API
- Resend: Dashboard → API Keys
- If missing, run: `vercel env pull .env`

### 2. Dependencies Installed

```bash
npm install
```

---

## Testing Workflow

### Step 1: Database Connectivity Test

**Purpose**: Verify Supabase connection and `leads` table access

```bash
npm run test:supabase
```

**Expected Output**:
```
✅ SUPABASE_URL: https://...
✅ SUPABASE_SERVICE_KEY: eyJ...
✅ Supabase client created
✅ Record created with ID: ...
✅ Record successfully read from database
✅ Data matches - everything works correctly!
ℹ️  Total records in table: X
✅ Test record successfully deleted
✅ Record confirmed deleted from database

✅ ALL TESTS PASSED SUCCESSFULLY!
```

**If it fails**:
- Check `.env` file has correct `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Verify service role key (not anon key)
- Check Supabase RLS policies allow service role to insert

---

### Step 2: API Endpoint Test (Local)

**Purpose**: Test API validation and full submission flow

#### 2.1 Start Development Server

```bash
npm run dev:vercel
```

**Wait for**: `Ready! Available at http://localhost:3000`

**Important**: Must use `dev:vercel` (not `dev`) to enable serverless functions

#### 2.2 Run API Test Script

In a **new terminal** (keep server running):

```bash
node .claude/scripts/test-consultation-api.js
```

**Expected Output**:
```
🧪 Testing: /api/submit-lead endpoint

Test 1: Valid submission (all fields)
✅ PASS - Status: 200, Lead ID: ...

Test 2: Valid submission (required only)
✅ PASS - Status: 200, Lead ID: ...

Test 3: Telegram without @ (normalization)
✅ PASS - Status: 200, Telegram stored as: @username

Test 4: Invalid phone format
✅ PASS - Status: 400, Validation error

Test 5: Missing required field
✅ PASS - Status: 400, Validation error

✅ ALL TESTS PASSED (5/5)
```

**If it fails**:
- Check server is running on port 3000
- Check `.env` has all required variables
- Check Supabase and Resend are accessible
- Look for errors in server terminal

---

### Step 3: Manual Browser Test (E2E)

**Purpose**: Test real user flow from UI to database

#### 3.1 Open Homepage

1. Keep `npm run dev:vercel` running
2. Open browser: `http://localhost:3000`
3. Click "Записатись на консультацію" button

**Expected**: Modal opens with empty form

#### 3.2 Fill Form (All Fields)

- **Ім'я**: `Test User`
- **Телефон**: `+380501234567`
- **Telegram**: `testuser` (without @)
- **Email**: `test@example.com`

Click **"Відправити заявку"**

**Expected**:
1. Button shows "Надсилання..." with spinner
2. Success message appears: "Дякуємо за вашу заявку!"
3. Modal auto-closes after 3 seconds

#### 3.3 Verify Database

**Option A: Supabase Dashboard**

1. Go to https://supabase.com/dashboard
2. Select project → Table Editor → `leads`
3. Find latest record (sort by `created_at DESC`)
4. Verify data:
   - `name`: "Test User"
   - `phone`: "+380501234567"
   - `telegram`: "@testuser" (normalized with @)
   - `email`: "test@example.com"
   - `source`: "consultation_modal"
   - `user_agent`: (your browser)
   - `referrer`: "http://localhost:3000/"

**Option B: SQL Query**

```sql
SELECT * FROM leads
ORDER BY created_at DESC
LIMIT 1;
```

#### 3.4 Verify Email

Check inbox for `NOTIFICATION_EMAIL` address

**Expected Email**:
```
Subject: New Lead from Test User

Body:
  New Lead

  Name: Test User
  Phone: +380501234567
  Telegram: @testuser
  Email: test@example.com
  Source: consultation_modal
  Submitted: 2025-11-17, 21:30 (Kyiv)
```

#### 3.5 Test Required Fields Only

Fill form again:
- **Ім'я**: `Min User`
- **Телефон**: `+380671234567`
- Leave Telegram and Email **empty**

Click **"Відправити заявку"**

**Expected**:
- Submission succeeds
- Database record shows:
  - `telegram`: `NULL`
  - `email`: `NULL`
- Email shows only name + phone (no telegram/email lines)

#### 3.6 Test Validation

Try submitting with:
- **Invalid phone**: `+38050` → Should show error: "Введіть номер у форматі +380XXXXXXXXX"
- **Name too short**: `A` → Should show error: "Ім'я має містити мінімум 2 символи"
- **Invalid email**: `notanemail` → Should show error: "Введіть коректну email адресу"

**Expected**: Validation errors appear, form doesn't submit

---

## Troubleshooting

### Issue: "npm run dev:vercel" not found

**Solution**: Install Vercel CLI globally

```bash
npm install -g vercel
vercel link  # Link to project
```

### Issue: API returns 500 "Failed to save your request"

**Possible Causes**:
1. **Wrong Supabase key**: Check using `SUPABASE_SERVICE_KEY` (not `SUPABASE_ANON_KEY`)
2. **RLS Policy**: Service role must have INSERT permission on `leads` table
3. **Database constraint**: Check Supabase logs for constraint violations

**Debug**:
```bash
# Check logs in server terminal
# Look for: [API] Database insert failed: ...
```

### Issue: API returns 500 "Email failed"

**Possible Causes**:
1. **Wrong Resend key**: Check `RESEND_API_KEY` in `.env`
2. **Invalid sender email**: Resend requires verified domain
3. **Rate limit**: Free tier has sending limits

**Debug**:
```bash
# Check server terminal for:
# [API] Email send failed: ...
```

### Issue: Form shows success but no database record

**Possible Causes**:
1. Wrong API endpoint (check Network tab in DevTools)
2. API code not updated (still commented out)
3. Wrong Supabase project

**Debug**:
1. Open DevTools → Network tab
2. Submit form
3. Check POST request to `/api/submit-lead`
4. Verify response has `leadId`

### Issue: Telegram stored without @

**Possible Causes**:
- Frontend validation not updated
- API transform not working

**Solution**: Check `src/types/consultationForm.ts` has transform:
```typescript
.transform(val => {
  if (!val || val === '') return undefined;
  return val.startsWith('@') ? val : `@${val}`;
})
```

---

## Verification Checklist

Before considering the fix complete:

- [ ] `npm run test:supabase` passes
- [ ] `test-consultation-api.js` script passes all tests
- [ ] Manual form submission succeeds
- [ ] Database record appears in Supabase
- [ ] Email notification received
- [ ] Telegram normalization works (adds @ if missing)
- [ ] Optional fields (telegram, email) can be omitted
- [ ] Validation errors show for invalid inputs
- [ ] Metadata fields populated (source, user_agent, referrer)

---

## Production Deployment

After all tests pass locally:

### 1. Push to GitHub

```bash
git add .
git commit -m "fix: consultation API endpoint validation and database insert"
git push origin 005-fix-consultation-api
```

### 2. Create Pull Request

1. Go to GitHub repository
2. Create PR from `005-fix-consultation-api` to `main`
3. Verify Vercel preview deployment succeeds

### 3. Test on Preview URL

Repeat manual browser test on Vercel preview URL (e.g., `https://zhulova-xxx.vercel.app`)

**Check**:
- Form submission works
- Database records appear in production Supabase
- Emails are received

### 4. Merge to Main

Once preview tests pass, merge PR. Vercel automatically deploys to production.

### 5. Verify Production

Test on `https://zhulova.com`:
- Submit test form
- Verify database + email
- Delete test records from Supabase

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run test:supabase` | Test database connectivity |
| `npm run dev:vercel` | Start dev server with API |
| `node .claude/scripts/test-consultation-api.js` | Test API endpoint |
| Open `http://localhost:3000` | Manual E2E test |

**Environment Variables**:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (database)
- `RESEND_API_KEY` (email)
- `NOTIFICATION_EMAIL` (recipient)

**Database**: Supabase Dashboard → `leads` table

---

**Status**: Ready for testing! Follow steps 1-3 in order.
