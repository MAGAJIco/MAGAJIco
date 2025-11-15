"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AuthModal from "../components/AuthModal";
import UserMenu from "../components/UserMenu";
import SettingsModal from "../components/SettingsModal";
import { motion } from "framer-motion";

// Assume these are defined elsewhere or imported
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const StatCard = ({ title, value, icon, trend, color }: any) => (
  <div style={{ background: "white", padding: "20px", borderRadius: "12px", minWidth: "250px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <div style={{ color, fontSize: "24px" }}>{icon}</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600" }}>{title}</h3>
    </div>
    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>{value}</div>
    <div style={{ fontSize: "13px", color: trend.startsWith("+") ? "green" : "red" }}>{trend}</div>
  </div>
);
const t = (key: string) => {
  if (key === "hero.title") return "Sports Central";
  if (key === "hero.subtitle") return "Your All-in-One Sports & Entertainment Hub";
  if (key === "features.title") return "Key Features";
  if (key === "content.mainTitle") return "Discover Sports Central";
  if (key === "content.description") return "Experience the future of sports engagement with AI-powered predictions, live tracking, social features, and a rewarding system.";
  return key;
};
const featuredMatches = [
  { title: "AI Accuracy", value: "87%", icon: "🤖", trend: "+5% vs last week", color: "#667eea" },
  { title: "Live Viewers", value: "1.2M", icon: "⚡", trend: "+10% today", color: "#f6ad55" },
  { title: "Rewards Earned", value: "50K Pi", icon: "🏆", trend: "+2% daily", color: "#805ad5" },
];

// Social Proof Data
const socialProofMetrics = {
  activeUsers: 24567,
  totalPredictions: 892341,
  accuracyRate: 87,
  sharesLast24h: 15234,
  topPredictors: [
    { name: "SportsFan2024", accuracy: 94, predictions: 156 },
    { name: "AIPredictor", accuracy: 91, predictions: 203 },
    { name: "MatchGuru", accuracy: 89, predictions: 187 }
  ]
};


