
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  category: "sports" | "tools" | "community" | "account";
  isPinned?: boolean;
  isNew?: boolean;
}

interface EnhancedMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export default function EnhancedMenu({ isOpen, onClose, currentPath = "" }: EnhancedMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recentPages, setRecentPages] = useState<string[]>([]);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    // Sports Section
    { id: "home", label: "Home", icon: "🏠", href: "/en", category: "sports" },
    { id: "live", label: "Live Matches", icon: "⚡", href: "/en/live", category: "sports", badge: 12 },
    { id: "predictions", label: "AI Predictions", icon: "🎯", href: "/en/predictions", category: "sports", isNew: true },
    { id: "matches", label: "Match Center", icon: "📊", href: "/en/matches", category: "sports" },
    { id: "bets", label: "My Bets", icon: "🎲", href: "/en/bets", category: "sports" },
    
    // Tools Section
    { id: "chat", label: "AI Chat", icon: "💬", href: "/en/chat", category: "tools", isNew: true },
    { id: "stats", label: "Statistics", icon: "📈", href: "/en/stats", category: "tools" },
    { id: "odds", label: "Odds Comparison", icon: "💰", href: "/en/odds", category: "tools" },
    
    // Community Section
    { id: "leaderboard", label: "Leaderboard", icon: "🏆", href: "/en/leaderboard", category: "community" },
    { id: "social", label: "Social Feed", icon: "👥", href: "/en/social", category: "community", badge: 5 },
    { id: "rewards", label: "Rewards", icon: "🎁", href: "/en/rewards", category: "community" },
    
    // Account Section
    { id: "profile", label: "Profile", icon: "👤", href: "/en/profile", category: "account" },
    { id: "settings", label: "Settings", icon: "⚙️", href: "/en/settings", category: "account" },
    { id: "help", label: "Help & Support", icon: "❓", href: "/en/help", category: "account" },
  ];

  const categories = [
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "tools", label: "Tools", icon: "🛠️" },
    { id: "community", label: "Community", icon: "👥" },
    { id: "account", label: "Account", icon: "👤" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedMenuItems = filteredItems.filter((item) => pinnedItems.includes(item.id));
  const unpinnedMenuItems = filteredItems.filter((item) => !pinnedItems.includes(item.id));

  const togglePin = (itemId: string) => {
    setPinnedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  useEffect(() => {
    if (currentPath) {
      setRecentPages((prev) => {
        // Filter out the current path to avoid duplicates
        const filtered = prev.filter((page) => page !== currentPath);
        // Add current path to the front, keep only last 4 pages
        const updated = [currentPath, ...filtered.slice(0, 3)];
        // Deduplicate by keeping only unique paths
        return Array.from(new Set(updated));
      });
    }
  }, [currentPath]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="enhanced-menu-overlay"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="enhanced-menu"
            onKeyDown={handleKeyPress}
          >
            {/* Header */}
            <div className="menu-header">
              <div className="menu-logo">
                <span className="logo-icon">⚡</span>
                <span className="logo-text">MagajiCo</span>
              </div>
              <button className="menu-close" onClick={onClose} aria-label="Close menu">
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="menu-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="search-clear">
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="menu-categories">
              <button
                className={`category-chip ${!activeCategory ? "active" : ""}`}
                onClick={() => setActiveCategory(null)}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-chip ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Pages */}
            {!searchQuery && recentPages.length > 0 && (
              <div className="menu-section">
                <div className="section-header">
                  <span className="section-icon">🕐</span>
                  <span className="section-title">Recent</span>
                </div>
                {recentPages.slice(0, 3).map((path, idx) => {
                  const item = menuItems.find((i) => i.href === path);
                  if (!item) return null;
                  return (
                    <Link key={idx} href={item.href} className="menu-item recent" onClick={onClose}>
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-label">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pinned Items */}
            {pinnedMenuItems.length > 0 && (
              <div className="menu-section">
                <div className="section-header">
                  <span className="section-icon">📌</span>
                  <span className="section-title">Pinned</span>
                </div>
                {pinnedMenuItems.map((item) => (
                  <MenuItem key={item.id} item={item} onClose={onClose} onPin={togglePin} isPinned />
                ))}
              </div>
            )}

            {/* All Menu Items */}
            <div className="menu-section menu-items-section">
              {unpinnedMenuItems.map((item) => (
                <MenuItem key={item.id} item={item} onClose={onClose} onPin={togglePin} isPinned={false} />
              ))}
            </div>

            {/* Footer */}
            <div className="menu-footer">
              <div className="footer-info">
                <span className="version">v2.0.0</span>
                <span className="divider">•</span>
                <span className="status">🟢 Online</span>
              </div>
              <div className="keyboard-hint">
                Press <kbd>ESC</kbd> to close
              </div>
            </div>
          </motion.div>

          <style jsx global>{`
            .enhanced-menu-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(4px);
              z-index: 2000;
            }

            .enhanced-menu {
              position: fixed;
              top: 0;
              left: 0;
              bottom: 0;
              width: 340px;
              max-width: 85vw;
              background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
              box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
              z-index: 2001;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }

            html.dark .enhanced-menu {
              background: linear-gradient(180deg, #1a1d2e 0%, #0f1117 100%);
            }

            .menu-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            html.dark .menu-header {
              border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            .menu-logo {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .logo-icon {
              font-size: 28px;
            }

            .logo-text {
              font-size: 22px;
              font-weight: 700;
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .menu-close {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: none;
              background: rgba(0, 0, 0, 0.05);
              color: #333;
              font-size: 20px;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            html.dark .menu-close {
              background: rgba(255, 255, 255, 0.1);
              color: #e0e0e0;
            }

            .menu-close:hover {
              background: rgba(0, 0, 0, 0.1);
              transform: rotate(90deg);
            }

            html.dark .menu-close:hover {
              background: rgba(255, 255, 255, 0.15);
            }

            .menu-search {
              margin: 16px 20px;
              position: relative;
              display: flex;
              align-items: center;
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 0 12px;
              transition: border-color 0.2s;
            }

            html.dark .menu-search {
              background: #1e2235;
              border-color: #2a2f45;
            }

            .menu-search:focus-within {
              border-color: #667eea;
            }

            .search-icon {
              font-size: 18px;
              margin-right: 8px;
            }

            .search-input {
              flex: 1;
              border: none;
              background: none;
              padding: 12px 0;
              font-size: 15px;
              color: #333;
              outline: none;
            }

            html.dark .search-input {
              color: #e0e0e0;
            }

            .search-input::placeholder {
              color: #999;
            }

            .search-clear {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: none;
              background: rgba(0, 0, 0, 0.05);
              color: #666;
              cursor: pointer;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            html.dark .search-clear {
              background: rgba(255, 255, 255, 0.1);
              color: #999;
            }

            .menu-categories {
              display: flex;
              gap: 8px;
              padding: 0 20px 16px;
              overflow-x: auto;
              scrollbar-width: none;
            }

            .menu-categories::-webkit-scrollbar {
              display: none;
            }

            .category-chip {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px;
              min-height: 40px;
              border-radius: 20px;
              border: 1px solid #e5e7eb;
              background: white;
              color: #666;
              font-size: clamp(12px, 2.5vw, 13px);
              font-weight: 500;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
              touch-action: manipulation;
              -webkit-tap-highlight-color: transparent;
            }

            html.dark .category-chip {
              background: #1e2235;
              border-color: #2a2f45;
              color: #999;
            }

            .category-chip:hover {
              border-color: #667eea;
              background: #f0f1ff;
            }

            html.dark .category-chip:hover {
              border-color: #667eea;
              background: #252a40;
            }

            .category-chip.active {
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-color: transparent;
              color: white;
            }

            .menu-items-section {
              flex: 1;
              overflow-y: auto;
            }

            .menu-section {
              padding: 8px 0;
            }

            .section-header {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 20px 8px;
              font-size: clamp(12px, 2.5vw, 13px);
              font-weight: 600;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              line-height: 1.2;
            }

            html.dark .section-header {
              color: #888;
            }

            .section-icon {
              font-size: 16px;
            }

            .menu-footer {
              padding: 16px 20px;
              border-top: 1px solid rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            html.dark .menu-footer {
              border-top-color: rgba(255, 255, 255, 0.1);
            }

            .footer-info {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: clamp(11px, 2vw, 12px);
              color: #999;
              line-height: 1.2;
            }

            .divider {
              color: #ddd;
            }

            .keyboard-hint {
              font-size: 11px;
              color: #999;
            }

            .keyboard-hint kbd {
              padding: 2px 6px;
              background: rgba(0, 0, 0, 0.05);
              border-radius: 4px;
              font-family: monospace;
              font-size: 10px;
            }

            html.dark .keyboard-hint kbd {
              background: rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 640px) {
              .enhanced-menu {
                width: 100%;
                max-width: 100%;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({
  item,
  onClose,
  onPin,
  isPinned,
}: {
  item: MenuItem;
  onClose: () => void;
  onPin: (id: string) => void;
  isPinned: boolean;
}) {
  return (
    <div className="menu-item-wrapper">
      <Link href={item.href} className="menu-item" onClick={onClose}>
        <div className="item-left">
          <span className="item-icon">{item.icon}</span>
          <span className="item-label">{item.label}</span>
          {item.isNew && <span className="new-badge">NEW</span>}
        </div>
        <div className="item-right">
          {item.badge && <span className="item-badge">{item.badge}</span>}
        </div>
      </Link>
      <button
        className="pin-button"
        onClick={(e) => {
          e.preventDefault();
          onPin(item.id);
        }}
        aria-label={isPinned ? "Unpin" : "Pin"}
      >
        {isPinned ? "📌" : "📍"}
      </button>

      <style jsx>{`
        .menu-item-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin: 0 12px;
        }

        .menu-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          min-height: 48px;
          border-radius: 12px;
          text-decoration: none;
          color: #333;
          transition: all 0.2s;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        html.dark .menu-item {
          color: #e0e0e0;
        }

        .menu-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-icon {
          font-size: 22px;
        }

        .item-label {
          font-size: clamp(14px, 3vw, 15px);
          font-weight: 500;
          line-height: 1.2;
        }

        .new-badge {
          padding: 2px 8px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 8px;
          font-size: clamp(9px, 1.5vw, 10px);
          font-weight: 700;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .item-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-badge {
          min-width: 28px;
          min-height: 28px;
          height: 28px;
          padding: 0 8px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 12px;
          font-size: clamp(11px, 2vw, 12px);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pin-button {
          min-width: 40px;
          min-height: 40px;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          font-size: 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
          opacity: 0;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }

        .menu-item-wrapper:hover .pin-button {
          opacity: 1;
        }

        .pin-button:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        html.dark .pin-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
