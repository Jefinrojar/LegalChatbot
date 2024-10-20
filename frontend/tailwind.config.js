/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#012169',
        'custom-pink': '#FF9090',
        'custom-purple': '#8F0092',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #FF9090 0%, #8F0092 100%)',
      },
      fontFamily:{
        'outfit': "Outfit",
      }
    },
  },
  plugins: [],
}

