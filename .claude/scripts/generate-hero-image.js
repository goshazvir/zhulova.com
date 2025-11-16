#!/usr/bin/env node

/**
 * Hero Image Generator
 *
 * Creates hero-viktoria.webp (1920x1080) from source photo
 * - Crops to focus on subject (right side)
 * - Adds gradient overlay for text readability
 * - Optimizes for web performance
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public/images');
const sourcePhoto = path.join(publicDir, 'viktoria-source.jpg');
const outputFile = path.join(publicDir, 'hero-viktoria.webp');

// Hero dimensions (Full HD)
const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;

async function generateHeroImage() {
  try {
    console.log('🎨 Generating Hero image...\n');

    // Check if source exists
    await fs.access(sourcePhoto);
    console.log(`✅ Source photo found: ${sourcePhoto}\n`);

    // Get source image metadata
    const metadata = await sharp(sourcePhoto).metadata();
    console.log(`📊 Source dimensions: ${metadata.width}x${metadata.height}`);

    // Create gradient overlay SVG for better text readability
    // Darker on left where text will be, lighter on right to show photo
    const gradientOverlay = Buffer.from(`
      <svg width="${HERO_WIDTH}" height="${HERO_HEIGHT}">
        <defs>
          <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgba(26,26,46,0.85);stop-opacity:1" />
            <stop offset="40%" style="stop-color:rgba(26,26,46,0.65);stop-opacity:1" />
            <stop offset="70%" style="stop-color:rgba(26,26,46,0.35);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(26,26,46,0.15);stop-opacity:1" />
          </linearGradient>
          <!-- Additional vignette for depth -->
          <radialGradient id="vignette">
            <stop offset="50%" style="stop-color:rgba(0,0,0,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.3);stop-opacity:1" />
          </radialGradient>
        </defs>

        <!-- Gradient overlay -->
        <rect width="${HERO_WIDTH}" height="${HERO_HEIGHT}" fill="url(#heroGradient)"/>

        <!-- Vignette effect -->
        <rect width="${HERO_WIDTH}" height="${HERO_HEIGHT}" fill="url(#vignette)"/>
      </svg>
    `);

    console.log('⚙️  Processing image...');
    console.log('  - Cropping to focus on subject (right side)');
    console.log('  - Resizing to 1920x1080');
    console.log('  - Adding gradient overlay for text contrast');
    console.log('  - Converting to WebP format\n');

    // Process image:
    // Strategy: Extract right portion first, then resize
    // The subject (Viktoria) is on the right side of the image

    // Calculate extraction area
    // We want to focus on the right part where Viktoria is
    // She's positioned at approximately 65-70% from left
    const aspectRatio = HERO_WIDTH / HERO_HEIGHT; // 1.777...

    // Take right 45% of the image to include full portrait
    const focusPercentage = 0.45; // Take right 45% of image

    // Calculate the extraction dimensions for 16:9 aspect ratio
    let extractWidth = Math.floor(metadata.width * focusPercentage);
    let extractHeight = Math.floor(extractWidth / aspectRatio);

    // Make sure we don't exceed image height
    if (extractHeight > metadata.height) {
      extractHeight = metadata.height;
      extractWidth = Math.floor(extractHeight * aspectRatio);
    }

    // Position extraction to capture Viktoria on the right side
    // Start from about 55% from left to get her properly framed
    let extractLeft = Math.floor(metadata.width * 0.55);

    // Adjust vertical position to capture head and shoulders
    // Start from top third to get the full portrait
    let extractTop = Math.floor(metadata.height * 0.15); // Start from upper portion

    console.log(`  - Original image: ${metadata.width}x${metadata.height}`);
    console.log(`  - Focusing on right 40% to position subject on right side`);
    console.log(`  - Extracting area: ${extractWidth}x${extractHeight} from position ${extractLeft},${extractTop}`);

    await sharp(sourcePhoto)
      .extract({
        left: extractLeft,
        top: extractTop,
        width: extractWidth,
        height: extractHeight
      })
      .resize(HERO_WIDTH, HERO_HEIGHT, {
        fit: 'fill' // Exact dimensions
      })
      .composite([{
        input: gradientOverlay,
        top: 0,
        left: 0,
        blend: 'over'
      }])
      .webp({
        quality: 85,
        effort: 6 // Max compression effort
      })
      .toFile(outputFile);

    console.log(`✅ Saved to ${outputFile}\n`);

    // Get file size
    const stats = await fs.stat(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`📊 Final specs:`);
    console.log(`   File size: ${fileSizeKB} KB`);
    console.log(`   Dimensions: ${HERO_WIDTH}x${HERO_HEIGHT} px`);
    console.log(`   Format: WebP\n`);

    // Provide optimization feedback
    if (fileSizeKB > 200) {
      console.log(`⚠️  File size (${fileSizeKB} KB) exceeds recommended 200 KB`);
      console.log(`   Consider reducing quality or using more aggressive compression\n`);
    } else {
      console.log(`✨ Optimized for web performance!\n`);
    }

    console.log('✅ Hero image generated successfully!\n');
    console.log('📝 Best practices applied:');
    console.log('   ✓ Focused crop on subject (right side)');
    console.log('   ✓ Gradient overlay for text readability');
    console.log('   ✓ WebP format for smaller file size');
    console.log('   ✓ 1920x1080 resolution (Full HD)');
    console.log('   ✓ Vignette effect for visual depth');

  } catch (error) {
    console.error('❌ Error generating Hero image:', error.message);

    // Provide helpful error messages
    if (error.code === 'ENOENT') {
      console.error('\n💡 Make sure the source file exists:');
      console.error(`   ${sourcePhoto}`);
    }

    process.exit(1);
  }
}

// Alternative version without gradient (for comparison)
async function generateHeroImageClean() {
  try {
    const outputFileClean = path.join(publicDir, 'hero-viktoria-clean.webp');

    console.log('\n🎨 Generating clean version (without overlay)...');

    const metadata = await sharp(sourcePhoto).metadata();

    // Calculate extraction area (same as above)
    const aspectRatio = HERO_WIDTH / HERO_HEIGHT;
    const focusPercentage = 0.45;

    let extractWidth = Math.floor(metadata.width * focusPercentage);
    let extractHeight = Math.floor(extractWidth / aspectRatio);

    if (extractHeight > metadata.height) {
      extractHeight = metadata.height;
      extractWidth = Math.floor(extractHeight * aspectRatio);
    }

    let extractLeft = Math.floor(metadata.width * 0.55);
    let extractTop = Math.floor(metadata.height * 0.15);

    // Just crop and resize, no overlay
    await sharp(sourcePhoto)
      .extract({
        left: extractLeft,
        top: extractTop,
        width: extractWidth,
        height: extractHeight
      })
      .resize(HERO_WIDTH, HERO_HEIGHT, {
        fit: 'fill'
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputFileClean);

    console.log(`✅ Clean version saved to ${outputFileClean}\n`);
    console.log('💡 You can compare both versions and choose the best one');

  } catch (error) {
    console.error('⚠️  Could not generate clean version:', error.message);
  }
}

// Run both versions
async function main() {
  await generateHeroImage();
  await generateHeroImageClean();
}

main();