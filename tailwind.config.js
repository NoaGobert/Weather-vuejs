/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'cold': "url('./src/assets/cold-bg.jpg')",
        'warm': "url('./src/assets/warm-bg.jpg')",
      }
    },
  },
  plugins: [],
}