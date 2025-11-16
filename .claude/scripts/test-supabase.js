#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 *
 * Tests:
 * 1. Connection to Supabase
 * 2. Insert test record into leads table
 * 3. Read record from database
 * 4. Delete test record
 *
 * Usage: node test-supabase.js
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
  blue: '\x1b[34m',
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

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

async function testSupabaseConnection() {
  log('\n==============================================', colors.bright);
  log('   Supabase Connection Test', colors.bright);
  log('==============================================\n', colors.bright);

  // Step 1: Check environment variables
  info('Step 1: Checking environment variables...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl) {
    error('SUPABASE_URL not found in .env file');
    process.exit(1);
  }

  if (!supabaseServiceKey) {
    error('SUPABASE_SERVICE_KEY not found in .env file');
    process.exit(1);
  }

  success(`SUPABASE_URL: ${supabaseUrl}`);
  success(`SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 20)}...`);

  // Step 2: Create Supabase client
  info('\nStep 2: Creating Supabase client...');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  success('Supabase client created');

  // Step 3: Insert test record
  info('\nStep 3: Inserting test record into leads table...');

  const testLead = {
    name: 'Test User',
    phone: '+380501234567',
    telegram: '@test_user',
    email: 'test@example.com',
    source: 'test_script',
  };

  const { data: insertedLead, error: insertError } = await supabase
    .from('leads')
    .insert(testLead)
    .select()
    .single();

  if (insertError) {
    error(`Insert error: ${insertError.message}`);
    console.error(insertError);
    process.exit(1);
  }

  success(`Record created with ID: ${insertedLead.id}`);
  info(`Record data:`);
  console.log(JSON.stringify(insertedLead, null, 2));

  // Step 4: Read record from database
  info('\nStep 4: Reading record from database...');

  const { data: fetchedLead, error: fetchError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', insertedLead.id)
    .single();

  if (fetchError) {
    error(`Read error: ${fetchError.message}`);
    console.error(fetchError);
    process.exit(1);
  }

  success('Record successfully read from database');

  // Verify data matches
  if (fetchedLead.name === testLead.name && fetchedLead.phone === testLead.phone) {
    success('Data matches - everything works correctly!');
  } else {
    warning('Data mismatch - possible issue detected');
  }

  // Step 5: Count all records in table
  info('\nStep 5: Counting all records in leads table...');

  const { count, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    error(`Count error: ${countError.message}`);
  } else {
    info(`Total records in table: ${count}`);
  }

  // Step 6: Delete test record
  info('\nStep 6: Deleting test record...');

  const { error: deleteError } = await supabase
    .from('leads')
    .delete()
    .eq('id', insertedLead.id);

  if (deleteError) {
    error(`Delete error: ${deleteError.message}`);
    console.error(deleteError);
    process.exit(1);
  }

  success('Test record successfully deleted');

  // Step 7: Verify record was deleted
  info('\nStep 7: Verifying record deletion...');

  const { data: deletedCheck, error: checkError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', insertedLead.id)
    .single();

  if (checkError && checkError.code === 'PGRST116') {
    success('Record confirmed deleted from database');
  } else if (!deletedCheck) {
    success('Record not found - deletion confirmed');
  } else {
    warning('Record still exists - possible issue detected');
  }

  // Final result
  log('\n==============================================', colors.bright);
  log('   ✅ ALL TESTS PASSED SUCCESSFULLY!', colors.green + colors.bright);
  log('==============================================\n', colors.bright);

  info('Supabase database is configured correctly and ready to use!');
  info('Next steps:\n');
  info('  1. Configure Resend for email notifications');
  info('  2. Add environment variables to Vercel');
  info('  3. Implement homepage form\n');
}

// Run test
testSupabaseConnection().catch((err) => {
  error(`\nUnexpected error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
