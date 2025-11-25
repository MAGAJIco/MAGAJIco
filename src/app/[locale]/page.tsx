'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RefreshCw, ChevronDown } from 'lucide-react';
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

const DEFAULT_LIVE = [
  { id: '1', homeTeam: 'Man City', awayTeam: 'Real Madrid', league: 'Champions League', time: '14:30', status: 'live', homeScore: 2, awayScore: 1 },
  { id: '2', homeTeam: 'Bayern', awayTeam: 'PSG', league: 'Champions League', time: '15:00', status: 'live', homeScore: 1, awayScore: 0 },
];

const DEFAULT_COMPETITIONS: Competition[] = [
  {
    name: 'Champions League',
    flag: '🇪🇺',
    country: 'EUROPE',
    live: 2,
    matches: [
      ...DEFAULT_LIVE,
      { id: '3', homeTeam: 'Liverpool', awayTeam: 'Inter', league: 'Champions League', time: '16:00', status: 'scheduled' },
    ],
  },
  {
    name: 'Premier League',
    flag: '🇬🇧',
    country: 'ENGLAND',
    live: 0,
    matches: [
      { id: '4', homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League', time: '16:00', status: 'scheduled' },
      { id: '5', homeTeam: 'Liverpool', awayTeam: 'Man United', league: 'Premier League', time: '17:30', status: 'scheduled' },
    ],
  },
  {
    name: 'La Liga',
    flag: '🇪🇸',
    country: 'SPAIN',
    live: 0,
    matches: [
      { id: '6', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', time: '21:00', status: 'scheduled' },
    ],
  },
];

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>(DEFAULT_COMPETITIONS);
  const [liveMatches, setLiveMatches] = useState<Match[]>(DEFAULT_LIVE);
  const [loading, setLoading] = useState(false);
  const [totalLive, setTotalLive] = useState(2);
  const [expandedLeague, setExpandedLeague] = useState<string | null>(null);
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
          homeScore: pred.home_score || pred.homeScore,
          awayScore: pred.away_score || pred.awayScore,
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

      if (predictions.length > 0) {
        const competitionsArray = Object.values(groupedByLeague).sort((a, b) => b.live - a.live);
        setCompetitions(competitionsArray);
        setLiveMatches(live.slice(0, 10));
        setTotalLive(liveCount);
      } else {
        setSampleData();
      }
    } catch (err) {
      console.log('Using sample data:', err);
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const sampleLive = [
      { id: '1', homeTeam: 'Man City', awayTeam: 'Real Madrid', league: 'Champions League', time: '14:30', status: 'live', homeScore: 2, awayScore: 1 },
      { id: '2', homeTeam: 'Bayern', awayTeam: 'PSG', league: 'Champions League', time: '15:00', status: 'live', homeScore: 1, awayScore: 0 },
    ];
    const sampleCompetitions: Competition[] = [
      {
        name: 'Champions League',
        flag: '🇪🇺',
        country: 'EUROPE',
        live: 2,
        matches: [
          ...sampleLive,
          { id: '3', homeTeam: 'Liverpool', awayTeam: 'Inter', league: 'Champions League', time: '16:00', status: 'scheduled' },
        ],
      },
      {
        name: 'Premier League',
        flag: '🇬🇧',
        country: 'ENGLAND',
        live: 0,
        matches: [
          { id: '4', homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League', time: '16:00', status: 'scheduled' },
          { id: '5', homeTeam: 'Liverpool', awayTeam: 'Man United', league: 'Premier League', time: '17:30', status: 'scheduled' },
        ],
      },
      {
        name: 'La Liga',
        flag: '🇪🇸',
        country: 'SPAIN',
        live: 0,
        matches: [
          { id: '6', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', time: '21:00', status: 'scheduled' },
        ],
      },
    ];
    setCompetitions(sampleCompetitions);
    setLiveMatches(sampleLive);
    setTotalLive(2);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Main Content - Mobile Optimized */}
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Live Counter Header */}
        {totalLive > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold"
          >
            <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            {totalLive} MATCHES LIVE
            <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          </motion.div>
        )}

        {/* Top Section - Compact */}
        <div className="px-3 py-3 space-y-3">
          
          {/* Live Matches - Compact Horizontal Cards */}
          {liveMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 px-1">Now Playing</h3>
              <div className="grid grid-cols-2 gap-2">
                {liveMatches.slice(0, 6).map((match, idx) => {
                  const isFav = isFavorite(match.id);
                  return (
                    <motion.button
                      key={match.id}
                      onClick={() => toggleFavorite(match.id, 'match', `${match.homeTeam} vs ${match.awayTeam}`)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-left hover:border-red-300 dark:hover:border-red-600 transition group relative"
                    >
                      {/* Favorite Heart */}
                      <div className="absolute top-1 right-1 z-20">
                        <svg className={`w-3.5 h-3.5 transition ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </div>

                      {/* Teams & Score */}
                      <div className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight mb-1">{match.homeTeam}</div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="text-xl font-black text-gray-900 dark:text-white">{match.homeScore || 0}</div>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-xs font-bold text-red-500">●</motion.div>
                        <div className="text-xl font-black text-gray-900 dark:text-white">{match.awayScore || 0}</div>
                      </div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{match.awayTeam}</div>
                      
                      {/* LIVE Badge */}
                      {match.status === 'live' && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-xs text-white bg-gradient-to-r from-red-500 to-red-600 rounded px-1.5 py-0.5 font-bold text-center mt-1.5"
                        >
                          LIVE
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Refresh Button */}
          <motion.button
            onClick={fetchMatches}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full gradient-blue text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        {/* Upcoming Matches - Compact FlashScore Style */}
        <div className="px-3 py-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-3 px-1">All Matches</h2>
          
          {competitions.length > 0 ? (
            <div className="space-y-1">
              {competitions.map((comp, idx) => {
                const isExpanded = expandedLeague === comp.name;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition"
                  >
                    {/* League Header */}
                    <motion.button
                      onClick={() => setExpandedLeague(isExpanded ? null : comp.name)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">{comp.flag}</span>
                        <div className="text-left min-w-0">
                          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{comp.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{comp.matches.length} matches</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {comp.live > 0 && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                          >
                            {comp.live} LIVE
                          </motion.span>
                        )}
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </motion.div>
                      </div>
                    </motion.button>

                    {/* Matches List - Compact FlashScore Style */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                        {comp.matches.map((match, midx) => (
                          <motion.button
                            key={midx}
                            onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                            whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                            className="w-full px-3 py-2 flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                          >
                            {/* Teams Column */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-xs truncate">{match.homeTeam}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{match.awayTeam}</p>
                            </div>

                            {/* Score/Time Column */}
                            <div className="ml-2 text-right flex-shrink-0">
                              {match.status === 'live' || match.status === 'in_progress' ? (
                                <>
                                  <div className="font-bold text-gray-900 dark:text-white text-sm">{match.homeScore || 0} - {match.awayScore || 0}</div>
                                  <motion.div
                                    animate={{ opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-xs text-red-600 dark:text-red-400 font-bold"
                                  >
                                    LIVE
                                  </motion.div>
                                </>
                              ) : (
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{match.time}</div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No matches available</p>
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="px-3 py-3 pb-6">
          <motion.div whileHover={{ x: 2 }} className="text-center">
            <Link href={`/${locale}/predictions`} className="inline-block gradient-purple text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition w-full text-center">
              View All Predictions ⭐
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
