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
  const [activePage, setActivePage] = useState('home');

  const handleNavigate = (view) => {
    setActivePage(view);
    setIsMenuOpen(false);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)',
  };

  const navStyle = {
    borderBottom: '1px solid #e5e7eb',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  };

  const selectionCardStyle = {
    background: 'linear-gradient(to bottom right, #f3e8ff 0%, #fce7f3 100%)',
    border: '2px solid #e9d5ff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  };

  const generateButtonStyle = {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(to right, #3b82f6 0%, #a855f7 50%, #ec4899 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  };

  const infoBoxStyle = {
    marginTop: '32px',
    padding: '24px',
    background: '#dbeafe',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
  };

  const navButtonStyle = {
    padding: '8px 16px',
    background: 'transparent',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    background: '#a855f7',
    color: 'white',
    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
  };

  const navButtonHoverStyle = {
    ...navButtonStyle,
    background: 'rgba(168, 85, 247, 0.15)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const purpleButtonStyle = {
    ...navButtonStyle,
    background: '#a855f7',
    color: 'white',
    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
  };

  return (
    <div style={containerStyle}>
      {/* Top Navigation */}
      <nav style={navStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsMenuOpen(true)}
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease' }}
              >
                <Menu className="w-6 h-6" style={{ color: '#374151' }} />
              </button>
              <div style={{ display: 'none' }}>
                <Lightbulb className="w-6 h-6" style={{ color: '#eab308' }} />
                <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937' }}>
                  MagajiCo AI Hub
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1f2937' }}>
                  🧠 AI Hub
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleNavigate('home')}
                style={activePage === 'home' ? activeNavButtonStyle : navButtonStyle}
                onMouseEnter={(e) => { if (activePage !== 'home') e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { if (activePage !== 'home') e.currentTarget.style.boxShadow = 'none'; }}
              >
                <img src="/favico.svg" alt="Home" style={{ width: '24px', height: '24px' }} />
              </button>
              <button 
                onClick={() => setIsBrainstormOpen(true)}
                style={purpleButtonStyle}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)'; }}
              >
                Brainstorm
              </button>
              <button
                onClick={() => { setActivePage('live'); router.push('/en/live'); }}
                style={activePage === 'live' ? activeNavButtonStyle : navButtonStyle}
                onMouseEnter={(e) => { if (activePage !== 'live') e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { if (activePage !== 'live') e.currentTarget.style.boxShadow = 'none'; }}
              >
                Live
              </button>
              <button
                onClick={() => { setActivePage('secrets'); router.push('/en/secrets'); }}
                style={activePage === 'secrets' ? activeNavButtonStyle : navButtonStyle}
                onMouseEnter={(e) => { if (activePage !== 'secrets') e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'; }}
                onMouseLeave={(e) => { if (activePage !== 'secrets') e.currentTarget.style.boxShadow = 'none'; }}
              >
                Secret
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '16px', paddingBottom: '96px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Lightbulb className="w-8 h-8" style={{ color: '#eab308' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              AI Brainstorming Hub
            </h1>
          </div>
          <p style={{ color: '#4b5563', fontSize: '18px' }}>
            Get AI-powered feature enhancement ideas for any component. Open the menu to select a component and let our AI help you innovate.
          </p>
        </div>

        {/* Current Selection Card */}
        <div style={selectionCardStyle}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#9333ea', fontWeight: '500', marginBottom: '4px' }}>
                Currently Selected
              </p>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain className="w-5 h-5" style={{ color: '#a855f7' }} />
                <span>{selectedComponent}</span>
              </h2>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#9333ea',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
            >
              Change
            </button>
          </div>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Click the button below to generate AI-powered feature ideas for this component.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => setIsBrainstormOpen(true)}
          style={generateButtonStyle}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'; }}
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Ideas for {selectedComponent}</span>
          <Zap className="w-5 h-5" />
        </button>

        {/* Info Box */}
        <div style={infoBoxStyle}>
          <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
            <Brain className="w-5 h-5" />
            How It Works
          </h3>
          <ul style={{ color: '#1e3a8a', fontSize: '14px', lineHeight: '1.6' }}>
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
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', zIndex: 30 }}>
        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button 
            onClick={() => router.push('/en/live')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#4b5563', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', transition: 'all 0.3s ease' }}
            title="Live Matches"
          >
            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Live</span>
          </button>
          <button 
            onClick={() => router.push('/en/secrets')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#4b5563', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', transition: 'all 0.3s ease' }}
            title="Secret Features"
          >
            <Lock className="w-5 h-5" style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Secret</span>
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