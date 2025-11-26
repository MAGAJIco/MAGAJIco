'use client';

import React, { useState, useEffect, use } from 'react';
import { Zap, TrendingUp, Shield, Clock, ArrowRight, CheckCircle, Star, Trophy, BarChart3, Target, Menu, X, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PredictionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const pathname = usePathname();
  const [currentStat, setCurrentStat] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;
  
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

      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />
          <div style={{ position: 'fixed', top: 0, left: 0, width: '280px', height: '100vh', backgroundColor: '#131921', zIndex: 50, overflow: 'auto', animation: 'slideInLeft 0.3s ease-out' }} className="text-white">
            <div style={{ padding: '20px 24px', borderBottomColor: '#374151' }} className="border-b dark:border-[#38383a] flex items-center justify-between">
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
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-orange-600" style={{ cursor: 'pointer' }}>
                  <Eye className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Predictions</span>
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

      {/* CTA Section */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }} className="text-white shadow-lg">
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Ready to Start Winning?</h2>
          <p style={{ fontSize: '14px', opacity: 0.95, marginBottom: '20px' }}>Access premium predictions from three trusted sources right now</p>
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