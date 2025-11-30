'use client';

import React, { useState, useEffect, use } from 'react';
import { RefreshCw, Zap, Filter, TrendingUp, Clock, Eye, Home, Brain, X, Search, Lightbulb, Settings, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import PageNav from '@/app/components/PageNav';

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

const MenuDrawer = ({ isOpen, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
      />
      
      <div className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slideInLeft overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Menu
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Navigate or select a component
          </p>
        </div>

        {/* Search Box */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:opacity-70 flex-shrink-0">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
            Navigation
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Lightbulb className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Home</span>
            </button>
            <button
              onClick={() => {
                onNavigate('live');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Live</span>
            </button>
            <button
              onClick={() => {
                onNavigate('secrets');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Secrets</span>
            </button>
            <button
              onClick={() => {
                onNavigate('betslip');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Betting Manager</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default function LivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sport, setSport] = useState<SportFilter>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setMenuOpen(false);
    if (view === 'home') router.push('/en');
    if (view === 'secrets') router.push('/en/secrets');
    if (view === 'betslip') router.push('/en/betslip');
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, [sport]);

  const fetchLive = async () => {
    try {
      setLoading(true);
      // Use live predictions endpoint
      const response = await fetch(`/api/live`);
      
      if (!response.ok) {
        console.error('API returned status:', response.status);
        setMatches([]);
        setLastUpdate(new Date());
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response:', contentType);
        setMatches([]);
        setLastUpdate(new Date());
        return;
      }

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
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sport === 'all' ? matches : matches.filter(m => m.sport === sport);

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh' }} className="dark:bg-black">
      <PageNav onMenuOpen={() => setMenuOpen(true)} />
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={handleNavigate} />

      <div style={{ maxWidth: '896px', margin: '0 auto', paddingBottom: '100px' }}>
        {/* Title Section */}
        <div style={{ marginBottom: '24px', paddingBottom: '24px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            LIVE
          </h1>
          <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '500' }}>
            Watch real-time match updates
          </p>
        </div>

        {/* Status Bar - Live Matches */}
        <div className="bg-gradient-to-r from-red-500 to-red-400 dark:from-red-600 dark:to-red-500 px-6 py-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold tracking-wide">{filtered.length} LIVE MATCHES</span>
            </div>
            <button
              onClick={fetchLive}
              disabled={loading}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Sport Filter - Button Nav */}
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 overflow-x-auto shadow-sm">
          <div className="flex gap-2">
            {(['all', 'Football', 'Basketball', 'Baseball', 'Soccer'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  sport === s
                    ? 'bg-red-500 dark:bg-red-600 text-white shadow-lg shadow-red-500/30 dark:shadow-red-600/30'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm'
                }`}
              >
                {s === 'all' ? 'All Sports' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Matches - Grouped by League */}
        <div style={{ backgroundColor: '#eaeded', padding: '20px 24px' }} className="dark:bg-black">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderRightColor: '#ff3b30' }}></div>
              <div style={{ marginTop: '16px', color: '#565959', fontWeight: 500 }} className="dark:text-gray-400">Loading live matches...</div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
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
                  <div style={{ backgroundColor: '#d5d9d9', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }} className="dark:bg-[#2c2c2e]">
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f1111', letterSpacing: '0.5px' }} className="dark:text-white uppercase">{league}</p>
                  </div>

                  {/* Matches in this league */}
                  <div className="space-y-3">
                    {leagueMatches.map((match, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: leagueIdx * 0.1 + idx * 0.05 }}
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f1111', marginBottom: '8px' }} className="dark:text-white">
                              {match.homeTeam}
                            </div>
                            <div style={{ fontSize: '13px', color: '#565959' }} className="dark:text-gray-400">
                              vs {match.awayTeam}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', marginLeft: '16px', marginRight: '16px' }}>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f1111', lineHeight: '1' }} className="dark:text-white">
                              {match.homeScore}
                            </div>
                            <div style={{ fontSize: '12px', color: '#565959', margin: '4px 0' }} className="dark:text-gray-400">-</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f1111', lineHeight: '1' }} className="dark:text-white">
                              {match.awayScore}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ backgroundColor: '#ff3b30', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '11px', whiteSpace: 'nowrap', animation: 'pulse 2s infinite' }}>
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
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f1111', marginBottom: '8px' }} className="dark:text-white">No live matches right now</div>
              <p style={{ fontSize: '13px', color: '#565959' }} className="dark:text-gray-400">Check back soon for upcoming matches</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', padding: '20px 0 env(safe-area-inset-bottom)' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/live`} className="flex flex-col items-center justify-center" style={{ color: '#ff3b30', gap: '10px', padding: '12px 24px', transition: 'all 0.3s ease', borderRadius: '12px' }}>
            <Clock className="w-9 h-9" style={{ filter: 'drop-shadow(0 3px 8px rgba(255,59,48,0.5))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.3px' }}>LIVE</span>
          </Link>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideInLeft {
          from { 
            transform: translateX(-100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
