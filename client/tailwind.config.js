/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef4f4',
          100: '#cde0e0',
          200: '#9ec2c2',
          300: '#6ea3a3',
          400: '#3f8585',
          500: '#1a3535',
          600: '#152b2b',
          700: '#102020',
          800: '#0a1515',
          900: '#050b0b',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#f9edcc',
          200: '#f3d98a',
          300: '#edc24a',
          400: '#d4a843',
          500: '#b8880c',
          600: '#956d09',
          700: '#725306',
          800: '#4e3804',
          900: '#2b1e02',
        },
        cream: {
          50:  '#fdfaf5',
          100: '#f7f2e8',
          200: '#f0e8d5',
          300: '#e8dcc0',
          400: '#ddd0ab',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
