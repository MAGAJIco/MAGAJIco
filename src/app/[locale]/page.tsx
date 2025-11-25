'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const [selectedDate, setSelectedDate] = useState('TODAY');

  // Generate date tabs
  const getDates = () => {
    const days = ['SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'];
    const today = new Date();
    const dates = [];
    
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      const date = d.getDate();
      const month = d.getMonth() + 1;
      dates.push({
        label: i === 0 ? 'TODAY' : dayName,
        date: `${dayName} ${date}.${month}`,
        isToday: i === 0,
      });
    }
    return dates;
  };

  const dates = getDates();

  // Sample competitions/leagues
  const competitions = [
    { country: '🇪🇺', flag: '🇪🇺', name: 'Champions League', matches: 9, live: 1 },
    { country: '🇦🇴', flag: '🇦🇴', name: 'Girabola', matches: 1, live: 0 },
    { country: '🇦🇷', flag: '🇦🇷', name: 'Torneo Betano', matches: 1, live: 0 },
    { country: '🇦🇲', flag: '🇦🇲', name: 'Premier League', matches: 1, live: 0 },
    { country: '🇦🇲', flag: '🇦🇲', name: 'First League', matches: 3, live: 0 },
    { country: '🇦🇸', flag: '🇦🇸', name: 'AFC Champions League', matches: 6, live: 1 },
    { country: '🇦🇸', flag: '🇦🇸', name: 'AFC Champions League 2', matches: 1, live: 0 },
    { country: '🇧🇩', flag: '🇧🇩', name: 'BFL', matches: 1, live: 1 },
    { country: '🇧🇦', flag: '🇧🇦', name: 'Prva Liga - RS', matches: 1, live: 0 },
    { country: '🇧🇷', flag: '🇧🇷', name: 'Serie A Betano', matches: 1, live: 0 },
  ];

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
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">☰</span>
            <span className="text-gray-700 font-semibold">All games</span>
            <span className="ml-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              2
            </span>
          </div>
        </div>

        {/* Favourite Competitions */}
        <div className="mb-8">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-xs font-bold mb-4 rounded">
            FAVOURITE COMPETITIONS
          </div>

          <div className="space-y-2">
            {competitions.slice(0, 1).map((comp, idx) => (
              <button
                key={idx}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between group"
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
                  <span className="text-gray-600 font-semibold">{comp.matches}</span>
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
            {competitions.slice(1).map((comp, idx) => (
              <button
                key={idx}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comp.flag}</span>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-semibold">{comp.country}</div>
                    <div className="text-gray-900 font-semibold">{comp.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {comp.live > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {comp.live}
                    </span>
                  )}
                  <span className="text-gray-600 font-semibold">{comp.matches}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
