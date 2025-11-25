'use client';

import React from 'react';
import { Star, Calendar, Trophy, Eye } from 'lucide-react';

export interface SecretMatch {
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
}

interface Props {
  match: SecretMatch;
  starredCount?: Record<string, number>; // team => star count
}

export const SecretMatchCard: React.FC<Props> = ({ match, starredCount }) => {
  const renderStars = (team: string) => {
    const count = starredCount?.[team] || 0;
    if (count === 0) return null;
    return (
      <span className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400" />
        ))}
      </span>
    );
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{match.date} • {match.time}</span>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
          {match.confidence}%
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-semibold">{match.league}</div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold flex items-center gap-1">
            {match.home_team} {renderStars(match.home_team)}
          </span>
          <span className="text-sm text-gray-400">vs</span>
          <span className="text-lg font-bold flex items-center gap-1">
            {match.away_team} {renderStars(match.away_team)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`p-3 rounded-lg border ${match.best_prediction === '1' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-500/20'}`}>
          <div className="text-xs text-gray-400 mb-1">Home (1)</div>
          <div className="text-xl font-bold">{match.odds_1.toFixed(2)}</div>
        </div>
        <div className={`p-3 rounded-lg border ${match.best_prediction === 'X' ? 'border-yellow-500 bg-yellow-500/20' : 'border-gray-500/20'}`}>
          <div className="text-xs text-gray-400 mb-1">Draw (X)</div>
          <div className="text-xl font-bold">{match.odds_x.toFixed(2)}</div>
        </div>
        <div className={`p-3 rounded-lg border ${match.best_prediction === '2' ? 'border-red-500 bg-red-500/20' : 'border-gray-500/20'}`}>
          <div className="text-xs text-gray-400 mb-1">Away (2)</div>
          <div className="text-xl font-bold">{match.odds_2.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-400">Secret Prediction</div>
            <div className="text-lg font-bold text-yellow-400">{match.prediction_label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Best Odd</div>
          <div className="text-2xl font-bold text-green-400">{match.best_odd.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Eye className="w-4 h-4" />
        <span>Confidence: {match.confidence}%</span>
      </div>
    </div>
  );
};