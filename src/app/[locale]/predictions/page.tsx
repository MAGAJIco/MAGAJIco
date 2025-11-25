'use client';
import React, { useState, useEffect } from 'react';
import { Lock, TrendingUp, Target, Eye, RefreshCw } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

export default function PrivatePredictionsPage() {
  const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString());
  const [myBetsPredictions, setMyBetsPredictions] = useState([]);
  const [loadingMyBets, setLoadingMyBets] = useState(true);
  const [activeTab, setActiveTab] = useState('private');

  useEffect(() => {
    fetchMyBetsPredictions();
    const interval = setInterval(fetchMyBetsPredictions, 60000);
    return () => clearInterval(interval);
  }, []);

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
      console.error('Error fetching mybets predictions:', error);
    } finally {
      setLoadingMyBets(false);
      setRefreshTime(new Date().toLocaleTimeString());
    }
  };

  // Private prediction sources
  const privatePredictions = [
    {
      id: 1,
      source: 'Today Bet',
      confidence: 73,
      type: 'home_win',
      label: 'Home Win',
      emoji: '🏠',
      description: 'Strong home advantage prediction',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      source: 'Statarea',
      confidence: 78,
      type: 'home_win',
      label: 'Home Win',
      emoji: '🎯',
      description: 'High probability home victory',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      source: 'ScorePrediction.net',
      confidence: 72,
      type: 'over_0_5',
      label: 'Home Win + Over 0.5',
      emoji: '⚽',
      description: 'Combined prediction: home win & goals',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      source: 'FlashScore',
      confidence: 65,
      type: 'odds',
      label: 'Odds 1.16',
      emoji: '💰',
      description: 'Current betting odds snapshot',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const getConfidenceRating = (confidence) => {
    if (confidence >= 75) return '🔥 Hot';
    if (confidence >= 70) return '⚡ Strong';
    if (confidence >= 65) return '👍 Good';
    return '📊 Fair';
  };

  const getConfidenceIndicator = (confidence) => {
    if (confidence >= 75) return 'bg-red-500';
    if (confidence >= 70) return 'bg-yellow-500';
    if (confidence >= 65) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-14 z-30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} />
            <h1 className="text-2xl font-bold">Private Predictions</h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('private')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'private'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🔒 My Sources
            </button>
            <button
              onClick={() => setActiveTab('mybets')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === 'mybets'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🎯 MyBets.Today
              {loadingMyBets && <RefreshCw size={14} className="animate-spin" />}
            </button>
          </div>
          
          <p className="text-slate-300 text-sm">Updated {refreshTime}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'private' ? (
          <>
            {/* Info Banner - Private */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Eye className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Private Dashboard</p>
                <p className="text-blue-700 text-sm">These predictions are aggregated from your 4 most trusted sources. Only you can see this data.</p>
              </div>
            </div>

            {/* Prediction Cards Grid - Private */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {privatePredictions.map((pred) => (
            <div
              key={pred.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${pred.color} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{pred.source}</h3>
                    <p className="text-white/80 text-sm">{pred.description}</p>
                  </div>
                  <span className="text-3xl">{pred.emoji}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Prediction Label */}
                <div className="mb-4">
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Prediction</p>
                  <p className="text-lg font-bold text-gray-900">{pred.label}</p>
                </div>

                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Confidence</p>
                    <span className="text-lg font-bold text-gray-900">{pred.confidence}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getConfidenceIndicator(pred.confidence)} transition-all duration-500`}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {getConfidenceRating(pred.confidence)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Source Reliability</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < (pred.confidence / 20) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

            {/* Summary Section */}
            <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target size={24} />
                <h2 className="text-xl font-bold">Quick Summary</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-1">Average Confidence</p>
                  <p className="text-3xl font-bold">
                    {Math.round(
                      privatePredictions.reduce((sum, p) => sum + p.confidence, 0) /
                        privatePredictions.length
                    )}%
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-1">Highest Prediction</p>
                  <p className="text-3xl font-bold">
                    {Math.max(...privatePredictions.map(p => p.confidence))}%
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {privatePredictions.find(p => p.confidence === Math.max(...privatePredictions.map(p => p.confidence)))?.source}
                  </p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-1">Consensus</p>
                  <p className="text-lg font-bold">🏠 Home Win</p>
                  <p className="text-xs text-slate-300 mt-1">All sources align</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>🔐 Your private predictions dashboard • Last updated {refreshTime}</p>
              <p className="mt-1 text-xs">Confidential data - for personal use only</p>
            </div>
          </>
        ) : (
          <>
            {/* MyBets.Today Tab */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <TrendingUp className="text-purple-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-purple-900">MyBets.Today Recommendations</p>
                <p className="text-purple-700 text-sm">Live soccer predictions scraped from mybets.today</p>
              </div>
            </div>

            {loadingMyBets ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <RefreshCw className="animate-spin text-gray-400" size={32} />
                  <p className="text-gray-500 mt-3">Loading predictions...</p>
                </div>
              </div>
            ) : myBetsPredictions.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-900 font-medium">No predictions found</p>
                <p className="text-yellow-700 text-sm mt-1">Try refreshing or check mybets.today directly</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBetsPredictions.map((pred: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                      <h3 className="font-bold text-sm line-clamp-2">{pred.teams || 'Unknown Match'}</h3>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      {/* Prediction */}
                      <div className="mb-4">
                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">Prediction</p>
                        <p className="text-lg font-bold text-gray-900">
                          {pred.prediction === '1' ? '🏠 Home Win' :
                           pred.prediction === 'X' ? '🤝 Draw' :
                           pred.prediction === '2' ? '✈️ Away Win' :
                           pred.prediction === 'OVER' ? '⬆️ Over' :
                           pred.prediction === 'UNDER' ? '⬇️ Under' :
                           pred.prediction}
                        </p>
                      </div>

                      {/* Confidence */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-600 text-xs font-semibold uppercase">Confidence</p>
                          <span className="text-lg font-bold text-gray-900">{pred.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* Odds */}
                      {pred.odds > 0 && (
                        <div className="bg-gray-100 rounded p-3 mt-4">
                          <p className="text-gray-600 text-xs font-semibold uppercase mb-1">Current Odds</p>
                          <p className="text-xl font-bold text-gray-900">{pred.odds.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>🔗 Source: mybets.today • Last updated {refreshTime}</p>
              <p className="mt-1 text-xs">Predictions updated every 60 seconds</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
