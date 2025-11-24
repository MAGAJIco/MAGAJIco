import React, { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/design-tokens.css";
import "../styles/theme.css";
import ThemeInitializer from "./components/ThemeInitializer";
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
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.png'
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
  viewportFit: 'cover', // Support for notched devices
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}