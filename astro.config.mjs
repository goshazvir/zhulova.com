import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://zhulova.com',
  output: 'hybrid', // Hybrid: static pages + serverless API endpoints
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    react(), // React for interactive islands
    tailwind({
      applyBaseStyles: false, // Custom base styles in global.css
    }),
    sitemap(),
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@data': path.resolve(__dirname, './src/data'),
      },
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
        },
      },
    },
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  compressHTML: true,
});
