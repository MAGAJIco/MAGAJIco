"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    if (params?.locale) {
      setLocale(params.locale as string);
    }
  }, [params]);

  const drawerApps = [
    { id: "home", icon: "🏠", name: "Portal", href: `/${locale}` },
    { id: "bets", icon: "💰", name: "Today's Bets", href: `/${locale}/bets` },
    { id: "predictions", icon: "🤖", name: "Predictions", href: `/${locale}/predictions` },
    { id: "ml-dashboard", icon: "🧠", name: "AI Dashboard", href: `/ml-report` },
    { id: "live", icon: "⚡", name: "Live", href: `/${locale}/live` },
    { id: "social", icon: "👥", name: "Social", href: `/${locale}/social` },
    { id: "kids", icon: "🎮", name: "Kids Mode", href: `/${locale}/kids` },
    { id: "rewards", icon: "🏆", name: "Rewards", href: `/${locale}/rewards` },
    { id: "analytics", icon: "📊", name: "Analytics", href: `/${locale}/analytics` },
    { id: "chat", icon: "💬", name: "Chat", href: `/${locale}/chat` },
    { id: "challenges", icon: "🎯", name: "Challenges", href: `/${locale}/challenges` },
  ];

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <div 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.hamburger}>
              <span className={styles.hamburgerSpan} />
              <span className={styles.hamburgerSpan} />
              <span className={styles.hamburgerSpan} />
            </div>
          </div>
          <div className={styles.logo}>🏗️ Sports Central</div>
        </div>

        <div className={styles.navbarRight}>
          <div className={styles.navIcon} title="Search">🔍</div>
          <div 
            className={styles.navIcon}
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Apps"
          >
            ☰
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div
        className={`${styles.appDrawerOverlay} ${drawerOpen ? styles.active : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside className={`${styles.appDrawer} ${drawerOpen ? styles.active : ""}`}>
        <div className={styles.appDrawerHeader}>Sports Central Apps</div>
        <div className={styles.appGrid}>
          {drawerApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className={styles.appItem}
              onClick={() => setDrawerOpen(false)}
            >
              <div className={styles.appIcon}>{app.icon}</div>
              <div className={styles.appName}>{app.name}</div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 className={styles.mainTitle}>
            Sports Central
          </h1>
          <p className={styles.mainDescription}>
            Your All-in-One Sports & Entertainment Hub
          </p>
        </div>

        {/* Menu Grid */}
        <div className={styles.menuGrid}>
          {drawerApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className={styles.menuItem}
            >
              <div className={styles.menuIcon}>{app.icon}</div>
              <div className={styles.menuName}>
                {app.name}
              </div>
              <div className={styles.menuExplore}>
                → Explore
              </div>
            </Link>
          ))}
        </div>

        <footer className={styles.footer}>
          © MagajiCo Sports Central — Your Sports Companion
        </footer>
      </main>
    </div>
  );
}
