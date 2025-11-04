
"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  AlertCircle,
  RefreshCw,
  Filter,
  BarChart3,
  Trophy,
  Clock,
  Flame,
  Shield,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SharePrediction } from "@/components/SharePrediction";

interface PredictionSource {
  name: string;
  prediction: string;
  confidence: number;
  odds: number;
}

interface EnhancedPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  gameTime: string;
  status: "upcoming" | "live" | "finished";
  liveScore?: { home: number; away: number };
  sources: PredictionSource[];
  consensus: {
    prediction: string;
    avgConfidence: number;
    agreement: number; // percentage of sources that agree
  };
  stats: {
    homeForm: number[]; // last 5 results (1=win, 0=draw, -1=loss)
    awayForm: number[];
    h2hLast5: { homeWins: number; draws: number; awayWins: number };
    goalsAvg: { home: number; away: number };
  };
  aiPrediction?: {
    prediction: string;
    confidence: number;
    probabilities: { home: number; draw: number; away: number };
  };
}

type SortBy = "time" | "confidence" | "odds" | "consensus";
type FilterLeague = "all" | "Premier League" | "La Liga" | "Bundesliga" | "Serie A";
type FilterConfidence = "all" | "high" | "medium" | "low";

export default function AdvancedPredictionsPage() {
  const [predictions, setPredictions] = useState<EnhancedPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [sortBy, setSortBy] = useState<SortBy>("confidence");
  const [filterLeague, setFilterLeague] = useState<FilterLeague>("all");
  const [filterConfidence, setFilterConfidence] = useState<FilterConfidence>("all");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [minConfidence, setMinConfidence] = useState(86);
  const [date, setDate] = useState("today");

  // Selected prediction for detailed view
  const [selectedPrediction, setSelectedPrediction] = useState<EnhancedPrediction | null>(null);

  useEffect(() => {
    fetchEnhancedPredictions();
    const interval = setInterval(fetchEnhancedPredictions, 30000);
    return () => clearInterval(interval);
  }, [minConfidence, date]);

  const fetchEnhancedPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from multiple sources
      const [mybetsResponse, statareaResponse, combinedResponse] = await Promise.all([
        fetch(`/api/predictions/soccer?min_confidence=${minConfidence}&date=${date}`).then(r => r.json()),
        fetch(`/api/predictions/statarea?min_odds=1.5`).then(r => r.json()),
        fetch(`/api/predictions/combined?min_confidence=${minConfidence}&date=${date}`).then(r => r.json()),
      ]);

      console.log('API Responses:', { mybetsResponse, statareaResponse, combinedResponse });
      console.log('Response types:', { 
        mybets: typeof mybetsResponse, 
        statarea: typeof statareaResponse, 
        combined: typeof combinedResponse 
      });

      // Extract predictions arrays from response objects - handle all cases
      let mybets = [];
      let statarea = [];
      let combined = [];

      // Handle mybets response
      if (Array.isArray(mybetsResponse)) {
        mybets = mybetsResponse;
      } else if (mybetsResponse?.predictions && Array.isArray(mybetsResponse.predictions)) {
        mybets = mybetsResponse.predictions;
      } else if (mybetsResponse?.data && Array.isArray(mybetsResponse.data)) {
        mybets = mybetsResponse.data;
      }

      // Handle statarea response
      if (Array.isArray(statareaResponse)) {
        statarea = statareaResponse;
      } else if (statareaResponse?.predictions && Array.isArray(statareaResponse.predictions)) {
        statarea = statareaResponse.predictions;
      } else if (statareaResponse?.data && Array.isArray(statareaResponse.data)) {
        statarea = statareaResponse.data;
      }

      // Handle combined response
      if (Array.isArray(combinedResponse)) {
        combined = combinedResponse;
      } else if (combinedResponse?.predictions && Array.isArray(combinedResponse.predictions)) {
        combined = combinedResponse.predictions;
      } else if (combinedResponse?.data && Array.isArray(combinedResponse.data)) {
        combined = combinedResponse.data;
      }

      console.log('Extracted arrays:', {
        mybetsCount: mybets.length,
        statareaCount: statarea.length,
        combinedCount: combined.length,
        mybetsSample: mybets[0],
        statareaSample: statarea[0],
        combinedSample: combined[0]
      });

      // Merge and enhance predictions
      const enhanced = mergePredictions(mybets, statarea, combined);
      console.log('Enhanced predictions:', enhanced.length, enhanced);
      
      if (enhanced.length === 0) {
        setError("No predictions available for the selected filters");
      }
      
      setPredictions(enhanced);
    } catch (err) {
      setError("Failed to load predictions");
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mergePredictions = (mybets: any[], statarea: any[], combined: any[]): EnhancedPrediction[] => {
    const predictionsMap = new Map<string, EnhancedPrediction>();

    // Process MyBetsToday predictions
    if (Array.isArray(mybets)) {
      mybets.forEach((pred: any) => {
        const key = `${pred.home_team}-${pred.away_team}`;
        if (!predictionsMap.has(key)) {
          predictionsMap.set(key, createEnhancedPrediction(pred, "mybetstoday"));
        } else {
          addSourceToPrediction(predictionsMap.get(key)!, pred, "mybetstoday");
        }
      });
    }

    // Process StatArea predictions
    if (Array.isArray(statarea)) {
      statarea.forEach((pred: any) => {
        const key = `${pred.home_team}-${pred.away_team}`;
        if (!predictionsMap.has(key)) {
          predictionsMap.set(key, createEnhancedPrediction(pred, "statarea"));
        } else {
          addSourceToPrediction(predictionsMap.get(key)!, pred, "statarea");
        }
      });
    }

    // Process combined predictions (already merged by backend)
    if (Array.isArray(combined)) {
      combined.forEach((pred: any) => {
        const key = `${pred.home_team}-${pred.away_team}`;
        if (!predictionsMap.has(key)) {
          // Create from combined data with both sources
          const enhanced = createEnhancedPrediction(pred, "combined");
          if (pred.mybets_prediction && pred.statarea_prediction) {
            enhanced.sources = [
              {
                name: "mybetstoday",
                prediction: pred.mybets_prediction,
                confidence: pred.mybets_confidence,
                odds: pred.mybets_odds
              },
              {
                name: "statarea",
                prediction: pred.statarea_prediction,
                confidence: pred.statarea_confidence,
                odds: pred.statarea_odds
              }
            ];
            enhanced.consensus = {
              prediction: pred.predictions_match ? pred.mybets_prediction : "Mixed",
              avgConfidence: pred.average_confidence,
              agreement: pred.predictions_match ? 100 : 50
            };
          }
          predictionsMap.set(key, enhanced);
        }
      });
    }

    return Array.from(predictionsMap.values());
  };

  const createEnhancedPrediction = (pred: any, source: string): EnhancedPrediction => {
    const homeTeam = pred.home_team || "Unknown";
    const awayTeam = pred.away_team || "Unknown";
    const timestamp = Date.now();
    
    return {
      id: `${homeTeam}-${awayTeam}-${timestamp}-${source}`,
      homeTeam,
      awayTeam,
      league: pred.league || "Unknown League",
      gameTime: pred.game_time || "TBD",
      status: pred.status === "live" ? "live" : "upcoming",
      sources: [{
        name: source,
        prediction: pred.prediction || pred.mybets_prediction || pred.statarea_prediction || "Unknown",
        confidence: Number(pred.confidence || pred.mybets_confidence || pred.statarea_confidence || 0),
        odds: Number(pred.implied_odds || pred.odds || pred.mybets_odds || pred.statarea_odds || 0),
      }],
      consensus: {
        prediction: pred.prediction || pred.mybets_prediction || "Unknown",
        avgConfidence: Number(pred.confidence || pred.average_confidence || 0),
        agreement: 100,
      },
      stats: generateMockStats(),
    };
  };

  const addSourceToPrediction = (existing: EnhancedPrediction, pred: any, source: string) => {
    existing.sources.push({
      name: source,
      prediction: pred.prediction,
      confidence: pred.confidence,
      odds: pred.implied_odds || pred.odds || 0,
    });

    // Recalculate consensus
    const predictions = existing.sources.map(s => s.prediction);
    const mostCommon = predictions.sort((a, b) =>
      predictions.filter(v => v === a).length - predictions.filter(v => v === b).length
    ).pop() || predictions[0];

    existing.consensus = {
      prediction: mostCommon,
      avgConfidence: existing.sources.reduce((sum, s) => sum + s.confidence, 0) / existing.sources.length,
      agreement: (predictions.filter(p => p === mostCommon).length / predictions.length) * 100,
    };
  };

  const generateMockStats = () => ({
    homeForm: [1, 1, 0, 1, -1],
    awayForm: [1, 0, 1, -1, 1],
    h2hLast5: { homeWins: 2, draws: 1, awayWins: 2 },
    goalsAvg: { home: 1.8, away: 1.5 },
  });

  const filteredPredictions = predictions
    .filter(p => filterLeague === "all" || p.league === filterLeague)
    .filter(p => {
      if (filterConfidence === "all") return true;
      if (filterConfidence === "high") return p.consensus.avgConfidence >= 85;
      if (filterConfidence === "medium") return p.consensus.avgConfidence >= 70 && p.consensus.avgConfidence < 85;
      return p.consensus.avgConfidence < 70;
    })
    .filter(p => !showLiveOnly || p.status === "live")
    .sort((a, b) => {
      if (sortBy === "confidence") return b.consensus.avgConfidence - a.consensus.avgConfidence;
      if (sortBy === "consensus") return b.consensus.agreement - a.consensus.agreement;
      if (sortBy === "odds") return Math.min(...a.sources.map(s => s.odds)) - Math.min(...b.sources.map(s => s.odds));
      return 0;
    });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-500";
    if (confidence >= 70) return "text-blue-500";
    return "text-amber-500";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 85) return "bg-green-500/10 border-green-500/30";
    if (confidence >= 70) return "bg-blue-500/10 border-blue-500/30";
    return "bg-amber-500/10 border-amber-500/30";
  };

  const renderFormIndicator = (form: number[]) => (
    <div className="flex gap-1">
      {form.map((result, idx) => (
        <div
          key={idx}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            result === 1 ? "bg-green-500 text-white" :
            result === 0 ? "bg-gray-400 text-white" :
            "bg-red-500 text-white"
          }`}
        >
          {result === 1 ? "W" : result === 0 ? "D" : "L"}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Advanced Predictions Hub</h1>
              <p className="text-gray-400">Multi-source analysis • Real-time updates</p>
            </div>
          </div>
          <button
            onClick={fetchEnhancedPredictions}
            disabled={loading}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-6 h-6 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Filters:</span>
            </div>

            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="today">📅 Today</option>
              <option value="tomorrow">🔜 Tomorrow</option>
            </select>

            <select
              value={filterLeague}
              onChange={(e) => setFilterLeague(e.target.value as FilterLeague)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="all">All Leagues</option>
              <option value="Premier League">Premier League</option>
              <option value="La Liga">La Liga</option>
              <option value="Bundesliga">Bundesliga</option>
              <option value="Serie A">Serie A</option>
            </select>

            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value as FilterConfidence)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="all">All Confidence</option>
              <option value="high">High (85%+)</option>
              <option value="medium">Medium (70-85%)</option>
              <option value="low">Low (&lt;70%)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="confidence">Sort: Confidence</option>
              <option value="consensus">Sort: Consensus</option>
              <option value="odds">Sort: Best Odds</option>
              <option value="time">Sort: Time</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showLiveOnly}
                onChange={(e) => setShowLiveOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-white">Live Only</span>
            </label>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">High Confidence</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {filteredPredictions.filter(p => p.consensus.avgConfidence >= 85).length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Strong Consensus</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {filteredPredictions.filter(p => p.consensus.agreement >= 80).length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Live Matches</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {filteredPredictions.filter(p => p.status === "live").length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-4 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-gray-300">Total Predictions</span>
            </div>
            <div className="text-2xl font-bold text-white">{filteredPredictions.length}</div>
          </div>
        </div>

        {/* Predictions Grid */}
        {loading && filteredPredictions.length === 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPredictions.map((pred) => (
              <div
                key={pred.id}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedPrediction(pred)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">{pred.league}</span>
                      {pred.status === "live" && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {pred.homeTeam} vs {pred.awayTeam}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {pred.gameTime}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getConfidenceColor(pred.consensus.avgConfidence)}`}>
                      {pred.consensus.avgConfidence.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {pred.consensus.agreement.toFixed(0)}% agree
                    </div>
                  </div>
                </div>

                {/* Consensus Prediction */}
                <div className={`p-3 rounded-lg border mb-4 ${getConfidenceBg(pred.consensus.avgConfidence)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Prediction</p>
                      <p className="text-lg font-bold text-white">{pred.consensus.prediction}</p>
                    </div>
                    {pred.sources.length > 0 && pred.sources[0].odds > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Odds</p>
                        <p className="text-lg font-bold text-white">
                          {Math.min(...pred.sources.filter(s => s.odds > 0).map(s => s.odds)).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sources Comparison */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Sources ({pred.sources.length})</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {pred.sources.map((source, idx) => (
                      <div key={idx} className="bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-purple-400 font-semibold uppercase">
                            {source.name}
                          </span>
                          {source.odds > 0 && (
                            <span className="text-xs text-gray-400">{source.odds.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">{source.prediction}</span>
                          {source.confidence > 0 && (
                            <span className={`text-sm font-bold ${getConfidenceColor(source.confidence)}`}>
                              {source.confidence}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">{pred.homeTeam} Form</p>
                    {renderFormIndicator(pred.stats.homeForm)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">{pred.awayTeam} Form</p>
                    {renderFormIndicator(pred.stats.awayForm)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-900/20 rounded-xl border border-red-500/30">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg font-semibold mb-2">{error}</p>
            <p className="text-gray-400 text-sm">Check console for details</p>
            <button
              onClick={fetchEnhancedPredictions}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {filteredPredictions.length === 0 && !loading && !error && (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">No predictions match your filters</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
