'use client';

import React, { useState, useEffect, use } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Menu, Calendar, ChevronRight, ChevronLeft, Trophy, Clock, TrendingUp, Quote, Eye, Lock, Users, X, BarChart3, Zap, Flame, Target, TrendingDown, Heart, Settings } from 'lucide-react';

export default function SoccerPredictionsHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('1x2');
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 26));
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 10));
  
  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;

  const formatDate = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getIgboMarketDay = (date: Date) => {
    const igboDays = ['Eke', 'Oye', 'Afo', 'Nkwo'];
    const epoch = new Date(2025, 10, 24); // November 24, 2025 is Eke
    const diffTime = Math.abs(date.getTime() - epoch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return igboDays[diffDays % 4];
  };

  const calendarDays = Array.from({ length: getDaysInMonth(calendarMonth) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: getFirstDayOfMonth(calendarMonth) }, () => null);

  const techQuotes = [
    { author: 'Larry Page', quote: 'Always deliver more than expected.', count: 2 },
    { author: 'Larry Page', quote: 'If you\'re changing the world, you\'re working on important things.', count: 2 },
    { author: 'Jeff Bezos', quote: 'We see our customers as invited guests to a party.', count: 3 },
    { author: 'Jeff Bezos', quote: 'If you double the number of experiments you do per year, you\'re going to double your inventiveness.', count: 3 },
    { author: 'Jeff Bezos', quote: 'The best customer service is if the customer doesn\'t need to call you.', count: 3 },
    { author: 'Mark Zuckerberg', quote: 'Move fast and break things.', count: 2 },
    { author: 'Mark Zuckerberg', quote: 'The biggest risk is not taking any risk.', count: 2 },
    { author: 'Elon Musk', quote: 'When something is important enough, you do it even if the odds are not in your favor.', count: 1 },
    { author: 'Jack Ma', quote: 'Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.', count: 2 },
    { author: 'Jack Ma', quote: 'If you don\'t give up, you still have a chance.', count: 2 }
  ];

  const tabs = [
    { id: '1x2', label: 'Predictions 1X2' },
    { id: 'over', label: 'Under/Over 2.5' },
    { id: 'btts', label: 'Both Teams To Score' }
  ];

  const matches = [
    {
      league: 'BOLIVIA COPA DE LA DIVISIÓN PROFESIONAL',
      flag: '🇧🇴',
      games: [
        { time: '19:00', home: 'Guabirá', away: 'The Strongest', prediction: '1' },
        { time: '22:00', home: 'Gualberto Villarroel SJ', away: 'Nacional Potosí', prediction: '1' }
      ]
    },
    {
      league: 'BOSNIA 1ST LEAGUE - RS',
      flag: '🇧🇦',
      games: [
        { time: '12:00', home: 'BSK Banja Luka', away: 'Leotar', prediction: '1' }
      ]
    },
    {
      league: 'BRAZIL SERIE A',
      flag: '🇧🇷',
      games: [
        { time: '00:30', home: 'Atletico Mineiro', away: 'Flamengo', prediction: '2' },
        { time: '00:30', home: 'Gremio', away: 'Palmeiras', prediction: '1' },
        { time: '22:00', home: 'Bragantino', away: 'Fortaleza', prediction: '1' }
      ]
    },
    {
      league: 'COLOMBIA PRIMERA A',
      flag: '🇨🇴',
      games: [
        { time: '00:30', home: 'Independiente Santa Fe', away: 'Deportes Tolima', prediction: '1' },
        { time: '23:30', home: 'Atletico Bucaramanga', away: 'Fortaleza CEIF', prediction: '1' }
      ]
    },
    {
      league: 'ECUADOR COPA ECUADOR',
      flag: '🇪🇨',
      games: [
        { time: '00:00', home: 'Universidad Catolica', away: 'Deportivo Cuenca', prediction: '1' }
      ]
    }
  ];

  const competitions = [
    { name: 'Champions League', flag: '🇪🇺', region: 'EUROPE', count: 9 },
    { name: 'Primera División', flag: '🇦🇩', region: 'ANDORRA', count: 2 },
    { name: 'Girabola', flag: '🇦🇴', region: 'ANGOLA', count: 1 },
    { name: 'First League', flag: '🇦🇲', region: 'ARMENIA', count: 5 },
    { name: 'AFC Champions League', flag: '🌏', region: 'ASIA', count: 2 },
    { name: 'AFC Champions League 2', flag: '🌏', region: 'ASIA', count: 6 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % techQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#eaeded', minHeight: '100vh' }} className="dark:bg-black">
      {/* Main Header Bar - Amazon Dark Navy / iPhone Dark */}
      <header style={{ backgroundColor: '#131921' }} className="text-white sticky top-0 z-50 shadow-lg">
        <div style={{ padding: '18px 24px' }} className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '18px' }}>
            <Trophy className="w-12 h-12" style={{ color: '#ff9900', filter: 'drop-shadow(0 3px 12px rgba(255,153,0,0.6))', strokeWidth: 1.5 }} />
            <div>
              <h1 style={{ letterSpacing: '0.8px', fontSize: '24px', fontWeight: 700 }}>SOCCER</h1>
              <p style={{ fontSize: '11px', color: '#999', letterSpacing: '1px', marginTop: '2px', fontWeight: 500 }}>PREDICTIONS</p>
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
          {/* Backdrop */}
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />
          
          {/* Menu Sidebar */}
          <div style={{ position: 'fixed', top: 0, left: 0, width: '280px', height: '100vh', backgroundColor: '#131921', zIndex: 50, overflow: 'auto', animation: 'slideInLeft 0.3s ease-out' }} className="text-white">
            <div style={{ padding: '20px 24px', borderBottomColor: '#374151' }} className="border-b dark:border-[#38383a] flex items-center justify-between">
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav style={{ padding: '24px 16px' }} className="space-y-2">
              <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('') ? 'bg-orange-600' : 'hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Trophy className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Dashboard</span>
                </div>
              </Link>

              <Link href={`/${locale}/predictions`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/predictions') ? 'bg-orange-600' : 'hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Eye className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Predictions</span>
                </div>
              </Link>

              <Link href={`/${locale}/live`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/live') ? 'bg-orange-600' : 'hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Clock className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>LIVE</span>
                </div>
              </Link>

              <Link href={`/${locale}/secrets`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/secrets') ? 'bg-orange-600' : 'hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Lock className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Secrets</span>
                </div>
              </Link>

              <Link href={`/${locale}/social`} onClick={() => setMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/social') ? 'bg-orange-600' : 'hover:bg-gray-800'}`} style={{ cursor: 'pointer' }}>
                  <Users className="w-5 h-5" style={{ color: '#ff9900' }} />
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>Social</span>
                </div>
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Tech Quote Banner - Amazon Orange */}
      <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)', padding: '20px 24px' }} className="text-white overflow-hidden shadow-lg">
        <div className="flex items-start" style={{ gap: '14px' }}>
          <Quote className="w-6 h-6 flex-shrink-0" style={{ marginTop: '4px', filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.4))', strokeWidth: 1.5 }} />
          <div className="min-w-0">
            <p style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.5', marginBottom: '8px' }}>
              "{techQuotes[currentQuoteIndex].quote}"
            </p>
            <p style={{ fontSize: '13px', opacity: 0.95, fontWeight: 400 }}>
              — {techQuotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selector - Softer Light / iPhone Dark */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '16px 24px', position: 'relative' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: '12px' }}>
            <Calendar className="w-7 h-7" style={{ color: '#565959', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '15px', color: '#565959', fontWeight: 500 }}>Select date</span>
          </div>
          <button 
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="flex items-center gap-3 bg-white dark:bg-[#2c2c2e] rounded-xl shadow-md hover:shadow-lg transition-all" 
            style={{ padding: '12px 16px', cursor: 'pointer', border: 'none' }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">{formatDate(selectedDate)}</span>
            <ChevronRight className="w-5 h-5" style={{ color: '#565959', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))', strokeWidth: 2.5, transform: calendarOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
          </button>
        </div>

        {/* Calendar Picker */}
        {calendarOpen && (
          <div style={{ position: 'absolute', top: '100%', right: '24px', marginTop: '12px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '20px', zIndex: 50, minWidth: '320px' }} className="dark:bg-[#2c2c2e]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: '#0f1111' }} />
              </button>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </span>
              <button 
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" style={{ color: '#0f1111' }} />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#565959' }} className="dark:text-gray-400 h-8 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, idx) => (
                <div key={`empty-${idx}`} style={{ height: '32px' }}></div>
              ))}
              {calendarDays.map(day => {
                const dateObj = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                const marketDay = getIgboMarketDay(dateObj);
                const marketDayColors = { 'Eke': '#667eea', 'Oye': '#764ba2', 'Afo': '#f093fb', 'Nkwo': '#4facfe' };
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <button
                      onClick={() => {
                        setSelectedDate(dateObj);
                        setCalendarOpen(false);
                      }}
                      style={{
                        height: '32px',
                        width: '32px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#ff9900' : 'transparent',
                        color: isSelected ? 'white' : '#0f1111',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      {day}
                    </button>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: marketDayColors[marketDay], letterSpacing: '0.3px', minHeight: '10px' }} className="dark:text-opacity-80">
                      {marketDay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* App Grid - Google-style Feature Tiles */}
      <div style={{ backgroundColor: '#eaeded', padding: '32px 24px' }} className="dark:bg-black">
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1111', marginBottom: '20px', letterSpacing: '0.5px' }} className="dark:text-white">Quick Features</h2>
        <div className="grid grid-cols-3 gap-4" style={{ maxWidth: '100%' }}>
          {/* Trending Predictions */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <Flame className="w-8 h-8" style={{ color: '#ff9900' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">Trending</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Hot Picks</span>
            </div>
          </div>

          {/* Expert Tips */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <Target className="w-8 h-8" style={{ color: '#667eea' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">Expert Tips</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Pro Advice</span>
            </div>
          </div>

          {/* Win Streaks */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <TrendingUp className="w-8 h-8" style={{ color: '#10b981' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">Win Streaks</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Top Picks</span>
            </div>
          </div>

          {/* Predictions */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <Eye className="w-8 h-8" style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">All Predictions</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Full Coverage</span>
            </div>
          </div>

          {/* Favorites */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <Heart className="w-8 h-8" style={{ color: '#ef4444' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">My Favorites</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Saved Matches</span>
            </div>
          </div>

          {/* Analytics */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '18px 16px', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #d5d9d9'
            }}
            className="dark:bg-[#2c2c2e] dark:border-[#38383a] hover:shadow-xl hover:scale-105"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
              <BarChart3 className="w-8 h-8" style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f1111' }} className="dark:text-white">Analytics</span>
              <span style={{ fontSize: '11px', color: '#565959' }} className="dark:text-gray-400">Statistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a] overflow-x-auto">
        <div className="flex" style={{ gap: '32px', padding: '16px 24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                color: activeTab === tab.id ? '#ff9900' : '#565959',
                borderBottomColor: activeTab === tab.id ? '#ff9900' : 'transparent',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '0.2px',
                paddingBottom: '8px',
                borderBottom: '2px solid',
                transition: 'all 0.3s ease'
              }}
              className="whitespace-nowrap dark:text-gray-400"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '18px 24px' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
        <div className="relative">
          <Search className="absolute w-6 h-6" style={{ color: '#565959', left: '14px', top: '50%', transform: 'translateY(-50%)', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))', strokeWidth: 1.5 }} />
          <input
            type="text"
            placeholder="Search game..."
            style={{ color: '#0f1111', fontSize: '15px', paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            className="w-full bg-white dark:bg-[#2c2c2e] rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-md"
          />
        </div>
      </div>

      {/* Matches List */}
      <div style={{ paddingBottom: '100px' }}>
        {matches.map((league, idx) => (
          <div key={idx} style={{ marginBottom: '8px' }}>
            {/* League Header - Subtle Gray / iPhone Dark */}
            <div style={{ backgroundColor: '#d5d9d9', padding: '14px 24px', gap: '12px' }} className="dark:bg-[#2c2c2e] flex items-center">
              <span style={{ fontSize: '20px' }}>{league.flag}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f1111', letterSpacing: '0.8px' }} className="uppercase">
                {league.league}
              </span>
            </div>
            {/* Games */}
            <div style={{ backgroundColor: '#f3f3f3' }} className="dark:bg-black">
              {league.games.map((game, gidx) => (
                <div
                  key={gidx}
                  style={{ borderBottomColor: '#d5d9d9', padding: '18px 24px' }}
                  className="flex items-center justify-between border-b dark:border-[#38383a] dark:hover:bg-[#1c1c1e] transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0" style={{ gap: '16px' }}>
                    <div className="flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ color: '#565959', gap: '6px', minWidth: '50px' }}>
                      <Clock className="w-5 h-5" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))', strokeWidth: 1.5 }} />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{game.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontWeight: 600, fontSize: '15px', color: '#0f1111' }} className="dark:text-white truncate">
                        {game.home}
                      </div>
                      <div className="flex items-center mt-2" style={{ gap: '8px' }}>
                        <span className="bg-white dark:bg-[#2c2c2e] rounded" style={{ color: '#565959', fontSize: '12px', padding: '4px 8px', fontWeight: 500 }}>
                          vs
                        </span>
                        <span style={{ fontSize: '14px', color: '#565959' }} className="truncate">
                          {game.away}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Prediction Badge - Amazon Orange */}
                  <div style={{ backgroundColor: '#ff9900', width: '44px', height: '44px', marginLeft: '16px', borderRadius: '12px' }} className="flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <span style={{ fontSize: '20px', fontWeight: 700 }}>{game.prediction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation - iPhone Style */}
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', padding: '14px 0 env(safe-area-inset-bottom)' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/`} className="flex flex-col items-center justify-center" style={{ color: isActive('/') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Trophy className="w-9 h-9" style={{ filter: isActive('/') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Dashboard</span>
          </Link>
          <Link href={`/${locale}/predictions`} className="flex flex-col items-center justify-center" style={{ color: isActive('/predictions') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Eye className="w-9 h-9" style={{ filter: isActive('/predictions') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Predictions</span>
          </Link>
          <Link href={`/${locale}/live`} className="flex flex-col items-center justify-center relative" style={{ color: isActive('/live') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <div className="relative flex items-center justify-center">
              <Clock className="w-9 h-9" style={{ filter: isActive('/live') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
              <span style={{ backgroundColor: '#ff3b30', width: '20px', height: '20px', fontSize: '10px', fontWeight: 700 }} className="absolute -top-1.5 -right-1.5 text-white rounded-full flex items-center justify-center shadow-lg">
                1
              </span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>LIVE</span>
          </Link>
          <Link href={`/${locale}/secrets`} className="flex flex-col items-center justify-center" style={{ color: isActive('/secrets') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Lock className="w-9 h-9" style={{ filter: isActive('/secrets') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Secrets</span>
          </Link>
          <Link href={`/${locale}/social`} className="flex flex-col items-center justify-center" style={{ color: isActive('/social') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Users className="w-9 h-9" style={{ filter: isActive('/social') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Social</span>
          </Link>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
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
