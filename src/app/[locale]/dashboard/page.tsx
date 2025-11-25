'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Trophy, Brain, Zap, BarChart3, TrendingUp, Users, BookOpen, Gamepad2 } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setLiveCount(data.total_matches || 0);
        setStats([
          { label: 'Live Matches', value: data.total_matches || 0, icon: <Zap className="w-6 h-6" />, color: 'text-red-500' },
          { label: 'Avg Confidence', value: `${Math.round(data.avg_confidence || 0)}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-500' },
          { label: 'High Confidence', value: data.high_confidence_count || 0, icon: <Trophy className="w-6 h-6" />, color: 'text-yellow-500' },
          { label: 'Accuracy', value: '90.35%', icon: <Brain className="w-6 h-6" />, color: 'text-blue-500' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const features = [
    {
      title: 'Live Predictions',
      description: 'Real-time AI-powered match predictions',
      icon: <Trophy className="w-8 h-8" />,
      href: `/${locale}/predictions`,
      color: 'from-blue-500 to-blue-600',
      count: liveCount,
    },
    {
      title: 'ML Report',
      description: 'Machine learning model performance',
      icon: <Brain className="w-8 h-8" />,
      href: `/${locale}/ml-report`,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Live Matches',
      description: 'Watch live sports events',
      icon: <Zap className="w-8 h-8" />,
      href: `/${locale}/live`,
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Match Details',
      description: 'Detailed match information & stats',
      icon: <BarChart3 className="w-8 h-8" />,
      href: `/${locale}/matches`,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Leaderboard',
      description: 'Top predictors & rankings',
      icon: <Users className="w-8 h-8" />,
      href: `/${locale}/leaderboard`,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Analytics',
      description: 'Detailed prediction analytics',
      icon: <TrendingUp className="w-8 h-8" />,
      href: `/${locale}/analytics`,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Challenges',
      description: 'Daily prediction challenges',
      icon: <Gamepad2 className="w-8 h-8" />,
      href: `/${locale}/challenges`,
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Help Center',
      description: 'FAQs & support resources',
      icon: <BookOpen className="w-8 h-8" />,
      href: `/${locale}/help`,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">MagajiCo Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Your sports prediction hub</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</h3>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative p-6 flex flex-col h-full">
                <div className="text-gray-900 dark:text-white mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">{feature.description}</p>
                {feature.count !== undefined && (
                  <div className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {feature.count} matches
                  </div>
                )}
                <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Today Matches', emoji: '📅' },
            { name: 'High Confidence', emoji: '⭐' },
            { name: 'My Profile', emoji: '👤' },
            { name: 'Settings', emoji: '⚙️' },
            { name: 'Rewards', emoji: '🎁' },
            { name: 'Community', emoji: '👥' },
          ].map((link) => (
            <button
              key={link.name}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">{link.emoji}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{link.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
