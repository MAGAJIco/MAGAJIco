"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function Magajico() {
  const [showAnimations, setShowAnimations] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimations(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] p-6 md:p-12 text-center">
        
        {/* Animated Background Elements - Lazy loaded after initial paint */}
        {showAnimations && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-6 inline-block">
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              MagajiCo
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
            Your All-in-One Sports & Entertainment Hub
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Get AI-powered predictions, live match tracking, social connections, 
            rewards, and more — all in one powerful platform
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="#launcher"
              onClick={(e) => {
                e.preventDefault();
                const launcher = document.querySelector('[aria-label="Open MagajiCo launcher"]') as HTMLButtonElement;
                if (launcher) launcher.click();
              }}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
            >
              Explore Portal
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              href="/en/predictions"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full font-semibold text-lg hover:border-purple-500 dark:hover:border-purple-400 transition-all hover:scale-105"
            >
              View Predictions
            </Link>
          </div>

          {/* Features Highlight - Mobile First: 1 column on mobile, 2 on sm, 4 on md+ */}
          {showAnimations && (
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <span className="text-3xl sm:text-4xl">🎯</span>
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">AI Predictions</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <span className="text-3xl sm:text-4xl">⚡</span>
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Live Matches</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <span className="text-3xl sm:text-4xl">👥</span>
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Social Hub</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform">
              <span className="text-3xl sm:text-4xl">🏆</span>
              <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Earn Rewards</span>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Add gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
