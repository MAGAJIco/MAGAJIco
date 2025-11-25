'use client';

import React, { ReactNode } from 'react';
import { useGuestSession } from '@/hooks/useGuestSession';
import GuestTimer from './GuestTimer';

interface GuestSessionWrapperProps {
  children: ReactNode;
}

export default function GuestSessionWrapper({ children }: GuestSessionWrapperProps) {
  const { showTimer, timeRemaining, dismissTimer, isGuest, sessionExpired } = useGuestSession();

  const handleSignUp = () => {
    // Redirect to login page
    window.location.href = '/auth/login';
  };

  return (
    <>
      {isGuest && (
        <GuestTimer
          isVisible={showTimer || sessionExpired}
          timeRemaining={timeRemaining}
          onSignUpClick={handleSignUp}
          onDismiss={dismissTimer}
        />
      )}
      {children}
    </>
  );
}
