
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const liveRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const categories = [
    { id: "all", label: "All Apps", icon: "🌟" },
    { id: "navigation", label: "Quick Nav", icon: "🧭" },
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "social", label: "Social", icon: "👥" },
    { id: "tools", label: "Tools", icon: "🛠️" },
    { id: "rewards", label: "Rewards", icon: "🏆" },
    { id: "kids", label: "Kids", icon: "🎮" },
  ];

  const primaryApps = [
    {
      id: "home",
      name: "Home",
      icon: "🏠",
      href: `/${locale}`,
      category: "navigation",
      color: "from-blue-500 to-blue-700",
      description: "Your sports hub dashboard",
      isPrimary: true,
    },
    {
      id: "predictions",
      name: "Predictions",
      icon: "🎯",
      href: `/${locale}/predictions`,
      category: "navigation",
      color: "from-purple-500 to-indigo-600",
      description: "87% accurate ML predictions",
      badge: "AI",
      isPrimary: true,
    },
    {
      id: "live",
      name: "Live Matches",
      icon: "⚡",
      href: `/${locale}/live`,
      category: "navigation",
      color: "from-emerald-500 to-teal-600",
      description: "Real-time match tracking",
      badge: "LIVE",
      isPrimary: true,
    },
    {
      id: "social",
      name: "Social Hub",
      icon: "👥",
      href: `/${locale}/social/feed`,
      category: "navigation",
      color: "from-pink-500 to-rose-600",
      description: "Connect with fans worldwide",
      isPrimary: true,
    },
    {
      id: "rewards",
      name: "Rewards",
      icon: "🏆",
      href: `/${locale}/achievements`,
      category: "navigation",
      color: "from-yellow-500 to-orange-600",
      description: "Earn Pi Coins & badges",
      isPrimary: true,
    },
  ];

  const allApps = [
    ...primaryApps,
    {
      id: "news",
      name: "Sports News",
      icon: "📰",
      href: `/${locale}/news`,
      category: "sports",
      color: "from-blue-500 to-cyan-600",
      description: "Breaking news worldwide",
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: "📊",
      href: `/${locale}/analytics`,
      category: "tools",
      color: "from-violet-500 to-purple-600",
      description: "Deep performance insights",
    },
    {
      id: "kids",
      name: "Kids Mode",
      icon: "🎮",
      href: `/${locale}/kids`,
      category: "kids",
      color: "from-orange-500 to-amber-600",
      description: "Safe learning environment",
    },
    {
      id: "chat",
      name: "AI Chat",
      icon: "💬",
      href: `/${locale}/chat`,
      category: "tools",
      color: "from-cyan-500 to-blue-600",
      description: "Chat with AI assistant",
    },
    {
      id: "challenges",
      name: "Challenges",
      icon: "🎮",
      href: `/${locale}/challenges`,
      category: "rewards",
      color: "from-red-500 to-pink-600",
      description: "Complete daily challenges",
    },
  ];

  const filteredApps = allApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function scrollCarousel(dir: -1 | 1) {
    const el = liveRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".carousel-card");
    const cardWidth = card ? card.offsetWidth + 20 : 340;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }

  return (
    <>
      {/* Floating Launch Button */}
      <button
        onClick={() => setLauncherOpen(!launcherOpen)}
        className="fixed right-4 bottom-20 md:bottom-4 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Open launcher"
      >
        <svg
          className="w-6 h-6 text-white transition-transform group-hover:rotate-90"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
        </svg>
      </button>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl pb-safe">
        <div className="flex justify-around items-center px-2 py-2">
          {primaryApps.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95 relative"
            >
              {app.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {app.badge}
                </div>
              )}
              <div
                className={`w-8 h-8 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-xl shadow-md`}
              >
                {app.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-700">
                {app.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* App Launcher Modal */}
      {launcherOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setLauncherOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto border border-white/20">
              <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🚀</span>
                    MagajiCo Sports Central
                  </h2>
                  <button
                    onClick={() => setLauncherOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search apps... (⌘K)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                    🔍
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? "bg-white text-gray-900 font-semibold"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                {filteredApps.length > 0 ? (
                  <>
                    {(selectedCategory === "all" ||
                      selectedCategory === "navigation") && (
                      <div className="mb-6">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                          <span>🧭</span>
                          Quick Navigation
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                          {primaryApps
                            .filter(
                              (app) =>
                                app.name
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                app.description
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                            )
                            .map((app) => (
                              <Link
                                key={app.id}
                                href={app.href}
                                onClick={() => setLauncherOpen(false)}
                                className="group relative bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl"
                              >
                                {app.badge && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    {app.badge}
                                  </div>
                                )}
                                <div
                                  className={`w-12 h-12 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform shadow-lg mx-auto`}
                                >
                                  {app.icon}
                                </div>
                                <h3 className="text-white font-bold text-center text-sm mb-1">
                                  {app.name}
                                </h3>
                                <p className="text-gray-300 text-xs text-center line-clamp-1">
                                  {app.description}
                                </p>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}

                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <span>🌟</span>
                      {selectedCategory === "all" ? "More Apps" : "Apps"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredApps
                        .filter(
                          (app) =>
                            !app.isPrimary || selectedCategory !== "all"
                        )
                        .map((app) => (
                          <Link
                            key={app.id}
                            href={app.href}
                            onClick={() => setLauncherOpen(false)}
                            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl"
                          >
                            {app.badge && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                {app.badge}
                              </div>
                            )}
                            <div
                              className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-2xl flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform shadow-lg mx-auto`}
                            >
                              {app.icon}
                            </div>
                            <h3 className="text-white font-bold text-center mb-1">
                              {app.name}
                            </h3>
                            <p className="text-gray-300 text-xs text-center line-clamp-2">
                              {app.description}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-400 text-lg">No apps found</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try a different search or category
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border-t border-white/20 p-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>
                    {filteredApps.length} of {allApps.length} apps
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">
                      ⌘K
                    </kbd>
                    <span>to open</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div
            className="menu-icon"
            role="button"
            tabIndex={0}
            onClick={() => {}}
          >
            <div className="hamburger">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="logo">🏗️ Sports Central</div>
        </div>

        <div className="navbar-right">
          <div className="nav-icon" title="Search">
            🔍
          </div>
          <div className="nav-icon" title="Help">
            ❓
          </div>
          <div className="nav-icon" title="Settings">
            ⚙️
          </div>
          <div
            className="nav-icon app-drawer-btn"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Apps"
            role="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="4" cy="4" r="2" />
              <circle cx="12" cy="4" r="2" />
              <circle cx="20" cy="4" r="2" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="20" cy="12" r="2" />
              <circle cx="4" cy="20" r="2" />
              <circle cx="12" cy="20" r="2" />
              <circle cx="20" cy="20" r="2" />
            </svg>
          </div>
          <div
            className="nav-icon"
            style={{
              background: "#667eea",
              color: "white",
              fontWeight: "bold",
            }}
            title="Profile"
          >
            SC
          </div>
        </div>
      </nav>

      {/* App Drawer Overlay */}
      <div
        className={`app-drawer-overlay ${drawerOpen ? "active" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* App Drawer */}
      <aside className={`app-drawer ${drawerOpen ? "active" : ""}`}>
        <div className="app-drawer-header">Sports Central Apps</div>
        <div className="app-grid">
          {[
            ["🏠", "Portal"],
            ["🤖", "Predictions"],
            ["⚡", "Live"],
            ["👥", "Social"],
            ["🎮", "Kids Mode"],
            ["🏆", "Rewards"],
            ["📊", "Analytics"],
            ["💬", "Chat"],
            ["🎯", "Challenges"],
          ].map(([emoji, name]) => (
            <div className="app-item" key={String(name)}>
              <div className="app-icon">{emoji}</div>
              <div className="app-name">{name}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="container">
        <header>
          <h1>🏗️ Sports Central</h1>
          <p>Your All-in-One Sports & Entertainment Hub</p>
        </header>

        <section className="carousel-section">
          <div className="carousel-header">
            <div className="carousel-title">⚡ Live Matches</div>
            <div className="carousel-controls">
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel(-1)}
              >
                ←
              </button>
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel(1)}
              >
                →
              </button>
            </div>
          </div>

          <div className="carousel-wrapper">
            <div className="carousel-container" ref={liveRef}>
              <Link href={`/${locale}/live`}>
                <article className="carousel-card">
                  <span className="card-badge">🔴 LIVE</span>
                  <div className="card-icon">⚽</div>
                  <div className="card-title">Man United vs Arsenal</div>
                  <div className="card-description">
                    Premier League - Thrilling match at Old Trafford
                  </div>
                  <div className="card-meta">
                    <div className="card-meta-item">⏱️ 67'</div>
                    <div className="card-meta-item">📊 2-1</div>
                    <div className="card-meta-item">👥 73K watching</div>
                  </div>
                </article>
              </Link>

              <Link href={`/${locale}/live`}>
                <article className="carousel-card">
                  <span className="card-badge news">LIVE</span>
                  <div className="card-icon">🏀</div>
                  <div className="card-title">Lakers vs Warriors</div>
                  <div className="card-description">
                    NBA - Western Conference showdown
                  </div>
                  <div className="card-meta">
                    <div className="card-meta-item">⏱️ Q3 02:14</div>
                    <div className="card-meta-item">📊 98-101</div>
                    <div className="card-meta-item">👥 18K watching</div>
                  </div>
                </article>
              </Link>

              <Link href={`/${locale}/matches`}>
                <article className="carousel-card">
                  <div className="card-icon">🏈</div>
                  <div className="card-title">Dolphins vs Bills</div>
                  <div className="card-description">
                    NFL - Divisional preview
                  </div>
                  <div className="card-meta">
                    <div className="card-meta-item">📅 Today</div>
                    <div className="card-meta-item">📊 —</div>
                    <div className="card-meta-item">👥 12K watching</div>
                  </div>
                </article>
              </Link>

              <Link href={`/${locale}/matches`}>
                <article className="carousel-card">
                  <div className="card-icon">🎾</div>
                  <div className="card-title">Wimbledon Highlights</div>
                  <div className="card-description">
                    Recap of yesterday's semi-finals
                  </div>
                  <div className="card-meta">
                    <div className="card-meta-item">⏱️ 2h ago</div>
                    <div className="card-meta-item">📊 Recap</div>
                  </div>
                </article>
              </Link>
            </div>
          </div>
        </section>

        <section className="overview section">
          <h2>🌟 What Makes Us Different</h2>
          <p>
            MagajiCo is your all-in-one sports platform combining AI-powered
            predictions, live tracking, social connections, and rewards.
          </p>

          <div className="apps-grid" style={{ marginTop: 20 }}>
            <Link href={`/${locale}/predictions`} style={{ textDecoration: 'none' }}>
              <div className="app-card">
                <h3>🎯 AI Predictions</h3>
                <ul>
                  <li>87% accuracy rate</li>
                  <li>Multi-source analysis</li>
                  <li>Real-time updates</li>
                  <li>Betting insights</li>
                </ul>
              </div>
            </Link>

            <Link href={`/${locale}/live`} style={{ textDecoration: 'none' }}>
              <div className="app-card">
                <h3>⚡ Live Tracking</h3>
                <ul>
                  <li>Real-time scores</li>
                  <li>Match commentary</li>
                  <li>Statistics & analytics</li>
                  <li>Multi-sport coverage</li>
                </ul>
              </div>
            </Link>

            <Link href={`/${locale}/matches`} style={{ textDecoration: 'none' }}>
              <div className="app-card">
                <h3>🏆 All Matches</h3>
                <ul>
                  <li>Live & upcoming</li>
                  <li>Multiple sports</li>
                  <li>Match schedules</li>
                  <li>Odds integration</li>
                </ul>
              </div>
            </Link>
          </div>
        </section>

        <footer>© MagajiCo Sports Central — Design & Architecture</footer>
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .menu-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-icon:hover {
          background: #f1f3f4;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #5f6368;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          color: #667eea;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.2rem;
        }

        .nav-icon:hover {
          background: #f1f3f4;
        }

        .app-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1998;
        }

        .app-drawer-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .app-drawer {
          position: fixed;
          top: 70px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          padding: 20px;
          width: 380px;
          max-height: 480px;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-20px);
          transition: all 0.3s ease;
          z-index: 1999;
        }

        .app-drawer.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .app-drawer-header {
          font-size: 1.1rem;
          font-weight: 600;
          color: #5f6368;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e8eaed;
        }

        .app-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: #5f6368;
        }

        .app-item:hover {
          background: #f1f3f4;
        }

        .app-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: white;
        }

        .app-name {
          font-size: 0.85rem;
          text-align: center;
          font-weight: 500;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .carousel-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.3s backwards;
        }

        .carousel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .carousel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #667eea;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .carousel-controls {
          display: flex;
          gap: 10px;
        }

        .carousel-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1f3f4;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s ease;
        }

        .carousel-btn:hover {
          background: #e8eaed;
          transform: scale(1.1);
        }

        .carousel-wrapper {
          position: relative;
          overflow: hidden;
        }

        .carousel-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 10px 0;
        }

        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        .carousel-card {
          min-width: 320px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .carousel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          border-color: #667eea;
        }

        .card-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #ff4444;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        .card-badge.news {
          background: #2196f3;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .card-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .card-description {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.85rem;
          color: #999;
        }

        header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease;
        }

        header h1 {
          font-size: 3.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        header p {
          font-size: 1.2rem;
          opacity: 0.95;
        }

        .overview {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease 0.4s backwards;
        }

        .section h2 {
          color: #667eea;
          margin-bottom: 20px;
          font-size: 2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .app-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .app-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          border-color: #667eea;
        }

        .app-card h3 {
          color: #667eea;
          font-size: 1.5rem;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-card ul {
          list-style: none;
          padding-left: 0;
        }

        .app-card li {
          padding: 8px 0;
          color: #555;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .app-card li:hover {
          padding-left: 10px;
          color: #667eea;
        }

        footer {
          text-align: center;
          color: white;
          padding: 30px;
          margin-top: 40px;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .pb-safe {
          padding-bottom: max(8px, env(safe-area-inset-bottom));
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          header h1 {
            font-size: 2.5rem;
          }

          .apps-grid {
            grid-template-columns: 1fr;
          }

          .app-drawer {
            right: 10px;
            left: 10px;
            width: auto;
          }
        }
      `}</style>
    </>
  );
}
