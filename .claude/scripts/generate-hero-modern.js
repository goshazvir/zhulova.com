#!/usr/bin/env node

/**
 * Modern Hero Portrait Generator
 *
 * Creates stylized hero images with contemporary effects:
 * - Duotone color grading
 * - Split-tone effects
 * - Premium texture
 * - Organic shapes
 * - Optimized for web performance
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

// Output files for different styles
const outputs = {
  duotone: path.join(publicDir, 'hero-viktoria-duotone.webp'),
  splitTone: path.join(publicDir, 'hero-viktoria-splittone.webp'),
  glassmorphism: path.join(publicDir, 'hero-viktoria-glass.webp'),
  organic: path.join(publicDir, 'hero-viktoria-organic.webp'),
  clean: path.join(publicDir, 'hero-viktoria.webp'), // Default/clean version
};

// Target dimensions for hero portrait
const TARGET_HEIGHT = 600;
const TARGET_WIDTH = 450;

// Brand colors from tailwind.config.mjs
const BRAND_COLORS = {
  navy: { r: 26, g: 26, b: 46 },      // navy-900
  gold: { r: 212, g: 175, b: 55 },    // gold-500
  sage: { r: 139, g: 169, b: 139 },   // sage-500
  white: { r: 255, g: 255, b: 255 },
};

/**
 * Generate duotone effect - Spotify style with brand colors
 */
