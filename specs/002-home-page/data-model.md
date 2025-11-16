# Data Model - Home Page

**Feature**: 002-home-page | **Date**: 2025-01-16
**Database**: Supabase PostgreSQL | **ORM**: Supabase JS Client

## Database Schema

### `leads` Table

Stores consultation requests from potential clients submitted via the homepage contact form.

```sql
CREATE TABLE leads (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact Information
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  telegram VARCHAR(100),  -- Optional, format: @username
  email VARCHAR(255),     -- Optional

  -- Metadata
  source VARCHAR(50) NOT NULL DEFAULT 'home_page',
  user_agent TEXT,        -- Browser user agent for analytics
  referrer TEXT,          -- Referrer URL for attribution

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

**Field Descriptions**:

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | UUID | NO | Unique identifier (auto-generated) |
| `name` | VARCHAR(255) | NO | Client's full name (2-255 characters) |
| `phone` | VARCHAR(50) | NO | Phone number in format +380XXXXXXXXX |
| `telegram` | VARCHAR(100) | YES | Telegram handle starting with @ (5-32 characters) |
| `email` | VARCHAR(255) | YES | Valid email address |
| `source` | VARCHAR(50) | NO | Page source (default: 'home_page') |
| `user_agent` | TEXT | YES | Browser user agent string |
| `referrer` | TEXT | YES | HTTP referrer header |
| `created_at` | TIMESTAMPTZ | NO | Record creation timestamp (UTC) |
| `updated_at` | TIMESTAMPTZ | NO | Last update timestamp (UTC) |

---

### Indexes

```sql
-- Query leads by creation date (most recent first)
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Find leads by email (for duplicate detection)
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;

-- Find leads by phone (for duplicate detection)
CREATE INDEX idx_leads_phone ON leads(phone);

-- Filter leads by source page
CREATE INDEX idx_leads_source ON leads(source);
```

**Index Rationale**:
- `idx_leads_created_at`: Supports "ORDER BY created_at DESC" queries for lead management dashboard
- `idx_leads_email`: Partial index (only non-null emails) for duplicate detection
- `idx_leads_phone`: Phone is required field, used for duplicate detection
- `idx_leads_source`: Supports analytics queries filtering by lead source

---

### Constraints

```sql
-- Ensure phone number format
ALTER TABLE leads ADD CONSTRAINT chk_phone_format
  CHECK (phone ~ '^\+380\d{9}$');

-- Ensure telegram format if provided
ALTER TABLE leads ADD CONSTRAINT chk_telegram_format
  CHECK (telegram IS NULL OR telegram ~ '^@[a-zA-Z0-9_]{5,32}$');

-- Ensure email format if provided
ALTER TABLE leads ADD CONSTRAINT chk_email_format
  CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$');

-- Ensure name has reasonable length
ALTER TABLE leads ADD CONSTRAINT chk_name_length
  CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 255);

-- Ensure source is not empty
ALTER TABLE leads ADD CONSTRAINT chk_source_not_empty
  CHECK (LENGTH(TRIM(source)) > 0);
```

**Constraint Rationale**:
- Phone format: Enforce Ukrainian phone number standard (+380XXXXXXXXX)
- Telegram format: Must start with @ and contain 5-32 alphanumeric/underscore characters
- Email format: Basic email validation (detailed validation in application layer)
- Name length: Prevent empty names and unreasonably long inputs
- Source validation: Ensure source is never empty string

---

### Row Level Security (RLS)

```sql
-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated service role can insert leads
CREATE POLICY "service_role_insert_only" ON leads
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Only authenticated service role can read leads
CREATE POLICY "service_role_read_only" ON leads
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Policy: No public access (all operations require service role)
CREATE POLICY "no_public_access" ON leads
  FOR ALL
  USING (false);
```

**RLS Rationale**:
- Prevents direct client-side access to leads table
- All operations must go through serverless function with service role key
- Protects sensitive client data from unauthorized access
- Service role key stored securely in Vercel environment variables

---

### Triggers

```sql
-- Automatically update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Trigger Rationale**:
- Automatically maintains `updated_at` timestamp
- Useful for tracking when lead data was last modified
- No manual timestamp management required

---

## TypeScript Types

### Client-Side Types

```typescript
// src/types/consultationForm.ts
import { z } from 'zod';

/**
 * Zod schema for consultation form validation
 * Used for both client-side and server-side validation
 */
export const consultationFormSchema = z.object({
  name: z.string()
    .min(2, 'Ім\'я має містити мінімум 2 символи')
    .max(255, 'Ім\'я занадто довге')
    .trim(),

  phone: z.string()
    .regex(/^\+380\d{9}$/, 'Введіть номер у форматі +380XXXXXXXXX')
    .trim(),

  telegram: z.string()
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, 'Telegram має формат @username')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),

  email: z.string()
    .email('Введіть коректну email адресу')
    .max(255, 'Email занадто довгий')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type ConsultationFormData = z.infer<typeof consultationFormSchema>;

/**
 * Form submission state
 */
export interface FormSubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}
```

