#!/usr/bin/env node

/**
 * Test script for /api/submit-lead endpoint
 *
 * Tests the consultation form submission API endpoint with various scenarios.
 * This script is part of the TDD workflow for feature 005-fix-consultation-api.
 *
 * Prerequisites:
 * - Server running on http://localhost:3000 (use `npm run dev:vercel`)
 * - Environment variables configured in .env
 *
 * Usage:
 *   node .claude/scripts/test-consultation-api.js
 *
 * Expected on first run: ALL TESTS SHOULD FAIL (API is broken)
 * Expected after fix: ALL TESTS SHOULD PASS
 */

const API_URL = 'http://localhost:4321/api/submit-lead';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Test case definitions
const testCases = [
  {
    name: 'Valid submission (all fields)',
    input: {
      name: 'Test User Full',
      phone: '+380501234567',
      telegram: '@testuser',
      email: 'test@example.com',
    },
    expectedStatus: 200,
    validate: (response) => {
      if (!response.success) return 'Response should have success: true';
      if (!response.leadId) return 'Response should have leadId';
      if (typeof response.leadId !== 'string') return 'leadId should be a string (UUID)';
      return null; // Pass
    },
  },
  {
    name: 'Valid submission (required fields only)',
    input: {
      name: 'Test User Min',
      phone: '+380671234567',
    },
    expectedStatus: 200,
    validate: (response) => {
      if (!response.success) return 'Response should have success: true';
      if (!response.leadId) return 'Response should have leadId';
      return null; // Pass
    },
  },
  {
    name: 'Telegram without @ (normalization test)',
    input: {
      name: 'Test Telegram',
      phone: '+380931234567',
      telegram: 'username123', // Should be normalized to @username123
    },
    expectedStatus: 200,
    validate: (response) => {
      if (!response.success) return 'Response should have success: true';
      if (!response.leadId) return 'Response should have leadId';
      // Note: We can't verify DB content here, but at least check API accepts it
      return null; // Pass
    },
  },
  {
    name: 'Invalid phone format',
    input: {
      name: 'Test User',
      phone: '+38050', // Too short
      email: 'test@example.com',
    },
    expectedStatus: 400,
    validate: (response) => {
      if (response.success !== false) return 'Response should have success: false';
      if (!response.error) return 'Response should have error message';
      return null; // Pass
    },
  },
  {
    name: 'Invalid email format',
    input: {
      name: 'Test User',
      phone: '+380501234567',
      email: 'notanemail', // Invalid email
    },
    expectedStatus: 400,
    validate: (response) => {
      if (response.success !== false) return 'Response should have success: false';
      if (!response.error) return 'Response should have error message';
      return null; // Pass
    },
  },
  {
    name: 'Missing required field (name)',
    input: {
      phone: '+380501234567',
      // name is missing
    },
    expectedStatus: 400,
    validate: (response) => {
      if (response.success !== false) return 'Response should have success: false';
      if (!response.error) return 'Response should have error message';
      return null; // Pass
    },
  },
];

/**
 * Run a single test case
 */
async function runTest(testCase, index) {
  const testNumber = index + 1;
  console.log(`\n${colors.blue}Test ${testNumber}: ${testCase.name}${colors.reset}`);
  console.log(`${colors.gray}Input: ${JSON.stringify(testCase.input)}${colors.reset}`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.input),
    });

    const data = await response.json();

    // Check status code
    if (response.status !== testCase.expectedStatus) {
      console.log(
        `${colors.red}✗ FAIL${colors.reset} - Expected status ${testCase.expectedStatus}, got ${response.status}`
      );
      console.log(`${colors.gray}Response: ${JSON.stringify(data)}${colors.reset}`);
      return false;
    }

    // Run custom validation if provided
    if (testCase.validate) {
      const validationError = testCase.validate(data);
      if (validationError) {
        console.log(`${colors.red}✗ FAIL${colors.reset} - ${validationError}`);
        console.log(`${colors.gray}Response: ${JSON.stringify(data)}${colors.reset}`);
        return false;
      }
    }

    console.log(
      `${colors.green}✓ PASS${colors.reset} - Status: ${response.status}${
        data.leadId ? `, Lead ID: ${data.leadId.substring(0, 8)}...` : ''
      }`
    );
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ FAIL${colors.reset} - ${error.message}`);
    if (error.message.includes('fetch')) {
      console.log(
        `${colors.yellow}Hint: Make sure server is running on http://localhost:3000 (use npm run dev:vercel)${colors.reset}`
      );
    }
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}🧪 Testing: /api/submit-lead endpoint${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);

  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const passed = await runTest(testCases[i], i);
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }

  // Summary
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`Total: ${testCases.length}`);
  console.log(`${colors.green}Passed: ${passedCount}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedCount}${colors.reset}`);

  if (failedCount === 0) {
    console.log(`\n${colors.green}✓ ALL TESTS PASSED (${passedCount}/${testCases.length})${colors.reset}`);
    process.exit(0);
  } else {
    console.log(
      `\n${colors.red}✗ SOME TESTS FAILED (${passedCount}/${testCases.length} passed)${colors.reset}`
    );
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
