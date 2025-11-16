#!/usr/bin/env node

/**
 * Hero Portrait Preparation
 *
 * Prepares vertical portrait for hero section
 * - Optimizes for web display
 * - Maintains vertical aspect ratio
 * - Adds subtle modern styling
 * - No background, just the portrait
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(projectRoot, 'public/images');
const sourcePhoto = path.join(publicDir, 'original.png');
const outputFile = path.join(publicDir, 'hero-viktoria.webp');

// Target dimensions for hero portrait
// Vertical portrait that fits nicely in the hero section
const TARGET_HEIGHT = 600; // Good height for hero section
const TARGET_WIDTH = 450;  // Maintain portrait aspect ratio

async function prepareHeroPortrait() {
  try {
    console.log('🎨 Preparing Hero Portrait...\n');

    // Check if source exists
    await fs.access(sourcePhoto);
    console.log(`✅ Source portrait found: ${sourcePhoto}\n`);

    // Get source metadata
    const metadata = await sharp(sourcePhoto).metadata();
    console.log(`📊 Original dimensions: ${metadata.width}x${metadata.height}`);

    // Process the portrait:
    // 1. Resize to target dimensions
    // 2. Apply subtle enhancements
    // 3. Convert to WebP for performance
    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top' // Focus on upper part (face and shoulders)
      })
      // Apply subtle enhancements for modern look
      .modulate({
        brightness: 1.02,  // Slightly brighter
        saturation: 1.05   // Slightly more vibrant
      })
      .sharpen()  // Enhance details
      .webp({
        quality: 90,  // High quality for hero section
        effort: 6     // Max compression effort
      })
      .toFile(outputFile);

    console.log(`\n✅ Saved to ${outputFile}`);

    // Get file size
    const stats = await fs.stat(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n📊 Final specs:`);
    console.log(`   Dimensions: ${TARGET_WIDTH}x${TARGET_HEIGHT} px`);
    console.log(`   File size: ${fileSizeKB} KB`);
    console.log(`   Format: WebP`);
    console.log(`   Aspect ratio: Vertical portrait (3:4)\n`);

    if (fileSizeKB > 150) {
      console.log(`⚠️  File size (${fileSizeKB} KB) is larger than recommended 150 KB`);
      console.log(`   Consider reducing quality if load time is an issue\n`);
    } else {
      console.log(`✨ Optimized for web performance!\n`);
    }

    console.log('✅ Hero portrait prepared successfully!\n');
    console.log('📝 Modern styling applied:');
    console.log('   ✓ Optimized dimensions for hero section');
    console.log('   ✓ Enhanced brightness and saturation');
    console.log('   ✓ Sharpened for clarity');
    console.log('   ✓ WebP format for fast loading');
    console.log('   ✓ Ready for modern rounded container styling');
    console.log('\n💡 Use with CSS:');
    console.log('   - border-radius for rounded corners');
    console.log('   - box-shadow for depth');
    console.log('   - object-fit: cover for responsive sizing');

  } catch (error) {
    console.error('❌ Error preparing hero portrait:', error.message);
    process.exit(1);
  }
}

prepareHeroPortrait();