'use client';

import React, { useState, useEffect, use } from 'react';
import { RefreshCw, Zap, Filter, TrendingUp, Clock, Eye, Lightbulb, Radio, Lock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const [activePage, setActivePage] = useState('live');

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

  const navStyle = {
    borderBottom: '1px solid #e5e7eb',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  };

  const navButtonStyle = {
    padding: '8px 16px',
    background: 'transparent',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  };

  const activeNavButtonStyle = {
    ...navButtonStyle,
    background: '#a855f7',
    color: 'white',
    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
  };

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh' }} className="dark:bg-black">
      {/* Top Navigation */}
      <nav style={navStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease' }}
                title="Menu"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '24px', height: '24px', justifyContent: 'center' }}>
                  <div style={{ height: '2px', background: '#374151', borderRadius: '1px' }}></div>
                  <div style={{ height: '2px', background: '#374151', borderRadius: '1px' }}></div>
                </div>
              </button>
              <button
                style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', transition: 'all 0.3s ease' }}
                title="Search"
              >
                <Search className="w-6 h-6" style={{ color: '#374151' }} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={() => { setActivePage('home'); router.push('/en'); }}
                style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '16px', borderRight: '1px solid #e5e7eb', ...(activePage === 'home' ? activeNavButtonStyle : {})}}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Lightbulb className="w-5 h-5" style={{ color: activePage === 'home' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
              </button>
              <button
                onClick={() => setActivePage('live')}
                style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(activePage === 'live' ? activeNavButtonStyle : {})}}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Radio className="w-5 h-5" style={{ color: activePage === 'live' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
              </button>
              <button
                onClick={() => { setActivePage('secrets'); router.push('/en/secrets'); }}
                style={{...navButtonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(activePage === 'secrets' ? activeNavButtonStyle : {})}}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Lock className="w-5 h-5" style={{ color: activePage === 'secrets' ? 'white' : '#4b5563', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))' }} />
              </button>
            </div>
          </div>
        </div>
      </nav>

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
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', padding: '14px 0 env(safe-area-inset-bottom)' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/live`} className="flex flex-col items-center justify-center" style={{ color: '#ff3b30', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Clock className="w-9 h-9" style={{ filter: 'drop-shadow(0 3px 8px rgba(255,59,48,0.5))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>LIVE</span>
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
