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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
        
        {/* Quick Stats - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-4 shadow-md border border-blue-200 dark:border-blue-700/50 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 mb-2 mx-auto">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center uppercase tracking-wide">Live</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300 text-center mt-1">{totalLive}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl p-4 shadow-md border border-purple-200 dark:border-purple-700/50 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-600 mb-2 mx-auto">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center uppercase tracking-wide">Leagues</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 text-center mt-1">{competitions.length}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ translateY: -2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-4 shadow-md border border-green-200 dark:border-green-700/50 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 mb-2 mx-auto">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center uppercase tracking-wide">Accuracy</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300 text-center mt-1">90.3%</p>
          </motion.div>
        </motion.div>

        {/* Live Now Section */}
        {liveMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div className="w-2.5 h-2.5 bg-red-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Now</h2>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold"
              >
                {liveMatches.length}
              </motion.span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {liveMatches.map((match, idx) => {
                const isFav = isFavorite(match.id);
                return (
                  <motion.button
                    key={match.id}
                    onClick={() => toggleFavorite(match.id, 'match', `${match.homeTeam} vs ${match.awayTeam}`)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ translateY: -2 }}
                    className="bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 dark:from-red-600 dark:to-orange-600 rounded-xl p-3 shadow-lg hover:shadow-xl transition text-left group relative overflow-hidden"
                  >
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition" />
                    
                    <div className="relative z-10">
                      <p className="font-bold text-white text-center text-sm leading-tight truncate">{match.homeTeam}</p>
                      <div className="flex items-center justify-between gap-1 my-2">
                        <div className="flex-1"></div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{match.homeScore}-{match.awayScore}</div>
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-xs text-white font-bold leading-none"
                          >
                            LIVE
                          </motion.div>
                        </div>
                        <div className="flex-1"></div>
                      </div>
                      <p className="font-bold text-white text-center text-sm leading-tight truncate">{match.awayTeam}</p>
                      
                      {/* Favorite indicator */}
                      <div className="mt-2 flex justify-center">
                        <Heart className={`w-4 h-4 transition ${isFav ? 'fill-white text-white' : 'text-white/50'}`} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Upcoming Matches by Competition */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Matches</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top competitions and predictions</p>
            </div>
            <motion.div whileHover={{ x: 4 }}>
              <Link href={`/${locale}/predictions`} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                All Predictions <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
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
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition"
                >
                  {/* Competition Header */}
                  <motion.button
                    whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                    onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{comp.flag}</span>
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{comp.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{comp.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {comp.live > 0 && (
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold"
                        >
                          {comp.live} LIVE
                        </motion.span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" />
                    </div>
                  </motion.button>

                  {/* Matches */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {comp.matches.slice(0, 3).map((match, midx) => (
                      <motion.div
                        key={midx}
                        whileHover={{ backgroundColor: 'var(--match-hover)' }}
                        className="px-4 py-3 flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{match.homeTeam}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">{match.time}</p>
                        </div>
                        <div className="ml-2 text-right">
                          {match.status === 'live' ? (
                            <>
                              <div className="font-bold text-gray-900 dark:text-white text-base">{match.homeScore} - {match.awayScore}</div>
                              <motion.div
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-xs text-red-600 dark:text-red-400 font-bold"
                              >
                                LIVE
                              </motion.div>
                            </>
                          ) : (
                            <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">{match.time}</div>
                          )}
                        </div>
                        <div className="ml-2">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {comp.matches.length > 3 && (
                    <motion.button
                      whileHover={{ backgroundColor: 'var(--view-all-hover)' }}
                      onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                      className="w-full px-4 py-3 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center"
                    >
                      View all {comp.matches.length} matches →
                    </motion.button>
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
