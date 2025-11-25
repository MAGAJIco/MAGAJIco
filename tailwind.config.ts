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

  // Load saved settings and theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNotifications(settings.notifications ?? true);
        setDarkMode(settings.darkMode ?? false);
        setAutoplay(settings.autoplay ?? true);
      }

      const currentTheme = localStorage.getItem("theme");
      if (currentTheme) setDarkMode(currentTheme === "dark");
    }
  }, []);

  // Sync theme in real-time
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newTheme = darkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  // DRY helper for Tailwind-compatible toggle backgrounds
  const getToggleClasses = (enabled: boolean) => {
    if (enabled) {
      return darkMode
        ? "bg-gradient-to-tr from-gradient-from to-gradient-to" // Apple dark
        : "bg-gradient-to-tr from-[#FF9900] to-[#FFB347]";      // Amazon light
    } else {
      return "bg-gray-300"; // Off state
    }
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (e: any) => void }) => (
    <label className="relative inline-flex items-center w-14 h-7">
      <input type="checkbox" checked={enabled} onChange={onChange} className="sr-only" />
      <span className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition ${getToggleClasses(enabled)}`}>
        <span className={`absolute h-5 w-5 bg-white rounded-full bottom-0.5 transition ${enabled ? "left-7" : "left-0.5"}`}></span>
      </span>
    </label>
  );

  const handleSave = () => {
    if (language !== locale) router.push(`/${language}`);

    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify({ notifications, darkMode, autoplay }));
      const newTheme = darkMode ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);
    }

    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen p-5 bg-gradient-to-tr from-purple-500 to-purple-700">
      <div className="max-w-2xl mx-auto pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}`}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
          >
            ←
          </Link>
          <h1 className="text-white text-3xl font-bold">⚙️ {t("settings.title")}</h1>
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col gap-8">

            {/* Language */}
            <div>
              <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-2">🌐 {t("settings.language")}</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 mt-2"
              >
                <option value="en">{t("settings.english")}</option>
                <option value="es">{t("settings.spanish")}</option>
                <option value="fr">{t("settings.french")}</option>
                <option value="de">{t("settings.german")}</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-6">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-2">🔔 {t("settings.notifications")}</h3>
                <p className="text-gray-400 text-sm">{t("settings.notificationsDesc")}</p>
              </div>
              <ToggleSwitch enabled={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            </div>

            {/* Dark Mode */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-6">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-2">🌙 {t("settings.darkMode")}</h3>
                <p className="text-gray-400 text-sm">{t("settings.darkModeDesc")}</p>
              </div>
              <ToggleSwitch enabled={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            </div>

            {/* Autoplay */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-6">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-2">▶️ {t("settings.autoplay")}</h3>
                <p className="text-gray-400 text-sm">{t("settings.autoplayDesc")}</p>
              </div>
              <ToggleSwitch enabled={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
            </div>

            {/* About */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <p className="text-gray-800 font-semibold">{t("settings.about")}</p>
              <p className="text-purple-600 text-sm">{t("settings.version")} 2.0.0</p>
              <p className="text-gray-400 text-sm">{t("settings.description")}</p>
            </div>

          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-8 py-3 bg-gradient-to-tr from-purple-500 to-purple-700 text-white font-semibold rounded-lg transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            {t("settings.saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}