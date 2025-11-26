'use client';

import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Shield, Clock, ArrowRight, CheckCircle, Star, Trophy, BarChart3, Target } from 'lucide-react';

export default function HomePage() {
  const [currentStat, setCurrentStat] = useState(0);
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-12 h-12 text-yellow-300" />
              <h1 className="text-5xl sm:text-6xl font-bold text-white">
                Premium Predictions
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto">
              Harness the power of three industry-leading prediction platforms
            </p>
            
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Get real-time predictions from Statarea, ScorePrediction, and MyBets—all in one powerful dashboard
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={() => window.location.href = '/predictions'}
                className="group px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                View Predictions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
                Learn More
              </button>
            </div>

            {/* Rotating Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-4">
                {React.createElement(stats[currentStat].icon, { className: "w-8 h-8 text-yellow-300" })}
                <div className="text-left">
                  <p className="text-3xl font-bold text-white">{stats[currentStat].value}</p>
                  <p className="text-blue-200">{stats[currentStat].label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Three Premium Sources, One Platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We aggregate predictions from the most trusted names in sports analytics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sources.map((source, index) => (
            <div
              key={source.name}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:-translate-y-2"
            >
              <div className={`h-2 bg-gradient-to-r ${colorMap[source.color]}`}></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorMap[source.color]} flex items-center justify-center`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {source.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {source.description}
                </p>
                
                <div className="space-y-2">
                  {source.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 text-${source.color}-600`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the advantage of consolidated, verified predictions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {React.createElement(benefit.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-12 sm:px-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Access premium predictions from three trusted sources right now
            </p>
            <button 
              onClick={() => window.location.href = '/predictions'}
              className="group px-10 py-5 bg-white text-blue-600 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all inline-flex items-center gap-3"
            >
              View Live Predictions
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">© 2024 Premium Predictions. All rights reserved.</p>
            <p className="text-sm">Powered by Statarea, ScorePrediction & MyBets</p>
          </div>
        </div>
      </div>
    </div>
  );
}