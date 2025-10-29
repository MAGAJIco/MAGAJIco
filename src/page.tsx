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
// =// ============================================
// FILE: app/(portal)/page.tsx - COMPLETE ALL-IN-ONE
// PATH: apps/frontend/src/app/(portal)/page.tsx
// Copy this entire file and it will work!
// ============================================

"use client";

import React, { useState, useEffect, useRef } from 'react';

// ===== DATA =====
const LIVE_MATCHES = [
  { id: '1', icon: '⚽', title: 'Man United vs Arsenal', description: 'Premier League - Thrilling match at Old Trafford', time: "67'", score: '2-1', viewers: '73K watching' },
  { id: '2', icon: '🏀', title: 'Lakers vs Warriors', description: 'NBA - Western Conference showdown', time: 'Q3 5:23', score: '98-95', viewers: '120K watching' },
  { id: '3', icon: '🏈', title: 'Patriots vs Chiefs', description: 'NFL - Championship game intensity', time: 'Q2 8:14', score: '14-21', viewers: '250K watching' },
  { id: '4', icon: '🎾', title: 'Djokovic vs Alcaraz', description: 'Wimbledon Final - Epic rally battle', time: 'Set 2', score: '6-4, 3-4', viewers: '89K watching' },
  { id: '5', icon: '🏏', title: 'India vs Australia', description: 'Test Cricket - Day 4 decisive moments', time: '45.2 overs', score: '234/5', viewers: '156K watching' },
];

const NEWS_ITEMS = [
  { id: '1', icon: '⚽', title: 'Mbappe Signs Historic Deal', description: 'Real Madrid announces record-breaking transfer', time: '2 hours ago', comments: '1.2K', badge: 'BREAKING' },
  { id: '2', icon: '🏀', title: 'LeBron Reaches 40K Points', description: 'King James makes history', time: '5 hours ago', comments: '892', badge: 'NEWS' },
  { id: '3', icon: '🎾', title: 'Serena Returns to Court', description: 'Tennis legend announces comeback', time: '8 hours ago', comments: '645', badge: 'NEWS' },
  { id: '4', icon: '⚾', title: 'Yankees Win World Series', description: 'First championship in 15 years', time: '1 day ago', comments: '2.1K', badge: 'NEWS' },
  { id: '5', icon: '🏁', title: 'Hamilton Breaks Records', description: 'Formula 1 legend secures 8th championship', time: '2 days ago', comments: '1.5K', badge: 'NEWS' },
];

const APPS = [
  { icon: '🏠', name: 'Portal' }, { icon: '🤖', name: 'Predictions' }, { icon: '⚡', name: 'Live' },
  { icon: '👥', name: 'Social' }, { icon: '🎮', name: 'Kids Mode' }, { icon: '🏆', name: 'Rewards' },
  { icon: '📊', name: 'Analytics' }, { icon: '💬', name: 'Chat' }, { icon: '🎯', name: 'Challenges' },
];

const FEATURES = [
  { icon: '🏠', title: 'Portal', desc: 'Main dashboard & navigation hub', items: ['page.tsx - Landing', 'layout.tsx - Portal layout'] },
  { icon: '🤖', title: 'Predictions', desc: 'AI Predictions & ML', items: ['ai-predictions/', 'coach/', 'analytics/'] },
  { icon: '⚡', title: 'Live', desc: 'Real-time updates', items: ['matches/', 'scores/', 'odds/'] },
  { icon: '👥', title: 'Social', desc: 'Community', items: ['feed/', 'challenges/', 'chat/', 'forum/'] },
  { icon: '🎮', title: 'Kids', desc: 'Safe for children', items: ['dashboard/', 'quizzes/', 'learning/'] },
  { icon: '🏆', title: 'Rewards', desc: 'Gamification', items: ['achievements/', 'leaderboard/', 'coins/'] },
];

