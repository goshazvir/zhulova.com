#!/usr/bin/env node

/**
 * Open Graph Image Generator
 *
 * Creates og-default.jpg (1200x630) from source photo with text overlay
 * Uses Sharp for image processing and SVG for text overlay
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
const outputFile = path.join(publicDir, 'og-default.jpg');

// OG Image dimensions (Facebook/LinkedIn standard)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function generateOGImage() {
  try {
    console.log('🎨 Generating Open Graph image...\n');

    // Check if source exists
    await fs.access(sourcePhoto);
    console.log(`✅ Source photo found: ${sourcePhoto}\n`);

    // Create text overlay SVG
    const textOverlay = Buffer.from(`
      <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
        <defs>
          <style>
            .name {
              font-family: Georgia, serif;
              font-size: 72px;
              font-weight: 700;
              fill: #ffffff;
              text-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            .title {
              font-family: Georgia, serif;
              font-size: 42px;
              font-weight: 400;
              fill: #D4AF37;
              text-shadow: 0 2px 8px rgba(0,0,0,0.5);
            }
            .overlay {
              fill: url(#gradient);
            }
          </style>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(26,26,46,0.3);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(26,26,46,0.7);stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Dark overlay for better text readability -->
        <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" class="overlay"/>

        <!-- Text content -->
        <text x="60" y="480" class="name">Вікторія Жульова</text>
        <text x="60" y="550" class="title">сертифікований коуч</text>
      </svg>
    `);

    console.log('⚙️  Processing image...');

    // Process image: resize, crop, add overlay
    await sharp(sourcePhoto)
      .resize(OG_WIDTH, OG_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .composite([{
        input: textOverlay,
        top: 0,
        left: 0
      }])
      .jpeg({
        quality: 85,
        mozjpeg: true
      })
      .toFile(outputFile);

    console.log(`✅ Saved to ${outputFile}\n`);

    // Get file size
    const stats = await fs.stat(outputFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`📊 File size: ${fileSizeKB} KB`);
    console.log(`📐 Dimensions: ${OG_WIDTH}x${OG_HEIGHT} px\n`);

    console.log('✨ Open Graph image generated successfully!\n');
    console.log('🔗 Test your OG image:');
    console.log('   Facebook: https://developers.facebook.com/tools/debug/');
    console.log('   LinkedIn: https://www.linkedin.com/post-inspector/');

  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
