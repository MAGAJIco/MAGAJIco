'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { RefreshCw } from 'lucide-react';
import { AuthNav } from '@/app/components/AuthNav';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: string;
}

interface Competition {
  name: string;
  flag: string;
  country: string;
  matches: Match[];
  live: number;
}

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('TODAY');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalLive, setTotalLive] = useState(0);
  const [dates, setDatesState] = useState<any[]>([]);

  // Generate date tabs dynamically
  const getDates = () => {
    const days = ['SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'];
    const today = new Date();
    const dateArray = [];
    
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      const date = d.getDate();
      const month = d.getMonth() + 1;
      dateArray.push({
        label: i === 0 ? 'TODAY' : dayName,
        date: `${dayName} ${date}.${month}`,
        isToday: i === 0,
      });
    }
    return dateArray;
  };

  // Initialize and update dates dynamically
  useEffect(() => {
    // Set initial dates
    setDatesState(getDates());
    setSampleData();
    fetchMatches();

    // Update dates every minute to ensure they're always current
    const dateInterval = setInterval(() => {
      setDatesState(getDates());
    }, 60000); // Update every minute

    return () => clearInterval(dateInterval);
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/predictions/live`, { timeout: 5000 });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      const predictions = data.predictions || [];
      
      // Group by league and parse data correctly
      const groupedByLeague: { [key: string]: Competition } = {};
      let liveCount = 0;

      predictions.forEach((pred: any) => {
        const league = pred.league || pred.sport || 'Other';
        const isLive = pred.status === 'live' || pred.status === 'in_progress';
        
        if (isLive) liveCount++;

        if (!groupedByLeague[league]) {
          groupedByLeague[league] = {
            name: league,
            flag: '⚽',
            country: league,
            matches: [],
            live: 0,
          };
        }

        groupedByLeague[league].matches.push({
          id: pred.id || `${pred.home_team || 'A'}-${pred.away_team || 'B'}`,
          homeTeam: pred.home_team || pred.homeTeam || 'Team A',
          awayTeam: pred.away_team || pred.awayTeam || 'Team B',
          league: league,
          time: pred.game_time || pred.time || '14:30',
          status: pred.status || 'scheduled',
        });

        if (isLive) {
          groupedByLeague[league].live++;
        }
      });

      const competitionsArray = Object.values(groupedByLeague).sort((a, b) => b.live - a.live);
      setCompetitions(competitionsArray);
      setTotalLive(liveCount);
    } catch (err) {
      console.log('Using sample data');
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    const sampleCompetitions: Competition[] = [
      {
        name: 'Champions League',
        flag: '🇪🇺',
        country: 'EUROPE',
        live: 1,
        matches: [
          {
            id: '1',
            homeTeam: 'Manchester City',
            awayTeam: 'Real Madrid',
            league: 'Champions League',
            time: '14:30',
            status: 'live',
            prediction: { winner: '1', confidence: 78 },
          },
          {
            id: '2',
            homeTeam: 'Bayern Munich',
            awayTeam: 'PSG',
            league: 'Champions League',
            time: '15:00',
            status: 'scheduled',
            prediction: { winner: '1', confidence: 72 },
          },
        ],
      },
      {
        name: 'Premier League',
        flag: '🇬🇧',
        country: 'ENGLAND',
        live: 0,
        matches: [
          {
            id: '3',
            homeTeam: 'Arsenal',
            awayTeam: 'Chelsea',
            league: 'Premier League',
            time: '16:00',
            status: 'scheduled',
            prediction: { winner: 'X', confidence: 65 },
          },
        ],
      },
      {
        name: 'La Liga',
        flag: '🇪🇸',
        country: 'SPAIN',
        live: 0,
        matches: [
          {
            id: '4',
            homeTeam: 'Barcelona',
            awayTeam: 'Atletico Madrid',
            league: 'La Liga',
            time: '17:00',
            status: 'scheduled',
            prediction: { winner: '2', confidence: 58 },
          },
        ],
      },
    ];
    setCompetitions(sampleCompetitions);
    setTotalLive(1);
  };

  const handleCompetitionClick = (compName: string) => {
    router.push(`/${locale}/matches?league=${encodeURIComponent(compName)}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Date Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 py-2 overflow-x-auto flex gap-4">
          {dates.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(d.label)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedDate === d.label
                  ? 'text-red-600 border-b-4 border-red-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="text-xs text-gray-500">{d.label}</div>
              <div>{d.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">☰</span>
            <span className="text-gray-700 font-semibold">All games</span>
            <span className="ml-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {totalLive}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMatches}
              disabled={loading}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Refresh matches"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <AuthNav />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-gray-600 mt-4">Loading live matches...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && competitions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No matches found for this date</p>
          </div>
        )}

        {/* Favourite Competitions */}
        {!loading && competitions.length > 0 && (
          <>
            <div className="mb-8">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-xs font-bold mb-4 rounded">
                FAVOURITE COMPETITIONS
              </div>

              <div className="space-y-2">
                {competitions.filter(c => c.live > 0).slice(0, 3).map((comp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCompetitionClick(comp.name)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between group hover:border-red-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{comp.flag}</span>
                      <div className="text-left">
                        <div className="text-xs text-gray-500 font-semibold">{comp.country}</div>
                        <div className="text-gray-900 font-semibold">{comp.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xl">🎧</span>
                      <span className="text-gray-600 font-semibold">{comp.matches.length}</span>
                      {comp.live > 0 && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                          {comp.live}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Competitions */}
            <div>
              <div className="bg-gray-100 text-gray-700 px-4 py-2 text-xs font-bold mb-4 rounded">
                OTHER COMPETITIONS [A-Z]
              </div>

              <div className="space-y-2">
                {competitions.filter(c => c.live === 0).map((comp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCompetitionClick(comp.name)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between group hover:border-red-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{comp.flag}</span>
                      <div className="text-left">
                        <div className="text-xs text-gray-500 font-semibold">{comp.country}</div>
                        <div className="text-gray-900 font-semibold">{comp.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-semibold">{comp.matches.length}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
