'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Zap, Trophy, Star, Settings, HelpCircle, User, LogOut, LogIn } from 'lucide-react';

interface EnhancedMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuLink = ({ icon: Icon, label, href, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
  >
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    <span className="font-medium">{label}</span>
  </Link>
);

const MenuSection = ({ title, children }: any) => (
  <div className="px-2 py-4">
    <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function EnhancedMenu({ isOpen, onClose }: EnhancedMenuProps) {
  const params = useParams();
  const locale = params?.locale || 'en';

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">MagajiCo</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="py-4">
              {/* Sports Section */}
              <MenuSection title="Sports">
                <MenuLink
                  icon={Home}
                  label="Home"
                  href={`/${locale}`}
                  onClick={onClose}
                />
                <MenuLink
                  icon={Zap}
                  label="Live Matches"
                  href={`/${locale}/live`}
                  onClick={onClose}
                />
                <MenuLink
                  icon={Trophy}
                  label="Predictions"
                  href={`/${locale}/predictions`}
                  onClick={onClose}
                />
                <MenuLink
                  icon={Star}
                  label="Secrets ⭐"
                  href={`/${locale}/secrets`}
                  onClick={onClose}
                />
              </MenuSection>

              {/* Account Section */}
              <MenuSection title="Account">
                <MenuLink
                  icon={User}
                  label="Profile"
                  href={`/${locale}/profile`}
                  onClick={onClose}
                />
                <MenuLink
                  icon={Settings}
                  label="Settings"
                  href={`/${locale}/settings`}
                  onClick={onClose}
                />
              </MenuSection>

              {/* Support Section */}
              <MenuSection title="Support">
                <MenuLink
                  icon={HelpCircle}
                  label="Help & Support"
                  href={`/${locale}/help`}
                  onClick={onClose}
                />
              </MenuSection>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>MagajiCo v2.0.0</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
