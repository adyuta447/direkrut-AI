/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-ibm-plex-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#0a66c2',
        'primary-strong': '#084e96',
        accent: '#f97316',
        canvas: '#ffffff',
        'surface-1': '#f4f6f8',
        'surface-2': '#e8ecf0',
        ink: '#161616',
        'ink-muted': '#5a6572',
        hairline: '#e4e7ec',
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
