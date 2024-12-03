/** @type {import('tailwindcss').Config} */
module.exports = {
<<<<<<< HEAD
  content: ["index.html","./{js,page}/**/*.{html,js}"],
=======
  content: ["./{src,js,page}/**/*.{html,js}"],
>>>>>>> 866ca6b2c340e466c3883c50dbb3a90dbe3e48ae
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

