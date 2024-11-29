/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{src,js,page}/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Comfortaa', 'sans-serif'],
      },
      fontSize: {
        'custom-32': '32px',
        'custom-15': '15px',
        'custom-20': '20px',
        'custom-16': '16px'
      }
    },
  },
  plugins: [],
}

