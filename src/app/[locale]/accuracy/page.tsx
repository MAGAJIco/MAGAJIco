'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccuracyRecord {
  timestamp: string;
  prediction_id: string;
  match: string;
  predicted: string;
  actual: string;
  correct: boolean;
  odds: number;
}

interface AccuracyStats {
  total_predictions_evaluated: number;
  correct: number;
  incorrect: number;
  accuracy_percentage: number;
  recent_records: AccuracyRecord[];
}

export default function AccuracyPage() {
  const [stats, setStats] = useState<AccuracyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/accuracy/stats');
      if (!res.ok) throw new Error('Failed to fetch accuracy stats');

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const accuracyColor =
    stats && stats.accuracy_percentage >= 70
      ? 'from-green-500 to-green-600'
      : stats && stats.accuracy_percentage >= 50
        ? 'from-yellow-500 to-yellow-600'
        : 'from-red-500 to-red-600';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${accuracyColor} p-3 rounded-lg`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Prediction Accuracy
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track how well our ML model predicts real match outcomes
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={loading}
              className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}

        {/* Overall Accuracy Card */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 p-8 rounded-lg bg-gradient-to-br ${accuracyColor} text-white shadow-xl`}
          >
            <p className="text-lg opacity-90 mb-2">Overall Accuracy</p>
            <p className="text-6xl font-bold mb-4">{stats.accuracy_percentage}%</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="opacity-75">Correct</p>
                <p className="text-2xl font-semibold">{stats.correct}</p>
              </div>
              <div>
                <p className="opacity-75">Incorrect</p>
                <p className="text-2xl font-semibold">{stats.incorrect}</p>
              </div>
              <div>
                <p className="opacity-75">Evaluated</p>
                <p className="text-2xl font-semibold">{stats.total_predictions_evaluated}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct Predictions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.correct}</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect Predictions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.incorrect}</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Evaluated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_predictions_evaluated}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Recent Records */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Results
            </h2>

            {stats.recent_records.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No accuracy records yet. Start logging prediction results to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.recent_records.map((record, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className={`p-4 rounded-lg border ${
                      record.correct
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {record.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                          <p className="font-semibold text-gray-900 dark:text-white">{record.match}</p>
                        </div>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Predicted</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{record.predicted}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Actual</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{record.actual}</p>
                          </div>
                          {record.odds > 0 && (
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Odds</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{record.odds.toFixed(2)}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Time</p>
                            <p className="font-semibold text-gray-900 dark:text-white text-xs">
                              {new Date(record.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          record.correct
                            ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                            : 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                        }`}>
                          {record.correct ? '✓ Correct' : '✗ Wrong'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>📊 How it Works:</strong> When match results become available, log them using the `/api/accuracy/log` endpoint to automatically calculate prediction accuracy. This helps track ML model performance over time.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
