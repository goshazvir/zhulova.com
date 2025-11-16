#!/usr/bin/env node

/**
 * Favicon Generator Script
 *
 * Generates all required favicon formats from source image:
 * - favicon.ico (32x32)
 * - apple-touch-icon.png (180x180) - iOS home screen
 * - icon-192.png (192x192) - Android Chrome
 * - icon-512.png (512x512) - Android Chrome, PWA
 * - favicon-32.png (32x32) - Standard favicon
 * - favicon-16.png (16x16) - Standard favicon
 *
 * Usage: node .claude/scripts/generate-favicon.js
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public');
const sourceImage = path.join(publicDir, 'vz-logo-source.png');

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon.ico', size: 32 }, // ICO will be created from 32x32 PNG
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateFavicons() {
  try {
    console.log('🎨 Generating favicons...\n');

    // Check if source image exists
    await fs.access(sourceImage);
    console.log(`✅ Source image found: ${sourceImage}\n`);

    // Load source image
    const image = sharp(sourceImage);
    const metadata = await image.metadata();
    console.log(`📐 Source dimensions: ${metadata.width}x${metadata.height}\n`);

    // Generate all sizes
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);

      console.log(`⚙️  Generating ${name} (${size}x${size})...`);

      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);

      console.log(`   ✅ Saved to ${outputPath}`);
    }

    console.log('\n✨ All favicons generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run npm script to add favicon tags to HTML');
    console.log('2. Test favicons in browser');
    console.log('3. Delete vz-logo-source.png if no longer needed');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
