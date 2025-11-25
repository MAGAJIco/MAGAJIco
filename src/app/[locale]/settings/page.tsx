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

  // Real-time theme preview
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const handleSave = () => {
    if (language !== locale) router.push(`/${language}`);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "settings",
        JSON.stringify({ notifications, darkMode, autoplay })
      );
    }

    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary to-secondary transition-colors duration-300">
      <div className="max-w-xl mx-auto pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${locale}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white text-xl"
          >
            ←
          </Link>
          <h1 className="text-white text-3xl font-bold m-0">
            ⚙️ {t("settings.title")}
          </h1>
        </div>

        {/* Settings Container */}
        <div className="bg-bg-primary dark:bg-bg-secondary rounded-3xl p-8 shadow-xl transition-colors duration-300">
          <div className="flex flex-col gap-8">
            {/* Language */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-text-secondary flex items-center gap-2 mb-2">
                🌐 {t("settings.language")}
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-bg-primary dark:bg-bg-secondary text-text-primary dark:text-text-secondary cursor-pointer"
              >
                <option value="en">{t("settings.english")}</option>
                <option value="es">{t("settings.spanish")}</option>
                <option value="fr">{t("settings.french")}</option>
                <option value="de">{t("settings.german")}</option>
              </select>
            </div>

            {/* Notifications, Dark Mode, Autoplay */}
            {[
              {
                label: t("settings.notifications"),
                desc: t("settings.notificationsDesc"),
                state: notifications,
                setState: setNotifications,
              },
              {
                label: t("settings.darkMode"),
                desc: t("settings.darkModeDesc"),
                state: darkMode,
                setState: setDarkMode,
              },
              {
                label: t("settings.autoplay"),
                desc: t("settings.autoplayDesc"),
                state: autoplay,
                setState: setAutoplay,
              },
            ].map(({ label, desc, state, setState }, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-secondary mb-1 flex items-center gap-2">
                    {label}
                  </h3>
                  <p className="text-sm text-text-tertiary dark:text-text-tertiary">
                    {desc}
                  </p>
                </div>
                <label className="relative w-14 h-7 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => setState(e.target.checked)}
                    className="hidden"
                  />
                  <span
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                      state
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute h-5 w-5 bg-white rounded-full transition-transform ${
                        state ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </span>
                </label>
              </div>
            ))}

            {/* About */}
            <div className="p-5 bg-bg-secondary dark:bg-bg-tertiary rounded-xl transition-colors duration-300">
              <p className="text-text-primary dark:text-text-secondary font-semibold mb-1">
                {t("settings.about")}
              </p>
              <p className="text-primary mb-1">{t("settings.version")} 2.0.0</p>
              <p className="text-text-tertiary dark:text-text-tertiary">
                {t("settings.description")}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl transition-transform hover:-translate-y-1 hover:shadow-lg"
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