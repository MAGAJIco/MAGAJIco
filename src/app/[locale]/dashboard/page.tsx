'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Brain, Zap, BarChart3, TrendingUp, Users, BookOpen, Gamepad2, Star, Calendar, Settings, Gift, UserCircle, Activity, Clock, Target, Award } from 'lucide-react';

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  bgColor: string;
}

interface RecentPrediction {
  id: number;
  team1: string;
  team2: string;
  confidence: number;
  outcome: string;
  time: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentPredictions();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulated API call - replace with actual endpoint
      setTimeout(() => {
        const mockData = {
          total_matches: 24,
          avg_confidence: 87,
          high_confidence_count: 12,
          accuracy: 90.35,
          todayMatches: 8,
          winRate: 78.5
        };
        
        setLiveCount(mockData.total_matches);
        setStats([
          { 
            label: 'Live Matches', 
            value: mockData.total_matches, 
            icon: <Zap className="w-6 h-6" />, 
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            trend: '+3 today'
          },
          { 
            label: 'Avg Confidence', 
            value: `${mockData.avg_confidence}%`, 
            icon: <TrendingUp className="w-6 h-6" />, 
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            trend: '+2.5%'
          },
          { 
            label: 'High Confidence', 
            value: mockData.high_confidence_count, 
            icon: <Trophy className="w-6 h-6" />, 
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            trend: '50% of total'
          },
          { 
            label: 'AI Accuracy', 
            value: `${mockData.accuracy}%`, 
            icon: <Brain className="w-6 h-6" />, 
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            trend: '+1.2%'
          },
          { 
            label: 'Today\'s Matches', 
            value: mockData.todayMatches, 
            icon: <Calendar className="w-6 h-6" />, 
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            trend: 'Updated now'
          },
          { 
            label: 'Win Rate', 
            value: `${mockData.winRate}%`, 
            icon: <Target className="w-6 h-6" />, 
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            trend: '+5.2%'
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  const fetchRecentPredictions = () => {
    // Mock recent predictions
    setRecentPredictions([
      { id: 1, team1: 'Man City', team2: 'Arsenal', confidence: 92, outcome: 'Win', time: '2h ago' },
      { id: 2, team1: 'Barcelona', team2: 'Real Madrid', confidence: 88, outcome: 'Draw', time: '4h ago' },
      { id: 3, team1: 'Liverpool', team2: 'Chelsea', confidence: 85, outcome: 'Win', time: '6h ago' },
    ]);
  };

  const features = [
    {
      title: 'Live Predictions',
      description: 'Real-time AI-powered match predictions',
      icon: <Trophy className="w-8 h-8" />,
      href: '/predictions',
      color: 'from-blue-500 to-blue-600',
      count: liveCount,
    },
    {
      title: 'Secrets ⭐',
      description: 'Exclusive starred predictions',
      icon: <Star className="w-8 h-8" />,
      href: '/secrets',
      color: 'from-yellow-500 to-orange-500',
      badge: 'Premium',
    },
    {
      title: 'ML Report',
      description: 'Machine learning model performance',
      icon: <Brain className="w-8 h-8" />,
      href: '/ml-report',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Live Matches',
      description: 'Watch live sports events',
      icon: <Zap className="w-8 h-8" />,
      href: '/live',
      color: 'from-red-500 to-red-600',
      badge: 'Live',
    },
    {
      title: 'Match Details',
      description: 'Detailed match information & stats',
      icon: <BarChart3 className="w-8 h-8" />,
      href: '/matches',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Leaderboard',
      description: 'Top predictors & rankings',
      icon: <Users className="w-8 h-8" />,
      href: '/leaderboard',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Analytics',
      description: 'Detailed prediction analytics',
      icon: <TrendingUp className="w-8 h-8" />,
      href: '/analytics',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Challenges',
      description: 'Daily prediction challenges',
      icon: <Gamepad2 className="w-8 h-8" />,
      href: '/challenges',
      color: 'from-pink-500 to-pink-600',
      badge: 'New',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back! 👋</h1>
                <p className="text-blue-100 text-lg">Your sports prediction hub powered by AI</p>
              </div>
              <Activity className="w-16 h-16 opacity-30 hidden md:block" />
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">Premium Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Performance Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))
            ) : (
              stats.map((stat) => (
                <div key={stat.label} className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${stat.color} p-3 rounded-lg bg-white dark:bg-gray-800`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</h3>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    {stat.trend && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stat.trend}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Grid - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      {feature.badge && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          feature.badge === 'Live' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          feature.badge === 'New' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{feature.description}</p>
                    {feature.count !== undefined && (
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {feature.count} active matches
                      </div>
                    )}
                    <div className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Explore <span>→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Recent Predictions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Recent Predictions
              </h3>
              <div className="space-y-3">
                {recentPredictions.map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {pred.team1} vs {pred.team2}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pred.time} • {pred.outcome}
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${
                      pred.confidence >= 90 ? 'text-green-500' :
                      pred.confidence >= 80 ? 'text-blue-500' :
                      'text-yellow-500'
                    }`}>
                      {pred.confidence}%
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View All Predictions →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Profile', emoji: '👤', icon: <UserCircle className="w-5 h-5" /> },
                  { name: 'Settings', emoji: '⚙️', icon: <Settings className="w-5 h-5" /> },
                  { name: 'Rewards', emoji: '🎁', icon: <Gift className="w-5 h-5" /> },
                  { name: 'Help', emoji: '📚', icon: <BookOpen className="w-5 h-5" /> },
                ].map((link) => (
                  <button
                    key={link.name}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5"
                  >
                    <div className="text-gray-600 dark:text-gray-300 mb-2 flex justify-center">
                      {link.icon}
                    </div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{link.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}