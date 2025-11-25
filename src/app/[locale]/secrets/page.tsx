'use client';

import React, { useEffect, useState } from 'react';
import { SecretMatchCard, SecretMatch } from './components/SecretMatchCard';
import { getApiBaseUrl } from '@/lib/api';

export default function SecretsPage() {
  const [matches, setMatches] = useState<SecretMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [starredTeams, setStarredTeams] = useState<Record<string, number>>({});

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/predictions/flashscore-odds`);
      const data = await res.json();

      // Flatten matches from week_calendar
      const allMatches: SecretMatch[] = [];
      Object.entries(data.week_calendar || {}).forEach(([date, dayData]: any) => {
        dayData.matches.forEach((match: any, i: number) => {
          allMatches.push({
            id: `${date}-${i}`,
            ...match,
            date: dayData.date_label,
          });
        });
      });

      setMatches(allMatches);

      // Compute starred teams
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) return <div className="text-center py-20">Loading secret matches...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map(match => (
          <SecretMatchCard key={match.id} match={match} starredCount={starredTeams} />
        ))}
      </div>
    </div>
  );
}