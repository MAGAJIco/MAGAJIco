'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Zap, Trophy, Star, Settings, HelpCircle, User } from 'lucide-react';

interface EnhancedMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppTile = ({ icon: Icon, label, href, onClick, colors }: any) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4"
    >
      <div className={`${colors} rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{label}</span>
    </Link>
  </motion.div>
);

export default function EnhancedMenu({ isOpen, onClose }: EnhancedMenuProps) {
  const params = useParams();
  const locale = params?.locale || 'en';

  const appItems = [
    { icon: Home, label: 'Home', href: `/${locale}`, colors: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { icon: Zap, label: 'Live', href: `/${locale}/live`, colors: 'bg-gradient-to-br from-red-500 to-red-600' },
    { icon: Trophy, label: 'Predictions', href: `/${locale}/predictions`, colors: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { icon: Star, label: 'Secrets', href: `/${locale}/secrets`, colors: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
    { icon: User, label: 'Profile', href: `/${locale}/profile`, colors: 'bg-gradient-to-br from-green-500 to-green-600' },
    { icon: Settings, label: 'Settings', href: `/${locale}/settings`, colors: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    { icon: HelpCircle, label: 'Help', href: `/${locale}/help`, colors: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Google-style App Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-end md:items-center justify-center"
          >
            <div className="w-full md:w-auto md:max-w-2xl bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Apps</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* App Grid */}
              <div className="p-6 overflow-y-auto max-h-[70vh] md:max-h-[80vh]">
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {appItems.map((item) => (
                    <AppTile
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      colors={item.colors}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">MagajiCo • v2.0.0</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
