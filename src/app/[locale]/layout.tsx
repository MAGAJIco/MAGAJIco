'use client';

import React, { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeInitializer from '@/components/ThemeInitializer';
import AuthProvider from '@/components/AuthProvider';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import EnhancedMenu from '@/components/EnhancedMenu';
import GuestSessionWrapper from '@/components/GuestSessionWrapper';
import EngagementNotifications from '@/components/EngagementNotifications';

export default function LocaleLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <ThemeProvider>
      <ThemeInitializer>
        <AuthProvider>
          <GuestSessionWrapper>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 dark:from-gray-950 dark:to-gray-900">
              <TopNav locale={locale as string} />
              <EnhancedMenu />
              <main className="pb-20 pt-0">
                {children}
              </main>
              <BottomNav locale={locale as string} />
              <EngagementNotifications />
            </div>
          </GuestSessionWrapper>
        </AuthProvider>
      </ThemeInitializer>
    </ThemeProvider>
  );
}
