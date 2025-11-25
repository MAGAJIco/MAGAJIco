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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around shadow-lg sm:shadow-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const accentColor = isActive ? 'text-red-600' : 'text-gray-600';
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center transition-colors flex-1
              min-h-16 sm:py-3 px-2 sm:px-4 
              text-xs sm:text-xs font-medium
              active:bg-gray-100 hover:bg-gray-50
              ${isActive ? 'border-b-4 border-red-600' : ''}
            `}
            title={item.label}
          >
            {/* Icon - larger on all screens, especially mobile */}
            <span className="text-2xl sm:text-lg leading-none mb-1 sm:mb-1">{item.icon}</span>
            
            {/* Label - hidden on mobile, visible on sm+ */}
            <span className={`hidden sm:inline ${accentColor} truncate max-w-16`}>
              {item.label}
            </span>
            
            {/* Mobile-only label below icon (shorter) */}
            <span className="sm:hidden text-gray-600 text-xs leading-tight truncate max-w-12">
              {item.label === 'All Games' ? 'All' : 
               item.label === 'Favorites' ? 'Fav' :
               item.label === 'Leagues' ? 'Lg' :
               item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
