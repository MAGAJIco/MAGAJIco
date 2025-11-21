import { ReactNode } from "react";
import { notFound } from "next/navigation";
import '../globals.css';
import '../../styles/icons.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "de" },
  ];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const validLocales = ["en", "es", "fr", "de"];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  return <>{children}</>;
}