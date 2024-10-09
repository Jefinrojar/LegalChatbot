/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#012169',
      },
      fontFamily:{
        'outfit': "Outfit",
      }
    },
  },
  plugins: [],
}

