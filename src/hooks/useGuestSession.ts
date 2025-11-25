'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

const GUEST_SESSION_DURATION = 30 * 60; // 30 minutes of free browsing
const SHOW_TIMER_AT = 5 * 60; // Show timer when 5 minutes remain

export function useGuestSession() {
  const { user, isLoading } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(GUEST_SESSION_DURATION);
  const [showTimer, setShowTimer] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    // If user is authenticated, no need for guest session
    if (user?.id) {
      setIsGuest(false);
      return;
    }

    // If still loading auth, don't start timer yet
    if (isLoading) {
      return;
    }

    // User is a guest, initialize timer
    const storedStartTime = localStorage.getItem('guest_session_start');
    let startTime = storedStartTime ? parseInt(storedStartTime) : Date.now();

    if (!storedStartTime) {
      localStorage.setItem('guest_session_start', startTime.toString());
    }

    // Update timer every second
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, GUEST_SESSION_DURATION - elapsedSeconds);

      setTimeRemaining(remaining);

      // Show timer when time is running out
      if (remaining <= SHOW_TIMER_AT && remaining > 0) {
        setShowTimer(true);
      }

      // Clear session when time expires
      if (remaining === 0) {
        localStorage.removeItem('guest_session_start');
        // Don't force logout, just let them browse but show persistent timer
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, isLoading]);

  const dismissTimer = () => {
    setShowTimer(false);
  };

  return {
    isGuest,
    timeRemaining,
    showTimer,
    dismissTimer,
    sessionExpired: timeRemaining === 0,
  };
}
