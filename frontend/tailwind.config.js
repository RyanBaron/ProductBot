/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minHeight: {
        '100': '100px',
        '150': '150px',
        '200': '200px',
        '250': '250px',
        '300': '300px',
        '400': '400px',
      },
      colors: {
        primary: '#0341c0',
        secondary: '#7ab9ff',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        spin: 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
