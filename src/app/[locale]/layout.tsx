// app/[locale]/layout.tsx

import "../globals.css";
import "../../styles/icons.css";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "de" },
  ];
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validLocales = ["en", "es", "fr", "de"];

  if (!validLocales.includes(locale)) notFound();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <TopNav />
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
