import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Amazon Light Theme
        'amazon-light': '#ffffff',
        'amazon-blue': '#0066cc',
        'amazon-orange': '#ff9900',
        'amazon-dark': '#131921',
        
        // iPhone Dark Theme
        'iphone-dark': '#000000',
        'iphone-gray': '#1c1c1e',
        'iphone-blue': '#0a84ff',
        
        // Gradients
        'gradient-from': '#a855f7',
        'gradient-to': '#7c3aed',
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(to right, #3b82f6, #1d4ed8)',
        'gradient-purple': 'linear-gradient(to right, #a855f7, #7c3aed)',
        'gradient-red': 'linear-gradient(to right, #ef4444, #f97316)',
        'gradient-green': 'linear-gradient(to right, #10b981, #059669)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
