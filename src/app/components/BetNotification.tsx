'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'opportunity' | 'reminder' | 'warning';
  timestamp: number;
}

export default function BetNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate incoming notifications
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Great Odds Available!',
        message: 'Liverpool vs Man City - 2.5 odds on home win',
        type: 'opportunity',
        timestamp: Date.now()
      };
      setNotifications(prev => [...prev, newNotif]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'reminder':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getTitleColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-900 dark:text-green-100';
      case 'warning':
        return 'text-red-900 dark:text-red-100';
      case 'reminder':
        return 'text-blue-900 dark:text-blue-100';
      default:
        return 'text-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 space-y-2 max-w-xs">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`rounded-lg border p-3 shadow-lg ${getBackgroundColor(notif.type)}`}
          >
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${getTitleColor(notif.type)}`}>
                  {notif.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {notif.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
