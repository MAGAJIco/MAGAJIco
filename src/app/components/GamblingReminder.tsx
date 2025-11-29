'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamblingReminder() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 rounded-lg shadow-sm"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
            Gamble Responsibly
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
            Only bet what you can afford to lose. Set limits on your betting activities. If you feel you're losing control, seek help immediately.
          </p>
          <a
            href="https://www.ncpg.org.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline mt-2 inline-block"
          >
            Get help →
          </a>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
