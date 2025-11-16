#!/usr/bin/env node

/**
 * Hero Image Generator from Vertical Portrait
 *
 * Creates hero-viktoria.webp (1920x1080) using vertical portrait
 * Places portrait on right side with gradient background
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public/images');
const verticalPhoto = path.join(publicDir, 'original.png');
const outputFile = path.join(publicDir, 'hero-viktoria.webp');

// Hero dimensions
const HERO_WIDTH = 1920;
const HERO_HEIGHT = 1080;

async function generateHeroImage() {
  try {
    console.log('🎨 Generating Hero image from vertical portrait...\n');

    // Check if source exists
    await fs.access(verticalPhoto);
    console.log(`✅ Vertical portrait found: ${verticalPhoto}\n`);

    // Get portrait metadata
    const portraitMetadata = await sharp(verticalPhoto).metadata();
    console.log(`📊 Portrait dimensions: ${portraitMetadata.width}x${portraitMetadata.height}`);

    // Calculate portrait size to fit nicely in hero
    // Portrait should take about 1/3 of width and fit height
    let portraitHeight = HERO_HEIGHT - 100; // Leave 50px margin top/bottom
    let portraitWidth = Math.floor(portraitHeight * (portraitMetadata.width / portraitMetadata.height));

    // Make sure portrait isn't too wide
    const maxPortraitWidth = Math.floor(HERO_WIDTH * 0.4); // Max 40% of width
    if (portraitWidth > maxPortraitWidth) {
      portraitWidth = maxPortraitWidth;
      portraitHeight = Math.floor(portraitWidth * (portraitMetadata.height / portraitMetadata.width));
    }

    console.log(`  - Resizing portrait to: ${portraitWidth}x${portraitHeight}`);

    // Resize the portrait
    const portraitBuffer = await sharp(verticalPhoto)
      .resize(portraitWidth, portraitHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Create gradient background
    const backgroundSvg = Buffer.from(`
      <svg width="${HERO_WIDTH}" height="${HERO_HEIGHT}">
        <defs>
          <!-- Main gradient from left to right -->
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#fafaf9;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f5f5f4;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#e7e5e4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d6d3d1;stop-opacity:1" />
          </linearGradient>

          <!-- Subtle overlay for depth -->
          <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgba(26,26,46,0.05);stop-opacity:1" />
            <stop offset="60%" style="stop-color:rgba(26,26,46,0.02);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(26,26,46,0);stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="${HERO_WIDTH}" height="${HERO_HEIGHT}" fill="url(#bgGradient)"/>

        <!-- Subtle overlay -->
        <rect width="${HERO_WIDTH}" height="${HERO_HEIGHT}" fill="url(#overlay)"/>
      </svg>
    `);

    // Calculate portrait position (right side with some margin)
    const portraitX = HERO_WIDTH - portraitWidth - 100; // 100px from right edge
    const portraitY = Math.floor((HERO_HEIGHT - portraitHeight) / 2); // Center vertically

    console.log(`  - Positioning portrait at: ${portraitX},${portraitY}`);

    // Compose final image
    await sharp(backgroundSvg)
      .resize(HERO_WIDTH, HERO_HEIGHT)
      .composite([
        {
          input: portraitBuffer,
          left: portraitX,
          top: portraitY,
          blend: 'over'
        }
      ])
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputFile);

    console.log(`\n✅ Saved to ${outputFile}`);

    // Get file size
    const stats = await fs.stat(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n📊 Final specs:`);
    console.log(`   File size: ${fileSizeKB} KB`);
    console.log(`   Hero dimensions: ${HERO_WIDTH}x${HERO_HEIGHT} px`);
    console.log(`   Portrait size: ${portraitWidth}x${portraitHeight} px`);
    console.log(`   Portrait position: right side`);
    console.log(`   Format: WebP\n`);

    console.log('✨ Hero image generated successfully!\n');
    console.log('📝 Layout features:');
    console.log('   ✓ Vertical portrait on right side');
    console.log('   ✓ Gradient background (light to subtle gray)');
    console.log('   ✓ Large text area on left side');
    console.log('   ✓ Professional hero section design');

  } catch (error) {
    console.error('❌ Error generating Hero image:', error.message);

    if (error.code === 'ENOENT') {
      console.error('\n💡 Make sure the vertical portrait exists:');
      console.error(`   ${verticalPhoto}`);
    }

    process.exit(1);
  }
}

generateHeroImage();