async function generateDuotone() {
  try {
    console.log('\n🎨 Generating Duotone Hero (Navy + Gold)...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Convert to grayscale first
      .grayscale()
      // Apply much subtler duotone tinting
      .tint({ r: 180, g: 160, b: 120 }) // Subtle warm tint instead of pure gold
      .modulate({
        brightness: 1.05,
        saturation: 0.5,  // Lower saturation
        hue: 10 // Much smaller hue shift
      })
      // Enhance contrast
      .linear(1.1, -5)  // Gentler contrast
      // Add navy shadows and gold highlights via composite
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <linearGradient id="duotoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="rgba(212,175,55,0.08)"/> <!-- Subtle gold in highlights -->
                <stop offset="50%" stop-color="transparent"/>
                <stop offset="100%" stop-color="rgba(26,26,46,0.25)"/> <!-- Navy in shadows -->
              </linearGradient>
              <radialGradient id="vignette">
                <stop offset="40%" stop-color="transparent"/>
                <stop offset="100%" stop-color="rgba(26,26,46,0.3)"/>
              </radialGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#duotoneGradient)"/>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#vignette)"/>
          </svg>
        `),
        blend: 'overlay'
      }])
      .sharpen({ sigma: 1.5 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.duotone);

    const stats = await fs.stat(outputs.duotone);
    console.log(`✅ Duotone saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Duotone generation failed:', error.message);
  }
}

/**
 * Generate split-tone effect - Warm highlights, cool shadows
 */
async function generateSplitTone() {
  try {
    console.log('\n🎨 Generating Split-Tone Hero (Warm/Cool)...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Warm the highlights
      .modulate({
        brightness: 1.05,
        saturation: 1.1
      })
      // Boost warm tones in highlights
      .linear(1.08, 5) // Lift highlights
      // Cool the shadows
      .gamma(1.15) // Lift shadows slightly
      // Add color overlay for split-tone
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <linearGradient id="splitTone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="rgba(212,175,55,0.15)"/> <!-- Gold highlights -->
                <stop offset="50%" stop-color="transparent"/>
                <stop offset="100%" stop-color="rgba(26,26,46,0.2)"/> <!-- Navy shadows -->
              </linearGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#splitTone)"/>
          </svg>
        `),
        blend: 'overlay'
      }])
      // Add film grain for texture
      .sharpen({ sigma: 2, m1: 0, m2: 2 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.splitTone);

    const stats = await fs.stat(outputs.splitTone);
    console.log(`✅ Split-tone saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Split-tone generation failed:', error.message);
  }
}

/**
 * Generate glassmorphism effect - Frosted glass overlay
 */
async function generateGlassmorphism() {
  try {
    console.log('\n🎨 Generating Glassmorphism Hero (Frosted)...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Slight blur for glass effect base
      .blur(0.5)
      // Brighten for glass feel
      .modulate({
        brightness: 1.15,
        saturation: 0.9
      })
      // Add frosted overlay
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <filter id="frost">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
              </filter>
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
                <stop offset="50%" stop-color="rgba(255,255,255,0.1)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0.3)"/>
              </linearGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}"
              fill="url(#glassGradient)" filter="url(#frost)"/>
          </svg>
        `),
        blend: 'screen'
      }])
      // Enhance edges
      .sharpen({ sigma: 1 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.glassmorphism);

    const stats = await fs.stat(outputs.glassmorphism);
    console.log(`✅ Glassmorphism saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Glassmorphism generation failed:', error.message);
  }
}

/**
 * Generate organic blob shape - Modern organic mask
 */
async function generateOrganic() {
  try {
    console.log('\n🎨 Generating Organic Shape Hero (Blob)...');

    // Create organic blob SVG mask
    const blobMask = Buffer.from(`
      <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="blob" d="
            M ${TARGET_WIDTH * 0.5}, ${TARGET_HEIGHT * 0.05}
            C ${TARGET_WIDTH * 0.8}, ${TARGET_HEIGHT * 0.1}
              ${TARGET_WIDTH * 0.95}, ${TARGET_HEIGHT * 0.3}
              ${TARGET_WIDTH * 0.95}, ${TARGET_HEIGHT * 0.5}
            C ${TARGET_WIDTH * 0.95}, ${TARGET_HEIGHT * 0.75}
              ${TARGET_WIDTH * 0.85}, ${TARGET_HEIGHT * 0.95}
              ${TARGET_WIDTH * 0.6}, ${TARGET_HEIGHT * 0.95}
            C ${TARGET_WIDTH * 0.35}, ${TARGET_HEIGHT * 0.95}
              ${TARGET_WIDTH * 0.05}, ${TARGET_HEIGHT * 0.85}
              ${TARGET_WIDTH * 0.05}, ${TARGET_HEIGHT * 0.6}
            C ${TARGET_WIDTH * 0.05}, ${TARGET_HEIGHT * 0.35}
              ${TARGET_WIDTH * 0.1}, ${TARGET_HEIGHT * 0.15}
              ${TARGET_WIDTH * 0.3}, ${TARGET_HEIGHT * 0.08}
            C ${TARGET_WIDTH * 0.4}, ${TARGET_HEIGHT * 0.04}
              ${TARGET_WIDTH * 0.45}, ${TARGET_HEIGHT * 0.03}
              ${TARGET_WIDTH * 0.5}, ${TARGET_HEIGHT * 0.05}
            Z
          "/>
        </defs>
        <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="white"/>
        <use href="#blob" fill="black"/>
      </svg>
    `);

    // First resize the image
    const resizedBuffer = await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      .modulate({
        brightness: 1.05,
        saturation: 1.05
      })
      .toBuffer();

    // Then apply blob mask
    await sharp(resizedBuffer)
      .composite([{
        input: blobMask,
        blend: 'dest-in'
      }])
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.organic);

    const stats = await fs.stat(outputs.organic);
    console.log(`✅ Organic blob saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Organic shape generation failed:', error.message);
  }
}

/**
 * Generate clean version - Enhanced but minimal
 */
async function generateClean() {
  try {
    console.log('\n🎨 Generating Clean Hero (Enhanced)...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Subtle enhancements only
      .modulate({
        brightness: 1.02,
        saturation: 1.05
      })
      .sharpen({ sigma: 1.5 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.clean);

    const stats = await fs.stat(outputs.clean);
    console.log(`✅ Clean version saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Clean generation failed:', error.message);
  }
}

/**
 * Main function - Generate all variants
 */
async function main() {
  try {
    console.log('🚀 Modern Hero Image Generator');
    console.log('================================\n');

    // Check if source exists
    await fs.access(sourcePhoto);
    console.log(`✅ Source found: ${sourcePhoto}`);

    const metadata = await sharp(sourcePhoto).metadata();
    console.log(`📊 Original: ${metadata.width}x${metadata.height}`);
    console.log(`🎯 Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}\n`);

    // Generate all variants
    await Promise.all([
      generateDuotone(),
      generateSplitTone(),
      generateGlassmorphism(),
      generateOrganic(),
      generateClean()
    ]);

    console.log('\n✨ All variants generated successfully!');
    console.log('\n📝 Usage Guide:');
    console.log('1. hero-viktoria-duotone.webp - Bold Spotify-style effect');
    console.log('2. hero-viktoria-splittone.webp - Subtle warm/cool tones');
    console.log('3. hero-viktoria-glass.webp - Modern frosted glass effect');
    console.log('4. hero-viktoria-organic.webp - Trendy blob shape mask');
    console.log('5. hero-viktoria.webp - Clean enhanced version');

    console.log('\n💡 CSS Tips:');
    console.log('- Add "rounded-2xl" class for rounded corners');
    console.log('- Add "shadow-2xl" for depth');
    console.log('- Use "animate-morph" for blob shape animation');
    console.log('- Apply "backdrop-blur" for glassmorphism containers');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ENOENT') {
      console.error(`\n💡 Make sure the source file exists: ${sourcePhoto}`);
    }
    process.exit(1);
  }
}

// Run the generator
main();