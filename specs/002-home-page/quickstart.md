# Quickstart Guide - Home Page Development

**Feature**: 002-home-page | **Date**: 2025-01-16
**Prerequisites**: Node.js 18+, Git, Supabase account, Resend account

---

## 🎯 Current Progress

**Last Updated**: 2025-01-16 | **Branch**: 002-home-page | **Commit**: fd73eeb

### ✅ Completed

- [x] Repository cloned and dependencies installed
- [x] Feature branch `002-home-page` created
- [x] Supabase account created and project configured
- [x] Database schema implemented:
  - `leads` table created with constraints, indexes, RLS policies
  - Verified all constraints and indexes in Supabase Dashboard
- [x] Environment variables configured in `.env`
- [x] Testing infrastructure setup:
  - Created `.claude/scripts/test-supabase.js` utility script
  - Added `npm run test:supabase` command
  - All database tests passing
- [x] Documentation updated:
  - Updated `CLAUDE.md` with Utility Scripts section
  - Configured `.gitignore` for proper `.claude/` tracking

### ⏳ In Progress / Next Steps

- [ ] **Resend Setup**: Create account and configure email service
- [ ] **Vercel Deployment**: Add environment variables to Vercel Dashboard
- [ ] **Local Testing**: Test serverless functions with `vercel dev`
- [ ] **Homepage Implementation**: Build UI components and sections
- [ ] **Form Integration**: Connect consultation form to backend

---

## Initial Setup

### 1. Clone Repository & Switch to Feature Branch

```bash
# Clone repository (if not already cloned)
git clone https://github.com/your-username/zhulova.git
cd zhulova

# Switch to home page feature branch
git checkout 002-home-page

# Install dependencies
npm install
```

### 2. Environment Variables

Create `.env` file in repository root:

```bash
# .env (DO NOT COMMIT THIS FILE)

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Resend Configuration
RESEND_API_KEY=re_your-api-key-here

# Site Configuration
PUBLIC_SITE_URL=http://localhost:4321
```

**How to get credentials**:

1. **Supabase**:
   - Create project at https://supabase.com
   - Go to Project Settings → API
   - Copy `URL`, `anon` key, and `service_role` key

2. **Resend**:
   - Create account at https://resend.com
   - Go to API Keys
   - Create new API key
   - Copy key value

### 3. Database Setup (Supabase)

Run migration to create `leads` table:

```bash
# Option 1: Via Supabase SQL Editor
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Copy contents of specs/002-home-page/data-model.md (migration section)
# 3. Run the migration SQL

# Option 2: Via Supabase CLI (if installed)
supabase migration new create_leads_table
# Paste migration SQL into generated file
supabase db push
```

**Verify database**:

```bash
# Option 1: Run automated test script (recommended)
npm run test:supabase

# This will:
# - Check environment variables
# - Test database connection
# - Insert test record
# - Read from database
# - Count records
# - Delete test record
# - Verify deletion
```

```sql
# Option 2: Manual verification in Supabase SQL Editor
SELECT * FROM leads LIMIT 1;
-- Should return empty result (no rows yet)

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'leads';
-- Should show 3 policies

-- Check constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'leads';
-- Should show 6 constraints

-- Check indexes
SELECT indexname FROM pg_indexes
WHERE tablename = 'leads';
-- Should show 5 indexes
```

### 4. Resend Email Setup

1. **Add sender domain**:
   - Go to Resend Dashboard → Domains
   - Add domain `zhulova.com`
   - Add DNS records (TXT, CNAME) to domain provider
   - Wait for verification (~5 minutes)

2. **Test email sending** (optional):
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your-api-key-here' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "website@zhulova.com",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "text": "If you receive this, Resend is configured correctly!"
  }'
```

---

## Development

### Start Development Server

```bash
# Start Astro dev server
npm run dev

# Server runs at http://localhost:4321
# Homepage at http://localhost:4321/
```

**What you'll see**:
- Homepage with all sections (hero, stats, questions, case studies, testimonials, courses, footer)
- Header navigation with links
- CTA buttons ("Book a Session", "Book Diagnostic")
- Mobile-responsive layout

### Test Consultation Form

1. **Open homepage**: http://localhost:4321
2. **Click "Записатись на розбір"** button
3. **Fill form**:
   - Name: `Тестовий Користувач`
   - Phone: `+380501234567`
   - Telegram: `@test_user` (optional)
   - Email: `test@example.com` (optional)
4. **Submit** and check:
   - Success message appears
   - Check Supabase Dashboard → Table Editor → `leads` table
   - Check email inbox (should receive notification)

### Verify Serverless Function Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run dev server with serverless functions
vercel dev

# Server runs at http://localhost:3000
# Test form submission at http://localhost:3000/
```

