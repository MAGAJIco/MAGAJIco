'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, TrendingUp, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrainingData {
  total_predictions: number;
  total_odds_logs: number;
  total_matches: number;
  predictions: any[];
  odds: any[];
  matches: any[];
  metadata: any;
  source: string;
}

interface TrainingSummary {
  total_logs: number;
  predictions_logged: number;
  odds_logged: number;
  matches_logged: number;
  total_entries: number;
  storage_file: string;
  mongodb_connected: boolean;
  created: string;
}

export default function TrainingDataPage() {
  const [summary, setSummary] = useState<TrainingSummary | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'predictions' | 'odds'>('summary');

  const fetchData = async () => {
    try {
      setLoading(true);

      const [summaryRes, trainingRes] = await Promise.all([
        fetch('/api/training/summary'),
        fetch('/api/training/data'),
      ]);

      if (!summaryRes.ok || !trainingRes.ok) {
        throw new Error('Failed to fetch training data');
      }

      const summaryData = await summaryRes.json();
      const trainingData = await trainingRes.json();

      setSummary(summaryData.summary);
      setTrainingData(trainingData.training_data);
    } catch (err) {
      console.error('Failed to fetch training data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const downloadJSON = () => {
    if (!trainingData) return;
    const dataStr = JSON.stringify(trainingData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'magajico-training-data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="gradient-purple p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Training Data Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  All logged predictions, odds, and matches for model training
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                disabled={loading}
                className="p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadJSON}
                className="p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Logs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {summary.total_logs}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Predictions</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {summary.predictions_logged}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Odds Logs</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {summary.odds_logged}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
                {summary.mongodb_connected ? '✅ MongoDB + JSON' : '📄 JSON Only'}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(['summary', 'predictions', 'odds'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={activeTab}
        >
          {activeTab === 'summary' && summary && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Summary Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total Entries</span>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {summary.total_entries}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Predictions Logged</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {summary.predictions_logged}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Odds Logged</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {summary.odds_logged}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Matches Logged</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {summary.matches_logged}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Storage File</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-gray-200">
                    {summary.storage_file}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(summary.created).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && trainingData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Predictions ({trainingData.predictions.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {trainingData.predictions.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No predictions logged yet</p>
                ) : (
                  trainingData.predictions.slice(0, 10).map((pred, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {pred.match}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Prediction: {pred.prediction} ({pred.confidence?.toFixed(2)}%)
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(pred.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'odds' && trainingData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Odds ({trainingData.odds.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {trainingData.odds.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No odds logged yet</p>
                ) : (
                  trainingData.odds.slice(0, 10).map((odd, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {odd.source} - {odd.league}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {odd.total_matches} matches logged
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(odd.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
        >
          <p className="text-sm text-purple-900 dark:text-purple-200">
            <strong>📊 About Training Data:</strong> All predictions, odds, and matches are automatically logged to train and improve the ML model. Download the data in JSON format to retrain your models or perform custom analysis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
