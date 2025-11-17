#!/usr/bin/env node

/**
 * Convert viktoriia2.jpg to footer-viktoria.webp with luxury styling
 * Same styling as hero-viktoria-luxury.webp
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

const inputPath = join(projectRoot, 'public/images/viktoriia2.jpg');
const outputPath = join(projectRoot, 'public/images/footer-viktoria.webp');

async function convertImage() {
  console.log('🎨 Converting footer image with luxury styling...');
  console.log(`📁 Input: ${inputPath}`);
  console.log(`📁 Output: ${outputPath}`);

  try {
    await sharp(inputPath)
      // Resize to reasonable dimensions (600x800 like hero)
      .resize(600, 800, {
        fit: 'cover',
        position: 'top',
      })
      // Apply SOFT LUXURY styling (same as hero)
      .modulate({
        brightness: 1.02,  // Slightly brighter
        saturation: 0.95,  // Slightly desaturated for elegance
        hue: 5            // Tiny warm shift
      })
      // Soft contrast enhancement
      .linear(1.05, -5)
      // Add subtle warm overlay (same as hero)
      .composite([{
        input: Buffer.from(`
          <svg width="600" height="800">
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
            <rect width="600" height="800" fill="url(#luxuryGradient)"/>
            <rect width="600" height="800" fill="url(#softVignette)"/>
          </svg>
        `),
        blend: 'overlay'
      }])
      .sharpen({ sigma: 1.2, m1: 0.5, m2: 0.3 })
      // Convert to WebP with high quality
      .webp({
        quality: 92,
        effort: 6,
      })
      .toFile(outputPath);

    console.log('✅ Footer image converted successfully!');
    console.log(`📊 Luxury styling applied (enhanced contrast, warm tones, rich colors)`);
  } catch (error) {
    console.error('❌ Error converting image:', error);
    process.exit(1);
  }
}

convertImage();
