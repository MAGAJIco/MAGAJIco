'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, Brain, Sparkles, Zap, X, TrendingUp, Clock, Star, Menu, ChevronRight, Search, ChevronUp, ChevronDown, Eye, Lock, Settings, Mail } from 'lucide-react';

const COMPONENTS = [
  'Predictions Dashboard',
  'Live Matches Feed',
  'ML Report Dashboard',
  'User Profile',
  'Settings Page',
  'Leaderboard',
  'Odds Display',
  'Betting Recommendations',
  'Social Features',
  'Mobile Experience',
];

const AIBrainstormingModal = ({ component, isOpen, onClose }) => {
  const [context, setContext] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateIdeas = () => {
    setLoading(true);
    setTimeout(() => {
      setIdeas([
        {
          title: 'Real-time Collaboration',
          description: `Enable users to share ${component} insights with teams in real-time`,
          priority: 'High',
          effort: 'Medium',
          aiScore: 92,
        },
        {
          title: 'Smart Notifications',
          description: 'AI-powered alerts based on user behavior patterns',
          priority: 'Medium',
          effort: 'Low',
          aiScore: 88,
        },
        {
          title: 'Predictive Analytics',
          description: 'Machine learning models to forecast trends',
          priority: 'High',
          effort: 'High',
          aiScore: 95,
        },
        {
          title: 'Personalization Engine',
          description: 'Adaptive UI based on user preferences and usage',
          priority: 'Medium',
          effort: 'Medium',
          aiScore: 85,
        },
        {
          title: 'Voice Commands',
          description: 'Hands-free interaction with natural language processing',
          priority: 'Low',
          effort: 'High',
          aiScore: 78,
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Ideas: {component}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Focus on mobile usability, improve performance, add social features..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="3"
            />
          </div>

          <button
            onClick={generateIdeas}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Ideas
              </>
            )}
          </button>

          {ideas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                5 Innovative Ideas
              </h3>
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {idea.title}
                    </h4>
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Star className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {idea.aiScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {idea.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        idea.priority === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : idea.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {idea.priority} Priority
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        idea.effort === 'High'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : idea.effort === 'Medium'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                      }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      {idea.effort} Effort
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MenuDrawer = ({ isOpen, onClose, onSelectComponent, selectedComponent, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />
      
      <div className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slideInLeft overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Menu
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Navigate or select a component
          </p>
        </div>

        {/* Search Box */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:opacity-70 flex-shrink-0">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
            Navigation
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Lightbulb className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Home</span>
            </button>
            <button
              onClick={() => {
                onNavigate('predictions');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Predictions</span>
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Settings</span>
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Contact</span>
            </button>
          </div>
        </div>

        {/* Components List */}
        <div className="p-3 sm:p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
            Components
          </h3>
          <div className="space-y-2">
            {COMPONENTS.filter(comp => 
              comp.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((component, idx) => (
              <button
                key={component}
                onClick={() => {
                  onSelectComponent(component);
                  onClose();
                }}
                style={{ animationDelay: `${idx * 30}ms` }}
                className={`w-full p-3 sm:p-4 rounded-lg transition-all text-left flex items-center justify-between group animate-slideUp ${
                  selectedComponent === component
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Brain className={`w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 ${
                    selectedComponent === component ? 'text-white' : 'text-purple-500'
                  }`} />
                  <span className="font-medium text-xs sm:text-sm truncate">{component}</span>
                </div>
                <ChevronRight className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-1 flex-shrink-0 ml-2 ${
                  selectedComponent === component ? 'text-white' : 'text-gray-400'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default function BrainstormPage() {
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState('Predictions Dashboard');
  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (view) => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex-shrink-0"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                  MagajiCo AI Hub
                </span>
              </div>
              <div className="sm:hidden">
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  AI Hub
                </span>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => handleNavigate('home')}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
              >
                Home
              </button>
              <button 
                onClick={() => setIsBrainstormOpen(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Brainstorm
              </button>
              <button
                onClick={handleLiveClick}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
              >
                Live
              </button>
              <button
                onClick={handleSecretClick}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
              >
                Secret
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-24">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Lightbulb className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              AI Brainstorming Hub
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Get AI-powered feature enhancement ideas for any component. Open the menu to select a component and let our AI help you innovate.
          </p>
        </div>

        {/* Current Selection Card */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg sm:rounded-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-3 sm:mb-4">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                Currently Selected
              </p>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 break-words">
                <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500 flex-shrink-0" />
                <span className="truncate">{selectedComponent}</span>
              </h2>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm whitespace-nowrap"
            >
              Change
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Click the button below to generate AI-powered feature ideas for this component.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => setIsBrainstormOpen(true)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 sm:gap-3 animate-fadeIn text-sm sm:text-base"
        >
          <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Generate Ideas for {selectedComponent}</span>
          <span className="sm:hidden">Generate Ideas</span>
          <Zap className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
        </button>

        {/* Info Box */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-lg animate-fadeIn">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Brain className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            How It Works
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm space-y-1">
            <li>• Open the menu to select a component from MagajiCo</li>
            <li>• Add optional context about what you want to improve</li>
            <li>• AI will generate 5 innovative feature ideas</li>
            <li>• Each idea includes priority, effort level, and AI potential score</li>
            <li>• Use insights to plan your next development sprint</li>
          </ul>
        </div>
      </div>

      {/* Overlay for menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 opacity-0"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectComponent={setSelectedComponent}
        selectedComponent={selectedComponent}
        onNavigate={handleNavigate}
      />

      {/* Brainstorming Modal */}
      <AIBrainstormingModal
        component={selectedComponent}
        isOpen={isBrainstormOpen}
        onClose={() => setIsBrainstormOpen(false)}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30">
        <div className="px-4 py-2 sm:py-3 flex justify-around items-center">
          <button 
            onClick={() => router.push('/en/live')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Live Matches"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-medium">Live</span>
          </button>
          <button 
            onClick={() => router.push('/en/secret')}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Secret Features"
          >
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Secret</span>
          </button>
          <button 
            onClick={() => setIsBrainstormOpen(true)}
            className="flex flex-col items-center gap-1 text-purple-500 hover:text-purple-600 transition-colors p-2 hover:opacity-80 active:opacity-60"
            title="Generate AI Ideas"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium">Generate</span>
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
          animation-fill-mode: both;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }

        .animate-fadeInOverlay {
          animation: fadeInOverlay 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}