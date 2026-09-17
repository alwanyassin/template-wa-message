/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wa: {
          light: '#25D366',
          DEFAULT: '#128C7E',
          dark: '#075E54',
          bubble: '#E7FCE3',
          darkBubble: '#056162',
          bg: '#EFEAE2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
