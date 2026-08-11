#!/usr/bin/env node

/**
 * quiz_submissions Table Verification Script (GEO-15)
 *
 * Verifies the `quiz_submissions` table created by docs/db/quiz_submissions.sql
 * (authoritative spec: docs/architecture/quiz-opora.md §6).
 *
 * Tests (mapped to GEO-15 acceptance criteria):
 * 1. Service key: insert -> read -> delete all succeed (AC1)
 * 2. Anon key: select returns no rows / is denied — RLS enabled, zero policies (AC2)
 * 3. Check constraints reject score_internal = 37 and result_type = 'other' (AC3)
 *
 * Note on AC4 (index): the `quiz_submissions_created_at_idx` index cannot be
 * inspected through PostgREST. Verify it in the Supabase SQL editor with:
 *   select indexname from pg_indexes where tablename = 'quiz_submissions';
 *
 * Usage: node .claude/scripts/test-quiz-submissions.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

// PostgreSQL error code for check-constraint violation
const CHECK_VIOLATION = '23514';

function buildTestSubmission() {
  // 12 answers, all "sebe" with max internal score -> 36/36 = 100%
  const answers = Array.from({ length: 12 }, (_, question) => ({
    question,
    option: 3,
    category: 'sebe',
    internal: 3,
  }));

  return {
    quiz_slug: 'opora',
    instagram_handle: '@test_quiz_script',
    answers,
    score_internal: 36,
    score_pct: 100,
    band: '70',
    result_type: 'sebe',
    user_agent: 'test-quiz-submissions.js',
    referrer: 'verification-script',
  };
}

async function testQuizSubmissionsTable() {
  log('\n==============================================', colors.bright);
  log('   quiz_submissions Table Verification', colors.bright);
  log('==============================================\n', colors.bright);

  // Step 1: Check environment variables
  info('Step 1: Checking environment variables...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey || !anonKey) {
    error('SUPABASE_URL, SUPABASE_SERVICE_KEY and SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
  }

  success(`SUPABASE_URL: ${supabaseUrl}`);
  success(`SUPABASE_SERVICE_KEY: ${serviceKey.substring(0, 20)}...`);
  success(`SUPABASE_ANON_KEY: ${anonKey.substring(0, 20)}...`);

  const clientOptions = {
    auth: { autoRefreshToken: false, persistSession: false },
  };
  const service = createClient(supabaseUrl, serviceKey, clientOptions);
  const anon = createClient(supabaseUrl, anonKey, clientOptions);

  // Step 2 (AC1): Insert a valid submission with the service key
  info('\nStep 2: Inserting test submission with service key...');

  const testSubmission = buildTestSubmission();
  const { data: inserted, error: insertError } = await service
    .from('quiz_submissions')
    .insert(testSubmission)
    .select()
    .single();

  if (insertError) {
    error(`Insert error: ${insertError.message}`);
    console.error(insertError);
    process.exit(1);
  }

  success(`Record created with ID: ${inserted.id}`);

  // Step 3 (AC1): Read it back with the service key
  info('\nStep 3: Reading record back with service key...');

  const { data: fetched, error: fetchError } = await service
    .from('quiz_submissions')
    .select('*')
    .eq('id', inserted.id)
    .single();

  if (fetchError) {
    error(`Read error: ${fetchError.message}`);
    process.exit(1);
  }

  if (
    fetched.instagram_handle === testSubmission.instagram_handle &&
    fetched.score_internal === testSubmission.score_internal &&
    Array.isArray(fetched.answers) &&
    fetched.answers.length === 12
  ) {
    success('Record read back, data matches (12 answers persisted as jsonb)');
  } else {
    error('Record read back but data does not match');
    process.exit(1);
  }

  // Step 4 (AC2): Anon key must NOT see the row (RLS, zero policies)
  info('\nStep 4: Selecting with anon key (RLS must hide all rows)...');

  const { data: anonRows, error: anonError } = await anon
    .from('quiz_submissions')
    .select('id')
    .eq('id', inserted.id);

  if (anonError) {
    success(`Anon select denied: ${anonError.message}`);
  } else if (Array.isArray(anonRows) && anonRows.length === 0) {
    success('Anon select returned 0 rows while service key sees the record — RLS active');
  } else {
    error('SECURITY FAILURE: anon key can read quiz_submissions rows!');
    process.exit(1);
  }

  // Step 5 (AC3): Check constraint must reject score_internal = 37
  info('\nStep 5: Inserting score_internal = 37 (must be rejected)...');

  const { error: scoreError } = await service
    .from('quiz_submissions')
    .insert({ ...buildTestSubmission(), score_internal: 37 });

  if (scoreError && scoreError.code === CHECK_VIOLATION) {
    success('score_internal = 37 rejected by check constraint');
  } else if (scoreError) {
    error(`Rejected, but with unexpected error code ${scoreError.code}: ${scoreError.message}`);
    process.exit(1);
  } else {
    error('CONSTRAINT FAILURE: score_internal = 37 was accepted!');
    process.exit(1);
  }

  // Step 6 (AC3): Check constraint must reject result_type = 'other'
  info("\nStep 6: Inserting result_type = 'other' (must be rejected)...");

  const { error: typeError } = await service
    .from('quiz_submissions')
    .insert({ ...buildTestSubmission(), result_type: 'other' });

  if (typeError && typeError.code === CHECK_VIOLATION) {
    success("result_type = 'other' rejected by check constraint");
  } else if (typeError) {
    error(`Rejected, but with unexpected error code ${typeError.code}: ${typeError.message}`);
    process.exit(1);
  } else {
    error("CONSTRAINT FAILURE: result_type = 'other' was accepted!");
    process.exit(1);
  }

  // Step 7 (AC1): Delete the test record with the service key
  info('\nStep 7: Deleting test record...');

  const { error: deleteError } = await service
    .from('quiz_submissions')
    .delete()
    .eq('id', inserted.id);

  if (deleteError) {
    error(`Delete error: ${deleteError.message}`);
    process.exit(1);
  }

  const { data: deletedCheck } = await service
    .from('quiz_submissions')
    .select('id')
    .eq('id', inserted.id);

  if (!deletedCheck || deletedCheck.length === 0) {
    success('Test record deleted and deletion confirmed');
  } else {
    error('Record still exists after delete');
    process.exit(1);
  }

  // Final result
  log('\n==============================================', colors.bright);
  log('   ✅ ALL TESTS PASSED SUCCESSFULLY!', colors.green + colors.bright);
  log('==============================================\n', colors.bright);

  info('quiz_submissions is live with the correct constraints and RLS posture.');
  info('Reminder (AC4): confirm the index in the Supabase SQL editor:');
  info("  select indexname from pg_indexes where tablename = 'quiz_submissions';\n");
}

// Run test
testQuizSubmissionsTable().catch((err) => {
  error(`\nUnexpected error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
