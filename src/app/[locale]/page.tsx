'use client';

import React, { useState, useEffect } from 'react';
import { Search, Menu, Calendar, ChevronRight, Trophy, Clock, TrendingUp, Quote } from 'lucide-react';

export default function SoccerPredictionsHome() {
  const [activeTab, setActiveTab] = useState('1x2');
  const [selectedDate, setSelectedDate] = useState('26 November');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

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
      <header style={{ backgroundColor: '#131921' }} className="text-white sticky top-0 z-50 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-10 h-10" style={{ color: '#ff9900', filter: 'drop-shadow(0 2px 8px rgba(255,153,0,0.5))' }} />
            <div>
              <h1 className="text-xl font-bold tracking-tight">SOCCER</h1>
              <p className="text-xs text-gray-400">PREDICTIONS</p>
            </div>
          </div>
          <Menu className="w-7 h-7" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </div>
      </header>

      {/* Tech Quote Banner - Amazon Orange */}
      <div style={{ background: 'linear-gradient(to right, #ff9900, #ffad33)' }} className="text-white px-4 py-3 overflow-hidden shadow-sm">
        <div className="flex items-start gap-2 animate-fade-in">
          <Quote className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))' }} />
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight line-clamp-2">
              "{techQuotes[currentQuoteIndex].quote}"
            </p>
            <p className="text-xs mt-1 opacity-90">
              — {techQuotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selector - Softer Light / iPhone Dark */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a] sticky top-[60px] z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" style={{ color: '#565959', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <span className="text-sm" style={{ color: '#565959' }}>Select date</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#2c2c2e] px-4 py-2 rounded-lg shadow-sm">
            <span className="font-semibold" style={{ color: '#0f1111' }}>26 November</span>
            <ChevronRight className="w-5 h-5" style={{ color: '#565959', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a] overflow-x-auto">
        <div className="flex gap-4 px-4 py-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                color: activeTab === tab.id ? '#ff9900' : '#565959',
                borderBottomColor: activeTab === tab.id ? '#ff9900' : 'transparent'
              }}
              className="whitespace-nowrap pb-2 px-2 font-medium text-sm transition-colors border-b-2 dark:text-gray-400"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a] px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: '#565959', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <input
            type="text"
            placeholder="Search game..."
            style={{ color: '#0f1111', placeholderColor: '#565959' }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2c2c2e] rounded-lg text-sm dark:text-white focus:outline-none focus:ring-2 shadow-sm"
          />
        </div>
      </div>

      {/* Matches List */}
      <div className="pb-20">
        {matches.map((league, idx) => (
          <div key={idx} className="mb-2">
            {/* League Header - Subtle Gray / iPhone Dark */}
            <div style={{ backgroundColor: '#d5d9d9' }} className="dark:bg-[#2c2c2e] px-4 py-2.5 flex items-center gap-2">
              <span className="text-xl">{league.flag}</span>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0f1111' }}>
                {league.league}
              </span>
            </div>
            {/* Games */}
            <div style={{ backgroundColor: '#f3f3f3' }} className="dark:bg-black">
              {league.games.map((game, gidx) => (
                <div
                  key={gidx}
                  style={{ borderBottomColor: '#d5d9d9' }}
                  className="flex items-center justify-between px-4 py-3 border-b dark:border-[#38383a] dark:hover:bg-[#1c1c1e] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-12 text-sm font-medium" style={{ color: '#565959' }}>
                      <Clock className="w-5 h-5 mr-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                      {game.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm dark:text-white truncate" style={{ color: '#0f1111' }}>
                        {game.home}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs px-2 py-0.5 bg-white dark:bg-[#2c2c2e] rounded" style={{ color: '#565959' }}>
                          vs
                        </span>
                        <span className="text-sm truncate" style={{ color: '#565959' }}>
                          {game.away}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Prediction Badge - Amazon Orange */}
                  <div style={{ backgroundColor: '#ff9900' }} className="flex items-center justify-center w-10 h-10 text-white rounded-lg font-bold text-lg ml-2 flex-shrink-0 shadow-md">
                    {game.prediction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation - iPhone Style */}
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 px-4 py-2 safe-area-inset-bottom backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 shadow-lg">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <button className="flex flex-col items-center gap-1" style={{ color: '#ff9900' }}>
            <Trophy className="w-7 h-7" style={{ filter: 'drop-shadow(0 2px 6px rgba(255,153,0,0.4))' }} />
            <span className="text-xs font-medium">All Games</span>
          </button>
          <button className="flex flex-col items-center gap-1" style={{ color: '#565959' }}>
            <div className="relative">
              <Clock className="w-7 h-7" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              <span style={{ backgroundColor: '#ff3b30' }} className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-md">
                1
              </span>
            </div>
            <span className="text-xs">LIVE</span>
          </button>
          <button className="flex flex-col items-center gap-1" style={{ color: '#565959' }}>
            <div className="relative">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ backgroundColor: '#ff9900' }} className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-md">
                3
              </span>
            </div>
            <span className="text-xs">Favorites</span>
          </button>
          <button className="flex flex-col items-center gap-1" style={{ color: '#565959' }}>
            <TrendingUp className="w-7 h-7" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
            <span className="text-xs">News</span>
          </button>
          <button className="flex flex-col items-center gap-1" style={{ color: '#565959' }}>
            <Trophy className="w-7 h-7" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
            <span className="text-xs">Leagues</span>
          </button>
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
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
