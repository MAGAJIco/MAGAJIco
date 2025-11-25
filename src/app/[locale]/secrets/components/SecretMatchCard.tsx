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
  best_prediction: '1' | 'X' | '2';
  prediction_label: string;
  best_odd: number;
  confidence: number;
}

interface Props {
  match: SecretMatch;
  starredCount: Record<string, number>;
}

export const SecretMatchCard: React.FC<Props> = ({ match, starredCount }) => {
  const getStars = (team: string) => {
    const count = starredCount[team] || 0;
    return Array.from({ length: count }, (_, i) => <Star key={i} className="w-4 h-4 text-yellow-400" />);
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{match.date} • {match.time}</span>
        </div>
        <div className="text-xs text-green-500 font-semibold">{match.confidence}%</div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center font-bold text-lg">
          <div>
            {match.home_team} {getStars(match.home_team)}
          </div>
          <span className="text-sm text-gray-400">vs</span>
          <div>
            {match.away_team} {getStars(match.away_team)}
          </div>
        </div>
        <div className="text-xs text-gray-400">{match.league}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
        <div className={`p-2 rounded border ${match.best_prediction === '1' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}>
          1: {match.odds_1.toFixed(2)}
        </div>
        <div className={`p-2 rounded border ${match.best_prediction === 'X' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300'}`}>
          X: {match.odds_x.toFixed(2)}
        </div>
        <div className={`p-2 rounded border ${match.best_prediction === '2' ? 'border-red-500 bg-red-100' : 'border-gray-300'}`}>
          2: {match.odds_2.toFixed(2)}
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold">{match.prediction_label}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Eye className="w-3 h-3" />
          <span>Best Odd: {match.best_odd.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};