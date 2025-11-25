'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader, TrendingUp, AlertCircle, Copy, Check } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  userBenefit: string;
  implementation: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  aiPotential: number;
}

interface AIBrainstormingProps {
  component: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIBrainstorming({ component, isOpen, onClose }: AIBrainstormingProps) {
  const [context, setContext] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  const handleBrainstorm = async () => {
    setLoading(true);
    setError('');
    setFeatures([]);

    try {
      const response = await fetch(`/api/ai/brainstorm?component=${component}&context=${encodeURIComponent(context)}`);
      if (!response.ok) throw new Error('Failed to brainstorm');

      const data = await response.json();
      setFeatures(Array.isArray(data.features) ? data.features : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Brainstorming: {component}
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Context
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., 'Focus on mobile experience' or 'Integrate with user preferences'"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              onClick={handleBrainstorm}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Brainstorming Ideas...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Ideas
                </>
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 dark:text-red-200">{error}</div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Suggested Features
                </h3>

                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {feature.title}
                      </h4>
                      <button
                        onClick={() => copyToClipboard(feature.title, idx)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied === idx ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {feature.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">User Benefit:</span>
                        <p className="text-gray-600 dark:text-gray-400">{feature.userBenefit}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Implementation:</span>
                        <p className="text-gray-600 dark:text-gray-400">{feature.implementation}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(feature.priority)}`}>
                        {feature.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border border-gray-300 dark:border-gray-600 ${getEffortColor(feature.effort)}`}>
                        {feature.effort.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                        🤖 AI Potential: {feature.aiPotential}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
