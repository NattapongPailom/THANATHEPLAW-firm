
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#c5a059',
          dark: '#020617',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif Thai', 'serif'],
      },
    },
  },
  plugins: [],
}
