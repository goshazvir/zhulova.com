import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://zhulova.com',
  output: 'static', // Static pages (SSG) + API routes as serverless functions
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  build: {
    // Inline all stylesheets to eliminate render-blocking CSS
    inlineStylesheets: 'always',
  },

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
        '@design-system': path.resolve(__dirname, './src/design-system'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@data': path.resolve(__dirname, './src/data'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          // Strip debug noise but KEEP console.error — it is the only client-side
          // trace of a lost lead when /api/submit-quiz fails (quiz-opora.md, AC-4)
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
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
