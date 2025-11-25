'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RefreshCw, ChevronLeft, Trophy, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
}

export default function MatchesPage() {
  const searchParams = useSearchParams();
  const league = searchParams?.get('league') || 'All Matches';
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'today' | 'tomorrow'>('all');

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [league, filter]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // Use sport predictions endpoint
      const response = await fetch(`/api/predictions/sport/soccer`);
      const data = await response.json();
      const espnMatches = data.matches || [];

      const matches = espnMatches.map((m: any) => ({
        id: m.id,
        homeTeam: m.home_team || 'Team A',
        awayTeam: m.away_team || 'Team B',
        league: m.league || 'League',
        time: m.game_time || '14:30',
        status: m.status || 'scheduled',
        homeScore: m.home_score,
        awayScore: m.away_score,
      }));

      setMatches(matches);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = matches.filter(m => {
    if (league !== 'All Matches' && m.league !== league) return false;
    if (filter === 'live' && m.status !== 'live') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-800 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ChevronLeft className="w-6 h-6 cursor-pointer hover:opacity-70" onClick={() => window.history.back()} />
            <Trophy className="w-6 h-6" />
            <h1 className="text-3xl font-bold flex-1">{league}</h1>
            <button
              onClick={fetchMatches}
              disabled={loading}
              className="p-2 hover:bg-indigo-500 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-indigo-100">{filtered.length} matches available</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2">
          {(['all', 'live', 'today', 'tomorrow'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Matches List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-1">
            {filtered.map((match, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-center justify-between px-4 py-4 rounded-lg border cursor-pointer hover:shadow-sm transition ${
                  match.status === 'live'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
                    {match.time}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-lg">
                    {match.homeTeam} <span className="text-gray-600 dark:text-gray-400">vs</span> {match.awayTeam}
                  </div>
                </div>

                <div className="text-right">
                  {match.status === 'live' ? (
                    <div>
                      <div className="font-bold text-xl text-gray-900 dark:text-white">
                        {match.homeScore} - {match.awayScore}
                      </div>
                      <div className="text-xs text-red-600 font-bold">● LIVE</div>
                    </div>
                  ) : match.homeScore !== undefined && match.awayScore !== undefined ? (
                    <div className="font-bold text-xl text-gray-900 dark:text-white">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{match.time}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3 text-4xl">📊</div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}
