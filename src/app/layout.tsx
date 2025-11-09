
import React, { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/design-tokens.css";
import "../styles/theme.css";
import DarkModeToggle from "./components/DarkModeToggle";
import ThemeInitializer from "./components/ThemeInitializer";
import { Analytics } from "@vercel/analytics/react";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "MagajiCo Sports",
  description: 'Live sports scores and predictions',
  keywords: ['sports predictions', 'live matches', 'AI sports', 'sports betting', 'sports hub', 'entertainment platform', 'sports social network'],
  authors: [{ name: 'MagajiCo Team' }],
  creator: 'MagajiCo',
  publisher: 'MagajiCo',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MagajiCo'
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.png'
  },
  openGraph: {
    type: 'website',
    title: 'MagajiCo - Your All-in-One Sports & Entertainment Hub',
    description: 'AI-powered predictions, live match tracking, social connections, and rewards - all in one powerful platform.',
    siteName: 'MagajiCo'
  },
  twitter: {
    card: 'summary',
    title: 'MagajiCo - Your All-in-One Sports & Entertainment Hub',
    description: 'AI-powered predictions, live match tracking, social connections, and rewards - all in one platform.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <ThemeInitializer />
        <DarkModeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
