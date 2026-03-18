/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        opera: {
          indigo: '#233E65',
          burgundy: '#710927',
          brass: '#C49F6D',
          plaster: '#F0EFEA',
          linen: '#DDD1BC',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['monospace'],
      }
    },
  },
  plugins: [],
}
