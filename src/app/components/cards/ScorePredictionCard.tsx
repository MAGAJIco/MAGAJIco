'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const ScorePredictionCard = ({ predictions = [], isLoading = false, error = null, onRetry }: any) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 dark:text-red-300">ScorePrediction Error</p>
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎯</span>
          <div className="text-left">
            <p className="font-bold">ScorePrediction</p>
            <p className="text-xs opacity-90">{predictions.length} matches</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3 space-y-2 bg-white dark:bg-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : predictions.length > 0 ? (
            <>
              {predictions.slice(0, 15).map((pred: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded border border-purple-100 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {pred.home_team} <span className="text-gray-600 dark:text-gray-400">vs</span> {pred.away_team}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pred.prediction_label || pred.score || '—'}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className="px-2 py-1 bg-purple-500 text-white rounded text-xs font-bold">
                      {(pred.confidence).toFixed(0)}%
                    </div>
                  </div>
                </motion.div>
              ))}
              {predictions.length > 15 && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-2">
                  +{predictions.length - 15} more predictions
                </p>
              )}
            </>
          ) : (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">No predictions available</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
