/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0c0b09',
          800: '#141210',
          700: '#1a1510',
          600: '#2e2010',
          500: '#3d2e18',
          400: '#52401f',
        },
        gold: {
          100: '#f8eed8',
          200: '#e4cfa0',
          300: '#d4b07a',
          400: '#c4a06a',
          500: '#a07840',
          600: '#856d4a',
          700: '#6a5030',
        },
        warm: {
          100: '#f9f7f3',
          200: '#f4f0e6',
          300: '#e8e0d0',
          400: '#d4c8b4',
          500: '#b4a890',
          600: '#8a7a60',
        },
        // keep for any remaining references
        primary: {
          500: '#0c0b09',
          600: '#141210',
        },
        cream: {
          100: '#f9f7f3',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
