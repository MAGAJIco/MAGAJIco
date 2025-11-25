'use client';

import React, { useEffect, useState } from 'react';
import { SecretMatchCard, SecretMatch } from './components/SecretMatchCard';
import { fetchFromBackend } from '@/lib/api';

type FilterType = 'starred' | 'today' | 'week';

export default function SecretsPage() {
  const [matches, setMatches] = useState<SecretMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('starred');
  const [starredTeams, setStarredTeams] = useState<Record<string, number>>({});

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchFromBackend('/api/predictions/flashscore-odds');
      const allMatches: SecretMatch[] = [];

      Object.entries(data.week_calendar || {}).forEach(([date, dayData]: any) => {
        dayData.matches.forEach((match: any, i: number) => {
          allMatches.push({ id: `${date}-${i}`, ...match, date: dayData.date_label });
        });
      });

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
    // Initial load
    fetchMatches();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: '2-digit' });

  // Filtered matches
  const filteredMatches = matches.filter(match => {
    if (filter === 'starred') return starredTeams[match.home_team] || starredTeams[match.away_team];
    if (filter === 'today') return match.date === today;
    return true; // week = all
  });

  // Handle filter button click
  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);

    // Fetch fresh data if Week or Today is selected
    if (newFilter === 'week' || newFilter === 'today') {
      await fetchMatches();
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold ${filter === 'starred' ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('starred')}
        >
          ⭐ Starred
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${filter === 'today' ? 'bg-blue-400 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('today')}
        >
          📅 Today
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${filter === 'week' ? 'bg-purple-400 text-white' : 'bg-gray-100'}`}
          onClick={() => handleFilterChange('week')}
        >
          📆 Week
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading secret matches...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-20">No matches found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map(match => (
            <SecretMatchCard key={match.id} match={match} starredCount={starredTeams} />
          ))}
        </div>
      )}
    </div>
  );
}