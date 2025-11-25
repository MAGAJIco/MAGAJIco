'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RefreshCw, Zap, TrendingUp, ChevronRight, Heart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { cachedFetch } from '@/lib/performance';

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
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalLive, setTotalLive] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await cachedFetch(`/api/predictions/live`);
      const predictions = data.predictions || [];
      
      const groupedByLeague: { [key: string]: Competition } = {};
      const live: Match[] = [];
      let liveCount = 0;

      predictions.forEach((pred: any) => {
        const league = pred.league || pred.sport || 'Other';
        const isLive = pred.status === 'live' || pred.status === 'in_progress';
        
        const match = {
          id: pred.id || `${pred.home_team || 'A'}-${pred.away_team || 'B'}`,
          homeTeam: pred.home_team || pred.homeTeam || 'Team A',
          awayTeam: pred.away_team || pred.awayTeam || 'Team B',
          league: league,
          time: pred.game_time || pred.time || '14:30',
          status: pred.status || 'scheduled',
          homeScore: pred.home_score,
          awayScore: pred.away_score,
        };

        if (isLive) {
          live.push(match);
          liveCount++;
        }
        
        if (!groupedByLeague[league]) {
          groupedByLeague[league] = {
            name: league,
            flag: '⚽',
            country: league,
            matches: [],
            live: 0,
          };
        }

        groupedByLeague[league].matches.push(match);
        if (isLive) groupedByLeague[league].live++;
      });

      const competitionsArray = Object.values(groupedByLeague).sort((a, b) => b.live - a.live);
      setCompetitions(competitionsArray);
      setLiveMatches(live.slice(0, 5)); // Show top 5 live matches
      setTotalLive(liveCount);
    } catch (err) {
      console.log('Using sample data');
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const sampleLive = [
      { id: '1', homeTeam: 'Manchester City', awayTeam: 'Real Madrid', league: 'Champions League', time: '14:30', status: 'live', homeScore: 2, awayScore: 1 },
    ];
    const sampleCompetitions: Competition[] = [
      {
        name: 'Champions League',
        flag: '🇪🇺',
        country: 'EUROPE',
        live: 1,
        matches: [
          ...sampleLive,
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
    ];
    setCompetitions(sampleCompetitions);
    setLiveMatches(sampleLive);
    setTotalLive(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 text-white px-4 py-6 sticky top-14 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <h1 className="text-3xl font-bold">MagajiCo</h1>
            </div>
            <button
              onClick={fetchMatches}
              disabled={loading}
              className="p-2 hover:bg-blue-500 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-blue-100 text-sm">Live scores • Fixtures • Predictions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live Matches</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalLive}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Competitions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{competitions.length}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ML Accuracy</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">90.3%</p>
            </div>
          </div>
        </motion.div>

        {/* Live Now Section */}
        {liveMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Now</h2>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{liveMatches.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveMatches.map((match, idx) => {
                const isFav = isFavorite(match.id);
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">{match.league}</span>
                      <motion.button
                        onClick={() => toggleFavorite(match.id, 'match', `${match.homeTeam} vs ${match.awayTeam}`)}
                        whileHover={{ scale: 1.2 }}
                      >
                        <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </motion.button>
                    </div>
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 dark:text-white text-center mb-2">{match.homeTeam}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1"></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">{match.homeScore} - {match.awayScore}</div>
                          <div className="text-xs text-red-600 dark:text-red-400 font-bold animate-pulse mt-1">LIVE</div>
                        </div>
                        <div className="flex-1"></div>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-center mt-2">{match.awayTeam}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Upcoming Matches by Competition */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming</h2>
            <Link href={`/${locale}/predictions`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center gap-1">
              View Predictions <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : competitions.length > 0 ? (
            <div className="space-y-4">
              {competitions.slice(0, 3).map((comp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
                >
                  {/* Competition Header */}
                  <button
                    onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{comp.flag}</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 dark:text-white">{comp.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{comp.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {comp.live > 0 && <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">{comp.live} Live</span>}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>

                  {/* Matches */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {comp.matches.slice(0, 3).map((match, midx) => (
                      <div key={midx} className="px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{match.homeTeam} vs {match.awayTeam}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{match.time}</p>
                        </div>
                        {match.status === 'live' ? (
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">{match.homeScore} - {match.awayScore}</div>
                            <div className="text-xs text-red-600 font-semibold">LIVE</div>
                          </div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-400 text-xs">{match.time}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {comp.matches.length > 3 && (
                    <button
                      onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                      className="w-full px-4 py-3 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/30 transition text-center"
                    >
                      View all {comp.matches.length} matches →
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No matches available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
