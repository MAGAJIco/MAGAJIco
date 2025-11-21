
'use client';

import { useEffect, useState } from 'react';

export default function MobileGestureHint() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenSwipeHint');
    if (!hasSeenHint && window.innerWidth <= 768) {
      setTimeout(() => setShowHint(true), 2000);
      setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('hasSeenSwipeHint', 'true');
      }, 5000);
    }
  }, []);

  if (!showHint) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 animate-fadeIn">
      <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
        <span>👆</span>
        <span>Swipe left/right to navigate</span>
      </div>
    </div>
  );
}
