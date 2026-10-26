/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          darkRed: '#B81D24',
          black: '#141414',
          darkGray: '#181818',
          lightGray: '#2F2F2F',
          border: '#333333'
        }
      }
    },
  },
  plugins: [],
}
