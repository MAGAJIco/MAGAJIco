'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, RefreshCw, TrendingUp } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// Carousel component
const HorizontalCarousel = ({ items, renderItem, title, icon, color = 'from-blue-500 to-blue-600' }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [canScroll, setCanScroll] = useState(true);

  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className={`h-1 flex-1 rounded-full bg-gradient-to-r ${color}`} />
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {scrollPos > 0 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight size={20} className="rotate-180 text-gray-700" />
          </button>
        )}

        {/* Items Container */}
        <div
          id={`carousel-${title}`}
          className="overflow-x-auto scrollbar-hide flex gap-4 pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex-shrink-0"
            >
              {renderItem(item, idx)}
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        {items.length > 3 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function PrivatePredictionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [refreshTime, setRefreshTime] = useState('');
  const [myBetsPredictions, setMyBetsPredictions] = useState([]);
  const [loadingMyBets, setLoadingMyBets] = useState(true);
  const [statareaPredictions, setStatareaPredictions] = useState([]);
  const [loadingStatarea, setLoadingStatarea] = useState(true);
  const [scorePredictions, setScorePredictions] = useState([]);
  const [loadingScorePred, setLoadingScorePred] = useState(true);
  const [secretMatches, setSecretMatches] = useState([]);
  const [weekCalendar, setWeekCalendar] = useState({});
  const [loadingWeek, setLoadingWeek] = useState(true);

  useEffect(() => {
    // Update time on client side only (avoid hydration mismatch)
    setRefreshTime(new Date().toLocaleTimeString());
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate secret matches whenever predictions change
  useEffect(() => {
    calculateSecretMatches();
  }, [statareaPredictions, scorePredictions, myBetsPredictions]);

  const fetchData = async () => {
    fetchMyBetsPredictions();
    fetchStatareaData();
    fetchScorePredictions();
    fetchWeekCalendar();
  };

  // Calculate matches appearing multiple times across scrapers
  const calculateSecretMatches = () => {
    const matchMap = new Map();

    // Helper to normalize team names (case-insensitive)
    const normalizeTeams = (team1, team2) => {
      const sorted = [team1?.toLowerCase().trim(), team2?.toLowerCase().trim()].sort();
      return `${sorted[0]}|${sorted[1]}`;
    };

    // Add Statarea matches
    statareaPredictions.forEach(pred => {
      const key = normalizeTeams(pred.home_team, pred.away_team);
      const existing = matchMap.get(key) || { teams: pred.teams, sources: [], count: 0 };
      if (!existing.sources.includes('Statarea')) {
        existing.sources.push('Statarea');
        existing.count += 1;
      }
      existing.source_data = { ...existing.source_data, statarea: pred };
      matchMap.set(key, existing);
    });

    // Add ScorePrediction matches
    scorePredictions.forEach(pred => {
      const key = normalizeTeams(pred.home_team, pred.away_team);
      const existing = matchMap.get(key) || { teams: pred.teams, sources: [], count: 0 };
      if (!existing.sources.includes('ScorePrediction')) {
        existing.sources.push('ScorePrediction');
        existing.count += 1;
      }
      existing.source_data = { ...existing.source_data, scoreprediction: pred };
      matchMap.set(key, existing);
    });

    // Add MyBets matches
    myBetsPredictions.forEach(pred => {
      const key = normalizeTeams(pred.home_team || '', pred.away_team || '');
      const existing = matchMap.get(key) || { teams: pred.teams, sources: [], count: 0 };
      if (!existing.sources.includes('MyBets')) {
        existing.sources.push('MyBets');
        existing.count += 1;
      }
      existing.source_data = { ...existing.source_data, mybets: pred };
      matchMap.set(key, existing);
    });

    // Filter for matches appearing 2+ times and sort by count
    const filtered = Array.from(matchMap.values())
      .filter(match => match.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setSecretMatches(filtered);
  };

  const fetchMyBetsPredictions = async () => {
    try {
      setLoadingMyBets(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/mybets`);
      if (response.ok) {
        const data = await response.json();
        setMyBetsPredictions(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching mybets:', error);
    } finally {
      setLoadingMyBets(false);
    }
  };

  const fetchStatareaData = async () => {
    try {
      setLoadingStatarea(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/statarea`);
      if (response.ok) {
        const data = await response.json();
        setStatareaPredictions(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching statarea:', error);
    } finally {
      setLoadingStatarea(false);
    }
  };

  const fetchScorePredictions = async () => {
    try {
      setLoadingScorePred(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/scoreprediction`);
      if (response.ok) {
        const data = await response.json();
        setScorePredictions(data.predictions || []);
      }
    } catch (error) {
      console.error('Error fetching scoreprediction:', error);
    } finally {
      setLoadingScorePred(false);
    }
  };

  const fetchWeekCalendar = async () => {
    try {
      setLoadingWeek(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/flashscore-odds?max_odds=1.16`);
      if (response.ok) {
        const data = await response.json();
        setWeekCalendar(data.week_calendar || {});
      }
    } catch (error) {
      console.error('Error fetching week calendar:', error);
    } finally {
      setLoadingWeek(false);
    }
  };

  // Private prediction sources - each gets its own carousel
  const privateSources = [
    {
      id: 1,
      source: 'Today Bet',
      confidence: 73,
      label: 'Home Win',
      emoji: '🏠',
      description: 'Strong home advantage',
      color: 'from-blue-500 to-blue-600',
      icon: '💎'
    },
    {
      id: 2,
      source: 'Statarea',
      confidence: 78,
      label: 'Home Win',
      emoji: '🎯',
      description: 'High probability victory',
      color: 'from-purple-500 to-purple-600',
      icon: '📊'
    },
    {
      id: 3,
      source: 'ScorePrediction.net',
      confidence: 72,
      label: 'Home Win + Over 0.5',
      emoji: '⚽',
      description: 'Combined prediction',
      color: 'from-green-500 to-green-600',
      icon: '🎲'
    },
    {
      id: 4,
      source: 'FlashScore',
      confidence: 65,
      label: 'Odds 1.16',
      emoji: '💰',
      description: 'Betting odds',
      color: 'from-amber-500 to-amber-600',
      icon: '⚡'
    }
  ];

  // Render source card
  const renderSourceCard = (source) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`w-80 rounded-2xl bg-gradient-to-br ${source.color} p-6 text-white shadow-lg cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white/80">{source.source}</p>
          <h3 className="text-2xl font-bold mt-1">{source.emoji}</h3>
        </div>
        <span className="text-3xl">{source.icon}</span>
      </div>

      <p className="text-white/90 text-sm mb-4">{source.description}</p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold">Confidence</span>
          <span className="text-2xl font-bold">{source.confidence}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${source.confidence}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      <p className="text-lg font-bold">{source.label}</p>
    </motion.div>
  );

  // Render statarea card
  const renderStatareCard = (pred) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-80 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg cursor-pointer"
    >
      <p className="text-xs font-semibold text-white/80">Statarea</p>
      <p className="text-sm font-bold mt-2 line-clamp-2">{pred.teams}</p>

      <div className="my-4">
        <p className="text-2xl font-bold mb-3">{pred.prediction_label}</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/10 rounded p-2 text-center">
            <p className="text-xs text-white/70">Home</p>
            <p className="font-bold text-lg">{pred.home_pct}%</p>
          </div>
          <div className="bg-white/10 rounded p-2 text-center">
            <p className="text-xs text-white/70">Draw</p>
            <p className="font-bold text-lg">{pred.draw_pct}%</p>
          </div>
          <div className="bg-white/10 rounded p-2 text-center">
            <p className="text-xs text-white/70">Away</p>
            <p className="font-bold text-lg">{pred.away_pct}%</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">Confidence</span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{pred.confidence}%</span>
      </div>
    </motion.div>
  );

  // Render 2-day bet card (betting-focused)
  const renderStatarea2DayBetCard = (pred) => (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      className="w-full rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-5 text-white shadow-lg cursor-pointer border-2 border-yellow-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-bold text-yellow-100 mb-1">🎯 TOP BET</p>
          <p className="text-sm font-bold line-clamp-1">{pred.teams}</p>
        </div>
        <span className="text-2xl font-bold text-yellow-200">{pred.confidence}%</span>
      </div>

      <div className="bg-black/30 rounded-lg p-3 mb-3">
        <p className="text-2xl font-bold text-center">{pred.prediction_label}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">1</p>
          <p className="font-bold text-lg">{pred.home_pct}%</p>
        </div>
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">X</p>
          <p className="font-bold text-lg">{pred.draw_pct}%</p>
        </div>
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">2</p>
          <p className="font-bold text-lg">{pred.away_pct}%</p>
        </div>
      </div>

      <button className="w-full bg-yellow-300 text-red-700 font-bold py-2 rounded-lg hover:bg-yellow-200 transition-all text-sm">
        💰 Place Bet
      </button>
    </motion.div>
  );

  // Render secret match card (matches appearing in multiple scrapers)
  const renderSecretMatchCard = (match) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-96 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-6 text-white shadow-xl cursor-pointer border-2 border-white/30"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-white/90 tracking-widest">🔮 MAGAJICO SECRET</span>
        <span className="text-2xl font-bold">
          {match.count === 3 ? '⭐⭐⭐' : match.count === 2 ? '⭐⭐' : '⭐'}
        </span>
      </div>

      <p className="text-sm font-bold line-clamp-2 mb-3">{match.teams}</p>

      <div className="bg-black/20 rounded-lg p-3 mb-3">
        <p className="text-xs text-white/80 mb-1">Appears in:</p>
        <div className="flex flex-wrap gap-1">
          {match.sources.map((source) => (
            <span key={source} className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">
              {source}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-2 text-xs">
        <p className="text-white/80">Confidence from sources:</p>
        <div className="flex justify-between mt-1 font-bold">
          {match.source_data?.statarea && (
            <span>📊 {match.source_data.statarea.confidence}%</span>
          )}
          {match.source_data?.scoreprediction && (
            <span>🎲 {match.source_data.scoreprediction.confidence}%</span>
          )}
          {match.source_data?.mybets && (
            <span>🎯 {match.source_data.mybets.confidence}%</span>
          )}
        </div>
      </div>

      <button className="w-full mt-4 bg-white text-orange-500 font-bold py-2 rounded-lg hover:bg-gray-100 transition-all text-sm">
        🎁 Claim Secret Bet
      </button>
    </motion.div>
  );

  // Render score prediction card
  const renderScorePredictionCard = (pred) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-80 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-green-100">{pred.league}</p>
          <p className="text-sm font-bold mt-1 line-clamp-2">{pred.teams}</p>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg p-4 mb-4 text-center">
        <p className="text-4xl font-bold text-yellow-300">{pred.score}</p>
        <p className="text-xs text-white/80 mt-1">{pred.total_goals} Goals</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">Prediction</p>
          <p className="font-bold text-lg">{pred.prediction_label}</p>
        </div>
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">Confidence</p>
          <p className="font-bold text-lg text-yellow-200">{pred.confidence}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">Home %</p>
          <p className="font-bold">{pred.home_goal_prob}%</p>
        </div>
        <div className="bg-white/10 rounded p-2 text-center">
          <p className="text-white/70">Away %</p>
          <p className="font-bold">{pred.away_goal_prob}%</p>
        </div>
      </div>
    </motion.div>
  );

  // Render mybets card
  const renderMyBetsCard = (pred) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="w-80 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg cursor-pointer"
    >
      <p className="text-xs font-semibold text-white/80">MyBets.Today</p>
      <p className="text-sm font-bold mt-2 line-clamp-2">{pred.teams}</p>

      <div className="my-4">
        <p className="text-2xl font-bold mb-2">{pred.prediction_label}</p>
        <p className="text-xs text-white/80">Odds: {pred.odds?.toFixed(2) || 'N/A'}</p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">Confidence</span>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{pred.confidence}%</span>
      </div>
    </motion.div>
  );

  // Render week day carousel card
  const renderDayCard = (date, day) => {
    const matchCount = day.matches_count || 0;
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="w-80 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white shadow-lg cursor-pointer"
      >
        <div className="mb-4">
          <p className="text-sm font-semibold text-white/80">{day.day_name}</p>
          <p className="text-lg font-bold mt-1">{day.date_label}</p>
        </div>

        <div className="bg-white/20 rounded-lg p-4 mb-4">
          <p className="text-xs text-white/80 mb-1">Matches with odds ≤ 1.16</p>
          <p className="text-3xl font-bold">{matchCount}</p>
        </div>

        {matchCount > 0 && day.matches && day.matches[0] && (
          <div className="text-sm">
            <p className="font-semibold mb-2">Top Match:</p>
            <p className="text-xs line-clamp-1">{day.matches[0].home_team} vs {day.matches[0].away_team}</p>
            <p className="text-xs mt-1">Odd: {day.matches[0].best_odd}</p>
          </div>
        )}
      </motion.div>
    );
  };

  const weekDays = Object.entries(weekCalendar).slice(0, 7);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated or missing username
  if (!isAuthenticated || !user?.username) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Lock size={48} className="mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Login Required</h1>
          <p className="text-gray-600 mb-6">
            These advanced predictions are available for authenticated users only. Please log in to access your personalized betting insights.
          </p>
          <Link
            href="/en/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 pb-32">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-14 z-30 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6 px-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
              <Lock size={28} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">Private Predictions - Welcome {user?.firstName || 'User'}</h1>
              <p className="text-slate-300 text-sm">Curated from 4 trusted sources for authenticated users</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-3">Last updated: {refreshTime}</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* MAGAJICO SECRET - Top Priority */}
        {secretMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl animate-spin">🔮</span>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
                MagajiCo Secret Matches
              </h2>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Matches appearing across multiple sources with star ratings</p>
            
            <div className="relative">
              <div
                id="carousel-MagajiCo Secret"
                className="overflow-x-auto scrollbar-hide flex gap-4 pb-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                {secretMatches.map((match, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="flex-shrink-0"
                  >
                    {renderSecretMatchCard(match)}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Section 1: Today Bet */}
        <HorizontalCarousel
          items={[privateSources[0]]}
          renderItem={renderSourceCard}
          title="Today Bet - Your Daily Pick"
          icon="💎"
          color="from-blue-500 to-blue-600"
        />

        {/* Section 2: Statarea */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          {loadingStatarea ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
              <p className="text-gray-500 mt-3">Loading Statarea predictions...</p>
            </div>
          ) : statareaPredictions.length > 0 ? (
            <HorizontalCarousel
              items={statareaPredictions.slice(0, 10)}
              renderItem={renderStatareCard}
              title="Statarea Analytics - Match Probabilities"
              icon="📊"
              color="from-purple-500 to-purple-600"
            />
          ) : (
            <HorizontalCarousel
              items={[privateSources[1]]}
              renderItem={renderSourceCard}
              title="Statarea Analytics"
              icon="📊"
              color="from-purple-500 to-purple-600"
            />
          )}
        </motion.div>

        {/* 2-Day Statarea Bets Section */}
        {statareaPredictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🚀</span>
              <h2 className="text-xl font-bold text-gray-900">2-Day Statarea Bets</h2>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-red-500 to-red-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Top betting opportunities for next 48 hours</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statareaPredictions
                .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
                .slice(0, 6)
                .map((pred, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {renderStatarea2DayBetCard(pred)}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Section 3: ScorePrediction */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          {loadingScorePred ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
              <p className="text-gray-500 mt-3">Loading ScorePrediction games...</p>
            </div>
          ) : scorePredictions.length > 0 ? (
            <HorizontalCarousel
              items={scorePredictions.slice(0, 10)}
              renderItem={renderScorePredictionCard}
              title="ScorePrediction.net - Score Forecasts"
              icon="🎲"
              color="from-green-500 to-green-600"
            />
          ) : (
            <HorizontalCarousel
              items={[privateSources[2]]}
              renderItem={renderSourceCard}
              title="ScorePrediction Network"
              icon="🎲"
              color="from-green-500 to-green-600"
            />
          )}
        </motion.div>

        {/* Section 4: FlashScore */}
        <HorizontalCarousel
          items={[privateSources[3]]}
          renderItem={renderSourceCard}
          title="FlashScore Current Odds"
          icon="⚡"
          color="from-amber-500 to-amber-600"
        />

        {/* MyBets Carousel */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          {loadingMyBets ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
              <p className="text-gray-500 mt-3">Loading predictions...</p>
            </div>
          ) : (
            <HorizontalCarousel
              items={myBetsPredictions.slice(0, 10)}
              renderItem={renderMyBetsCard}
              title="MyBets.Today Predictions"
              icon="🎯"
              color="from-purple-500 to-pink-600"
            />
          )}
        </motion.div>

        {/* Week Calendar Carousel */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          {loadingWeek ? (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto text-gray-400" size={32} />
              <p className="text-gray-500 mt-3">Loading week calendar...</p>
            </div>
          ) : (
            <HorizontalCarousel
              items={weekDays}
              renderItem={([date, day]) => renderDayCard(date, day)}
              title="This Week's Odds Calendar"
              icon="📅"
              color="from-indigo-500 to-blue-600"
            />
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
            <TrendingUp size={40} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-slate-300 mb-4">Predictions refresh every 60 seconds</p>
            <p className="text-xs text-slate-400">🔐 All data is private and for personal use only</p>
          </div>
        </motion.div>
      </div>

      {/* Global Scrollbar Hide CSS */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
