
'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    // Immediate theme application to prevent flash
    const applyTheme = () => {
      const stored = localStorage.getItem('theme') || 'system';
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = stored === 'dark' || (stored === 'system' && systemDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();
  }, []);

  return null;
}


'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return null;
}
