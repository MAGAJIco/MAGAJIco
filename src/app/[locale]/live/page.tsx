'use client';

import React, { useState, useEffect, use } from 'react';
import { RefreshCw, Zap, Filter, TrendingUp, Menu, X, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sport, setSport] = useState<SportFilter>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Header - Dark Navy Amazon Style */}
      <header style={{ backgroundColor: '#131921' }} className="text-white sticky top-0 z-50 shadow-lg">
        <div style={{ padding: '18px 24px' }} className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '18px' }}>
            <Clock className="w-12 h-12" style={{ color: '#ff9900', filter: 'drop-shadow(0 3px 12px rgba(255,153,0,0.6))', strokeWidth: 1.5 }} />
            <div>
              <h1 style={{ letterSpacing: '0.8px', fontSize: '24px', fontWeight: 700 }}>LIVE</h1>
              <p style={{ fontSize: '11px', color: '#999', letterSpacing: '1px', marginTop: '2px', fontWeight: 500 }}>MATCHES</p>
            </div>
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Menu className="w-8 h-8" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))', strokeWidth: 1.5 }} />
          </button>
        </div>
      </header>

      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />
          <div style={{ position: 'fixed', top: 0, left: 0, width: '280px', height: '100vh', backgroundColor: '#131921', zIndex: 50, overflow: 'auto', animation: 'slideInLeft 0.3s ease-out' }} className="text-white">
            <div style={{ padding: '20px 24px', borderBottomColor: '#374151' }} className="border-b flex items-center justify-between">
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav style={{ padding: '24px 16px' }} className="space-y-2">
              <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Dashboard</span>
                </div>
              </Link>
              <Link href={`/${locale}/predictions`} onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800" style={{ cursor: 'pointer' }}>
                  <Eye className="w-5 h-5" style={{ color: '#999' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Predictions</span>
                </div>
              </Link>
              <Link href={`/${locale}/live`} onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-orange-600" style={{ cursor: 'pointer' }}>
                  <Clock className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>LIVE</span>
                </div>
              </Link>
            </nav>
          </div>
        </>
      )}

      <div style={{ paddingBottom: '100px' }}>
        {/* Orange Gradient Banner */}
        <div style={{ background: 'linear-gradient(to right, #ff3b30, #ff6b6b)', padding: '20px 24px' }} className="text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <div className="absolute animate-pulse" style={{ width: '12px', height: '12px', backgroundColor: '#ff3b30', borderRadius: '50%' }}></div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>{filtered.length} LIVE MATCHES</span>
            </div>
            <button
              onClick={fetchLive}
              disabled={loading}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} style={{ strokeWidth: 2 }} />
            </button>
          </div>
        </div>

        {/* Sport Filter */}
        <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '16px 24px' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a] overflow-x-auto">
          <div className="flex gap-3">
            {(['all', 'Football', 'Basketball', 'Baseball', 'Soccer'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSport(s)}
                style={{
                  backgroundColor: sport === s ? '#ff3b30' : 'white',
                  color: sport === s ? 'white' : '#0f1111',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: sport === s ? '0 4px 12px rgba(255,59,48,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                  whiteSpace: 'nowrap'
                }}
                className="dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a]"
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
          <Link href={`/${locale}/`} className="flex flex-col items-center justify-center" style={{ color: '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Dashboard</span>
          </Link>
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
