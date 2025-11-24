import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          400: '#42a5f5',
          500: '#0066cc',
          600: '#0052a3',
          700: '#00397a',
        },
        secondary: {
          500: '#ff9900',
          600: '#e68a00',
        },
        accent: '#146eb4',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0066cc 0%, #ff9900 100%)',
        'gradient-brand-hover': 'linear-gradient(135deg, #0052a3 0%, #e68a00 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-dark': '0 0 20px rgba(102, 126, 234, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;