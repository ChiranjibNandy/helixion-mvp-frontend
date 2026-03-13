/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
      },
      colors: {
        blue: {
          DEFAULT: '#3b6fe0',
          light:   '#4d7ef5',
          dim:     'rgba(59,111,224,0.18)',
        },
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease both',
        'spin-fast': 'spin 0.65s linear infinite',
      },
    },
  },
  plugins: [],
}
