'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { RefreshCw, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

interface Competition {
  name: string;
  flag: string;
  country: string;
  matches: Match[];
  live: number;
}

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalLive, setTotalLive] = useState(0);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/live`, { timeout: 5000 });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      const predictions = data.predictions || [];
      
      const groupedByLeague: { [key: string]: Competition } = {};
      let liveCount = 0;

      predictions.forEach((pred: any) => {
        const league = pred.league || pred.sport || 'Other';
        const isLive = pred.status === 'live' || pred.status === 'in_progress';
        
        if (isLive) liveCount++;

        if (!groupedByLeague[league]) {
          groupedByLeague[league] = {
            name: league,
            flag: '⚽',
            country: league,
            matches: [],
            live: 0,
          };
        }

        groupedByLeague[league].matches.push({
          id: pred.id || `${pred.home_team || 'A'}-${pred.away_team || 'B'}`,
          homeTeam: pred.home_team || pred.homeTeam || 'Team A',
          awayTeam: pred.away_team || pred.awayTeam || 'Team B',
          league: league,
          time: pred.game_time || pred.time || '14:30',
          status: pred.status || 'scheduled',
          homeScore: pred.home_score,
          awayScore: pred.away_score,
        });

        if (isLive) {
          groupedByLeague[league].live++;
        }
      });

      const competitionsArray = Object.values(groupedByLeague).sort((a, b) => b.live - a.live);
      setCompetitions(competitionsArray);
      setTotalLive(liveCount);
    } catch (err) {
      console.log('Using sample data');
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const sampleCompetitions: Competition[] = [
      {
        name: 'Champions League',
        flag: '🇪🇺',
        country: 'EUROPE',
        live: 1,
        matches: [
          { id: '1', homeTeam: 'Manchester City', awayTeam: 'Real Madrid', league: 'Champions League', time: '14:30', status: 'live', homeScore: 2, awayScore: 1 },
          { id: '2', homeTeam: 'Bayern Munich', awayTeam: 'PSG', league: 'Champions League', time: '15:00', status: 'scheduled' },
        ],
      },
      {
        name: 'Premier League',
        flag: '🇬🇧',
        country: 'ENGLAND',
        live: 0,
        matches: [
          { id: '3', homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League', time: '16:00', status: 'scheduled' },
          { id: '4', homeTeam: 'Liverpool', awayTeam: 'Man United', league: 'Premier League', time: '17:30', status: 'scheduled' },
        ],
      },
      {
        name: 'La Liga',
        flag: '🇪🇸',
        country: 'SPAIN',
        live: 0,
        matches: [
          { id: '5', homeTeam: 'Barcelona', awayTeam: 'Atletico Madrid', league: 'La Liga', time: '17:00', status: 'scheduled' },
        ],
      },
    ];
    setCompetitions(sampleCompetitions);
    setTotalLive(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header - FlashScore Style */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">MagajiCo</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMatches}
                disabled={loading}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link href={`/${locale}/predictions`} className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition font-medium">
                Premium
              </Link>
            </div>
          </div>
          <p className="text-blue-100">Live scores • Fixtures • Predictions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLive}</p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Competitions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitions.length}</p>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <div className="w-6 h-6 text-green-600 text-lg">✓</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">90.3%</p>
            </div>
          </div>
        </motion.div>

        {/* Matches */}
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : competitions.length > 0 ? (
          <div className="space-y-6">
            {competitions.map((comp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* League Header */}
                <button
                  onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                  className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{comp.flag}</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">{comp.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{comp.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comp.live > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">{comp.live} Live</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition" />
                  </div>
                </button>

                {/* Matches */}
                <div className="space-y-1 mt-2">
                  {comp.matches.slice(0, 5).map((match, midx) => (
                    <motion.div
                      key={midx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + midx * 0.05 }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                        match.status === 'live'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {match.homeTeam} <span className="text-gray-600 dark:text-gray-400">vs</span> {match.awayTeam}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{match.time}</div>
                      </div>

                      <div className="text-right">
                        {match.status === 'live' ? (
                          <div>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                              {match.homeScore} - {match.awayScore}
                            </div>
                            <div className="text-xs text-red-600 font-semibold animate-pulse">LIVE</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{match.time}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {comp.matches.length > 5 && (
                    <button
                      onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                      className="w-full text-center py-2 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
                    >
                      View all {comp.matches.length} matches →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No matches available</p>
          </div>
        )}
      </div>
    </div>
  );
}
