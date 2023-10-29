/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {    
      colors: {
      'c-blue': {
        200: '#cffafe',
        300: '#527691',
        400: '#335c76',
        500: '#285979',
        600: '#165878',
        700: '#083653',
        800: '#072e4b',
        900: '#082d42',
      },
      'c-yellow': {
        400: '#fffb7c',
        900: '#ed5a14'
      }
    },
  },

  },
  plugins: [],
}
