'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function PrivatePredictionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [refreshTime, setRefreshTime] = useState('');
  const [data, setData] = useState({
    myBets: [],
    statarea: [],
    scorePred: [],
    secretMatches: [],
    weekCalendar: {},
  });
  const [loadingState, setLoadingState] = useState({
    myBets: true,
    statarea: true,
    scorePred: true,
    week: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRefreshTime(new Date().toLocaleTimeString());
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setError(null);
      const apiBaseUrl = getApiBaseUrl();
      const [myBets, statarea, scorePred, weekCal] = await Promise.all([
        fetchWithTimeout(`${apiBaseUrl}/api/predictions/mybets`),
        fetchWithTimeout(`${apiBaseUrl}/api/predictions/statarea`),
        fetchWithTimeout(`${apiBaseUrl}/api/predictions/scoreprediction`),
        fetchWithTimeout(`${apiBaseUrl}/api/predictions/flashscore-odds?max_odds=1.16`),
      ]);

      const myBetsPreds = myBets?.predictions || [];
      const statareaPreds = statarea?.predictions || [];
      const scorePreds = scorePred?.predictions || [];
      const secretMatches = calculateSecretMatches(statareaPreds, scorePreds, myBetsPreds);

      setData({
        myBets: myBetsPreds,
        statarea: statareaPreds,
        scorePred: scorePreds,
        secretMatches,
        weekCalendar: weekCal?.week_calendar || {},
      });
      setRefreshTime(new Date().toLocaleTimeString());
      setLoadingState({ myBets: false, statarea: false, scorePred: false, week: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load predictions');
      setLoadingState({ myBets: false, statarea: false, scorePred: false, week: false });
    }
  };

  const fetchWithTimeout = async (url: string, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      console.error(`Failed to fetch ${url}:`, err);
      return null;
    }
  };

  const calculateSecretMatches = (statarea: any[], scorePred: any[], myBets: any[]) => {
    const matchMap = new Map();
    const normalize = (t1: string, t2: string) => {
      const sorted = [t1?.toLowerCase().trim(), t2?.toLowerCase().trim()].sort();
      return `${sorted[0]}|${sorted[1]}`;
    };

    [...statarea, ...scorePred, ...myBets].forEach((pred) => {
      const key = normalize(pred.home_team || '', pred.away_team || '');
      const existing = matchMap.get(key) || { teams: pred.teams, sources: [], count: 0 };
      const source = pred.source || (statarea.includes(pred) ? 'Statarea' : scorePred.includes(pred) ? 'ScorePrediction' : 'MyBets');
      if (!existing.sources.includes(source)) {
        existing.sources.push(source);
        existing.count += 1;
      }
      matchMap.set(key, existing);
    });

    return Array.from(matchMap.values())
      .filter((m) => m.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.username) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Lock size={48} className="mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Premium Access Required</h1>
          <p className="text-gray-600 mb-6">Sign in with Google to access advanced predictions from 4+ trusted sources</p>
          <Link href="/en/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors block">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 pb-32">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-14 z-30 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
              <Lock size={28} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">Premium Predictions</h1>
              <p className="text-slate-300 text-sm">Welcome, {user?.firstName || user?.username || 'User'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap size={14} />
            <span>Auto-refreshing every 60 seconds • Last updated: {refreshTime}</span>
          </div>
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div>
              <p className="font-semibold text-red-800">Unable to load some predictions</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={fetchAllData} className="ml-auto text-red-600 hover:text-red-800 font-semibold">
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Secret Matches Section */}
        {data.secretMatches.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl animate-pulse">🔮</span>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">MagajiCo Secret Matches</h2>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Matches appearing in multiple expert sources</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.secretMatches.map((match, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="rounded-xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-white/90">🎯 EXPERT CONSENSUS</p>
                      <p className="text-sm font-bold mt-2 line-clamp-2">{match.teams}</p>
                    </div>
                    <span className="text-xl font-bold">{match.count === 3 ? '⭐⭐⭐' : '⭐⭐'}</span>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-xs text-white/80 mb-1">Recommended by:</p>
                    <div className="flex flex-wrap gap-1">
                      {match.sources.map((src) => (
                        <span key={src} className="bg-white/30 px-2 py-1 rounded text-xs font-semibold">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Statarea Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-gray-900">Statarea Analytics</h2>
            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" />
          </div>
          {loadingState.statarea ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin text-purple-500" size={32} />
            </div>
          ) : data.statarea.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.statarea.slice(0, 6).map((pred, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-xs font-bold text-purple-100 mb-1">Match Probability</p>
                  <p className="text-sm font-bold line-clamp-2 mb-3">{pred.teams}</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/20 rounded p-2 text-center">
                      <p className="text-xs text-white/70">Home</p>
                      <p className="font-bold">{pred.home_pct}%</p>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-center">
                      <p className="text-xs text-white/70">Draw</p>
                      <p className="font-bold">{pred.draw_pct}%</p>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-center">
                      <p className="text-xs text-white/70">Away</p>
                      <p className="font-bold">{pred.away_pct}%</p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded px-3 py-1 text-sm font-bold text-center">{pred.confidence}% Confidence</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No predictions available from Statarea</p>
            </div>
          )}
        </motion.section>

        {/* ScorePrediction Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚽</span>
            <h2 className="text-xl font-bold text-gray-900">Score Predictions</h2>
            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
          </div>
          {loadingState.scorePred ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin text-green-500" size={32} />
            </div>
          ) : data.scorePred.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.scorePred.slice(0, 6).map((pred, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-xs font-bold text-green-100 mb-1">Predicted Score</p>
                  <p className="text-sm font-bold line-clamp-2 mb-3">{pred.teams}</p>
                  <div className="bg-black/20 rounded-lg p-4 text-center mb-3">
                    <p className="text-3xl font-bold text-yellow-300">{pred.score || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/20 rounded p-2 text-center">
                      <p className="text-xs text-white/70">Home %</p>
                      <p className="font-bold">{pred.home_goal_prob}%</p>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-center">
                      <p className="text-xs text-white/70">Away %</p>
                      <p className="font-bold">{pred.away_goal_prob}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No score predictions available</p>
            </div>
          )}
        </motion.section>

        {/* MyBets Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-bold text-gray-900">MyBets.Today</h2>
            <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-pink-500 to-pink-600" />
          </div>
          {loadingState.myBets ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin text-pink-500" size={32} />
            </div>
          ) : data.myBets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.myBets.slice(0, 6).map((pred, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-xs font-bold text-pink-100 mb-1">MyBets Prediction</p>
                  <p className="text-sm font-bold line-clamp-2 mb-3">{pred.teams}</p>
                  <p className="text-lg font-bold mb-3">{pred.prediction_label}</p>
                  <p className="text-xs text-white/80">
                    Odds: <span className="font-bold">{pred.odds?.toFixed(2) || 'N/A'}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No predictions from MyBets available</p>
            </div>
          )}
        </motion.section>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mt-12 text-center">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <TrendingUp size={40} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Always Up to Date</h2>
            <p className="text-slate-300 mb-4">Data refreshes automatically every 60 seconds</p>
            <p className="text-xs text-slate-400">🔐 All predictions are for personal analysis only</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
