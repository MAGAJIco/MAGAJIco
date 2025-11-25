'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Menu, Search, User, ChevronDown, Star, Home, Trophy } from 'lucide-react';
import EnhancedMenu from './EnhancedMenu';

export default function TopNav() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [sportOpen, setSportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sports = [
    { name: 'Football', emoji: '⚽' },
    { name: 'Basketball', emoji: '🏀' },
    { name: 'American Football', emoji: '🏈' },
    { name: 'Baseball', emoji: '⚾' },
    { name: 'Tennis', emoji: '🎾' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 gradient-blue border-b border-blue-900 shadow-xl z-30">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">MagajiCo</span>
            </Link>
          </div>

          {/* Center: Quick Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href={`/${locale}`}
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              href={`/${locale}/predictions`}
              className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Predictions
            </Link>
            <Link 
              href={`/${locale}/secrets`}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg transition-all hover:shadow-lg flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-white" />
              Secrets
            </Link>
          </div>

          {/* Right: Search & User */}
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <EnhancedMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
