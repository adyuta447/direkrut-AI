/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"IBM Plex Sans"', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#0f62fe',
        canvas: '#ffffff',
        'surface-1': '#f4f4f4',
        'surface-2': '#e0e0e0',
        ink: '#161616',
        'ink-muted': '#525252',
        hairline: '#e0e0e0',
        'inverse-canvas': '#161616',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
