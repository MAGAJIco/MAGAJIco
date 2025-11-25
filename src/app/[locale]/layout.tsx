// app/[locale]/layout.tsx

import "../globals.css";
import "../../styles/icons.css";
import { ReactNode } from "react";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col items-center">
      <main className="w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
