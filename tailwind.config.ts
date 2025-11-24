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
          50: '#f0f4ff',
          100: '#e6edff',
          400: '#818cf8',
          500: '#667eea',
          600: '#5568d3',
          700: '#3d47a0',
        },
        secondary: {
          500: '#764ba2',
          600: '#6b4096',
        },
        accent: '#f093fb',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-brand-hover': 'linear-gradient(135deg, #5568d3 0%, #6b4096 100%)',
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