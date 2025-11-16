#!/usr/bin/env node

/**
 * Favicon Generator from SVG
 *
 * Generates PNG favicons from the main favicon.svg file
 * Uses the current favicon.svg as source
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public');
const sourceSVG = path.join(publicDir, 'favicon.svg');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon.ico', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateFromSVG() {
  try {
    console.log('🎨 Generating PNG favicons from favicon.svg...\n');

    // Check if SVG exists
    await fs.access(sourceSVG);
    console.log(`✅ Source SVG found: ${sourceSVG}\n`);

    // Generate all PNG sizes
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);

      console.log(`⚙️  Generating ${name} (${size}x${size})...`);

      await sharp(sourceSVG)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`   ✅ Saved to ${outputPath}`);
    }

    console.log('\n✨ All PNG favicons generated successfully!');
    console.log('🔄 Refresh your browser to see the new favicon');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFromSVG();
