"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

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
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div 
            className="menu-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="logo">🏗️ Sports Central</div>
        </div>

        <div className={`navbar-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-icon" title="Search">🔍</div>
          <div 
            className="nav-icon"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Apps"
          >
            ☰
          </div>
        </div>
      </nav>

      {/* Drawer Overlay */}
      <div
        className={`app-drawer-overlay ${drawerOpen ? "active" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside className={`app-drawer ${drawerOpen ? "active" : ""}`}>
        <div className="app-drawer-header">Sports Central Apps</div>
        <div className="app-grid">
          {drawerApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className="app-item"
              onClick={() => setDrawerOpen(false)}
            >
              <div className="app-icon">{app.icon}</div>
              <div className="app-name">{app.name}</div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}>
            Sports Central
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.85)",
            maxWidth: "650px",
            margin: "0 auto",
          }}>
            Your All-in-One Sports & Entertainment Hub
          </p>
        </div>

        {/* Menu Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "60px"
        }}>
          {drawerApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 24px",
                background: "rgba(255,255,255,0.95)",
                borderRadius: "16px",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
                minHeight: "200px"
              }}
            >
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>{app.icon}</div>
              <div style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a202c",
                marginBottom: "12px",
                textAlign: "center"
              }}>
                {app.name}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#667eea",
                fontWeight: "500"
              }}>
                → Explore
              </div>
            </Link>
          ))}
        </div>

        <footer style={{
          textAlign: "center",
          padding: "40px 24px",
          color: "rgba(255,255,255,0.8)",
          fontSize: "14px",
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}>
          © MagajiCo Sports Central — Your Sports Companion
        </footer>
      </main>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: #333;
        }
        .navbar {
          background: white;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .navbar-left { display: flex; align-items: center; gap: 16px; }
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          cursor: pointer;
        }
        .hamburger span {
          width: 24px; 
          height: 3px; 
          background: #333; 
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        .logo { font-size: 20px; font-weight: bold; color: #667eea; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }
        .nav-icon {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s; font-size: 18px;
        }
        .nav-icon:hover { background: #f5f5f5; }
        .app-drawer-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 1100; opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .app-drawer-overlay.active {
          opacity: 1; pointer-events: auto;
        }
        .app-drawer {
          position: fixed; top: 64px; right: 0; width: 320px;
          height: calc(100vh - 64px); background: white;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          z-index: 1200; transform: translateX(100%);
          transition: transform 0.3s; overflow-y: auto;
        }
        .app-drawer.active { transform: translateX(0); }
        .app-drawer-header {
          padding: 20px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee;
        }
        .app-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 16px; padding: 20px;
        }
        .app-item {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; padding: 16px; border-radius: 12px; text-decoration: none; color: inherit;
          transition: background 0.2s;
        }
        .app-item:hover { background: #f5f5f5; }
        .app-icon { font-size: 32px; }
        .app-name { font-size: 14px; font-weight: 600; text-align: center; }
        .menu-icon { display: none; }
        @media (max-width: 768px) {
          .menu-icon { display: block !important; }
          .navbar-right {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            max-height: calc(100vh - 64px);
            overflow-y: auto;
            padding: 20px;
            gap: 16px;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 1000;
          }
          .navbar-right.mobile-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .app-drawer {
            width: 100% !important;
            max-width: 100% !important;
            height: 80vh !important;
            border-radius: 24px 24px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}
