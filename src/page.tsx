// ============================================
// FILE: app/(portal)/page.tsx
// PATH: apps/frontend/src/app/(portal)/page.tsx
// COMPLETE ALL-IN-ONE VERSION WITH ALL FEATURES
// ============================================

"use client";

import React, { useState, useEffect, useRef } from "react";

// ============================================
// TYPES & INTERFACES
// ============================================

interface LiveMatch {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  score: string;
  viewers: string;
}

interface NewsItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  comments: string;
  badge: "BREAKING" | "NEWS";
}

interface AppItem {
  icon: string;
  name: string;
  route?: string;
}

interface FeatureApp {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface TimelineItem {
  title: string;
  status: "complete" | "progress" | "pending";
  description: string;
}

// ============================================
// MOCK DATA
// ============================================

const LIVE_MATCHES: LiveMatch[] = [
  {
    id: "1",
    icon: "⚽",
    title: "Man United vs Arsenal",
    description: "Premier League - Thrilling match at Old Trafford",
    time: "67'",
    score: "2-1",
    viewers: "73K watching",
  },
  {
    id: "2",
    icon: "🏀",
    title: "Lakers vs Warriors",
    description: "NBA - Western Conference showdown",
    time: "Q3 5:23",
    score: "98-95",
    viewers: "120K watching",
  },
  {
    id: "3",
    icon: "🏈",
    title: "Patriots vs Chiefs",
    description: "NFL - Championship game intensity",
    time: "Q2 8:14",
    score: "14-21",
    viewers: "250K watching",
  },
  {
    id: "4",
    icon: "🎾",
    title: "Djokovic vs Alcaraz",
    description: "Wimbledon Final - Epic rally battle",
    time: "Set 2",
    score: "6-4, 3-4",
    viewers: "89K watching",
  },
  {
    id: "5",
    icon: "🏏",
    title: "India vs Australia",
    description: "Test Cricket - Day 4 decisive moments",
    time: "45.2 overs",
    score: "234/5",
    viewers: "156K watching",
  },
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    icon: "⚽",
    title: "Mbappe Signs Historic Deal",
    description:
      "Real Madrid announces record-breaking transfer for French superstar",
    time: "2 hours ago",
    comments: "1.2K comments",
    badge: "BREAKING",
  },
  {
    id: "2",
    icon: "🏀",
    title: "LeBron Reaches 40K Points",
    description:
      "King James makes history with unprecedented milestone achievement",
    time: "5 hours ago",
    comments: "892 comments",
    badge: "NEWS",
  },
  {
    id: "3",
    icon: "🎾",
    title: "Serena Returns to Court",
    description:
      "Tennis legend announces comeback tournament in Miami next month",
    time: "8 hours ago",
    comments: "645 comments",
    badge: "NEWS",
  },
  {
    id: "4",
    icon: "⚾",
    title: "Yankees Win World Series",
    description: "First championship in 15 years with dramatic Game 7 victory",
    time: "1 day ago",
    comments: "2.1K comments",
    badge: "NEWS",
  },
  {
    id: "5",
    icon: "🏁",
    title: "Hamilton Breaks Records",
    description: "Formula 1 legend secures 8th world championship in Abu Dhabi",
    time: "2 days ago",
    comments: "1.5K comments",
    badge: "NEWS",
  },
];

const APP_ITEMS: AppItem[] = [
  { icon: "🏠", name: "Portal", route: "/" },
  { icon: "🤖", name: "Predictions", route: "/predictions" },
  { icon: "⚡", name: "Live", route: "/live" },
  { icon: "👥", name: "Social", route: "/social" },
  { icon: "🎮", name: "Kids Mode", route: "/kids" },
  { icon: "🏆", name: "Rewards", route: "/rewards" },
  { icon: "📊", name: "Analytics", route: "/analytics" },
  { icon: "💬", name: "Chat", route: "/chat" },
  { icon: "🎯", name: "Challenges", route: "/challenges" },
];

const FEATURE_APPS: FeatureApp[] = [
  {
    icon: "🏠",
    title: "Portal",
    description: "Main dashboard & navigation hub",
    items: [
      "page.tsx - Landing with feature cards",
      "layout.tsx - Portal-specific layout",
    ],
  },
  {
    icon: "🤖",
    title: "Predictions",
    description: "AI Predictions & ML Features",
    items: [
      "ai-predictions/ - ML interface",
      "coach/ - AI coach assistant",
      "analytics/ - Prediction analytics",
    ],
  },
  {
    icon: "⚡",
    title: "Live Tracking",
    description: "Real-time sports updates",
    items: [
      "matches/ - Live match tracker",
      "scores/ - Live scores display",
      "odds/ - Live odds updates",
    ],
  },
  {
    icon: "👥",
    title: "Social",
    description: "Community & engagement",
    items: [
      "feed/ - Social feed",
      "challenges/ - Friend challenges",
      "chat/ - Live match chat",
      "forum/ - Community discussions",
    ],
  },
  {
    icon: "🎮",
    title: "Kids Mode",
    description: "Safe environment for children",
    items: [
      "dashboard/ - Kids dashboard",
      "quizzes/ - Educational quizzes",
      "learning/ - Learning paths",
    ],
  },
  {
    icon: "🏆",
    title: "Rewards",
    description: "Achievements & gamification",
    items: [
      "achievements/ - Achievement system",
      "leaderboard/ - Global rankings",
      "coins/ - Pi Coin management",
    ],
  },
];

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    title: "Frontend Route Groups",
    status: "complete",
    description:
      "All feature route groups created with proper layouts and navigation updated",
  },
  {
    title: "Backend Modules",
    status: "complete",
    description:
      "Module structure created and routes reorganized with feature grouping",
  },
  {
    title: "Service Layer",
    status: "progress",
    description: "Currently refactoring service layers for each module",
  },
  {
    title: "Testing & Deployment",
    status: "pending",
    description: "Feature-specific testing and deployment pipeline setup",
  },
];

