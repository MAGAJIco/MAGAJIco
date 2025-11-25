'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface StatAreaPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  confidence: number;
  odds?: string;
}

export const StatAreaCard = ({ predictions = [], isLoading = false, error = null, onRetry }: any) => {
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
            <p className="font-semibold text-red-900 dark:text-red-300">Statarea Error</p>
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
        className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div className="text-left">
            <p className="font-bold">Statarea Predictions</p>
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
              <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : predictions.length > 0 ? (
            <>
              {predictions.slice(0, 15).map((pred: StatAreaPrediction, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 rounded border border-orange-100 dark:border-orange-800/30 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {pred.homeTeam} <span className="text-gray-600 dark:text-gray-400">vs</span> {pred.awayTeam}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pred.prediction}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-bold">
                      {(pred.confidence * 100).toFixed(0)}%
                    </div>
                    {pred.odds && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Odds: {pred.odds}</p>
                    )}
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
