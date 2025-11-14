/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1a202c',
        },
        gold: {
          50: '#fdfaf3',
          100: '#faf4e6',
          200: '#f4e8c0',
          300: '#eedc9a',
          400: '#e8cf74',
          500: '#d4af37',
          600: '#b8941f',
          700: '#9a7a16',
          800: '#7c600f',
          900: '#5e4608',
        },
        sage: {
          50: '#f5f7f5',
          100: '#e8ede8',
          200: '#d1dcd1',
          300: '#b9cbb9',
          400: '#a2baa2',
          500: '#8ba98b',
          600: '#739873',
          700: '#5c875c',
          800: '#457645',
          900: '#2e652e',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