const KEY_BENEFITS = [
  "✅ Better Organization",
  "✅ Easier Maintenance",
  "✅ Improved Performance",
  "✅ Team Scalability",
  "✅ Independent Testing",
  "✅ Flexible Deployment",
];

const NEXT_STEPS = [
  "1. Move remaining components into feature directories",
  "2. Create service layers for each module",
  "3. Add module-specific middleware",
  "4. Implement feature-specific testing",
];

const HELP_TOPICS = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      { title: "How to use Sports Central", link: "#" },
      { title: "Understanding AI Predictions", link: "#" },
      { title: "Navigating the Portal", link: "#" },
    ],
  },
  {
    category: "Features",
    icon: "⚡",
    items: [
      { title: "Live Match Tracking", link: "#" },
      { title: "Social Feed & Challenges", link: "#" },
      { title: "Rewards System", link: "#" },
    ],
  },
  {
    category: "Account",
    icon: "👤",
    items: [
      { title: "Managing Your Profile", link: "#" },
      { title: "Privacy Settings", link: "#" },
      { title: "Notifications", link: "#" },
    ],
  },
];

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function PortalPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Enhanced Google NavBar */}
      <EnhancedNavBar
        onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        onSearchOpen={() => setIsSearchOpen(true)}
        onHelpOpen={() => setIsHelpOpen(true)}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onProfileToggle={() => setIsProfileOpen(!isProfileOpen)}
        isProfileOpen={isProfileOpen}
      />

      {/* App Drawer */}
      <AppDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      {/* Help Center Modal */}
      <HelpCenterModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        notifications={notifications}
        setNotifications={setNotifications}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        language={language}
        setLanguage={setLanguage}
      />

      {/* User Profile Dropdown */}
      {isProfileOpen && (
        <UserProfileDropdown onClose={() => setIsProfileOpen(false)} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center py-12 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🏗️ Sports Central
          </h1>
          <p className="text-xl text-white/90">
            Feature-Based Architecture Documentation
          </p>
        </header>

        {/* Enhanced Live Carousel */}
        <EnhancedLiveCarousel
          matches={LIVE_MATCHES}
          onMatchClick={setSelectedMatch}
        />

        {/* Enhanced News Carousel */}
        <EnhancedNewsCarousel news={NEWS_ITEMS} onNewsClick={setSelectedNews} />

        {/* Overview Section */}
        <ArchitectureOverview />

        {/* Frontend Apps Structure */}
        <FrontendAppsSection apps={FEATURE_APPS} />

        {/* Key Benefits */}
        <KeyBenefitsSection benefits={KEY_BENEFITS} />

        {/* Data Flow */}
        <DataFlowSection />

        {/* Implementation Status */}
        <ImplementationStatusSection timeline={TIMELINE_ITEMS} />

        {/* Next Steps */}
        <NextStepsSection steps={NEXT_STEPS} />

        {/* Footer */}
        <footer className="text-center text-white/90 py-8 text-sm">
          <p className="font-semibold">Sports Central Architecture v2.0.0</p>
          <p>Last Updated: October 26, 2025</p>
        </footer>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* News Detail Modal */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {/* Add Required Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease forwards;
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
          pointer-events: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ============================================
// NAVBAR COMPONENT
// ============================================

function EnhancedNavBar({
  onDrawerToggle,
  onSearchOpen,
  onHelpOpen,
  onSettingsOpen,
  onProfileToggle,
  isProfileOpen,
}: {
  onDrawerToggle: () => void;
  onSearchOpen: () => void;
  onHelpOpen: () => void;
  onSettingsOpen: () => void;
  onProfileToggle: () => void;
  isProfileOpen: boolean;
}) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-5 h-16 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-5">
        <button
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          onClick={() => alert("Side menu")}
        >
          <div className="flex flex-col gap-1">
            <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
            <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
            <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
          </div>
        </button>
        <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          🏗️ Sports Central
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl"
        >
          🔍
        </button>

        <button
          onClick={onHelpOpen}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl"
        >
          ❓
        </button>

        <button
          onClick={onSettingsOpen}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl"
        >
          ⚙️
        </button>

        <button
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          onClick={onDrawerToggle}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
        </button>

        <button
          onClick={onProfileToggle}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold hover:shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          SC
        </button>
      </div>
    </nav>
  );
}

// ============================================
// APP DRAWER COMPONENT
// ============================================

function AppDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 max-h-[480px] overflow-y-auto z-50 transition-all ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
      >
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-200">
          Sports Central Apps
        </div>
        <div className="grid grid-cols-3 gap-4">
          {APP_ITEMS.map((app, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-2 text-white">
                {app.icon}
              </div>
              <div className="text-sm font-medium text-gray-700 text-center">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================
// CONTINUE IN NEXT PART...
// (Due to length, breaking into multiple messages)
// ============================================
