'use client';

import React, { useEffect, useState } from 'react';
import { Star, Calendar, CalendarDays, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface SecretMatch {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  league: string;
  home_odds?: number;
  draw_odds?: number;
  away_odds?: number;
  prediction?: string;
  confidence?: number;
}

interface SecretMatchCardProps {
  match: SecretMatch;
  starredCount: Record<string, number>;
}

function SecretMatchCard({ match, starredCount }: SecretMatchCardProps) {
  const homeStars = starredCount[match.home_team] || 0;
  const awayStars = starredCount[match.away_team] || 0;
  const maxStars = Math.max(homeStars, awayStars);

  const renderStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{match.date}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span className="text-sm">{match.time}</span>
          </div>
          {maxStars > 0 && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span className="text-xs text-white font-bold">{maxStars}x</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {match.league}
        </div>

        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                {match.home_team.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{match.home_team}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(homeStars)}
                </div>
              </div>
            </div>
            {match.home_odds && (
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-500">Odds</div>
                <div className="font-bold text-blue-600">{match.home_odds.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 px-2">VS</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                {match.away_team.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{match.away_team}</div>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(awayStars)}
                </div>
              </div>
            </div>
            {match.away_odds && (
              <div className="bg-red-50 px-3 py-2 rounded-lg">
                <div className="text-xs text-gray-500">Odds</div>
                <div className="font-bold text-red-600">{match.away_odds.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Draw Odds */}
          {match.draw_odds && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Draw</span>
                <span className="font-semibold text-gray-700">{match.draw_odds.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Prediction */}
          {match.prediction && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Prediction</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-800">{match.prediction}</div>
              {match.confidence && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${match.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-green-700">{match.confidence}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FilterType = 'starred' | 'today' | 'week';

export default function SecretsPage() {
  const [matches, setMatches] = useState<SecretMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('starred');
  const [starredTeams, setStarredTeams] = useState<Record<string, number>>({});

  // Mock data for demonstration
  const mockMatches: SecretMatch[] = [
    {
      id: '1',
      date: 'Wed 27/11',
      time: '19:45',
      home_team: 'Manchester City',
      away_team: 'Liverpool',
      league: 'Premier League',
      home_odds: 2.10,
      draw_odds: 3.40,
      away_odds: 3.25,
      prediction: 'Liverpool Win',
      confidence: 68
    },
    {
      id: '2',
      date: 'Wed 27/11',
      time: '20:00',
      home_team: 'Real Madrid',
      away_team: 'Barcelona',
      league: 'La Liga',
      home_odds: 1.95,
      draw_odds: 3.60,
      away_odds: 3.80,
      prediction: 'Real Madrid Win',
      confidence: 72
    },
    {
      id: '3',
      date: 'Thu 28/11',
      time: '18:30',
      home_team: 'Bayern Munich',
      away_team: 'Borussia Dortmund',
      league: 'Bundesliga',
      home_odds: 1.75,
      draw_odds: 3.90,
      away_odds: 4.20
    },
    {
      id: '4',
      date: 'Wed 27/11',
      time: '21:00',
      home_team: 'Paris Saint-Germain',
      away_team: 'Manchester City',
      league: 'Champions League',
      home_odds: 2.30,
      draw_odds: 3.20,
      away_odds: 2.90,
      prediction: 'Draw',
      confidence: 55
    }
  ];

  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allMatches = mockMatches;
      setMatches(allMatches);

      // Count how many times each team appears
      const counts: Record<string, number> = {};
      allMatches.forEach(m => {
        counts[m.home_team] = (counts[m.home_team] || 0) + 1;
        counts[m.away_team] = (counts[m.away_team] || 0) + 1;
      });

      const starred: Record<string, number> = {};
      Object.entries(counts).forEach(([team, count]) => {
        if (count >= 2) starred[team] = count >= 3 ? 3 : 2;
      });

      setStarredTeams(starred);
    } catch (err) {
      console.error('Error fetching secret matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: '2-digit' });

  const filteredMatches = matches.filter(match => {
    if (filter === 'starred') return starredTeams[match.home_team] || starredTeams[match.away_team];
    if (filter === 'today') return match.date.includes('27/11');
    return true;
  });

  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);
    if (newFilter === 'week' || newFilter === 'today') {
      await fetchMatches();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Secret Matches</h1>
          <p className="text-gray-600">Discover high-value betting opportunities</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              filter === 'starred' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
            onClick={() => handleFilterChange('starred')}
          >
            <Star className={`w-5 h-5 ${filter === 'starred' ? 'fill-white' : ''}`} />
            Starred Teams
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              filter === 'today' 
                ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
            onClick={() => handleFilterChange('today')}
          >
            <Calendar className="w-5 h-5" />
            Today's Matches
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              filter === 'week' 
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
            onClick={() => handleFilterChange('week')}
          >
            <CalendarDays className="w-5 h-5" />
            This Week
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-500">Total Matches</div>
            <div className="text-2xl font-bold text-gray-800">{matches.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-500">Starred Teams</div>
            <div className="text-2xl font-bold text-yellow-500">{Object.keys(starredTeams).length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-500">Current Filter</div>
            <div className="text-2xl font-bold text-indigo-600 capitalize">{filter}</div>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <div className="mt-4 text-gray-600 font-medium">Loading secret matches...</div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-xl font-semibold text-gray-800 mb-2">No matches found</div>
            <p className="text-gray-600">Try selecting a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map(match => (
              <SecretMatchCard key={match.id} match={match} starredCount={starredTeams} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}