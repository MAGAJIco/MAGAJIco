'use client';

import React, { useState, useEffect, use } from 'react';
import { Zap, TrendingUp, Shield, Clock, ArrowRight, CheckCircle, Star, Trophy, BarChart3, Target, Menu, X, Eye, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PredictionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const pathname = usePathname();
  const [currentStat, setCurrentStat] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasAIAccess, setHasAIAccess] = useState(false);
  const [showAISignup, setShowAISignup] = useState(false);
  
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
      {/* Header - Dark Navy Amazon Style */}
      <header style={{ backgroundColor: '#131921' }} className="text-white sticky top-0 z-50 shadow-lg">
        <div style={{ padding: '18px 24px' }} className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '18px' }}>
            <Eye className="w-12 h-12" style={{ color: '#ff9900', filter: 'drop-shadow(0 3px 12px rgba(255,153,0,0.6))', strokeWidth: 1.5 }} />
            <div>
              <h1 style={{ letterSpacing: '0.8px', fontSize: '24px', fontWeight: 700 }}>PREDICTIONS</h1>
              <p style={{ fontSize: '11px', color: '#999', letterSpacing: '1px', marginTop: '2px', fontWeight: 500 }}>PREMIUM</p>
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

      {/* Hamburger Menu Overlay - Google Style */}
      {menuOpen && (
        <>
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, pointerEvents: 'auto' }}
          />
          
          {/* Menu Sidebar - Google Style */}
          <div style={{ position: 'fixed', top: '80px', left: '0px', width: '240px', height: 'calc(100vh - 180px)', backgroundColor: '#f3f3f3', zIndex: 50, overflow: 'auto', animation: 'slideInLeft 0.3s ease-out', borderRadius: '20px' }} className="dark:bg-[#1c1c1e]">
            <nav style={{ padding: '24px 12px' }} className="space-y-0">
              <Link href={`/${locale}/predictions`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-6 px-6 py-4 rounded-lg transition-colors ${isActive('/predictions') ? 'bg-orange-100 dark:bg-orange-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Eye className="w-6 h-6" style={{ color: isActive('/predictions') ? '#ff9900' : '#565959', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: isActive('/predictions') ? '#ff9900' : '#0f1111' }} className="dark:text-white">Predictions</span>
                </div>
              </Link>

              <Link href={`/${locale}/secrets`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-6 px-6 py-4 rounded-lg transition-colors ${isActive('/secrets') ? 'bg-orange-100 dark:bg-orange-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Lock className="w-6 h-6" style={{ color: isActive('/secrets') ? '#ff9900' : '#565959', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: isActive('/secrets') ? '#ff9900' : '#0f1111' }} className="dark:text-white">Secret</span>
                </div>
              </Link>

              <Link href={`/${locale}/live`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-6 px-6 py-4 rounded-lg transition-colors ${isActive('/live') ? 'bg-orange-100 dark:bg-orange-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Clock className="w-6 h-6" style={{ color: isActive('/live') ? '#ff9900' : '#565959', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: isActive('/live') ? '#ff9900' : '#0f1111' }} className="dark:text-white">Live</span>
                </div>
              </Link>

              <Link href={`/${locale}/contact`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-6 px-6 py-4 rounded-lg transition-colors ${isActive('/contact') ? 'bg-orange-100 dark:bg-orange-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Mail className="w-6 h-6" style={{ color: isActive('/contact') ? '#ff9900' : '#565959', flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', fontWeight: 500, color: isActive('/contact') ? '#ff9900' : '#0f1111' }} className="dark:text-white">Contact</span>
                </div>
              </Link>
            </nav>
          </div>
        </>
      )}

      <div style={{ paddingBottom: '100px' }}>
        {/* Hero Banner - Premium Style */}
        <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)', padding: '32px 24px' }} className="text-white overflow-hidden shadow-lg">
          <div className="flex items-start" style={{ gap: '14px' }}>
            <Zap className="w-8 h-8 flex-shrink-0" style={{ marginTop: '4px', filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.4))', strokeWidth: 1.5 }} />
            <div className="min-w-0">
              <p style={{ fontSize: '16px', fontWeight: 600, lineHeight: '1.5', marginBottom: '8px' }}>
                Premium Predictions from Industry Leaders
              </p>
              <p style={{ fontSize: '13px', opacity: 0.95, fontWeight: 400 }}>
                Real-time insights from Statarea, ScorePrediction, and MyBets—all verified and curated for you
              </p>
            </div>
          </div>
        </div>

      {/* Rotating Stats */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '24px' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
          <div className="flex items-center" style={{ gap: '16px' }}>
            {React.createElement(stats[currentStat].icon, { className: "w-8 h-8 flex-shrink-0", style: { color: '#ff9900' } })}
            <div>
              <p style={{ fontSize: '12px', color: '#565959', marginBottom: '4px' }} className="dark:text-gray-500">{stats[currentStat].label}</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#ff9900' }}>{stats[currentStat].value}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', marginBottom: '20px', letterSpacing: '0.5px' }} className="dark:text-white">Three Premium Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sources.map((source, index) => (
            <Link key={source.name} href={`/${locale}/live`}>
              <div
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9', cursor: 'pointer', transition: 'all 0.3s ease' }}
                className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: source.color === 'blue' ? '#667eea' : source.color === 'purple' ? '#764ba2' : '#10b981' }}>
                    <Star className="w-6 h-6 text-white" style={{ fill: 'white' }} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">
                    {source.name}
                  </h3>
                </div>
                
                <p style={{ fontSize: '13px', color: '#565959', marginBottom: '16px' }} className="dark:text-gray-400">
                  {source.description}
                </p>
                
                <div className="space-y-2">
                  {source.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: source.color === 'blue' ? '#667eea' : source.color === 'purple' ? '#764ba2' : '#10b981' }} />
                      <span style={{ fontSize: '12px', color: '#565959' }} className="dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Suggestions Section - With SignUp Gate */}
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

      {/* Benefits Section */}
      <div style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', borderBottomColor: '#d5d9d9', padding: '32px 24px' }} className="border-y dark:bg-[#1c1c1e] dark:border-[#38383a]">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', marginBottom: '24px', letterSpacing: '0.5px' }} className="dark:text-white">Why Choose Us?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }}
              className="dark:bg-[#2c2c2e] dark:border-[#38383a]"
            >
              <div style={{ width: '40px', height: '40px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ff9900', borderRadius: '10px' }}>
                {React.createElement(benefit.icon, { className: "w-5 h-5 text-white" })}
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f1111', marginBottom: '8px', textAlign: 'center' }} className="dark:text-white">
                {benefit.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#565959', textAlign: 'center' }} className="dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All Predictions Section - Grouped by League */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', marginBottom: '20px', letterSpacing: '0.5px' }} className="dark:text-white">All Predictions by League</h2>
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

      {/* CTA Section */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }} className="text-white shadow-lg">
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Ready to Start Winning?</h2>
          <p style={{ fontSize: '14px', opacity: 0.95, marginBottom: '24px' }}>Access premium predictions from three trusted sources right now</p>
          
          {/* Three Sources Mini Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {sources.map((source) => (
              <Link key={source.name} href={`/${locale}/live`}>
                <div 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255,255,255,0.5)'
                  }}
                  className="hover:shadow-xl hover:scale-105"
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', background: source.color === 'blue' ? '#667eea' : source.color === 'purple' ? '#764ba2' : '#10b981' }}>
                    <Star className="w-4 h-4 text-white" style={{ fill: 'white' }} />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f1111', marginBottom: '4px' }}>{source.name}</p>
                  <p style={{ fontSize: '10px', color: '#565959', lineHeight: '1.3' }}>{source.features[0]}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <button 
            onClick={() => window.location.href = `/${locale}/live`}
            style={{ backgroundColor: 'white', color: '#ff9900', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(255,153,0,0.3)' }}
            className="hover:shadow-xl hover:scale-105"
          >
            View Live Predictions
          </button>
        </div>
      </div>
      </div>

      {/* Bottom Navigation */}
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', padding: '14px 0 env(safe-area-inset-bottom)' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/`} className="flex flex-col items-center justify-center" style={{ color: '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Dashboard</span>
          </Link>
          <Link href={`/${locale}/predictions`} className="flex flex-col items-center justify-center" style={{ color: '#ff9900', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Eye className="w-9 h-9" style={{ filter: 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Predictions</span>
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
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}