'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Clock, TrendingUp, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

export default function LivePredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchPredictions();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPredictions, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchPredictions = async () => {
    try {
      setError(null);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/live`);
      
      if (!response.ok) throw new Error('Failed to fetch predictions');
      
      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'text-green-600 dark:text-green-400';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getConfidenceBg = (confidence) => {
    if (confidence >= 85) return 'bg-green-100 dark:bg-green-900/30';
    if (confidence >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-orange-100 dark:bg-orange-900/30';
  };

  const getPredictionLabel = (pred) => {
    if (pred === '1') return 'Home Win';
    if (pred === 'X') return 'Draw';
    if (pred === '2') return 'Away Win';
    return pred;
  };

  const getPredictionEmoji = (pred) => {
    if (pred === '1') return '🏠';
    if (pred === 'X') return '🤝';
    if (pred === '2') return '✈️';
    return '⚽';
  };

  const filteredPredictions = predictions.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'high') return p.confidence >= 85;
    if (filter === 'medium') return p.confidence >= 70 && p.confidence < 85;
    if (filter === 'live') return p.status === 'live';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Live Match Predictions
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered predictions with {predictions.length} matches
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchPredictions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Matches ({predictions.length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'high'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              High Confidence (85%+)
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Medium Confidence (70-84%)
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'live'
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🔴 Live Now
            </button>
            
            <label className="ml-auto flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh
            </label>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && predictions.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {predictions.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-gray-400">High Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {predictions.filter(p => p.confidence >= 85).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
                <p className="text-2xl font-bold text-blue-600">
                  {predictions.length > 0
                    ? Math.round(predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictions.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                <p className="text-2xl font-bold text-red-600">
                  {predictions.filter(p => p.status === 'live').length}
                </p>
              </div>
            </div>

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPredictions.map((prediction, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-100">
                        {prediction.league}
                      </span>
                      {prediction.status === 'live' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-300">
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                    
                    {/* Teams */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">
                          {prediction.home_team}
                        </span>
                        {prediction.home_score !== null && (
                          <span className="text-2xl font-bold text-white">
                            {prediction.home_score}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">
                          {prediction.away_team}
                        </span>
                        {prediction.away_score !== null && (
                          <span className="text-2xl font-bold text-white">
                            {prediction.away_score}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prediction Details */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {prediction.game_time}
                      </span>
                    </div>

                    {prediction.prediction && (
                      <div className={`${getConfidenceBg(prediction.confidence)} rounded-lg p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getPredictionEmoji(prediction.prediction)}
                            </span>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                AI Prediction
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {getPredictionLabel(prediction.prediction)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Confidence
                            </p>
                            <p className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                              {prediction.confidence}%
                            </p>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              prediction.confidence >= 85
                                ? 'bg-green-500'
                                : prediction.confidence >= 70
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {prediction.odds && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Odds:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {prediction.odds.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPredictions.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No predictions found with current filters
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Matches
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}