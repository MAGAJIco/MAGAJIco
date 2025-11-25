'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Brain, Zap, BarChart3, TrendingUp, Users, Gamepad2, BookOpen } from 'lucide-react';

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();

  const sections = [
    {
      category: 'Main Features',
      items: [
        { title: 'Live Predictions', emoji: '🎯', href: `/${locale}/predictions`, desc: 'AI-powered match predictions' },
        { title: 'ML Dashboard', emoji: '🧠', href: `/${locale}/ml-report`, desc: 'Model performance metrics' },
        { title: 'Live Matches', emoji: '⚡', href: `/${locale}/live`, desc: 'Watch live events' },
        { title: 'Match Details', emoji: '📊', href: `/${locale}/matches`, desc: 'In-depth match info' },
      ],
    },
    {
      category: 'Community',
      items: [
        { title: 'Leaderboard', emoji: '🏆', href: `/${locale}/leaderboard`, desc: 'Top predictors' },
        { title: 'Challenges', emoji: '🎯', href: `/${locale}/challenges`, desc: 'Daily competitions' },
        { title: 'Analytics', emoji: '📈', href: `/${locale}/analytics`, desc: 'Your statistics' },
      ],
    },
    {
      category: 'Support',
      items: [
        { title: 'Help Center', emoji: '❓', href: `/${locale}/help`, desc: 'FAQs & guides' },
      ],
    },
  ];

  const quickLinks = [
    { emoji: '🏠', label: 'Home', action: () => router.push(`/${locale}`) },
    { emoji: '🔍', label: 'Search', action: () => {} },
    { emoji: '⭐', label: 'Favorites', action: () => {} },
    { emoji: '👤', label: 'Profile', action: () => {} },
    { emoji: '⚙️', label: 'Settings', action: () => router.push(`/${locale}/settings`) },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to MagajiCo
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your AI-powered sports prediction platform. Get instant predictions for thousands of matches worldwide.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: '90.35%', desc: 'Model Accuracy' },
          { label: '5+', desc: 'Live Matches' },
          { label: '7', desc: 'Features' },
          { label: '24/7', desc: 'Predictions' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.label}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {sections.map((section) => (
        <div key={section.category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{section.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.items.map((item) => (
              <button
                key={item.title}
                onClick={() => router.push(item.href)}
                className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 text-left p-6 hover:border-blue-400 dark:hover:border-blue-600"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                <div className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-block">
                  Open →
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="my-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Start Making Predictions Today</h2>
        <p className="mb-6 opacity-90">Get instant AI-powered predictions for your favorite sports matches</p>
        <button
          onClick={() => router.push(`/${locale}/predictions`)}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          View Live Predictions
        </button>
      </div>

      {/* Quick Access */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 hover:border-blue-400"
            >
              <div className="text-2xl mb-2">{link.emoji}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{link.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 dark:text-gray-400 mb-8">
        <p>© 2025 MagajiCo • Your Sports Prediction Hub</p>
      </div>
    </div>
  );
}
