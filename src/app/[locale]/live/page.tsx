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
      // Use sport predictions endpoint
      const response = await fetch(`/api/predictions/sport/soccer`);
      const data = await response.json();
      const matches = data.matches || [];

      const liveMatches = matches
        .filter((m: any) => m.status === 'live' || m.status === 'in_progress')
        .map((m: any) => ({
          id: m.id,
          sport: 'Soccer',
          homeTeam: m.home_team || 'Team A',
          awayTeam: m.away_team || 'Team B',
          homeScore: m.home_score || 0,
          awayScore: m.away_score || 0,
          status: 'live',
          league: m.league || 'League',
          time: m.game_time || 'Live',
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

      {/* Matches - Grouped by League */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-6">
            {/* Group matches by league */}
            {Object.entries(
              filtered.reduce((acc, match) => {
                if (!acc[match.league]) acc[match.league] = [];
                acc[match.league].push(match);
                return acc;
              }, {} as Record<string, LiveMatch[]>)
            ).map(([league, leagueMatches], leagueIdx) => (
              <motion.div
                key={league}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: leagueIdx * 0.1 }}
              >
                {/* League Header */}
                <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 px-4 py-2 rounded-lg mb-3 border border-red-200 dark:border-red-800/50">
                  <p className="font-bold text-red-900 dark:text-red-300">{league}</p>
                </div>

                {/* Matches in this league */}
                <div className="space-y-2">
                  {leagueMatches.map((match, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: leagueIdx * 0.1 + idx * 0.05 }}
                      className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-900/50 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {match.homeTeam}
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {match.awayTeam}
                          </div>
                        </div>

                        <div className="text-right mx-4">
                          <div className="font-bold text-3xl text-gray-900 dark:text-white leading-none">
                            {match.homeScore}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 my-1">-</div>
                          <div className="font-bold text-3xl text-gray-900 dark:text-white leading-none">
                            {match.awayScore}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="px-3 py-2 bg-red-500 text-white rounded font-bold text-sm animate-pulse whitespace-nowrap">
                            ● LIVE
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
