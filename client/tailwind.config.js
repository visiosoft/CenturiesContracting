/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f7eb',
          100: '#daeece',
          200: '#b5dd9d',
          300: '#8fc96c',
          400: '#6aaf42',
          500: '#4F7A3A',
          600: '#3d6129',
          700: '#2d4820',
          800: '#1e3015',
          900: '#0f180b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
