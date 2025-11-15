"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale?: string;
}

export default function SettingsModal({ isOpen, onClose, currentLocale = "en" }: SettingsModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState(currentLocale);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    setLanguage(currentLocale);
    
    // Load saved settings
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNotifications(settings.notifications ?? true);
        setDarkMode(settings.darkMode ?? false);
        setAutoplay(settings.autoplay ?? true);
      }
      
      // Sync with current theme
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme) {
        setDarkMode(currentTheme === "dark");
      }
    }
  }, [currentLocale]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (language !== currentLocale) {
      const newPath = pathname.replace(`/${currentLocale}`, `/${language}`);
      router.push(newPath);
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify({
        notifications,
        darkMode,
        autoplay
      }));
      
      // Apply theme changes
      localStorage.setItem("theme", darkMode ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    }
    
    onClose();
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-modal">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <h3>🌐 Language</h3>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="setting-select"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="setting-group">
            <div className="setting-row">
              <div>
                <h3>🔔 Notifications</h3>
                <p className="setting-desc">Get alerts for live matches and predictions</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-row">
              <div>
                <h3>🌙 Dark Mode</h3>
                <p className="setting-desc">Switch to dark theme</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-group">
            <div className="setting-row">
              <div>
                <h3>▶️ Auto-play</h3>
                <p className="setting-desc">Automatically play videos</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-group">
            <div className="about-section">
              <p className="about-title">MagajiCo Sports Central</p>
              <p className="about-version">Version 2.0.0</p>
              <p className="about-desc">Your all-in-one sports platform</p>
            </div>
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <style jsx>{`
        .settings-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        
        .settings-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 2001;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .settings-header h2 {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .close-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .close-btn:hover {
          background: #e5e5e5;
        }
        
        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .setting-group {
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .setting-group:last-child {
          border-bottom: none;
        }
        
        .setting-group h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }
        
        .setting-desc {
          font-size: 13px;
          color: #888;
          margin: 4px 0 0 0;
        }
        
        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        
        .setting-select {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          color: #333;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        
        .setting-select:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .toggle {
          position: relative;
          width: 52px;
          height: 28px;
          flex-shrink: 0;
        }
        
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 28px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        
        .toggle input:checked + .toggle-slider {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .toggle input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }
        
        .about-section {
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }
        
        .about-title {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }
        
        .about-version {
          font-size: 13px;
          color: #667eea;
          margin: 0 0 8px 0;
        }
        
        .about-desc {
          font-size: 13px;
          color: #888;
          margin: 0;
        }
        
        .save-btn {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .save-btn:active {
          transform: translateY(0);
        }
        
        @media (max-width: 640px) {
          .settings-modal {
            width: 95%;
            max-height: 95vh;
          }
        }
      `}</style>
    </>
  );
}