### Server-Side Types

```typescript
// api/types/lead.ts

/**
 * Lead record as stored in database
 */
export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  telegram: string | null;
  email: string | null;
  source: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;  // ISO 8601 timestamp
  updated_at: string;  // ISO 8601 timestamp
}

/**
 * Data required to create a new lead
 * Omits auto-generated fields (id, timestamps)
 */
export interface CreateLeadInput {
  name: string;
  phone: string;
  telegram?: string | null;
  email?: string | null;
  source?: string;
  user_agent?: string | null;
  referrer?: string | null;
}

/**
 * API response for lead creation
 */
export interface CreateLeadResponse {
  success: boolean;
  leadId?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

---

## Data Validation Rules

### Client-Side Validation (React Hook Form + Zod)

**Name Field**:
- Required: Yes
- Min length: 2 characters
- Max length: 255 characters
- Trim whitespace
- Error messages: Ukrainian language

**Phone Field**:
- Required: Yes
- Format: `+380XXXXXXXXX` (Ukraine country code + 9 digits)
- Input mask: Automatically format as user types
- Validation: Regex `/^\+380\d{9}$/`
- Error message: "Введіть номер у форматі +380XXXXXXXXX"

**Telegram Field**:
- Required: No
- Format: `@username` (5-32 alphanumeric or underscore characters)
- Validation: Regex `/^@[a-zA-Z0-9_]{5,32}$/`
- Error message: "Telegram має формат @username"
- Transform: Empty string → null

**Email Field**:
- Required: No
- Format: Valid email address
- Max length: 255 characters
- Validation: Zod email() validator
- Error message: "Введіть коректну email адресу"
- Transform: Empty string → null

### Server-Side Validation (Serverless Function)

```typescript
// api/submit-lead.ts

import { consultationFormSchema } from '@/types/consultationForm';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validationResult = consultationFormSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Некоректні дані форми',
          details: validationResult.error.format(),
        },
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const leadData = validationResult.data;
    // ... proceed with database insert
  } catch (error) {
    // ... error handling
  }
}
```

**Additional Server-Side Checks**:
- Rate limiting: Max 10 requests per IP per hour (Vercel built-in)
- SQL injection prevention: Supabase SDK uses parameterized queries
- XSS prevention: No HTML allowed in any field
- CSRF protection: Verify origin header matches allowed domains

---

## Data Relationships

### Current Schema (MVP)

```
leads (standalone table)
  - No foreign keys
  - No relationships to other tables
```

**Rationale**: Homepage form is a standalone feature. No user authentication, no courses table (yet), no related data.

### Future Extensions

**Potential relationships if features expand**:

```
users
  ├─ leads (1:N) - One user can have multiple consultation requests
  └─ enrollments (1:N) - One user can enroll in multiple courses

courses
  └─ enrollments (1:N) - One course has multiple students

leads
  └─ follow_ups (1:N) - One lead can have multiple follow-up actions
```

**Not implemented in MVP**: These relationships would require user authentication system, which is out of scope per specification.

---

## Migration Scripts

### Initial Migration (Create Table)

```sql
-- File: migrations/001_create_leads_table.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  telegram VARCHAR(100),
  email VARCHAR(255),
  source VARCHAR(50) NOT NULL DEFAULT 'home_page',
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add constraints
ALTER TABLE leads ADD CONSTRAINT chk_phone_format
  CHECK (phone ~ '^\+380\d{9}$');

ALTER TABLE leads ADD CONSTRAINT chk_telegram_format
  CHECK (telegram IS NULL OR telegram ~ '^@[a-zA-Z0-9_]{5,32}$');

ALTER TABLE leads ADD CONSTRAINT chk_email_format
  CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$');

ALTER TABLE leads ADD CONSTRAINT chk_name_length
  CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 255);

ALTER TABLE leads ADD CONSTRAINT chk_source_not_empty
  CHECK (LENGTH(TRIM(source)) > 0);

-- Create indexes
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_source ON leads(source);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "service_role_insert_only" ON leads
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_read_only" ON leads
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "no_public_access" ON leads
  FOR ALL
  USING (false);
```

### Rollback Migration

```sql
-- File: migrations/001_rollback_leads_table.sql