**Test API directly**:
```bash
curl -X POST http://localhost:3000/api/submit-lead \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Тестовий Користувач",
    "phone": "+380501234567",
    "telegram": "@test_user",
    "email": "test@example.com"
  }'
```

**Expected response**:
```json
{
  "success": true,
  "leadId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Дякуємо! Ваша заявка успішно надіслана..."
}
```

---

## Project Structure

```
zhulova/
├── src/
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.tsx        # CTA button
│   │   │   ├── Modal.tsx         # Modal wrapper
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.astro      # Site header with navigation
│   │   │   ├── Footer.astro      # Site footer
│   │   │   └── ...
│   │   ├── sections/             # Homepage sections
│   │   │   ├── HeroSection.astro
│   │   │   ├── StatsSection.astro
│   │   │   ├── QuestionsSection.astro
│   │   │   ├── CaseStudiesSection.astro
│   │   │   ├── TestimonialsSection.astro
│   │   │   └── ...
│   │   └── forms/                # Form components
│   │       ├── ConsultationModal.tsx
│   │       └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro      # Base page layout with SEO
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   └── api/
│   │       └── submit-lead.ts    # Serverless function
│   ├── stores/
│   │   └── uiStore.ts            # Zustand UI state
│   ├── types/
│   │   ├── consultationForm.ts   # Form types & validation
│   │   └── lead.ts               # Lead entity types
│   ├── data/
│   │   └── homePageContent.ts    # Static content data
│   ├── styles/
│   │   └── global.css            # Global styles & Tailwind
│   └── utils/
│       └── scrollAnimations.ts   # Scroll animation logic
├── public/
│   ├── images/                   # Static images
│   └── robots.txt
├── api/                          # Vercel serverless functions
│   └── submit-lead.ts            # Same as src/pages/api/
├── specs/
│   └── 002-home-page/            # Feature documentation
│       ├── spec.md               # Business requirements
│       ├── plan.md               # Implementation plan
│       ├── research.md           # Technical research
│       ├── data-model.md         # Database schema
│       ├── quickstart.md         # This file
│       └── contracts/
│           └── submit-lead.yaml  # API contract
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Example environment file
├── astro.config.mjs              # Astro configuration
├── tailwind.config.mjs           # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

---

## Common Tasks

### Add New Homepage Section

1. **Create section component**:
```bash
touch src/components/sections/NewSection.astro
```

2. **Implement component**:
```astro
---
// src/components/sections/NewSection.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<section class="py-16 px-4 bg-white">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-3xl font-serif text-navy-900">{title}</h2>
    <!-- Section content -->
  </div>
</section>
```

3. **Add to homepage**:
```astro
---
// src/pages/index.astro
import NewSection from '@components/sections/NewSection.astro';
---

<BaseLayout title="Home" description="...">
  <HeroSection />
  <NewSection title="New Section" />
  <!-- Other sections -->
</BaseLayout>
```

### Modify Consultation Form Fields

1. **Update Zod schema**:
```typescript
// src/types/consultationForm.ts
export const consultationFormSchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string().regex(/^\+380\d{9}$/),
  telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/).optional(),
  email: z.string().email().optional(),
  // Add new field
  message: z.string().max(500).optional(),
});
```

2. **Update database schema** (if storing new field):
```sql
ALTER TABLE leads ADD COLUMN message TEXT;
```

3. **Update React form component**:
```tsx
// src/components/forms/ConsultationModal.tsx
<textarea
  {...register('message')}
  placeholder="Повідомлення (необов'язково)"
  className="..."
/>
```

### Change Email Template

```typescript
// api/submit-lead.ts or src/pages/api/submit-lead.ts

const emailHtml = `
  <h1>Нова заявка на консультацію</h1>
  <p><strong>Ім'я:</strong> ${name}</p>
  <p><strong>Телефон:</strong> ${phone}</p>
  <p><strong>Telegram:</strong> ${telegram || 'Не вказано'}</p>
  <p><strong>Email:</strong> ${email || 'Не вказано'}</p>
  <p><strong>Дата:</strong> ${new Date().toLocaleString('uk-UA')}</p>
  <p><strong>Джерело:</strong> Головна сторінка</p>
`;

