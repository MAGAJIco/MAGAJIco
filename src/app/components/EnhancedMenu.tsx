'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Zap, Trophy, Star, Settings, HelpCircle, User, LogOut } from 'lucide-react';

interface EnhancedMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuItem = ({ icon: Icon, label, href, onClick, isDivider = false }: any) => {
  if (isDivider) {
    return <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
    >
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const MenuSection = ({ title, children }: any) => (
  <div className="py-2">
    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {title}
    </h3>
    <div className="space-y-0">
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Google-style Sidebar Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center gap-2">
                <div className="gradient-blue p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">MagajiCo</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
              {/* Sports Section */}
              <MenuSection title="Sports">
                <MenuItem
                  icon={Home}
                  label="Home"
                  href={`/${locale}`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={Zap}
                  label="Live Matches"
                  href={`/${locale}/live`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={Trophy}
                  label="Predictions"
                  href={`/${locale}/predictions`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={Star}
                  label="Secrets ⭐"
                  href={`/${locale}/secrets`}
                  onClick={onClose}
                />
              </MenuSection>

              {/* Account Section */}
              <MenuSection title="Account">
                <MenuItem
                  icon={User}
                  label="Profile"
                  href={`/${locale}/profile`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={Settings}
                  label="Settings"
                  href={`/${locale}/settings`}
                  onClick={onClose}
                />
              </MenuSection>

              {/* Support Section */}
              <MenuSection title="Support">
                <MenuItem
                  icon={HelpCircle}
                  label="Help & Support"
                  href={`/${locale}/help`}
                  onClick={onClose}
                />
              </MenuSection>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <MenuItem
                icon={LogOut}
                label="Sign Out"
                href={`/${locale}/logout`}
                onClick={onClose}
              />
              <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="font-medium">MagajiCo • v2.0.0</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
