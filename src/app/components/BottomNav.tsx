'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale || 'en';

  const navItems = [
    { href: `/${locale}`, label: 'All Games', icon: '☰' },
    { href: `/${locale}/live`, label: 'LIVE', icon: '🔴' },
    { href: `/${locale}/predictions`, label: 'Favorites', icon: '☆' },
    { href: `/${locale}/chat`, label: 'News', icon: '📰' },
    { href: `/${locale}/leaderboard`, label: 'Leagues', icon: '🏆' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const accentColor = isActive ? 'text-red-600' : 'text-gray-600';
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-3 px-4 text-xs font-medium transition-colors flex-1 ${
              isActive ? 'border-b-4 border-red-600 ' : ''
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className={`${accentColor}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