await resend.emails.send({
  from: 'website@zhulova.com',
  to: 'viktoria@zhulova.com',
  subject: `Нова заявка на консультацію - ${name}`,
  html: emailHtml,
});
```

---

## Testing

### Manual Testing Checklist

- [ ] Homepage loads in <3 seconds
- [ ] All 10 sections visible and styled correctly
- [ ] Navigation menu works (scroll to sections)
- [ ] Mobile menu opens/closes correctly
- [ ] Hero CTA button opens consultation modal
- [ ] Footer CTA button opens consultation modal
- [ ] Form validates required fields (name, phone)
- [ ] Form accepts optional fields (telegram, email)
- [ ] Form shows error messages for invalid data
- [ ] Form submission succeeds
- [ ] Success message displays after submission
- [ ] Lead appears in Supabase `leads` table
- [ ] Email notification received
- [ ] Modal closes on Escape key
- [ ] Modal closes on background click
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Images have alt text
- [ ] Page responsive on mobile (320px - 1920px)

### Lighthouse Audit

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run Lighthouse (in Chrome DevTools)
# 1. Open http://localhost:4321
# 2. Open DevTools (F12)
# 3. Go to Lighthouse tab
# 4. Click "Analyze page load"
```

**Target scores**:
- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

### Test Serverless Function

```bash
# Test validation errors
curl -X POST http://localhost:3000/api/submit-lead \
  -H 'Content-Type: application/json' \
  -d '{"name": "A", "phone": "123"}' \
  | jq

# Expected: Validation error for name (too short) and phone (invalid format)

# Test successful submission
curl -X POST http://localhost:3000/api/submit-lead \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Тестовий Користувач",
    "phone": "+380501234567"
  }' \
  | jq

# Expected: {"success": true, "leadId": "...", "message": "..."}
```

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase RLS blocks inserts

**Solution**:
```sql
-- Check RLS is enabled
SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Verify service_role policy exists
-- If missing, run migration again from data-model.md
```

### Issue: Email not sending

**Solution**:
1. Check Resend API key is correct in `.env`
2. Verify sender domain is verified in Resend dashboard
3. Check Resend dashboard → Logs for error details
4. Ensure `from` address matches verified domain

### Issue: Form submission fails with CORS error

**Solution**:
```typescript
// api/submit-lead.ts - Add CORS headers

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:4321',
    'http://localhost:3000',
    'https://zhulova.com',
  ];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin!) ? origin! : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // ... rest of function
}
```

### Issue: Tailwind styles not applying

**Solution**:
```bash
# Restart dev server
# Tailwind sometimes needs restart after config changes
npm run dev
```

### Issue: TypeScript errors in IDE

**Solution**:
```bash
# Regenerate Astro types
npx astro sync

# Restart TypeScript server in VSCode
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Deployment to Production (Vercel)

### Initial Deployment

1. **Connect GitHub repository**:
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import GitHub repository
   - Select `zhulova` repository

2. **Configure project**:
   - Framework: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

3. **Add environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `RESEND_API_KEY`
   - `PUBLIC_SITE_URL`: `https://zhulova.com`

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)
   - Site live at `https://zhulova-*.vercel.app`

### Custom Domain

1. **Add domain**:
   - Go to Project Settings → Domains
   - Add `zhulova.com` and `www.zhulova.com`

2. **Configure DNS**:
   - Add A record: `76.76.21.21` (Vercel IP)
   - Add CNAME record: `cname.vercel-dns.com`

3. **Wait for DNS propagation** (~5-10 minutes)

4. **Verify**:
   - Visit https://zhulova.com
   - Check SSL certificate is active (lock icon in browser)

---

## Next Steps

1. **Implement remaining pages**:
   - About Me (`/about`)
   - Courses Catalog (`/courses`)
   - Individual Course pages (`/courses/[slug]`)
   - Contact page (`/contact`)

2. **Add analytics**:
   - Integrate Plausible Analytics
   - Track custom events (form submissions, CTA clicks)

3. **Optimize images**:
   - Add professional photos of coach
   - Add client testimonial photos
   - Add case study photos

4. **Content updates**:
   - Replace placeholder content with real data
   - Add actual testimonials
   - Add real case studies

5. **Performance optimization**:
   - Run Lighthouse audits
   - Optimize bundle size
   - Enable CDN caching

---

## Resources

- **Astro Docs**: https://docs.astro.build
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Zod Docs**: https://zod.dev
- **React Hook Form**: https://react-hook-form.com

---

**Questions?** Check `specs/002-home-page/plan.md` for detailed implementation plan.
