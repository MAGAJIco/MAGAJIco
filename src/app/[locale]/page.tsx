'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { RefreshCw, Zap, TrendingUp, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: string;
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
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState('TODAY');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalLive, setTotalLive] = useState(0);
  const [dates, setDatesState] = useState<any[]>([]);

  const getDates = () => {
    const days = ['SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'];
    const today = new Date();
    const dateArray = [];
    
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      const date = d.getDate();
      const month = d.getMonth() + 1;
      dateArray.push({
        label: i === 0 ? 'TODAY' : dayName,
        date: `${dayName} ${date}.${month}`,
        isToday: i === 0,
      });
    }
    return dateArray;
  };

  useEffect(() => {
    setDatesState(getDates());
    setSampleData();
    fetchMatches();

    const dateInterval = setInterval(() => {
      setDatesState(getDates());
    }, 60000);

    return () => clearInterval(dateInterval);
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
          { id: '1', homeTeam: 'Manchester City', awayTeam: 'Real Madrid', league: 'Champions League', time: '14:30', status: 'live' },
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
        ],
      },
      {
        name: 'La Liga',
        flag: '🇪🇸',
        country: 'SPAIN',
        live: 0,
        matches: [
          { id: '4', homeTeam: 'Barcelona', awayTeam: 'Atletico Madrid', league: 'La Liga', time: '17:00', status: 'scheduled' },
        ],
      },
    ];
    setCompetitions(sampleCompetitions);
    setTotalLive(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 pb-32">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-8 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-3"
            >
              MagajiCo
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-xl"
            >
              {isAuthenticated ? `Welcome back, ${user?.firstName || user?.username}!` : 'AI-powered sports predictions at your fingertips'}
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-blue-600 dark:text-blue-400" size={20} />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Live Matches</p>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{totalLive}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Competitions</p>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{competitions.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-green-600 dark:text-green-400" size={20} />
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Accuracy</p>
              </div>
              <p className="text-4xl font-black text-gray-900 dark:text-white">90.3%</p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mb-12"
            >
              <Link
                href="/auth/login"
                className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href={`/${locale}/live`}
                className="px-8 py-3 rounded-full backdrop-blur-md bg-white/30 dark:bg-slate-800/30 border border-white/60 dark:border-slate-700/60 text-gray-900 dark:text-white font-semibold hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
              >
                Explore Live Matches
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Date Tabs - iOS 18 Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="sticky top-14 z-20 backdrop-blur-lg bg-white/40 dark:bg-slate-800/40 border-b border-white/20 dark:border-slate-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto flex gap-2">
          {dates.map((d, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(d.label)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                selectedDate === d.label
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/30 dark:bg-slate-700/30 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="text-xs text-opacity-70">{d.label}</div>
              <div className="text-sm font-bold">{d.date.split(' ')[1]}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </motion.div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading matches...</p>
          </motion.div>
        ) : competitions.length > 0 ? (
          <>
            {/* Live Competitions Section */}
            {competitions.filter(c => c.live > 0).length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  Live Now
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {competitions
                    .filter(c => c.live > 0)
                    .map((comp, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                        className="text-left backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-3xl mb-2">{comp.flag}</p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{comp.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{comp.country}</p>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                          >
                            {comp.live} Live
                          </motion.div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {comp.matches.length} matches • View details →
                        </p>
                      </motion.button>
                    ))}
                </div>
              </motion.section>
            )}

            {/* Other Competitions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">All Competitions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitions
                  .filter(c => c.live === 0)
                  .map((comp, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(`/${locale}/matches?league=${encodeURIComponent(comp.name)}`)}
                      className="text-left backdrop-blur-md bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 rounded-3xl p-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
                    >
                      <div>
                        <p className="text-3xl mb-2">{comp.flag}</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{comp.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comp.country}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          {comp.matches.length} matches available
                        </p>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </motion.section>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">No matches for this date</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try selecting a different date</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
