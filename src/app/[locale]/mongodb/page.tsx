'use client';

import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle, XCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface MongoDBStatus {
  status: string;
  mongodb_connected: boolean;
  database: string | null;
  storage_methods: string[];
  collections: {
    predictions: number;
    odds: number;
    matches: number;
  };
  timestamp: string;
}

interface MongoDBStats {
  status: string;
  mongodb_connected: boolean;
  storage_file: string;
  dual_storage: boolean;
  mongodb_collections?: {
    predictions: number;
    odds: number;
    matches: number;
  };
  total_mongodb_records?: number;
  timestamp: string;
}

const StatBox = ({ icon: Icon, label, value, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-lg ${color} shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90">{label}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <Icon className="w-8 h-8 opacity-50" />
    </div>
  </motion.div>
);

export default function MongoDBPage() {
  const [status, setStatus] = useState<MongoDBStatus | null>(null);
  const [stats, setStats] = useState<MongoDBStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusRes, statsRes] = await Promise.all([
        fetch('/api/mongodb/status'),
        fetch('/api/mongodb/stats'),
      ]);

      if (!statusRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch MongoDB data');
      }

      const statusData = await statusRes.json();
      const statsData = await statsRes.json();

      setStatus(statusData);
      setStats(statsData);
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
        <div className="max-w-4xl mx-auto">
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-blue p-3 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  MongoDB Status
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Centralized data storage & statistics
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

        {/* Connection Status */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connection Status
              </h2>
              <div className="flex items-center gap-2">
                {status.mongodb_connected ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                      Using JSON Storage
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Database</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {status.database || 'N/A (JSON Mode)'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Storage Methods</p>
                <div className="mt-1 flex gap-2">
                  {status.storage_methods.map((method, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collections Overview */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <StatBox
              icon={Database}
              label="Predictions"
              value={status.collections.predictions}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatBox
              icon={Database}
              label="Odds"
              value={status.collections.odds}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatBox
              icon={Database}
              label="Matches"
              value={status.collections.matches}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
          </motion.div>
        )}

        {/* Detailed Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Detailed Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Dual Storage Active</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.dual_storage ? '✅ Yes' : '❌ No'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Storage File</span>
                <span className="font-mono text-sm text-gray-900 dark:text-gray-200">
                  {stats.storage_file}
                </span>
              </div>

              {stats.mongodb_collections && (
                <>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      MongoDB Collections
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Predictions</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {stats.mongodb_collections.predictions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Odds</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {stats.mongodb_collections.odds}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Matches</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {stats.mongodb_collections.matches}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Total MongoDB Records
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {stats.total_mongodb_records}
                    </span>
                  </div>
                </>
              )}

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(stats.timestamp).toLocaleString()}
              </div>
            </div>
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
            <strong>ℹ️ Info:</strong> MagajiCo uses a dual-storage system. Data is stored in both MongoDB (when available) and JSON for reliability. If MongoDB is unavailable, the system automatically switches to JSON-only storage.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
