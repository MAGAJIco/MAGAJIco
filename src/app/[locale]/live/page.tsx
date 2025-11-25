'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, Filter, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api';

interface LiveMatch {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
  time: string;
}

type SportFilter = 'all' | 'Football' | 'Basketball' | 'Baseball' | 'Soccer';

export default function LivePage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sport, setSport] = useState<SportFilter>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, [sport]);

  const fetchLive = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/live`);
      const data = await response.json();
      const preds = data.predictions || [];

      const liveMatches = preds
        .filter((p: any) => p.status === 'live' || p.status === 'in_progress')
        .map((p: any) => ({
          id: p.id,
          sport: p.sport || 'Football',
          homeTeam: p.home_team || 'Team A',
          awayTeam: p.away_team || 'Team B',
          homeScore: p.home_score || 0,
          awayScore: p.away_score || 0,
          status: 'live',
          league: p.league || 'League',
          time: p.game_time || 'Live',
        }));

      setMatches(liveMatches);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching live matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sport === 'all' ? matches : matches.filter(m => m.sport === sport);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-900 dark:to-red-800 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Live Now</h1>
              {filtered.length > 0 && (
                <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold ml-2">{filtered.length}</span>
              )}
            </div>
            <button
              onClick={fetchLive}
              disabled={loading}
              className="p-2 hover:bg-red-500 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-red-100 text-sm">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Sport Filter */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          {(['all', 'Football', 'Basketball', 'Baseball', 'Soccer'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                sport === s
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {s === 'all' ? 'All Sports' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Matches */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((match, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">{match.league}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {match.homeTeam} <span className="text-gray-600 dark:text-gray-400">vs</span> {match.awayTeam}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-2xl text-gray-900 dark:text-white">
                      {match.homeScore} - {match.awayScore}
                    </div>
                    <div className="text-xs text-red-600 font-bold animate-pulse mt-1">● LIVE</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3 text-4xl">⚽</div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold">No live matches right now</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Check back soon for upcoming matches</p>
          </div>
        )}
      </div>
    </div>
  );
}
