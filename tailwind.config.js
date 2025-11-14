/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'Sora', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        lavender: {
          50: '#e8c7ff',
          100: '#d4a5e8',
          200: '#c28dd9',
          300: '#b075c7',
          400: '#9d5db5',
          500: '#a875c7',
          600: '#8e5da8',
          700: '#7a4d94',
          800: '#663d80',
          900: '#522d6c',
        },
        accent: {
          pink: '#ff9ff3',
          purple: '#c56cf0',
          lavender: '#c6a4ff',
        },
      },
      animation: {
        'gradient-slow': 'gradient-slow 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-soft': 'glow-soft 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-slow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-soft': {
          '0%': { boxShadow: '0 0 20px rgba(255, 159, 243, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(197, 108, 240, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

