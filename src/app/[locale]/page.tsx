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

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
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
      const data = await cachedFetch(`/api/predictions/sport/soccer`);
      const espnMatches = data.matches || [];

      const groupedByLeague: { [key: string]: Competition } = {};
      const live: Match[] = [];
      let liveCount = 0;

      espnMatches.forEach((m: any) => {
        const league = m.league || 'Soccer';
        const isLive = m.status === 'live' || m.status === 'in_progress';

        const match = {
          id: m.id || `${m.home_team || 'A'}-${m.away_team || 'B'}`,
          homeTeam: m.home_team || 'Team A',
          awayTeam: m.away_team || 'Team B',
          league: league,
          time: m.game_time || '14:30',
          status: m.status || 'scheduled',
          homeScore: m.home_score,
          awayScore: m.away_score,
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

      if (espnMatches.length > 0) {
        const competitionsArray = Object.values(groupedByLeague).sort((a, b) => b.live - a.live);
        setCompetitions(competitionsArray);
        setLiveMatches(live.slice(0, 10));
        setTotalLive(liveCount);
      } else {
        setCompetitions([]);
        setLiveMatches([]);
        setTotalLive(0);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setCompetitions([]);
      setLiveMatches([]);
      setTotalLive(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] transition-colors duration-300">
      {/* Main Content - Mobile Optimized */}
      <div className="w-full max-w-2xl mx-auto">

        {/* Live Counter Header - Amazon Style */}
        {totalLive > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 bg-gradient-to-r from-[#ff9900] via-[#ff9900] to-[#ffad33] dark:from-[#ff9500] dark:to-[#ffad33] text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-bold shadow-md"
          >
            <motion.div 
              className="w-2 h-2 bg-white rounded-full" 
              animate={{ scale: [1, 1.3, 1] }} 
              transition={{ duration: 1, repeat: Infinity }} 
            />
            {totalLive} MATCHES LIVE
            <motion.div 
              className="w-2 h-2 bg-white rounded-full" 
              animate={{ scale: [1, 1.3, 1] }} 
              transition={{ duration: 1, repeat: Infinity }} 
            />
          </motion.div>
        )}

        {/* Top Section - Compact */}
        <div className="px-3 py-4 space-y-3 bg-[var(--bg-light-secondary)]">

          {/* Live Matches - Flashscore Style Cards */}
          {liveMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-light)] opacity-60 px-1">
                Now Playing
              </h3>
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
                      className="match-card p-2.5 text-left hover:shadow-lg transition-all group relative bg-white dark:bg-[#1c1c1e]"
                    >
                      {/* Favorite Heart */}
                      <div className="absolute top-1 right-1 z-20">
                        <svg 
                          className={`w-3.5 h-3.5 transition ${isFav ? 'fill-[#ff9900] dark:fill-[#ff9500] text-[#ff9900] dark:text-[#ff9500]' : 'text-gray-300 dark:text-gray-600'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </div>

                      {/* Teams & Score */}
                      <div className="text-xs font-bold text-[var(--text-light)] truncate leading-tight mb-1">
                        {match.homeTeam}
                      </div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="score-display text-[var(--text-light)]">{match.homeScore || 0}</div>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }} 
                          transition={{ duration: 0.8, repeat: Infinity }} 
                          className="text-xs font-bold text-[#ff4444]"
                        >
                          ●
                        </motion.div>
                        <div className="score-display text-[var(--text-light)]">{match.awayScore || 0}</div>
                      </div>
                      <div className="text-xs font-bold text-[var(--text-light)] truncate leading-tight">
                        {match.awayTeam}
                      </div>

                      {/* LIVE Badge */}
                      {match.status === 'live' && (
                        <div className="live-indicator mt-1.5">LIVE</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Refresh Button - Amazon Style */}
          <motion.button
            onClick={fetchMatches}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[var(--accent-color)] hover:bg-[#ffad33] dark:hover:bg-[#ffad33] text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Matches'}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-2 bg-[var(--border-color)]" />

        {/* Upcoming Matches - Flashscore Style */}
        <div className="px-3 py-4 bg-[var(--bg-light)]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-light)] opacity-60 mb-3 px-1">
            All Competitions
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin">
                <RefreshCw className="w-6 h-6 text-[var(--accent-color)]" />
              </div>
            </div>
          ) : competitions.length > 0 ? (
            <div className="space-y-2">
              {competitions.map((comp, idx) => {
                const isExpanded = expandedLeague === comp.name;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="match-card overflow-hidden hover:shadow-lg"
                  >
                    {/* League Header */}
                    <motion.button
                      onClick={() => setExpandedLeague(isExpanded ? null : comp.name)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-light-secondary)] transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">{comp.flag}</span>
                        <div className="text-left min-w-0">
                          <p className="font-bold text-sm text-[var(--text-light)] truncate">{comp.name}</p>
                          <p className="text-xs text-[var(--text-light)] opacity-60 uppercase tracking-wider font-semibold">
                            {comp.matches.length} matches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {comp.live > 0 && (
                          <span className="live-indicator">
                            {comp.live} LIVE
                          </span>
                        )}
                        <motion.div 
                          animate={{ rotate: isExpanded ? 180 : 0 }} 
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 text-[var(--text-light)] opacity-60" />
                        </motion.div>
                      </div>
                    </motion.button>

                    {/* Matches List - Flashscore Style */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? 'auto' : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-[var(--border-color)] border-t border-[var(--border-color)]">
                        {comp.matches.map((match, midx) => (
                          <motion.button
                            key={midx}
                            onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                            whileHover={{ backgroundColor: 'var(--bg-light-secondary)' }}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-sm transition"
                          >
                            {/* Teams Column */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[var(--text-light)] text-xs truncate">
                                {match.homeTeam}
                              </p>
                              <p className="text-xs text-[var(--text-light)] opacity-60 mt-0.5 truncate">
                                {match.awayTeam}
                              </p>
                            </div>

                            {/* Score/Time Column */}
                            <div className="ml-2 text-right flex-shrink-0">
                              {match.status === 'live' || match.status === 'in_progress' ? (
                                <>
                                  <div className="font-bold text-[var(--text-light)] text-sm">
                                    {match.homeScore || 0} - {match.awayScore || 0}
                                  </div>
                                  <div className="text-xs text-[#ff4444] font-bold">LIVE</div>
                                </>
                              ) : (
                                <div className="text-xs font-medium text-[var(--text-light)] opacity-60">
                                  {match.time}
                                </div>
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
              <p className="text-[var(--text-light)] opacity-60 text-sm">No matches available</p>
            </div>
          )}
        </div>

        {/* View All Link - Amazon Style */}
        <div className="px-3 py-4 pb-6 bg-[var(--bg-light-secondary)]">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href={`/${locale}/predictions`} 
              className="block bg-[#232f3e] dark:bg-[#2c2c2e] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:shadow-lg transition-all w-full text-center"
            >
              View All Predictions ⭐
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}