// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'My App',
  description: 'Clean layout with Amazon light and Apple dark theme',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" data-theme="light">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-bg-primary text-text-primary transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}