// ===== MAIN COMPONENT =====
export default function PortalPage() {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [help, setHelp] = useState(false);
  const [settings, setSettings] = useState(false);
  const [profile, setProfile] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [news, setNews] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [notif, setNotif] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* NavBar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <div className="flex flex-col gap-1">
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
              <span className="w-5 h-0.5 bg-gray-600 rounded"></span>
            </div>
          </button>
          <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🏗️ Sports Central
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSearch(true)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">🔍</button>
          <button onClick={() => setHelp(true)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">❓</button>
          <button onClick={() => setSettings(true)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl">⚙️</button>
          <button onClick={() => setDrawer(!drawer)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="4" cy="4" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
              <circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>
              <circle cx="4" cy="20" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
            </svg>
          </button>
          <button onClick={() => setProfile(!profile)} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold hover:scale-110">SC</button>
        </div>
      </nav>

      {/* App Drawer */}
      {drawer && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDrawer(false)} />}
      <div className={`fixed top-20 right-5 bg-white rounded-xl shadow-2xl p-5 w-96 z-50 transition-all ${drawer ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-lg font-semibold text-gray-700 mb-5 pb-4 border-b">Sports Central Apps</div>
        <div className="grid grid-cols-3 gap-4">
          {APPS.map((app, i) => (
            <button key={i} className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl text-white">{app.icon}</div>
              <div className="text-sm font-medium text-gray-700 mt-2">{app.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      {search && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 p-4" onClick={() => setSearch(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="flex-1 text-lg outline-none" autoFocus />
              <button onClick={() => setSearch(false)}>✕</button>
            </div>
            {query && <div className="p-4"><div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"><div className="font-semibold">Man United vs Arsenal</div><div className="text-sm text-gray-500">Live Match</div></div></div>}
          </div>
        </div>
      )}

      {/* Help */}
      {help && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setHelp(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">❓ Help Center</h2>
                <button onClick={() => setHelp(false)} className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center">✕</button>
              </div>
              <input placeholder="Search for help..." className="w-full px-4 py-3 rounded-lg text-gray-900 outline-none" />
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {[{cat:'Getting Started',icon:'🚀',items:['How to use','Understanding AI','Navigating Portal']},{cat:'Features',icon:'⚡',items:['Live Tracking','Social Feed','Rewards']}].map((t,i) => (
                <div key={i} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><span className="text-2xl">{t.icon}</span>{t.cat}</h3>
                  {t.items.map((item,j) => <div key={j} className="p-3 hover:bg-gray-50 rounded-lg"><div className="text-indigo-600 font-medium">{item} →</div></div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {settings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSettings(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">⚙️ Settings</h2>
              <button onClick={() => setSettings(false)} className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <div className="flex gap-2">
                  <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-lg font-medium ${theme==='light'?'bg-indigo-600 text-white':'bg-gray-100'}`}>☀️ Light</button>
                  <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-lg font-medium ${theme==='dark'?'bg-indigo-600 text-white':'bg-gray-100'}`}>🌙 Dark</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div><div className="font-medium">Notifications</div><div className="text-sm text-gray-500">Receive alerts</div></div>
                <button onClick={() => setNotif(!notif)} className={`w-12 h-6 rounded-full ${notif?'bg-indigo-600':'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notif?'translate-x-6':'translate-x-1'}`}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {profile && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setProfile(false)} />
          <div className="fixed top-20 right-5 bg-white rounded-xl shadow-2xl w-80 z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center text-2xl font-bold">SC</div>
                <div><div className="font-bold text-lg">Sports Fan</div><div className="text-sm text-white/80">fan@email.com</div></div>
              </div>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 rounded-lg">View Profile</button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 border-b">
              <div className="text-center"><div className="text-2xl font-bold text-indigo-600">127</div><div className="text-xs text-gray-500">Predictions</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-indigo-600">1.2K</div><div className="text-xs text-gray-500">Points</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-indigo-600">45</div><div className="text-xs text-gray-500">Badges</div></div>
            </div>
            <div className="p-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3"><span className="text-xl">📊</span>Statistics</button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3"><span className="text-xl">🏆</span>Achievements</button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 border-t mt-2"><span className="text-xl">🚪</span><span className="text-red-600">Sign Out</span></button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <header className="text-center py-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">🏗️ Sports Central</h1>
          <p className="text-xl text-white/90">Feature-Based Architecture Documentation</p>
        </header>

        {/* Live Carousel */}
        <LiveCarousel matches={LIVE_MATCHES} onSelect={setMatch} />

        {/* News Carousel */}
        <NewsCarousel news={NEWS_ITEMS} onSelect={setNews} />

        {/* Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-indigo-600 mb-5">📋 Overview</h2>
          <p className="text-lg text-gray-700 leading-relaxed">Sports Central is organized into feature-based apps within a monorepo structure. Each feature app is independent but shares common infrastructure.</p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">📱 Frontend Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f,i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 hover:-translate-y-2 transition-all hover:shadow-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer">
                <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-2"><span className="text-3xl">{f.icon}</span>{f.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{f.desc}</p>
                <ul className="space-y-2">{f.items.map((item,j) => <li key={j} className="text-sm text-gray-700 py-2 border-b border-gray-300 last:border-0 hover:pl-2 hover:text-indigo-600 transition-all">{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">🚀 Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['✅ Better Organization','✅ Easier Maintenance','✅ Improved Performance','✅ Team Scalability','✅ Independent Testing','✅ Flexible Deployment'].map((b,i) => (
              <div key={i} className="bg-gradient-to-br from-orange-100 to-pink-200 p-5 rounded-xl font-semibold hover:scale-105 transition-all cursor-pointer">{b}</div>
            ))}
          </div>
        </div>

        <footer className="text-center text-white/90 py-8"><p className="font-semibold">Sports Central v2.0.0</p><p>Last Updated: October 26, 2025</p></footer>
      </div>

      {/* Match Modal */}
      {match && <MatchModal match={match} onClose={() => setMatch(null)} />}
      {/* News Modal */}
      {news && <NewsModal news={news} onClose={() => setNews(null)} />}
    </div>
  );
}

// ===== CAROUSELS =====
function LiveCarousel({matches, onSelect}: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if(hover) return;
    const int = setInterval(() => ref.current?.scrollBy({left:340,behavior:'smooth'}), 3000);
    return () => clearInterval(int);
  }, [hover]);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-indigo-600">⚡ Live Matches</h2>
        <div className="flex gap-2">
          <button onClick={() => ref.current?.scrollBy({left:-340,behavior:'smooth'})} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center hover:scale-110">←</button>
          <button onClick={() => ref.current?.scrollBy({left:340,behavior:'smooth'})} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center hover:scale-110">→</button>
        </div>
      </div>
      <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2">
        {matches.map((m:any) => (
          <div key={m.id} onClick={() => onSelect(m)} className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-red-500 relative group">
            <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 rounded-xl" />
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>LIVE
            </span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all">{m.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{m.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{m.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⏱️ {m.time}</span><span>📊 {m.score}</span><span>👥 {m.viewers}</span>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.shimmer-effect{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%);animation:shimmer 2s infinite}@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

function NewsCarousel({news, onSelect}: any) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-indigo-600">📰 Latest News</h2>
        <div className="flex gap-2">
          <button onClick={() => ref.current?.scrollBy({left:-340,behavior:'smooth'})} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center hover:scale-110">←</button>
          <button onClick={() => ref.current?.scrollBy({left:340,behavior:'smooth'})} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center hover:scale-110">→</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2">
        {news.map((n:any) => (
          <div key={n.id} onClick={() => onSelect(n)} className="min-w-[320px] bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-5 cursor-pointer hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative">
            <span className={`absolute top-4 right-4 ${n.badge==='BREAKING'?'bg-blue-500':'bg-blue-400'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>{n.badge==='BREAKING'?'🔥':'📰'} {n.badge}</span>
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mb-4">{n.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{n.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{n.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500"><span>🕐 {n.time}</span><span>💬 {n.comments}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MODALS =====
function MatchModal({match, onClose}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl">{match.icon}</div>
              <div>
                <span className="inline-flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-xs font-semibold mb-2">🔴 LIVE</span>
                <h2 className="text-2xl font-bold">{match.title}</h2>
                <p className="text-white/80 text-sm mt-1">{match.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="text-center mb-4"><div className="text-5xl font-bold text-indigo-600">{match.score}</div><div className="text-gray-600 mt-2">{match.time}</div></div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600"><span>👥 {match.viewers}</span></div>
          </div>
          <div><h3 className="text-xl font-bold text-gray-900 mb-4">Match Statistics</h3><div className="space-y-3">{[{l:'Possession',v:55},{l:'Shots',v:70},{l:'Accuracy',v:85}].map((s,i) => <div key={i} className="flex items-center justify-between"><span className="text-gray-600">{s.l}</span><div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden"><div className="bg-indigo-600 h-full" style={{width:`${s.v}%`}}/></div><span className="font-semibold">{s.v}%</span></div>)}</div></div>
          <div className="flex gap-3"><button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl">Watch Live 📺</button><button className="flex-1 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl">Share 📤</button></div>
        </div>
      </div>
    </div>
  );
}

function NewsModal({news, onClose}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h
