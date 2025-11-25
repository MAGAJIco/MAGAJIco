'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Zap, Brain, BarChart3, Trophy, Home } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale || 'en';

  const navItems = [
    { href: `/${locale}`, label: 'Home', icon: Home },
    { href: `/${locale}/predictions`, label: 'Predictions', icon: Trophy },
    { href: `/${locale}/live`, label: 'Live', icon: Zap },
    { href: `/${locale}/ml-report`, label: 'ML Report', icon: Brain },
    { href: `/${locale}/analytics`, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="max-w-7xl mx-auto flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 text-xs font-medium transition-colors flex-1 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
