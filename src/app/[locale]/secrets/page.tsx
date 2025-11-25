'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Lock, TrendingUp, Target, Zap, Calendar, Trophy, Eye } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';

interface SecretMatch {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  time: string;
  date: string;
  odds_1: number;
  odds_x: number;
  odds_2: number;
  best_prediction: string;
  prediction_label: string;
  best_odd: number;
  confidence: number;
  starred: boolean;
}

export default function SecretsPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [secretMatches, setSecretMatches] = useState<SecretMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    fetchSecretMatches();
  }, []);

  const fetchSecretMatches = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/flashscore-odds`);
      
      if (response.ok) {
        const data = await response.json();
        const allMatches: SecretMatch[] = [];
        
        Object.entries(data.week_calendar || {}).forEach(([date, dayData]: [string, any]) => {
          dayData.matches.forEach((match: any, index: number) => {
            allMatches.push({
              id: `${date}-${index}`,
              ...match,
              date: dayData.date_label,
              starred: match.confidence >= 130,
            });
          });
        });
        
        allMatches.sort((a, b) => b.confidence - a.confidence);
        setSecretMatches(allMatches);
      }
    } catch (error) {
      console.error('Failed to fetch secret matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMatches = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return secretMatches.filter(match => {
      if (filter === 'today') {
        return match.date === new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: '2-digit' });
      }
      if (filter === 'week') {
        return true;
      }
      return match.starred;
    });
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case '1': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'X': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case '2': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 140) return { label: 'ULTRA HIGH', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' };
    if (confidence >= 130) return { label: 'VERY HIGH', color: 'bg-gradient-to-r from-green-500 to-emerald-500' };
    if (confidence >= 100) return { label: 'HIGH', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' };
    return { label: 'MODERATE', color: 'bg-gradient-to-r from-gray-500 to-slate-500' };
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-purple-900 dark:to-gray-950 text-gray-900 dark:text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="gradient-red p-3 rounded-xl shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text-red">
                  Secrets ⭐
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Exclusive starred predictions with highest confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 backdrop-blur-sm rounded-lg p-2 px-4 border border-blue-200 dark:border-blue-800/50">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">VIP Access</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'gradient-red text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              ⭐ Starred Only
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'today'
                  ? 'gradient-blue text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              📅 Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'week'
                  ? 'gradient-purple text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              📆 This Week
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-sm border border-red-200 dark:border-red-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-semibold">Starred Matches</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{secretMatches.filter(m => m.starred).length}</p>
                </div>
                <Star className="w-12 h-12 text-red-500 fill-red-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border border-green-200 dark:border-green-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-semibold">Avg Confidence</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {secretMatches.length > 0
                      ? Math.round(secretMatches.reduce((sum, m) => sum + m.confidence, 0) / secretMatches.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 font-semibold">Best Odd</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {secretMatches.length > 0
                      ? Math.min(...secretMatches.map(m => m.best_odd)).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
                <Target className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-20">
            <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No secret matches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => {
              const confidenceBadge = getConfidenceBadge(match.confidence);
              
              return (
                <div
                  key={match.id}
                  className="group relative bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-red-400 dark:hover:border-red-500/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-red-500/20"
                >
                  {match.starred && (
                    <div className="absolute -top-3 -right-3 gradient-red rounded-full p-3 shadow-lg animate-pulse">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{match.date}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">{match.time}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${confidenceBadge.color} shadow-lg`}>
                      {confidenceBadge.label}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2 font-semibold">{match.league}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{match.home_team}</span>
                        <span className="text-sm text-gray-400">vs</span>
                        <span className="text-lg font-bold">{match.away_team}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className={`p-3 rounded-lg border ${match.best_prediction === '1' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-600/50 bg-slate-700/30'}`}>
                      <div className="text-xs text-gray-400 mb-1">Home (1)</div>
                      <div className="text-xl font-bold">{match.odds_1.toFixed(2)}</div>
                    </div>
                    <div className={`p-3 rounded-lg border ${match.best_prediction === 'X' ? 'border-yellow-500 bg-yellow-500/20' : 'border-slate-600/50 bg-slate-700/30'}`}>
                      <div className="text-xs text-gray-400 mb-1">Draw (X)</div>
                      <div className="text-xl font-bold">{match.odds_x.toFixed(2)}</div>
                    </div>
                    <div className={`p-3 rounded-lg border ${match.best_prediction === '2' ? 'border-red-500 bg-red-500/20' : 'border-slate-600/50 bg-slate-700/30'}`}>
                      <div className="text-xs text-gray-400 mb-1">Away (2)</div>
                      <div className="text-xl font-bold">{match.odds_2.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <div>
                        <div className="text-xs text-gray-400">Secret Prediction</div>
                        <div className="text-lg font-bold text-yellow-400">{match.prediction_label}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Confidence</div>
                      <div className="text-2xl font-bold text-green-400">{match.confidence}%</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>Best Odd: {match.best_odd.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
