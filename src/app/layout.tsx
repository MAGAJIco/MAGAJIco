import React, { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/design-tokens.css";
import "../styles/theme-enhanced.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://magajico.com'),
  title: "MagajiCo Sports Central - AI Sports Predictions & Live Matches",
  description: "Get AI-powered sports predictions, live match tracking, and earn rewards. Real-time data from FlashScore, MyBetsToday & StatArea!",
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
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: '/favicon.png'
  },
  openGraph: {
    type: 'website',
    title: "MagajiCo Sports Central - AI Sports Predictions",
    description: "AI-powered predictions from multiple sources • Live tracking • Earn rewards",
    siteName: 'MagajiCo',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sports Central - AI Predictions & Live Matches"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Central - AI Sports Predictions",
    description: "Real-time predictions • Multi-source data • Earn rewards",
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
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#667eea' },
    { media: '(prefers-color-scheme: dark)', color: '#667eea' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        
        {/* PWA and Mobile App */}
        <meta name="application-name" content="MagajiCo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MagajiCo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#667eea" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#667eea" media="(prefers-color-scheme: dark)" />
        
        {/* Mobile UI Optimization */}
        <meta name="format-detection" content="telephone=no,email=no,address=no" />
        <meta name="viewport-fit" content="cover" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Status Bar */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Windows */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Global Site Tag for Analytics */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}