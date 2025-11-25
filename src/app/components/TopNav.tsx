'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Search, User, ChevronDown } from 'lucide-react';

export default function TopNav() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sportOpen, setSportOpen] = useState(false);

  const sports = [
    { name: 'Football', emoji: '⚽' },
    { name: 'Basketball', emoji: '🏀' },
    { name: 'American Football', emoji: '🏈' },
    { name: 'Baseball', emoji: '⚾' },
    { name: 'Tennis', emoji: '🎾' },
  ];

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Sport Selector */}
        <div className="relative">
          <button
            onClick={() => setSportOpen(!sportOpen)}
            className="flex items-center gap-2 text-white font-bold text-base hover:bg-slate-700 px-3 py-2 rounded transition-colors"
          >
            <span className="text-2xl">⚽</span>
            <span>Football</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {sportOpen && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-40">
              {sports.map((sport) => (
                <button
                  key={sport.name}
                  onClick={() => setSportOpen(false)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700 last:border-b-0"
                >
                  <span className="text-xl">{sport.emoji}</span>
                  {sport.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Search */}
        <div className="hidden sm:flex flex-1 max-w-xs mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <button className="sm:hidden text-white hover:bg-slate-700 p-2 rounded transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-white hover:bg-slate-700 p-2 rounded transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
