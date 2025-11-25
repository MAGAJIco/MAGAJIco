'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, AlertCircle, Zap, Star } from 'lucide-react';

export default function PredictionsPage() {
  const [data, setData] = useState({
    statarea: [],
    scorePred: [],
    myBets: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [myBets, statarea, scorePred] = await Promise.all([
        fetch(`/api/predictions/mybets`).then(r => r.json()).catch(() => ({ predictions: [] })),
        fetch(`/api/predictions/statarea`).then(r => r.json()).catch(() => ({ predictions: [] })),
        fetch(`/api/predictions/scoreprediction`).then(r => r.json()).catch(() => ({ predictions: [] })),
      ]);

      setData({
        myBets: myBets?.predictions || [],
        statarea: statarea?.predictions || [],
        scorePred: scorePred?.predictions || [],
      });
      setRefreshTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Premium Predictions</h1>
          </div>
          <p className="text-blue-100">Predictions from Statarea, ScorePrediction & MyBets</p>
          <div className="text-xs text-blue-200 mt-2">Last updated: {refreshTime}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Refresh Button */}
        <div className="mb-8">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Statarea Predictions */}
        {data.statarea.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Statarea ({data.statarea.length})</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                    {data.statarea.slice(0, 10).map((pred: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{pred.home_team} vs {pred.away_team}</td>
                        <td className="px-4 py-3">{pred.prediction_label || pred.prediction}</td>
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
            </div>
          </div>
        )}

        {/* ScorePrediction */}
        {data.scorePred.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">ScorePrediction ({data.scorePred.length})</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                    {data.scorePred.slice(0, 10).map((pred: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{pred.home_team} vs {pred.away_team}</td>
                        <td className="px-4 py-3">{pred.prediction_label || pred.score}</td>
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
            </div>
          </div>
        )}

        {/* No Data */}
        {data.statarea.length === 0 && data.scorePred.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-semibold">No predictions available</p>
          </div>
        )}
      </div>
    </div>
  );
}
