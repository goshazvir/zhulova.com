#!/usr/bin/env node

/**
 * Premium Hero Image Generator
 *
 * Creates modern, premium styles for hero images:
 * - Soft Luxury (subtle enhancements)
 * - Aurora Overlay (trending gradient effects)
 * - Editorial Style (magazine-like)
 * - Minimalist Premium (ultra-clean)
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

// Output files for premium styles
const outputs = {
  softLuxury: path.join(publicDir, 'hero-viktoria-luxury.webp'),
  aurora: path.join(publicDir, 'hero-viktoria-aurora.webp'),
  editorial: path.join(publicDir, 'hero-viktoria-editorial.webp'),
  minimal: path.join(publicDir, 'hero-viktoria-minimal.webp'),
};

// Target dimensions
const TARGET_HEIGHT = 800;
const TARGET_WIDTH = 600;

/**
 * Soft Luxury - Subtle premium enhancements
 */
async function generateSoftLuxury() {
  try {
    console.log('\n🌟 Generating Soft Luxury Hero...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Subtle color grading for luxury feel
      .modulate({
        brightness: 1.02,  // Slightly brighter
        saturation: 0.95,  // Slightly desaturated for elegance
        hue: 5            // Tiny warm shift
      })
      // Soft contrast enhancement
      .linear(1.05, -5)
      // Add subtle warm overlay
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(255,250,240,0.1)"/>
                <stop offset="50%" style="stop-color:transparent"/>
                <stop offset="100%" style="stop-color:rgba(212,175,55,0.05)"/>
              </linearGradient>
              <radialGradient id="softVignette">
                <stop offset="50%" style="stop-color:transparent"/>
                <stop offset="100%" style="stop-color:rgba(0,0,0,0.05)"/>
              </radialGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#luxuryGradient)"/>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#softVignette)"/>
          </svg>
        `),
        blend: 'overlay'
      }])
      .sharpen({ sigma: 1.2, m1: 0.5, m2: 0.3 })
      .webp({
        quality: 92,
        effort: 6
      })
      .toFile(outputs.softLuxury);

    const stats = await fs.stat(outputs.softLuxury);
    console.log(`✅ Soft Luxury saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Soft Luxury generation failed:', error.message);
  }
}

/**
 * Aurora Overlay - Trendy gradient effects
 */
async function generateAurora() {
  try {
    console.log('\n🌈 Generating Aurora Hero...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      .modulate({
        brightness: 1.08,
        saturation: 1.1
      })
      // Aurora gradient overlay
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <radialGradient id="aurora1" cx="20%" cy="30%">
                <stop offset="0%" style="stop-color:rgba(212,175,55,0.15)"/>
                <stop offset="100%" style="stop-color:transparent"/>
              </radialGradient>
              <radialGradient id="aurora2" cx="80%" cy="60%">
                <stop offset="0%" style="stop-color:rgba(139,169,139,0.12)"/>
                <stop offset="100%" style="stop-color:transparent"/>
              </radialGradient>
              <radialGradient id="aurora3" cx="50%" cy="90%">
                <stop offset="0%" style="stop-color:rgba(26,26,46,0.08)"/>
                <stop offset="100%" style="stop-color:transparent"/>
              </radialGradient>
            </defs>
            <ellipse cx="20%" cy="30%" rx="50%" ry="40%" fill="url(#aurora1)"/>
            <ellipse cx="80%" cy="60%" rx="45%" ry="50%" fill="url(#aurora2)"/>
            <ellipse cx="50%" cy="90%" rx="60%" ry="35%" fill="url(#aurora3)"/>
          </svg>
        `),
        blend: 'screen'
      }])
      .sharpen({ sigma: 1.5 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.aurora);

    const stats = await fs.stat(outputs.aurora);
    console.log(`✅ Aurora saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Aurora generation failed:', error.message);
  }
}

/**
 * Editorial Style - Magazine-like high contrast
 */
async function generateEditorial() {
  try {
    console.log('\n📰 Generating Editorial Hero...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // High contrast editorial look
      .modulate({
        brightness: 1.05,
        saturation: 0.9
      })
      .linear(1.2, -20)  // Strong contrast
      .gamma(1.1)        // Lift midtones
      // Add editorial gradient
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <linearGradient id="editorial" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(255,255,255,0.2)"/>
                <stop offset="30%" style="stop-color:transparent"/>
                <stop offset="70%" style="stop-color:transparent"/>
                <stop offset="100%" style="stop-color:rgba(0,0,0,0.1)"/>
              </linearGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#editorial)"/>
          </svg>
        `),
        blend: 'overlay'
      }])
      .sharpen({ sigma: 2, m1: 1, m2: 0.5 })
      .webp({
        quality: 90,
        effort: 6
      })
      .toFile(outputs.editorial);

    const stats = await fs.stat(outputs.editorial);
    console.log(`✅ Editorial saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Editorial generation failed:', error.message);
  }
}

/**
 * Minimalist Premium - Ultra-clean, subtle
 */
async function generateMinimal() {
  try {
    console.log('\n⚪ Generating Minimalist Premium Hero...');

    await sharp(sourcePhoto)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'top'
      })
      // Very subtle adjustments
      .modulate({
        brightness: 1.01,
        saturation: 1.02
      })
      // Minimal enhancement
      .linear(1.02, 0)
      // Ultra-subtle vignette only
      .composite([{
        input: Buffer.from(`
          <svg width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}">
            <defs>
              <radialGradient id="minimal">
                <stop offset="70%" style="stop-color:transparent"/>
                <stop offset="100%" style="stop-color:rgba(0,0,0,0.02)"/>
              </radialGradient>
            </defs>
            <rect width="${TARGET_WIDTH}" height="${TARGET_HEIGHT}" fill="url(#minimal)"/>
          </svg>
        `),
        blend: 'multiply'
      }])
      .sharpen({ sigma: 1 })
      .webp({
        quality: 95,  // Higher quality for minimal style
        effort: 6
      })
      .toFile(outputs.minimal);

    const stats = await fs.stat(outputs.minimal);
    console.log(`✅ Minimalist Premium saved: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Minimalist generation failed:', error.message);
  }
}

/**
 * Main function - Generate all premium variants
 */
async function main() {
  try {
    console.log('✨ Premium Hero Image Generator');
    console.log('================================\n');

    // Check if source exists
    await fs.access(sourcePhoto);
    console.log(`✅ Source found: ${sourcePhoto}`);

    const metadata = await sharp(sourcePhoto).metadata();
    console.log(`📊 Original: ${metadata.width}x${metadata.height}`);
    console.log(`🎯 Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}\n`);

    // Generate all premium variants
    await Promise.all([
      generateSoftLuxury(),
      generateAurora(),
      generateEditorial(),
      generateMinimal()
    ]);

    console.log('\n✨ All premium variants generated successfully!');
    console.log('\n📝 Style Guide:');
    console.log('1. hero-viktoria-luxury.webp - Soft, elegant luxury feel');
    console.log('2. hero-viktoria-aurora.webp - Modern gradient trends 2025');
    console.log('3. hero-viktoria-editorial.webp - High-contrast magazine style');
    console.log('4. hero-viktoria-minimal.webp - Ultra-clean minimalist');

    console.log('\n💡 Best for your brand:');
    console.log('- Soft Luxury: Perfect for "Minimal Luxury Coach" aesthetic');
    console.log('- Aurora: Great for modern, transformation-focused messaging');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the generator
main();