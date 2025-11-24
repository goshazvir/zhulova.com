#!/usr/bin/env node

/**
 * Fetch Real User Metrics from Vercel Speed Insights
 *
 * Prerequisites:
 * 1. Get your Vercel token: vercel login && vercel whoami
 * 2. Get project ID from Vercel dashboard or: vercel project ls
 * 3. Set environment variables:
 *    export VERCEL_TOKEN="your-token"
 *    export VERCEL_PROJECT_ID="prj_xxx"
 *
 * Usage: node fetch-vercel-metrics.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

if (!VERCEL_TOKEN || !PROJECT_ID) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please set VERCEL_TOKEN and VERCEL_PROJECT_ID');
  console.error('\nExample:');
  console.error('export VERCEL_TOKEN="your-token"');
  console.error('export VERCEL_PROJECT_ID="prj_xxx"');
  process.exit(1);
}

// Fetch metrics from Vercel API
function fetchMetrics(timeRange = '7d') {
  const options = {
    hostname: 'api.vercel.com',
    path: `/v1/insights/vitals?projectId=${PROJECT_ID}&from=${timeRange}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Format metrics for markdown report
function formatMetrics(data) {
  const timestamp = new Date().toISOString();

  let report = `# Vercel Speed Insights - Real User Metrics\n\n`;
  report += `**Generated**: ${timestamp}\n`;
  report += `**Time Range**: Last 7 days\n`;
  report += `**Source**: Vercel Speed Insights API\n\n`;

  report += `## Core Web Vitals\n\n`;
  report += `| Metric | P50 (Median) | P75 | P95 | Status |\n`;
  report += `|--------|-------------|-----|-----|--------|\n`;

  // Define thresholds based on Google's Core Web Vitals
  const thresholds = {
    lcp: { good: 2500, needsImprovement: 4000 }, // milliseconds
    fid: { good: 100, needsImprovement: 300 },   // milliseconds
    cls: { good: 0.1, needsImprovement: 0.25 },   // score
    fcp: { good: 1800, needsImprovement: 3000 },  // milliseconds
    ttfb: { good: 800, needsImprovement: 1800 }   // milliseconds
  };

  // Process each metric
  const metrics = ['lcp', 'fid', 'cls', 'fcp', 'ttfb'];
  const metricNames = {
    lcp: 'Largest Contentful Paint (LCP)',
    fid: 'First Input Delay (FID)',
    cls: 'Cumulative Layout Shift (CLS)',
    fcp: 'First Contentful Paint (FCP)',
    ttfb: 'Time to First Byte (TTFB)'
  };

  metrics.forEach(metric => {
    if (data[metric]) {
      const p50 = data[metric].p50 || 'N/A';
      const p75 = data[metric].p75 || 'N/A';
      const p95 = data[metric].p95 || 'N/A';

      // Determine status based on p75 (Google uses p75 for Core Web Vitals)
      let status = '❓ No data';
      if (p75 !== 'N/A' && thresholds[metric]) {
        const value = metric === 'cls' ? p75 : parseInt(p75);
        if (value <= thresholds[metric].good) {
          status = '✅ Good';
        } else if (value <= thresholds[metric].needsImprovement) {
          status = '⚠️ Needs Improvement';
        } else {
          status = '❌ Poor';
        }
      }

      const unit = metric === 'cls' ? '' : 'ms';
      report += `| ${metricNames[metric]} | ${p50}${unit} | ${p75}${unit} | ${p95}${unit} | ${status} |\n`;
    }
  });

  report += `\n## Thresholds\n\n`;
  report += `### Good (✅)\n`;
  report += `- LCP: < 2.5s\n`;
  report += `- FID: < 100ms\n`;
  report += `- CLS: < 0.1\n`;
  report += `- FCP: < 1.8s\n`;
  report += `- TTFB: < 800ms\n\n`;

  report += `### Needs Improvement (⚠️)\n`;
  report += `- LCP: 2.5s - 4s\n`;
  report += `- FID: 100ms - 300ms\n`;
  report += `- CLS: 0.1 - 0.25\n`;
  report += `- FCP: 1.8s - 3s\n`;
  report += `- TTFB: 800ms - 1.8s\n\n`;

  report += `### Poor (❌)\n`;
  report += `- LCP: > 4s\n`;
  report += `- FID: > 300ms\n`;
  report += `- CLS: > 0.25\n`;
  report += `- FCP: > 3s\n`;
  report += `- TTFB: > 1.8s\n\n`;

  report += `## Raw Data\n\n`;
  report += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;

  return report;
}

// Main execution
async function main() {
  try {
    console.log('🔍 Fetching metrics from Vercel Speed Insights...');

    const data = await fetchMetrics();

    console.log('✅ Metrics fetched successfully');

    // Format the report
    const report = formatMetrics(data);

    // Save to file
    const reportPath = path.join(__dirname, '..', 'reports', 'real-user-metrics.md');
    const reportsDir = path.dirname(reportPath);

    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, report);

    console.log(`📝 Report saved to: ${reportPath}`);

    // Also output summary to console
    console.log('\n📊 Summary:');
    if (data.lcp) console.log(`  LCP (p75): ${data.lcp.p75}ms`);
    if (data.fid) console.log(`  FID (p75): ${data.fid.p75}ms`);
    if (data.cls) console.log(`  CLS (p75): ${data.cls.p75}`);
    if (data.fcp) console.log(`  FCP (p75): ${data.fcp.p75}ms`);
    if (data.ttfb) console.log(`  TTFB (p75): ${data.ttfb.p75}ms`);

  } catch (error) {
    console.error('❌ Error fetching metrics:', error.message);

    if (error.message.includes('401')) {
      console.error('\n🔐 Authentication failed. Please check your VERCEL_TOKEN');
      console.error('Get a new token at: https://vercel.com/account/tokens');
    } else if (error.message.includes('404')) {
      console.error('\n🔍 Project not found. Please check your VERCEL_PROJECT_ID');
      console.error('Find your project ID in Vercel dashboard or run: vercel project ls');
    }

    process.exit(1);
  }
}

// Run the script
main();