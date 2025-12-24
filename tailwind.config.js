/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-navy': '#0d1b2a',
        'christmas-green': '#2a9d8f',
      }
    },
  },
  plugins: [],
}