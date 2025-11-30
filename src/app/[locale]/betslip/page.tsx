'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Brain, X, Search, Lightbulb, Clock, Eye, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MagajicoCEO from '@/app/components/MagajicoCEO';
import GamblingReminder from '@/app/components/GamblingReminder';
import PageNav from '@/app/components/PageNav';

const MenuDrawer = ({ isOpen, onClose, onNavigate }) => {
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
                onNavigate('live');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Live</span>
            </button>
            <button
              onClick={() => {
                onNavigate('secrets');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Secrets</span>
            </button>
            <button
              onClick={() => {
                onNavigate('betslip');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Betting Manager</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default function BetslipPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setMenuOpen(false);
    if (view === 'home') router.push('/en');
    if (view === 'live') router.push('/en/live');
    if (view === 'secrets') router.push('/en/secrets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <PageNav onMenuOpen={() => setMenuOpen(true)} />
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AI Manager */}
          <div className="lg:col-span-2">
            <div className="h-screen lg:h-auto">
              <MagajicoCEO />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Gambling Reminder */}
            <GamblingReminder />

            {/* Tips Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Smart Betting Tips</h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Start with a game count you want to book</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Add game details one at a time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Review your betting slip before placing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Check odds and predictions from multiple sources</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span>Set daily and weekly betting limits</span>
                </li>
              </ul>
            </div>

            {/* Popular Matches Card - Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                <span className="text-lg">⭐</span> Featured Matches
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Check the Live page for today's top matches with high confidence predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
