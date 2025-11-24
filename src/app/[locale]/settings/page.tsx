
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  
  const [language, setLanguage] = useState(locale);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
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
  }, []);

  // Real-time theme preview
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newTheme = darkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  const handleSave = () => {
    if (language !== locale) {
      const newPath = `/${language}`;
      router.push(newPath);
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem("settings", JSON.stringify({
        notifications,
        darkMode,
        autoplay
      }));
      
      // Apply theme changes immediately
      const newTheme = darkMode ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.classList.toggle("dark", darkMode);
      
      // Force a reflow to ensure styles are applied
      if (darkMode) {
        document.body.style.backgroundColor = "#111827";
        document.body.style.color = "#F9FAFB";
      } else {
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#111827";
      }
    }
    
    router.push(`/${locale}`);
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        paddingTop: "40px"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "32px"
        }}>
          <Link 
            href={`/${locale}`}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textDecoration: "none",
              fontSize: "20px"
            }}
          >
            ←
          </Link>
          <h1 style={{
            color: "white",
            fontSize: "32px",
            fontWeight: "700",
            margin: 0
          }}>
            ⚙️ Settings
          </h1>
        </div>

        {/* Settings Container */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px"
          }}>
            {/* Language */}
            <div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🌐 Language
              </h3>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "16px",
                  color: "#333",
                  background: "white",
                  cursor: "pointer"
                }}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {/* Notifications */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "24px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🔔 Notifications
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#888",
                  margin: 0
                }}>
                  Get alerts for live matches and predictions
                </p>
              </div>
              <label style={{
                position: "relative",
                width: "52px",
                height: "28px",
                flexShrink: 0
              }}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ display: "none" }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: notifications ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ccc",
                  transition: "0.3s",
                  borderRadius: "28px"
                }}>
                  <span style={{
                    position: "absolute",
                    content: '""',
                    height: "20px",
                    width: "20px",
                    left: notifications ? "28px" : "4px",
                    bottom: "4px",
                    background: "white",
                    transition: "0.3s",
                    borderRadius: "50%"
                  }} />
                </span>
              </label>
            </div>

            {/* Dark Mode */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "24px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🌙 Dark Mode
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#888",
                  margin: 0
                }}>
                  Switch to dark theme
                </p>
              </div>
              <label style={{
                position: "relative",
                width: "52px",
                height: "28px",
                flexShrink: 0
              }}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  style={{ display: "none" }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: darkMode ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ccc",
                  transition: "0.3s",
                  borderRadius: "28px"
                }}>
                  <span style={{
                    position: "absolute",
                    content: '""',
                    height: "20px",
                    width: "20px",
                    left: darkMode ? "28px" : "4px",
                    bottom: "4px",
                    background: "white",
                    transition: "0.3s",
                    borderRadius: "50%"
                  }} />
                </span>
              </label>
            </div>

            {/* Auto-play */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "24px",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  ▶️ Auto-play
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#888",
                  margin: 0
                }}>
                  Automatically play videos
                </p>
              </div>
              <label style={{
                position: "relative",
                width: "52px",
                height: "28px",
                flexShrink: 0
              }}>
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  style={{ display: "none" }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: autoplay ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ccc",
                  transition: "0.3s",
                  borderRadius: "28px"
                }}>
                  <span style={{
                    position: "absolute",
                    content: '""',
                    height: "20px",
                    width: "20px",
                    left: autoplay ? "28px" : "4px",
                    bottom: "4px",
                    background: "white",
                    transition: "0.3s",
                    borderRadius: "50%"
                  }} />
                </span>
              </label>
            </div>

            {/* About */}
            <div style={{
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "12px"
            }}>
              <p style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#333",
                margin: "0 0 4px 0"
              }}>
                MagajiCo Sports Central
              </p>
              <p style={{
                fontSize: "14px",
                color: "#667eea",
                margin: "0 0 8px 0"
              }}>
                Version 2.0.0
              </p>
              <p style={{
                fontSize: "14px",
                color: "#888",
                margin: 0
              }}>
                Your all-in-one sports platform
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "32px",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
