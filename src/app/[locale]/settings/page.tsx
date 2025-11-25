"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

function SettingsContent() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [language, setLanguage] = useState(locale);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load saved settings
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications ?? true);
      setDarkMode(settings.darkMode ?? false);
      setAutoplay(settings.autoplay ?? true);
    } else {
      // No saved settings → detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }

    // Sync theme from localStorage if already saved
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setDarkMode(currentTheme === "dark");
    }
  }, []);

  // Apply theme changes immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const newTheme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSave = () => {
    if (language !== locale) router.push(`/${language}`);

    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify({
        notifications,
        darkMode,
        autoplay,
      }));

      localStorage.setItem("theme", darkMode ? "dark" : "light");

      // Optional: force body styles
      document.body.style.backgroundColor = darkMode ? "#111827" : "#FFFFFF";
      document.body.style.color = darkMode ? "#F9FAFB" : "#111827";
    }

    router.push(`/${locale}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      {/* ... rest of your JSX remains unchanged ... */}
      <button onClick={handleSave}>{t("settings.saveChanges")}</button>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}