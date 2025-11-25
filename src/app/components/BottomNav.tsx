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
    { href: `/${locale}/predictions`, label: 'Premium', icon: '⭐' },
    { href: `/${locale}/leaderboard`, label: 'Leagues', icon: '🏆' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-20 flex justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${locale}`);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center transition-all flex-1
              min-h-16 px-2 relative group
              ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'}
            `}
            title={item.label}
          >
            {/* Icon */}
            <span className="text-2xl mb-1 transition-transform group-active:scale-110">
              {item.icon}
            </span>
            
            {/* Label */}
            <span className="text-xs font-medium truncate max-w-14 leading-tight">
              {item.label}
            </span>

            {/* Persistent Underline Indicator */}
            <div
              className={`
                absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300
                ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
              `}
              style={{ transformOrigin: 'center' }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
