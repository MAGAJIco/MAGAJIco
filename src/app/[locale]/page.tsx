"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AuthModal from "../components/AuthModal";
import UserMenu from "../components/UserMenu";

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const handleSignIn = (email: string, password: string) => {
    setUser({ name: email.split("@")[0], email });
    setAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const drawerApps = [
    { id: "home", icon: "🏠", name: "Portal", href: `/${locale}` },
    { id: "predictions", icon: "🤖", name: "Predictions", href: `/${locale}/predictions` },
    { id: "live", icon: "⚡", name: "Live", href: `/${locale}/live` },
    { id: "social", icon: "👥", name: "Social", href: `/${locale}/social` },
    { id: "kids", icon: "🎮", name: "Kids Mode", href: `/${locale}/kids` },
    { id: "rewards", icon: "🏆", name: "Rewards", href: `/${locale}/rewards` },
    { id: "analytics", icon: "📊", name: "Analytics", href: `/${locale}/analytics` },
    { id: "chat", icon: "💬", name: "Chat", href: `/${locale}/chat` },
    { id: "challenges", icon: "🎯", name: "Challenges", href: `/${locale}/challenges` },
  ];

  const primaryApps = drawerApps.slice(0, 5);

  function scrollCarousel(dir: -1 | 1) {
    const el = liveRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".carousel-card");
    const cardWidth = card ? card.offsetWidth + 20 : 340;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }

  return (
    <>
      {/* ✅ Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <div className="flex justify-around items-center px-2 py-2">
          {primaryApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                {app.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-700">
                {app.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="menu-icon">
            <div className="hamburger">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="logo">🏗️ Sports Central</div>
        </div>

        <div className="navbar-right">
          <div className="nav-icon" title="Search">🔍</div>
          <div className="nav-icon" title="Help">❓</div>
          <div className="nav-icon" title="Settings">⚙️</div>
          <div
            className="nav-icon"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Apps"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {[4, 12, 20].flatMap((y) =>
                [4, 12, 20].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />)
              )}
            </svg>
          </div>
          {user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <div 
              className="nav-icon profile"
              onClick={() => setAuthModalOpen(true)}
              title="Sign In"
            >
              SC
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={handleSignIn}
      />

      {/* ✅ Drawer Overlay */}
      <div
        className={`app-drawer-overlay ${drawerOpen ? "active" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ✅ Drawer */}
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

      {/* ✅ Main Content */}
      <main className="container">
        <header>
          <h1>🏗️ Sports Central</h1>
          <p>Your All-in-One Sports & Entertainment Hub</p>
        </header>

        {/* Live Carousel */}
        <section className="carousel-section">
          <div className="carousel-header">
            <div className="carousel-title">⚡ Live Matches</div>
            <div className="carousel-controls">
              <button className="carousel-btn" onClick={() => scrollCarousel(-1)}>←</button>
              <button className="carousel-btn" onClick={() => scrollCarousel(1)}>→</button>
            </div>
          </div>

          <div className="carousel-wrapper">
            <div className="carousel-container" ref={liveRef}>
              {[
                {
                  icon: "⚽",
                  title: "Man United vs Arsenal",
                  desc: "Premier League - Thrilling match at Old Trafford",
                  meta: ["⏱️ 67'", "📊 2-1", "👥 73K watching"],
                  badge: "LIVE",
                },
                {
                  icon: "🏀",
                  title: "Lakers vs Warriors",
                  desc: "NBA - Western Conference showdown",
                  meta: ["⏱️ Q3 02:14", "📊 98-101", "👥 18K watching"],
                  badge: "LIVE",
                },
                {
                  icon: "🏈",
                  title: "Dolphins vs Bills",
                  desc: "NFL - Divisional preview",
                  meta: ["📅 Today", "📊 —", "👥 12K watching"],
                },
                {
                  icon: "🎾",
                  title: "Wimbledon Highlights",
                  desc: "Recap of yesterday's semi-finals",
                  meta: ["⏱️ 2h ago", "📊 Recap"],
                },
              ].map((match, i) => (
                <article key={i} className="carousel-card">
                  {match.badge && <span className="card-badge">🔴 {match.badge}</span>}
                  <div className="card-icon">{match.icon}</div>
                  <div className="card-title">{match.title}</div>
                  <div className="card-description">{match.desc}</div>
                  <div className="card-meta">
                    {match.meta.map((m, i) => (
                      <div key={i} className="card-meta-item">{m}</div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="overview section">
          <h2>🌟 What Makes Us Different</h2>
          <p>
            MagajiCo is your all-in-one sports platform combining AI-powered
            predictions, live tracking, social connections, and rewards.
          </p>

          <div className="apps-grid" style={{ marginTop: 20 }}>
            <div className="app-card">
              <h3>🎯 AI Predictions</h3>
              <ul>
                <li>87% accuracy rate</li>
                <li>Multi-source analysis</li>
                <li>Real-time updates</li>
                <li>Betting insights</li>
              </ul>
            </div>

            <div className="app-card">
              <h3>⚡ Live Tracking</h3>
              <ul>
                <li>Real-time scores</li>
                <li>Match commentary</li>
                <li>Statistics & analytics</li>
                <li>Multi-sport coverage</li>
              </ul>
            </div>

            <div className="app-card">
              <h3>🏆 Rewards System</h3>
              <ul>
                <li>Earn Pi Coins</li>
                <li>Unlock badges</li>
                <li>Daily challenges</li>
                <li>Leaderboards</li>
              </ul>
            </div>
          </div>
        </section>

        <footer>© MagajiCo Sports Central — Design & Architecture</footer>
      </main>

      {/* ✅ Styles */}
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
        .hamburger span {
          width: 24px; height: 3px; background: #333; margin: 3px 0; border-radius: 2px;
        }
        .logo { font-size: 20px; font-weight: bold; color: #667eea; }
        .navbar-right { display: flex; align-items: center; gap: 12px; }
        .nav-icon {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .nav-icon:hover { background: #f5f5f5; }
        .profile {
          background: #667eea; color: white; font-weight: bold;
        }
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
        .app-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg,#667eea,#764ba2);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .container {
          max-width: 1200px; margin: 0 auto; padding: 40px 20px 100px;
        }
        header { text-align: center; margin-bottom: 40px; }
        header h1 {
          font-size: 48px; color: white; margin-bottom: 12px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        header p { font-size: 18px; color: rgba(255,255,255,0.9); }
        .carousel-section { margin-bottom: 40px; }
        .carousel-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .carousel-title { font-size: 24px; font-weight: bold; color: white; }
        .carousel-btn {
          width: 36px; height: 36px; border-radius: 50%; border: none;
          background: white; cursor: pointer; font-size: 18px;
        }
        .carousel-container {
          display: flex; gap: 20px; overflow-x: auto; scroll-behavior: smooth;
        }
        .carousel-card {
          flex: 0 0 320px; background: white; border-radius: 16px;
          padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative;
        }
        .card-badge {
          position: absolute; top: 12px; right: 12px;
          background: #ff4444; color: white; padding: 4px 12px;
          border-radius: 12px; font-size: 11px; font-weight: bold;
        }
        .card-icon { font-size: 48px; margin-bottom: 12px; }
        .card-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
        .card-description { font-size: 14px; color: #666; margin-bottom: 16px; }
        .card-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: #888; }
        .section {
          background: rgba(255,255,255,0.95); border-radius: 16px;
          padding: 32px; margin-bottom: 32px;
        }
        footer {
          text-align: center; padding: 24px; color: rgba(255,255,255,0.8); font-size: 14px;
        }
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          header h1 { font-size: 32px; }
          .carousel-card { flex: 0 0 280px; }
          .container { padding-bottom: 120px; }
          .mobile-bottom-nav {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 40;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </>
  );
}