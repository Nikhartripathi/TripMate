/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7C3AED',
          dark: '#3B82F6',
        },
        background: '#F9FAFB',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #3B82F6, #7C3AED)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft':    '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'soft-dark':    '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
        'premium-dark': '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
