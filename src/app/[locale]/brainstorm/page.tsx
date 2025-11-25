'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Lightbulb, Brain, Sparkles } from 'lucide-react';
import AIBrainstorming from '@/app/components/AIBrainstorming';
import TopNav from '@/app/components/TopNav';
import BottomNav from '@/app/components/BottomNav';

const COMPONENTS = [
  'Predictions Dashboard',
  'Live Matches Feed',
  'ML Report Dashboard',
  'User Profile',
  'Settings Page',
  'Leaderboard',
  'Odds Display',
  'Betting Recommendations',
  'Social Features',
  'Mobile Experience',
];

export default function BrainstormPage() {
  const [selectedComponent, setSelectedComponent] = useState('Predictions Dashboard');
  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <TopNav />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Brainstorming Hub
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Get AI-powered feature enhancement ideas for any component. Select a component below and let our AI help you innovate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {COMPONENTS.map((component, idx) => (
            <motion.button
              key={component}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedComponent(component);
                setIsBrainstormOpen(true);
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedComponent === component
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">{component}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setIsBrainstormOpen(true)}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Generate Ideas for {selectedComponent}
          <Zap className="w-5 h-5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            How It Works
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
            <li>• Select a component from MagajiCo</li>
            <li>• Add optional context about what you want to improve</li>
            <li>• AI will generate 5 innovative feature ideas</li>
            <li>• Each idea includes priority, effort level, and AI potential score</li>
            <li>• Use insights to plan your next development sprint</li>
          </ul>
        </motion.div>
      </div>

      <AIBrainstorming
        component={selectedComponent}
        isOpen={isBrainstormOpen}
        onClose={() => setIsBrainstormOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
