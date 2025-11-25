'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Search, User, Menu } from 'lucide-react';

export default function TopNav() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sports = [
    { name: 'Football', emoji: '⚽' },
    { name: 'Basketball', emoji: '🏀' },
    { name: 'American Football', emoji: '🏈' },
    { name: 'Baseball', emoji: '⚾' },
    { name: 'Tennis', emoji: '🎾' },
  ];

  return (
    <>
      <nav className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Sport Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">⚽</span>
              <span className="hidden sm:inline text-gray-900 dark:text-white">MagajiCo</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden sm:flex flex-1 max-w-xs mx-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search matches..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="space-y-2">
              {sports.map((sport) => (
                <button
                  key={sport.name}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  {sport.emoji} {sport.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
