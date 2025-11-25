'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Zap, Trophy, Star, Settings, HelpCircle, User, LogOut, Database, BookOpen, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import AIBrainstorming from './AIBrainstorming';

interface EnhancedMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Prediction {
  home_team: string;
  away_team: string;
  prediction: string;
  confidence: number;
  source: string;
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
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [brainstormOpen, setBrainstormOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Predictions Dashboard');

  const handleBrainstorm = (component: string) => {
    setSelectedComponent(component);
    setBrainstormOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      fetchPredictions();
    }
  }, [isOpen]);

  const fetchPredictions = async () => {
    setPredictionsLoading(true);
    try {
      const myBetsRes = await fetch('/api/predictions/mybets', { signal: AbortSignal.timeout(5000) }).catch(() => null);
      const statAreaRes = await fetch('/api/predictions/statarea/high-confidence?min_confidence=78', { signal: AbortSignal.timeout(5000) }).catch(() => null);
      
      const allPreds: Prediction[] = [];
      
      if (myBetsRes?.ok) {
        const data = await myBetsRes.json();
        allPreds.push(...(data.predictions || []).slice(0, 2));
      }
      
      if (statAreaRes?.ok) {
        const data = await statAreaRes.json();
        allPreds.push(...(data.predictions || []).slice(0, 2));
      }
      
      setPredictions(allPreds.slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setPredictionsLoading(false);
    }
  };

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

              {/* Data & Analytics Section */}
              <MenuSection title="Data & Analytics">
                <MenuItem
                  icon={TrendingUp}
                  label="Prediction Accuracy"
                  href={`/${locale}/accuracy`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={Database}
                  label="MongoDB Status"
                  href={`/${locale}/mongodb`}
                  onClick={onClose}
                />
                <MenuItem
                  icon={BookOpen}
                  label="Training Data"
                  href={`/${locale}/training-data`}
                  onClick={onClose}
                />
              </MenuSection>

              {/* AI & Innovation Section */}
              <MenuSection title="🤖 AI & Innovation">
                <MenuItem
                  icon={Lightbulb}
                  label="Brainstorm Hub"
                  href={`/${locale}/brainstorm`}
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

              {/* Premium Secrets Section */}
              <MenuSection title="🔥 Premium Secrets">
                {predictionsLoading ? (
                  <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    Loading predictions...
                  </div>
                ) : predictions.length > 0 ? (
                  <div className="space-y-2 px-2">
                    {predictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {pred.home_team} vs {pred.away_team}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {pred.prediction}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            pred.confidence >= 85
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : pred.confidence >= 78
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {pred.confidence}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {pred.source}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                    No predictions available
                  </div>
                )}
                <Link
                  href={`/${locale}/predictions`}
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-lg mt-2"
                >
                  <Star className="w-4 h-4" />
                  View All Predictions →
                </Link>
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

          <AIBrainstorming
            component={selectedComponent}
            isOpen={brainstormOpen}
            onClose={() => setBrainstormOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