export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeViewers, setActiveViewers] = useState(socialProofMetrics.activeUsers);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  // Simulate real-time viewer updates (Zuckerberg's FOMO tactic)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveViewers(prev => prev + Math.floor(Math.random() * 20) - 8);
    }, 3000);

    // Simulate activity feed
    const activityInterval = setInterval(() => {
      const activities = [
        "🎯 SportsFan2024 predicted Lakers win with 94% confidence",
        "⚡ MatchGuru just earned 500 Pi for accurate prediction",
        "🔥 AIPredictor is on a 12-game streak!",
        "👥 1,234 users shared today's top prediction",
        "🏆 New record: 94% accuracy this week!"
      ];
      setRecentActivity([activities[Math.floor(Math.random() * activities.length)]]);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
    };
  }, []);

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
              className="touch-target flex flex-col items-center gap-1 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95 min-w-[60px]"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                {app.icon}
              </div>
              <span className="text-[11px] font-semibold text-gray-700 text-center">
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
          <div 
            className="nav-icon" 
            onClick={() => setSettingsModalOpen(true)}
            title="Settings"
          >
            ⚙️
          </div>
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
            <UserMenu 
              user={user} 
              onSignOut={handleSignOut}
              onOpenSettings={() => setSettingsModalOpen(true)}
            />
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

      <SettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentLocale={locale}
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

      {/* Main Content */}
      <motion.main 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorBoundary>
          <div className="container" style={{ paddingTop: "40px", paddingBottom: "100px" }}>
            {/* Hero Section with Gradient - Jobs-style simplicity */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "20px",
                  letterSpacing: "-0.03em",
                  lineHeight: "1.1"
                }}
              >
                {t("hero.title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                  color: "rgba(255,255,255,0.85)",
                  maxWidth: "650px",
                  margin: "0 auto",
                  fontWeight: "300",
                  lineHeight: "1.6"
                }}
              >
                {t("hero.subtitle")}
              </motion.p>
            </motion.div>

            {/* Social Proof Bar - Zuckerberg Style */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="social-proof-bar"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "16px 24px",
                marginBottom: "40px",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#10b981",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px #10b981"
                  }}
                />
                <span style={{ color: "#fff", fontSize: "15px", fontWeight: "500" }}>
                  🔴 <strong>{activeViewers.toLocaleString()}</strong> people watching now
                </span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                📊 {socialProofMetrics.totalPredictions.toLocaleString()} predictions made today
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                🎯 {socialProofMetrics.accuracyRate}% average accuracy
              </div>
            </motion.div>

            {/* Live Activity Feed - Social Validation */}
            {recentActivity.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: "linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  marginBottom: "32px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  overflow: "hidden"
                }}
              >
                <motion.div
                  animate={{ x: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}
                >
                  {recentActivity[0]}
                </motion.div>
              </motion.div>
            )}

            {/* ✅ Horizontal Scrolling Cards - Jobs-style polish */}
            <section style={{ marginBottom: "60px" }}>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: "32px",
                  textAlign: "center",
                  letterSpacing: "-0.02em"
                }}
              >
                {t("features.title")}
              </motion.h2>
              <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "16px" }}>
                {featuredMatches.map((match, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: [0.6, 0.05, 0.01, 0.9]
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <StatCard
                      title={match.title}
                      value={match.value}
                      icon={match.icon}
                      trend={match.trend}
                      color={match.color}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Viral Sharing Section - Zuckerberg's Growth Hack */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                borderRadius: "24px",
                padding: "40px",
                marginBottom: "40px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", marginBottom: "16px" }}>
                🎁 Share & Earn Rewards
              </h3>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", marginBottom: "24px" }}>
                Invite friends and earn <strong>100 Pi</strong> for each active referral!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button style={{
                  padding: "12px 32px",
                  background: "#fff",
                  color: "#667eea",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  📱 Share on Social Media
                </button>
                <button style={{
                  padding: "12px 32px",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  📋 Copy Invite Link
                </button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginTop: "16px" }}>
                ⚡ {socialProofMetrics.sharesLast24h.toLocaleString()} people shared in the last 24 hours
              </p>
            </motion.section>

            {/* Top Predictors Leaderboard - Social Validation */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: "rgba(255,255,255,0.97)",
                borderRadius: "24px",
                padding: "40px",
                marginBottom: "40px",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", color: "#1a202c" }}>
                🏆 Top Predictors This Week
              </h3>
              <div style={{ display: "grid", gap: "16px" }}>
                {socialProofMetrics.topPredictors.map((predictor, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px",
                      background: index === 0 ? "linear-gradient(135deg, #ffd70020, #ffa50020)" : "#f9fafb",
                      borderRadius: "12px",
                      border: index === 0 ? "2px solid #ffd700" : "1px solid #e5e7eb"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "24px" }}>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <div>
                        <div style={{ fontWeight: "600", color: "#333" }}>{predictor.name}</div>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                          {predictor.predictions} predictions
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#10b981" }}>
                        {predictor.accuracy}%
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ✅ Main Content Section - Jobs-style clarity */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
              style={{
                background: "rgba(255,255,255,0.97)",
                borderRadius: "24px",
                padding: "48px",
                boxShadow: "0 25px 70px rgba(0,0,0,0.25), 0 10px 25px rgba(0,0,0,0.15)",
                marginBottom: "50px",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <h2 style={{
                fontSize: "clamp(2rem, 3vw, 2.75rem)",
                fontWeight: "600",
                color: "#1a202c",
                marginBottom: "24px",
                letterSpacing: "-0.02em",
                lineHeight: "1.2"
              }}>
                {t("content.mainTitle")}
              </h2>
              <p style={{
                fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                color: "#4a5568",
                lineHeight: "1.75",
                marginBottom: "32px",
                fontWeight: "400"
              }}>
                {t("content.description")}
              </p>
            </motion.section>

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
                      isLive: true,
                    },
                    {
                      icon: "🏀",
                      title: "Lakers vs Warriors",
                      desc: "NBA - Western Conference showdown",
                      meta: ["⏱️ Q3 02:14", "📊 98-101", "👥 18K watching"],
                      badge: "LIVE",
                      isLive: true,
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
                    <motion.article 
                      key={i} 
                      className={`carousel-card ${match.isLive ? 'live-indicator' : ''}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                      {match.badge && (
                        <motion.span 
                          className="card-badge"
                          animate={match.isLive ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔴 {match.badge}
                        </motion.span>
                      )}
                      <div className="card-icon">{match.icon}</div>
                      <div className="card-title">{match.title}</div>
                      <div className="card-description">{match.desc}</div>
                      <div className="card-meta">
                        {match.meta.map((m, i) => (
                          <div key={i} className="card-meta-item">{m}</div>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </ErrorBoundary>

        <footer>© MagajiCo Sports Central — Design & Architecture</footer>
      </motion.main>

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