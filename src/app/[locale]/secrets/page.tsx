'use client';

import React, { useEffect, useState } from 'react';
import { Star, Calendar, CalendarDays, TrendingUp, Clock, AlertCircle, Lock, ChevronLeft, ChevronRight, Home, Lightbulb, Radio, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { use } from 'react';

interface SecretMatch {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  league: string;
  home_odds?: number;
  draw_odds?: number;
  away_odds?: number;
  prediction?: string;
  confidence?: number;
}

interface SecretMatchCardProps {
  match: SecretMatch;
  starredCount: Record<string, number>;
}

function SecretMatchCard({ match, starredCount }: SecretMatchCardProps) {
  const homeStars = starredCount[match.home_team] || 0;
  const awayStars = starredCount[match.away_team] || 0;
  const maxStars = Math.max(homeStars, awayStars);

  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{match.date}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span className="text-sm">{match.time}</span>
          </div>
          {maxStars > 0 && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="text-xs text-white font-bold">{maxStars}x</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {match.league}
        </div>

        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                {match.home_team.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{match.home_team}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(homeStars)}
                </div>
              </div>
            </div>
            {match.home_odds && (
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-500">Odds</div>
                <div className="font-bold text-blue-600">{match.home_odds.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 px-2">VS</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                {match.away_team.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{match.away_team}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(awayStars)}
                </div>
              </div>
            </div>
            {match.away_odds && (
              <div className="bg-red-50 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-500">Odds</div>
                <div className="font-bold text-red-600">{match.away_odds.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Draw Odds */}
          {match.draw_odds && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Draw</span>
                <span className="font-semibold text-gray-700">{match.draw_odds.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Prediction */}
          {match.prediction && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Prediction</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-800">{match.prediction}</div>
              {match.confidence && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${match.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">{match.confidence}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FilterType = 'starred' | 'today' | 'week';

export default function SecretsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('secrets');
  const [matches, setMatches] = useState<SecretMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('starred');
  const [starredTeams, setStarredTeams] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 10));
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 26));

  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname === `/${locale}/`;

  // Mock data for demonstration
  const mockMatches: SecretMatch[] = [
    {
      id: '1',
      date: 'Wed 27/11',
      time: '19:45',
      home_team: 'Manchester City',
      away_team: 'Liverpool',
      league: 'Premier League',
      home_odds: 2.10,
      draw_odds: 3.40,
      away_odds: 3.25,
      prediction: 'Liverpool Win',
      confidence: 68
    },
    {
      id: '2',
      date: 'Wed 27/11',
      time: '20:00',
      home_team: 'Real Madrid',
      away_team: 'Barcelona',
      league: 'La Liga',
      home_odds: 1.95,
      draw_odds: 3.60,
      away_odds: 3.80,
      prediction: 'Real Madrid Win',
      confidence: 72
    },
    {
      id: '3',
      date: 'Thu 28/11',
      time: '18:30',
      home_team: 'Bayern Munich',
      away_team: 'Borussia Dortmund',
      league: 'Bundesliga',
      home_odds: 1.75,
      draw_odds: 3.90,
      away_odds: 4.20
    },
    {
      id: '4',
      date: 'Wed 27/11',
      time: '21:00',
      home_team: 'Paris Saint-Germain',
      away_team: 'Manchester City',
      league: 'Champions League',
      home_odds: 2.30,
      draw_odds: 3.20,
      away_odds: 2.90,
      prediction: 'Draw',
      confidence: 55
    }
  ];

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allMatches = mockMatches;
      setMatches(allMatches);

      // Count how many times each team appears
      const counts: Record<string, number> = {};
      allMatches.forEach(m => {
        counts[m.home_team] = (counts[m.home_team] || 0) + 1;
        counts[m.away_team] = (counts[m.away_team] || 0) + 1;
      });

      const starred: Record<string, number> = {};
      Object.entries(counts).forEach(([team, count]) => {
        if (count >= 2) starred[team] = count >= 3 ? 3 : 2;
      });

      setStarredTeams(starred);
    } catch (err) {
      console.error('Error fetching secret matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: '2-digit' });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getIgboMarketDay = (date: Date) => {
    const igboDays = ['Eke', 'Oye', 'Afo', 'Nkwo'];
    const epoch = new Date(2025, 10, 24);
    const diffTime = Math.abs(date.getTime() - epoch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return igboDays[diffDays % 4];
  };

  const calendarDays = Array.from({ length: getDaysInMonth(calendarMonth) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: getFirstDayOfMonth(calendarMonth) }, () => null);

  const filteredMatches = matches.filter(match => {
    if (filter === 'starred') return starredTeams[match.home_team] || starredTeams[match.away_team];
    if (filter === 'today') return match.date.includes('27/11');
    return true;
  });

  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);
    if (newFilter === 'week' || newFilter === 'today') {
      await fetchMatches();
    }
  };

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
                onClick={() => { setActivePage('live'); router.push('/en/live'); }}
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
                onClick={() => setActivePage('secrets')}
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
            Secrets
          </h1>
          <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '500' }}>
            Discover high-value betting opportunities
          </p>
        </div>

        {/* Description Banner */}
        <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '24px' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
          <p style={{ fontSize: '15px', color: '#565959', fontWeight: 500 }} className="dark:text-gray-400">Discover high-value betting opportunities with our curated secret predictions</p>
        </div>

        {/* Calendar Picker - Full Grid */}
        <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '20px 24px', position: 'relative' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
          <button 
            onClick={() => setCalendarOpen(!calendarOpen)}
            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', border: '1px solid #d5d9d9', width: '100%', textAlign: 'center', fontSize: '15px', fontWeight: 600, color: '#0f1111' }}
            className="dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a]"
          >
            📅 {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </button>

          {calendarOpen && (
            <div style={{ position: 'absolute', top: '100%', left: '24px', marginTop: '12px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '20px', zIndex: 50, minWidth: '320px' }} className="dark:bg-[#2c2c2e]">
              {/* Month Navigation with Close Button */}
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" style={{ color: '#0f1111' }} />
                  </button>
                  <button
                    onClick={() => setCalendarOpen(false)}
                    className="cursor-pointer hover:opacity-70 transition-opacity ml-2"
                    title="Close calendar"
                  >
                    <X className="w-5 h-5" style={{ color: '#0f1111' }} />
                  </button>
                </div>
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

        {/* Filter Buttons - Premium Style */}
        <div style={{ backgroundColor: '#f3f3f3', borderBottomColor: '#d5d9d9', padding: '20px 24px' }} className="border-b dark:bg-[#1c1c1e] dark:border-[#38383a]">
          <div className="flex flex-wrap gap-3">
            <button
              style={{
                backgroundColor: filter === 'starred' ? '#ff9900' : 'white',
                color: filter === 'starred' ? 'white' : '#0f1111',
                borderColor: '#d5d9d9',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: filter === 'starred' ? '0 4px 12px rgba(255,153,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
              }}
              className="dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a]"
              onClick={() => handleFilterChange('starred')}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Starred Teams
            </button>
            <button
              style={{
                backgroundColor: filter === 'today' ? '#ff9900' : 'white',
                color: filter === 'today' ? 'white' : '#0f1111',
                borderColor: '#d5d9d9',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: filter === 'today' ? '0 4px 12px rgba(255,153,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
              }}
              className="dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a]"
              onClick={() => handleFilterChange('today')}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Today's Matches
            </button>
            <button
              style={{
                backgroundColor: filter === 'week' ? '#ff9900' : 'white',
                color: filter === 'week' ? 'white' : '#0f1111',
                borderColor: '#d5d9d9',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: filter === 'week' ? '0 4px 12px rgba(255,153,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)'
              }}
              className="dark:bg-[#2c2c2e] dark:text-white dark:border-[#38383a]"
              onClick={() => handleFilterChange('week')}
            >
              <CalendarDays className="w-4 h-4 inline mr-2" />
              This Week
            </button>
          </div>
        </div>

        {/* Stats Bar - Premium Cards */}
        <div style={{ backgroundColor: '#f3f3f3', padding: '20px 24px' }} className="dark:bg-[#1c1c1e]">
          <div className="grid grid-cols-3 gap-3">
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <div style={{ fontSize: '12px', color: '#565959', marginBottom: '8px' }} className="dark:text-gray-500">Total Matches</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f1111' }} className="dark:text-white">{matches.length}</div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <div style={{ fontSize: '12px', color: '#565959', marginBottom: '8px' }} className="dark:text-gray-500">Starred Teams</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff9900' }}>{Object.keys(starredTeams).length}</div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <div style={{ fontSize: '12px', color: '#565959', marginBottom: '8px' }} className="dark:text-gray-500">Current Filter</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ff9900', textTransform: 'capitalize' }}>{filter}</div>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        <div style={{ backgroundColor: '#eaeded', padding: '20px 24px' }} className="dark:bg-black">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderRightColor: '#ff9900' }}></div>
              <div style={{ marginTop: '16px', color: '#565959', fontWeight: 500 }} className="dark:text-gray-400">Loading secret matches...</div>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #d5d9d9' }} className="dark:bg-[#2c2c2e] dark:border-[#38383a]">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#d5d9d9' }} />
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0f1111', marginBottom: '8px' }} className="dark:text-white">No matches found</div>
              <p style={{ color: '#565959' }} className="dark:text-gray-400">Try selecting a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMatches.map(match => (
                <SecretMatchCard key={match.id} match={match} starredCount={starredTeams} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav style={{ backgroundColor: '#f3f3f3', borderTopColor: '#d5d9d9', padding: '14px 0 env(safe-area-inset-bottom)' }} className="border-t dark:bg-[#1c1c1e] dark:border-[#38383a] fixed bottom-0 left-0 right-0 safe-area-inset-bottom backdrop-blur-xl bg-opacity-98 dark:bg-opacity-98 shadow-2xl">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link href={`/${locale}/`} className="flex flex-col items-center justify-center" style={{ color: isActive('/') ? '#ff9900' : '#565959', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Home className="w-9 h-9" style={{ filter: isActive('/') ? 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Home</span>
          </Link>
          <Link href={`/${locale}/secrets`} className="flex flex-col items-center justify-center" style={{ color: '#ff9900', gap: '6px', padding: '8px 0', transition: 'color 0.3s ease' }}>
            <Lock className="w-9 h-9" style={{ filter: 'drop-shadow(0 3px 8px rgba(255,153,0,0.5))', strokeWidth: 1.5 }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2px' }}>Secrets</span>
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