-- Drop policies
DROP POLICY IF EXISTS "service_role_insert_only" ON leads;
DROP POLICY IF EXISTS "service_role_read_only" ON leads;
DROP POLICY IF EXISTS "no_public_access" ON leads;

-- Drop trigger
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_leads_created_at;
DROP INDEX IF EXISTS idx_leads_email;
DROP INDEX IF EXISTS idx_leads_phone;
DROP INDEX IF EXISTS idx_leads_source;

-- Drop table
DROP TABLE IF EXISTS leads;
```

---

## Sample Data (for testing)

```sql
-- Insert test leads (for local development only)
INSERT INTO leads (name, phone, telegram, email, source) VALUES
  ('Олена Коваленко', '+380501234567', '@olena_coach', 'olena@example.com', 'home_page'),
  ('Іван Петренко', '+380671234567', '@ivan_business', NULL, 'home_page'),
  ('Марія Шевченко', '+380631234567', NULL, 'maria@example.com', 'home_page'),
  ('Андрій Мельник', '+380991234567', '@andrii_dev', 'andrii@example.com', 'home_page');
```

---

## Data Access Patterns

### 1. Insert New Lead

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!  // Service role key (server-side only)
);

const { data, error } = await supabase
  .from('leads')
  .insert({
    name: 'Олена Коваленко',
    phone: '+380501234567',
    telegram: '@olena_coach',
    email: 'olena@example.com',
    source: 'home_page',
    user_agent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
  })
  .select()
  .single();

if (error) {
  console.error('Failed to insert lead:', error);
  throw error;
}

console.log('Lead created:', data.id);
```

### 2. Check for Duplicate Leads

```typescript
// Check if lead with same phone was submitted today
const today = new Date();
today.setHours(0, 0, 0, 0);

const { data, error } = await supabase
  .from('leads')
  .select('id')
  .eq('phone', phone)
  .gte('created_at', today.toISOString())
  .single();

if (data) {
  // Duplicate found - show friendly message or skip
  return { duplicate: true, leadId: data.id };
}
```

### 3. Fetch Recent Leads (for admin dashboard - future)

```typescript
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);

if (error) {
  console.error('Failed to fetch leads:', error);
  throw error;
}

return data; // Array of 50 most recent leads
```

### 4. Count Leads by Source (analytics - future)

```typescript
const { count, error } = await supabase
  .from('leads')
  .select('*', { count: 'exact', head: true })
  .eq('source', 'home_page');

console.log(`Total home_page leads: ${count}`);
```

---

## Performance Considerations

### Query Performance
- All queries use indexed columns (created_at, email, phone, source)
- Primary key (UUID) used for point lookups
- Partial index on email reduces index size (only non-null values)

### Database Connection Pooling
- Supabase handles connection pooling automatically
- Serverless functions use connection pooling via Supabase SDK
- No manual connection management required

### Estimated Table Size
- Average row size: ~500 bytes (including indexes)
- Expected volume: ~100 leads/month initially
- 1 year storage: ~50,000 rows = ~25MB
- Database remains performant for years without optimization

---

## Data Privacy & Compliance

### GDPR Considerations
- Personal data stored: name, phone, email, telegram
- Purpose: Processing consultation requests
- Retention: Leads stored indefinitely (coach may contact months later)
- Right to deletion: Not automated (manual deletion via Supabase dashboard if requested)
- Data export: CSV export via Supabase dashboard

### Security Measures
- Row Level Security (RLS) prevents unauthorized access
- Service role key never exposed client-side
- All PII encrypted at rest (Supabase default)
- TLS encryption in transit (Supabase default)
- Regular backups (Supabase automatic daily backups)

### Future Enhancement: Data Retention Policy
```sql
-- Delete leads older than 2 years (if required by privacy policy)
DELETE FROM leads
WHERE created_at < NOW() - INTERVAL '2 years';
```

---

## Summary

**Database**: Supabase PostgreSQL
**Tables**: 1 (`leads`)
**Indexes**: 4 (created_at, email, phone, source)
**Constraints**: 5 (phone format, telegram format, email format, name length, source validation)
**RLS Policies**: 3 (service_role insert, service_role read, no public access)
**Triggers**: 1 (auto-update updated_at)

**Key Features**:
- ✅ Type-safe schema with PostgreSQL constraints
- ✅ Row Level Security for data protection
- ✅ Optimized indexes for common queries
- ✅ Automatic timestamp management
- ✅ Zod schema for runtime validation
- ✅ TypeScript types for type safety
- ✅ Migration scripts for version control

**Next Steps**:
- Run migration on Supabase project
- Configure RLS policies
- Test insert operations via serverless function
- Validate constraint enforcement
