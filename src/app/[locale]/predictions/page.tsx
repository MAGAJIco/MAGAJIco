'use client';

import React, { useState, useEffect, use } from 'react';
import { Zap, TrendingUp, Shield, Clock, ArrowRight, CheckCircle, Star, Trophy, BarChart3, Target, Eye, ChevronLeft, ChevronRight, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PageNav from '@/app/components/PageNav';

export default function PredictionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const pathname = usePathname();
  const [currentStat, setCurrentStat] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAIAccess, setHasAIAccess] = useState(false);
  const [showAISignup, setShowAISignup] = useState(false);
  const [showDotsHoverboard, setShowDotsHoverboard] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;

  // Fetch all predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/predictions');
        if (!response.ok) {
          console.error('API returned status:', response.status);
          return;
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('API returned non-JSON response');
          return;
        }
        const data = await response.json();
        setAllPredictions(data.matches || []);
      } catch (err) {
        console.error('Error fetching predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);
  
  const stats = [
    { label: 'Active Predictions', value: '2,500+', icon: Target },
    { label: 'Success Rate', value: '89%', icon: TrendingUp },
    { label: 'Data Sources', value: '3', icon: BarChart3 },
    { label: 'Daily Updates', value: '24/7', icon: Clock }
  ];

  const sources = [
    {
      name: 'Statarea',
      description: 'Advanced statistical analysis and data-driven predictions',
      color: 'blue',
      features: ['Deep analytics', 'Historical patterns', 'Team statistics']
    },
    {
      name: 'ScorePrediction',
      description: 'AI-powered match outcome forecasts with precision scoring',
      color: 'purple',
      features: ['AI algorithms', 'Live updates', 'Score forecasting']
    },
    {
      name: 'MyBets',
      description: 'Curated betting tips from expert analysts worldwide',
      color: 'green',
      features: ['Expert insights', 'Betting odds', 'Value picks']
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Sources',
      description: 'All predictions from trusted, industry-leading platforms'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live data synchronization every 60 seconds'
    },
    {
      icon: Trophy,
      title: 'High Accuracy',
      description: 'Consistently delivers winning predictions with proven track record'
    },
    {
      icon: BarChart3,
      title: 'Multi-Source Analysis',
      description: 'Compare predictions from three premium sources in one place'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const colorMap = {
    blue: 'from-blue-600 to-blue-700',
    purple: 'from-purple-600 to-purple-700',
    green: 'from-green-600 to-green-700'
  };

  const borderColorMap = {
    blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
    green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
  };

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh' }} className="dark:bg-black">
      <PageNav onMenuOpen={() => setMenuOpen(true)} />

      {/* Hero Banner - Premium Style */}
      <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)', padding: '32px 24px' }} className="text-white overflow-hidden shadow-lg">
        <div className="flex items-start" style={{ gap: '14px' }}>
          <Zap className="w-8 h-8 flex-shrink-0" style={{ marginTop: '4px', filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.4))', strokeWidth: 1.5 }} />
          <div className="min-w-0">
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, marginBottom: '12px', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.3)' }}>
              PREMIUM
            </div>
            <p style={{ fontSize: '16px', fontWeight: 600, lineHeight: '1.5', marginBottom: '8px' }}>
              Ready to Start Winning?
            </p>
            <p style={{ fontSize: '13px', opacity: 0.95, fontWeight: 400, marginBottom: '12px' }}>
              Access premium predictions from three trusted sources right now
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
                <span>📊</span> Statarea
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
                <span>🤖</span> ScorePrediction
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
                <span>💡</span> MyBets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Carousel Section with Navigation */}
      <div style={{ backgroundColor: '#eaeded', padding: '24px 24px' }} className="dark:bg-black">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setCurrentStat((prev) => (prev - 1 + stats.length) % stats.length)}
            style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff9900', transition: 'all 0.3s ease' }}
            className="hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div style={{ display: 'flex', gap: '12px', overflow: 'auto', scrollBehavior: 'smooth', flex: 1 }}>
            {stats.map((stat, idx) => {
              const isActive = idx === currentStat;
              const IconComponent = stat.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => setCurrentStat(idx)}
                  style={{
                    borderRadius: '12px',
                    padding: '16px',
                    minWidth: '150px',
                    border: isActive ? '2px solid #ff9900' : '1px solid #d5d9d9',
                    boxShadow: isActive ? '0 0 0 3px rgba(255,153,0,0.2)' : '0 2px 4px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    backgroundColor: isActive ? 'rgba(255,153,0,0.05)' : 'white',
                    cursor: 'pointer'
                  }}
                  className="dark:bg-[#2c2c2e] dark:border-[#38383a]"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <IconComponent className="w-5 h-5" style={{ color: isActive ? '#ff9900' : '#565959', flex: 'shrink-0' }} />
                    <span style={{ fontSize: '12px', color: isActive ? '#ff9900' : '#565959', fontWeight: isActive ? 700 : 500, transition: 'all 0.3s ease' }}>
                      {stat.label}
                    </span>
                  </div>
                  <div style={{ fontSize: isActive ? '24px' : '20px', fontWeight: 700, color: isActive ? '#ff9900' : '#0f1111', transition: 'all 0.3s ease' }} className="dark:text-white">
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentStat((prev) => (prev + 1) % stats.length)}
            style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff9900', transition: 'all 0.3s ease' }}
            className="hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div style={{ paddingBottom: '100px' }}>

      {/* AI Suggestions Section - Status Bar Style */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', marginBottom: '20px', letterSpacing: '0.5px' }} className="dark:text-white">AI-Powered Suggestions</h2>
        {hasAIAccess ? (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-6 h-6 flex-shrink-0" style={{ color: '#ff9900' }} />
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f1111', marginBottom: '8px' }} className="dark:text-white">Smart Analysis</h3>
                <p style={{ fontSize: '13px', color: '#565959' }} className="dark:text-gray-400">AI analyzes all three data sources to recommend the highest-confidence picks for today's matches</p>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff5e6', borderRadius: '8px', padding: '12px', marginTop: '16px' }} className="dark:bg-orange-900/20">
              <p style={{ fontSize: '12px', color: '#ff7f00', fontWeight: 500 }}>✨ AI insights are now available for all predictions below</p>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'linear-gradient(135deg, #ff9900 0%, #ffad33 100%)', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }} className="text-white shadow-lg">
            <Zap className="w-10 h-10 mx-auto mb-4" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Unlock AI Suggestions</h3>
            <p style={{ fontSize: '13px', opacity: 0.95, marginBottom: '24px' }}>Get AI-powered insights that analyze all three data sources and recommend top picks</p>
            <button
              onClick={() => setShowAISignup(true)}
              style={{ backgroundColor: 'white', color: '#ff9900', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="hover:shadow-xl hover:scale-105"
            >
              Sign Up for AI Access
            </button>
          </div>
        )}
      </div>

      {/* AI Signup Modal */}
      {showAISignup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} className="p-4">
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px 24px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} className="dark:bg-[#2c2c2e]">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111' }} className="dark:text-white">Enable AI Suggestions</h2>
              <button onClick={() => setShowAISignup(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
            </div>
            
            <p style={{ fontSize: '13px', color: '#565959', marginBottom: '20px' }} className="dark:text-gray-400">Sign up to get AI-powered predictions and smart analysis of all matches</p>
            
            <input type="email" placeholder="Email address" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d5d9d9', fontSize: '13px', marginBottom: '12px' }} className="dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-white" />
            
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d5d9d9', fontSize: '13px', marginBottom: '20px' }} className="dark:bg-[#1c1c1e] dark:border-[#38383a] dark:text-white" />
            
            <button
              onClick={() => {
                setHasAIAccess(true);
                setShowAISignup(false);
              }}
              style={{ width: '100%', backgroundColor: '#ff9900', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '12px' }}
              className="hover:shadow-lg hover:scale-105"
            >
              Continue with AI Access
            </button>
            
            <button
              onClick={() => setShowAISignup(false)}
              style={{ width: '100%', backgroundColor: '#f3f3f3', color: '#0f1111', padding: '12px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              className="dark:bg-[#1c1c1e] dark:text-white"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}


      {/* All Predictions Section - Grouped by League */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', letterSpacing: '0.5px' }} className="dark:text-white">All Predictions by League</h2>
          <div style={{ position: 'relative' }}>
            <button 
              onMouseEnter={() => setShowDotsHoverboard(true)}
              onMouseLeave={() => setShowDotsHoverboard(false)}
              style={{ padding: '6px 8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.3s ease' }}
              title="More options"
            >
              ⋯
            </button>
            {showDotsHoverboard && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '12px',
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb',
                zIndex: 100,
                width: '200px'
              }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '16px' }} className="dark:text-gray-400">Data Connection</div>
                <svg width="180" height="120" style={{ width: '100%', height: 'auto' }}>
                  {/* Connection lines */}
                  <line x1="30" y1="60" x2="90" y2="30" stroke="#eab308" strokeWidth="2" strokeDasharray="4" />
                  <line x1="30" y1="60" x2="90" y2="90" stroke="#84cc16" strokeWidth="2" strokeDasharray="4" />
                  <line x1="90" y1="30" x2="150" y2="60" stroke="#22c55e" strokeWidth="2" strokeDasharray="4" />
                  
                  {/* Circle 1 - Yellow */}
                  <circle cx="30" cy="60" r="8" fill="#eab308" style={{ filter: 'drop-shadow(0 2px 8px rgba(234, 179, 8, 0.4))' }} />
                  
                  {/* Circle 2 - Light Green */}
                  <circle cx="90" cy="30" r="8" fill="#84cc16" style={{ filter: 'drop-shadow(0 2px 8px rgba(132, 204, 22, 0.4))' }} />
                  
                  {/* Circle 3 - Dark Green */}
                  <circle cx="150" cy="60" r="8" fill="#22c55e" style={{ filter: 'drop-shadow(0 2px 8px rgba(34, 197, 94, 0.4))' }} />
                </svg>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '12px', textAlign: 'center' }} className="dark:text-gray-500">
                  3 Data Sources Connected
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#565959' }} className="dark:text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p style={{ marginTop: '12px' }}>Loading predictions...</p>
          </div>
        ) : allPredictions.length > 0 ? (
          <div className="space-y-4">
            {allPredictions.map((league, idx) => (
              <div key={idx}>
                {/* League Header */}
                <div style={{ backgroundColor: '#d5d9d9', padding: '12px 16px', gap: '12px', marginBottom: '8px', borderRadius: '8px' }} className="dark:bg-[#2c2c2e] flex items-center">
                  <span style={{ fontSize: '18px' }}>⚽</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f1111', letterSpacing: '0.5px' }} className="dark:text-white uppercase">
                    {league.league}
                  </span>
                </div>
                {/* Predictions Grid */}
                <div className="grid gap-3">
                  {league.games && league.games.map((pred: any, pidx: number) => (
                    <div key={pidx} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
                      <div className="flex items-start justify-between gap-3">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111', marginBottom: '6px' }} className="dark:text-white">
                            {pred.home_team} vs {pred.away_team}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {pred.prediction_1x2 && (
                              <span style={{ backgroundColor: '#667eea', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                                1X2: {pred.prediction_1x2}
                              </span>
                            )}
                            {pred.prediction_over_under && (
                              <span style={{ backgroundColor: '#764ba2', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                                O/U: {pred.prediction_over_under}
                              </span>
                            )}
                            {pred.prediction_btts && (
                              <span style={{ backgroundColor: '#10b981', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                                BTTS: {pred.prediction_btts}
                              </span>
                            )}
                            {hasAIAccess && (
                              <span style={{ backgroundColor: '#ff9900', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                ✨ AI Recommended
                              </span>
                            )}
                          </div>
                        </div>
                        {pred.confidence && (
                          <div style={{ textAlign: 'right', minWidth: '60px' }}>
                            <div style={{ fontSize: '12px', color: '#ff9900', fontWeight: 700 }}>
                              {pred.confidence}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#565959' }} className="dark:text-gray-400">
            <p>No predictions available</p>
          </div>
        )}
      </div>

      </div>

      {/* Jeff Bezos Quote Section */}
      <div style={{ backgroundColor: '#eaeded', padding: '40px 24px' }} className="dark:bg-black">
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9', textAlign: 'center' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#0f1111', marginBottom: '16px', lineHeight: '1.6' }} className="dark:text-white italic">
            "The best customer service is if the customer doesn't need to call you."
          </p>
          <p style={{ fontSize: '14px', color: '#565959', fontWeight: 500 }} className="dark:text-gray-400">
            — Jeff Bezos
          </p>
        </div>
      </div>

      {/* Google Style Search Overlay */}
      {searchActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.98)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px 24px' }} className="dark:bg-[#1a1a1a]">
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', border: '1px solid #d5d9d9', borderRadius: '24px', padding: '12px 16px', marginBottom: '24px' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <Search className="w-5 h-5" style={{ color: '#999' }} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search predictions, teams, leagues..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', backgroundColor: 'transparent' }}
                className="dark:text-white dark:placeholder-gray-500"
              />
              <button
                onClick={() => { setSearchActive(false); setSearchQuery(''); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '20px' }}
              >
                ✕
              </button>
            </div>

            {searchQuery && (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '16px', maxHeight: '70vh', overflowY: 'auto' }} className="dark:bg-[#2c2c2e]">
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px', fontWeight: 500 }} className="dark:text-gray-400">
                  Search results for "{searchQuery}"
                </div>
                <div style={{ color: '#0f1111', fontSize: '14px', padding: '20px', textAlign: 'center' }} className="dark:text-gray-300">
                  <p>🔍 Searching through predictions, teams, and matches...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Minimal Search Bar When Active */}
      {searchActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '12px', backgroundColor: 'transparent', backdropFilter: 'blur(8px)', zIndex: 99 }} />
      )}

      {/* Bottom Navigation */}
      <nav style={{ backgroundColor: searchActive ? 'transparent' : '#f3f3f3', borderTopColor: '#d5d9d9', padding: searchActive ? '0' : '14px 0 env(safe-area-inset-bottom)', height: searchActive ? '12px' : 'auto', display: searchActive ? 'none' : 'block' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/`} className="flex flex-col items-center justify-center" style={{ color: isActive('/') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Home className="w-9 h-9" style={{ filter: isActive('/') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Home</span>
          </Link>
          <Link href={`/${locale}/predictions`} className="flex flex-col items-center justify-center" style={{ color: '#ff9900', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Eye className="w-9 h-9" style={{ filter: 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Predictions</span>
          </Link>
          <button
            onClick={() => setSearchActive(true)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: '#565959', transition: 'color 0.3s ease' }}
            title="Search"
          >
            <Search className="w-9 h-9" style={{ color: '#565959' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Search</span>
          </button>
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
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}