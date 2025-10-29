
"use client";

import React, { useEffect, useState } from 'react';

interface Prediction {
  home_team: string;
  away_team: string;
  game_time: string;
  confidence: number;
  implied_odds: number;
  prediction: string;
  status: string;
}

interface PredictionsResponse {
  source: string;
  description: string;
  filter: {
    min_confidence: number;
    max_odds_applied: number;
    total_available: number;
  };
  count: number;
  predictions: Prediction[];
  recommendations: {
    very_safe: number;
    safe: number;
    moderate: number;
  };
}

export default function PredictionsAutoLoader() {
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minConfidence, setMinConfidence] = useState(86);
  const [date, setDate] = useState("today");

  useEffect(() => {
    fetchPredictions();
  }, [minConfidence, date]);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://0.0.0.0:5000/api/predictions/soccer?min_confidence=${minConfidence}&date=${date}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <p className="text-red-600 font-semibold">⚠️ Error: {error}</p>
          <button 
            onClick={fetchPredictions}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!predictions || predictions.count === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <p className="text-center text-gray-600">No predictions available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
            ⚽ Soccer Predictions
          </h2>
          <p className="text-sm text-gray-600 mt-1">{predictions.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="today">📅 Today</option>
            <option value="tomorrow">🔜 Tomorrow</option>
          </select>
          
          <label className="text-sm font-medium text-gray-700">Min Confidence:</label>
          <select
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="90">90% (Very Safe)</option>
            <option value="86">86% (Safe)</option>
            <option value="77">77% (Moderate)</option>
            <option value="70">70% (Balanced)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
          <div className="text-2xl font-bold text-green-600">{predictions.recommendations.very_safe}</div>
          <div className="text-sm text-gray-600">Very Safe Bets</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{predictions.recommendations.safe}</div>
          <div className="text-sm text-gray-600">Safe Bets</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{predictions.recommendations.moderate}</div>
          <div className="text-sm text-gray-600">Moderate Bets</div>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.predictions.map((pred, index) => (
          <div 
            key={index}
            className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all border-2 border-transparent hover:border-indigo-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {pred.home_team} vs {pred.away_team}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ⏱️ {pred.game_time} | Prediction: {pred.prediction}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{pred.confidence}%</div>
                <div className="text-sm text-gray-500">Odds: {pred.implied_odds}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${pred.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
