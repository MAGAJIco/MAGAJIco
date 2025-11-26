/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff9900',
        secondary: '#232f3e',
        amazon: {
          50: '#fff8e7',
          100: '#ffeccc',
          200: '#ffd699',
          300: '#ffc166',
          400: '#ffad33',
          500: '#ff9900',
          600: '#e68900',
          700: '#cc7700',
          800: '#b36600',
          900: '#8c5200',
        },
        navy: {
          50: '#f3f4f6',
          100: '#e5e7eb',
          200: '#d1d5db',
          300: '#9ca3af',
          400: '#6b7280',
          500: '#374151',
          600: '#1f2937',
          700: '#131921',
          800: '#111827',
          900: '#0f1111',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.5)',
        glow: '0 4px 12px rgba(255, 153, 0, 0.4)',
      },
      animation: {
        pulse: 'pulse 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
      },
    },
  },
  darkMode: 'media',
};
