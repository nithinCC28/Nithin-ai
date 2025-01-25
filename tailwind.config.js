/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#000000',
          darker: '#121212',
          dark: '#1A1A1A',
          gray: '#2A2A2A',
          lightgray: '#404040',
          accent: '#808080'
        }
      }
    },
  },
  plugins: [],
};