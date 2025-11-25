'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, AlertCircle, Zap, ChevronDown } from 'lucide-react';

export default function PredictionsPage() {
  const [data, setData] = useState({
    statarea: [],
    scorePred: [],
    myBets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());
  const [expandedSections, setExpandedSections] = useState({
    statarea: true,
    scorePred: true,
    myBets: true,
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [myBets, statarea, scorePred] = await Promise.allSettled([
        fetch(`/api/predictions/mybets`, { signal: AbortSignal.timeout(8000) })
          .then(r => {
            if (!r.ok) throw new Error(`MyBets error: ${r.status}`);
            return r.json();
          }),
        fetch(`/api/predictions/statarea`, { signal: AbortSignal.timeout(8000) })
          .then(r => {
            if (!r.ok) throw new Error(`Statarea error: ${r.status}`);
            return r.json();
          }),
        fetch(`/api/predictions/scoreprediction`, { signal: AbortSignal.timeout(8000) })
          .then(r => {
            if (!r.ok) throw new Error(`ScorePrediction error: ${r.status}`);
            return r.json();
          }),
      ]);

      const processed = {
        myBets: myBets.status === 'fulfilled' ? (myBets.value?.predictions || []) : [],
        statarea: statarea.status === 'fulfilled' ? (statarea.value?.predictions || []) : [],
        scorePred: scorePred.status === 'fulfilled' ? (scorePred.value?.predictions || []) : [],
      };

      const totalPredictions = processed.myBets.length + processed.statarea.length + processed.scorePred.length;
      
      if (totalPredictions === 0 && [myBets, statarea, scorePred].some(r => r.status === 'rejected')) {
        setError('Failed to load some prediction sources. Retry available.');
      }

      setData(processed);
      setRefreshTime(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load predictions: ${errorMsg}`);
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading && Object.values(data).every(arr => arr.length === 0)) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Premium Predictions</h1>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 hover:bg-blue-500 rounded-lg transition disabled:opacity-50"
              title="Refresh predictions"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-blue-100">Predictions from Statarea, ScorePrediction & MyBets</p>
          <div className="text-xs text-blue-200 mt-2">Last updated: {refreshTime}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-800 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={fetchData}
                className="ml-auto px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300 rounded transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Statarea</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.statarea.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Predictions</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">ScorePrediction</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.scorePred.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Predictions</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">MyBets</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.myBets.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Predictions</p>
          </div>
        </div>

        {/* Predictions Sections */}
        <div className="space-y-6">
          {/* Statarea */}
          {data.statarea.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection('statarea')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Statarea ({data.statarea.length})
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                    expandedSections.statarea ? '' : '-rotate-90'
                  }`}
                />
              </button>
              {expandedSections.statarea && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Match</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Prediction</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {data.statarea.slice(0, 15).map((pred: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                          <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                            {pred.home_team} vs {pred.away_team}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pred.prediction_label || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${pred.confidence}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{pred.confidence}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ScorePrediction */}
          {data.scorePred.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleSection('scorePred')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  ScorePrediction ({data.scorePred.length})
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                    expandedSections.scorePred ? '' : '-rotate-90'
                  }`}
                />
              </button>
              {expandedSections.scorePred && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Match</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Prediction</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {data.scorePred.slice(0, 15).map((pred: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                          <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                            {pred.home_team} vs {pred.away_team}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pred.prediction_label || pred.score || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-600" style={{ width: `${pred.confidence}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{pred.confidence}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* No Data State */}
          {data.statarea.length === 0 && data.scorePred.length === 0 && data.myBets.length === 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-semibold">No predictions available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try refreshing or check back later for new predictions
              </p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Refresh Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
