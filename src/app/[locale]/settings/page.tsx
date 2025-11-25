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

  // Load saved settings
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

  // Apply theme in real time
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newTheme = darkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  // DRY toggle background logic
  const getToggleBackground = (enabled: boolean) => {
    if (typeof window === "undefined") return "#ccc";
    const theme = darkMode ? "dark" : "light";

    if (enabled) {
      return theme === "dark"
        ? "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" // Apple dark
        : "linear-gradient(135deg, #FF9900, #FFB347)"; // Amazon light
    } else {
      return "var(--border-color)"; // Off state
    }
  };

  const handleSave = () => {
    if (language !== locale) router.push(`/${language}`);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "settings",
        JSON.stringify({ notifications, darkMode, autoplay })
      );

      const newTheme = darkMode ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);

      // Optional: immediate style adjustments
      document.body.style.backgroundColor = darkMode ? "#111827" : "#FFFFFF";
      document.body.style.color = darkMode ? "#F9FAFB" : "#111827";
    }

    router.push(`/${locale}`);
  };

  // Toggle component
  const Toggle = ({
    label,
    description,
    value,
    onChange,
  }: {
    label: string;
    description: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex justify-between items-center py-6 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {label}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative w-14 h-7 flex-shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="hidden"
        />
        <span
          style={{ background: getToggleBackground(value) }}
          className="absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all"
        >
          <span
            className={`absolute bottom-1 h-5 w-5 bg-white rounded-full transition-all`}
            style={{ left: value ? "1.5rem" : "0.25rem" }}
          />
        </span>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-5">
      <div className="max-w-xl mx-auto pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}`}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
          >
            ←
          </Link>
          <h1 className="text-3xl font-bold text-white">⚙️ {t("settings.title")}</h1>
        </div>

        {/* Settings Container */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col gap-8">
            {/* Language */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                🌐 {t("settings.language")}
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-gray-800 cursor-pointer bg-white dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="en">{t("settings.english")}</option>
                <option value="es">{t("settings.spanish")}</option>
                <option value="fr">{t("settings.french")}</option>
                <option value="de">{t("settings.german")}</option>
              </select>
            </div>

            {/* Toggles */}
            <Toggle
              label={`🔔 ${t("settings.notifications")}`}
              description={t("settings.notificationsDesc")}
              value={notifications}
              onChange={setNotifications}
            />
            <Toggle
              label={`🌙 ${t("settings.darkMode")}`}
              description={t("settings.darkModeDesc")}
              value={darkMode}
              onChange={setDarkMode}
            />
            <Toggle
              label={`▶️ ${t("settings.autoplay")}`}
              description={t("settings.autoplayDesc")}
              value={autoplay}
              onChange={setAutoplay}
            />

            {/* About */}
            <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <p className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {t("settings.about")}
              </p>
              <p className="text-sm text-indigo-600 mb-2">{t("settings.version")} 2.0.0</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.description")}</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-8 py-4 px-6 rounded-xl text-white font-semibold bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-xl"
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