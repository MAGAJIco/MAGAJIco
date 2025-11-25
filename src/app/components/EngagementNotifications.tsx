'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { useFavorites } from '@/hooks/useFavorites';
import { Bell, Star, TrendingUp } from 'lucide-react';

// Meta-style engagement notifications
export const EngagementNotifications = () => {
  const { notifications, removeNotification } = useNotifications();
  const { favorites } = useFavorites();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    setHasUnread(notifications.length > 0);
  }, [notifications]);

  return (
    <>
      {/* Notifications Toast Stack */}
      <div className="fixed top-20 right-4 z-50 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="mb-3 pointer-events-auto"
            >
              <div
                className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm backdrop-blur-md ${
                  notif.type === 'success'
                    ? 'bg-green-500/90 text-white'
                    : notif.type === 'error'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-blue-500/90 text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                <span className="text-sm font-medium">{notif.message}</span>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="ml-2 text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Favorites Badge in Navigation */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-40 flex items-center gap-2"
        >
          <Heart className="w-4 h-4" />
          {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
        </motion.div>
      )}
    </>
  );
};

// Heart icon component (needed for the Badge)
const Heart = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Real-time match updates banner
export const LiveUpdatesBanner = ({ liveCount }: { liveCount: number }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || liveCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="font-semibold">{liveCount} Live Match{liveCount !== 1 ? 'es' : ''}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white/70 hover:text-white"
      >
        ✕
      </button>
    </motion.div>
  );
};

// Trending indicator badge
export const TrendingBadge = ({ trend }: { trend: number }) => {
  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
    >
      <TrendingUp className="w-3 h-3" />
      +{trend}% Trending
    </motion.div>
  );
};
