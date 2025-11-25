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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                  Secrets ⭐
                </h1>
                <p className="text-gray-400 mt-1">Exclusive starred predictions with highest confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
              <Lock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-400">VIP Access</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              ⭐ Starred Only
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'today'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📅 Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'week'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📆 This Week
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Starred Matches</p>
                  <p className="text-3xl font-bold">{secretMatches.filter(m => m.starred).length}</p>
                </div>
                <Star className="w-12 h-12 text-yellow-500 fill-yellow-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Avg Confidence</p>
                  <p className="text-3xl font-bold">
                    {secretMatches.length > 0
                      ? Math.round(secretMatches.reduce((sum, m) => sum + m.confidence, 0) / secretMatches.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Best Odd</p>
                  <p className="text-3xl font-bold">
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
                  className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  {match.starred && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full p-3 shadow-lg animate-pulse">
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
