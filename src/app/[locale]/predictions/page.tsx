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
  List,
  LayoutGrid,
  Share2,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import { useSmartRetry } from "../../hook/useSmartRetry";
import StatCard from "../../components/StatCard";
import { API_BASE_URL } from "../../../lib/api";

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
  const [viewType, setViewType] = useState<"predictions" | "leaderboard" | "consensus" | "history">("predictions");

  // Filters
  const [sortBy, setSortBy] = useState<SortBy>("confidence");
  const [filterLeague, setFilterLeague] = useState<FilterLeague>("all");
  const [filterConfidence, setFilterConfidence] = useState<FilterConfidence>("all");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [minConfidence, setMinConfidence] = useState(86);
  const [date, setDate] = useState("today");
  const [sportFilter, setSportFilter] = useState<"all" | "soccer">("all");

  // Selected prediction for detailed view
  const [selectedPrediction, setSelectedPrediction] = useState<EnhancedPrediction | null>(null);

  // View mode: table or cards
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Smart retry hook with custom configuration
  const { executeWithRetry, isRetrying, retryCount } = useSmartRetry({
    maxRetries: 3,
    baseDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt} after error:`, error.message);
    }
  });

  useEffect(() => {
    fetchEnhancedPredictions();
    const interval = setInterval(fetchEnhancedPredictions, 30000);
    return () => clearInterval(interval);
  }, [minConfidence, date]);

  const fetchEnhancedPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Amazon-style: Fetch from multiple sources with graceful degradation
      const result = await executeWithRetry(async () => {
        const sources = [
          { name: 'mybets', url: `${API_BASE_URL}/api/predictions/soccer?min_confidence=${minConfidence}&date=${date}` },
          { name: 'statarea', url: `${API_BASE_URL}/api/predictions/statarea?min_odds=1.5` },
          { name: 'combined', url: `${API_BASE_URL}/api/predictions/combined?min_confidence=${minConfidence}&date=${date}` }
        ];

        // Fetch with individual error handling - don't let one failure block all
        const responses = await Promise.allSettled(
          sources.map(source => 
            fetch(source.url, { 
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(8000) // 8 second timeout per request
            })
            .then(r => {
              if (!r.ok) throw new Error(`${source.name} returned ${r.status}`);
              return r.json();
            })
            .catch(err => {
              console.warn(`Source ${source.name} failed:`, err.message);
              return { predictions: [], data: [], error: err.message };
            })
          )
        );

        // Extract successful responses with Amazon-style fallback
        const [mybetsResult, statareaResult, combinedResult] = responses.map(r => 
          r.status === 'fulfilled' ? r.value : { predictions: [], data: [] }
        );

        console.log('API Responses:', { mybetsResult, statareaResult, combinedResult });

        // Extract predictions arrays - prioritize combined, then individual sources
        const extractPredictions = (response: any): any[] => {
          if (Array.isArray(response)) return response;
          if (response?.predictions && Array.isArray(response.predictions)) return response.predictions;
          if (response?.data && Array.isArray(response.data)) return response.data;
          return [];
        };

        const mybets = extractPredictions(mybetsResult);
        const statarea = extractPredictions(statareaResult);
        const combined = extractPredictions(combinedResult);

        console.log('Extracted arrays:', {
          mybetsCount: mybets.length,
          statareaCount: statarea.length,
          combinedCount: combined.length
        });

        // Merge predictions - at least one source must succeed
        const merged = mergePredictions(mybets, statarea, combined);

        if (merged.length === 0) {
          // Check if all sources actually failed (not just empty)
          const allFailed = responses.every(r => r.status === 'rejected' || 
            (r.status === 'fulfilled' && r.value?.error));

          if (allFailed) {
            throw new Error('All prediction sources are currently unavailable');
          }
        }

        return merged;
      });

      console.log('Enhanced predictions:', result.length, result);

      if (result.length === 0) {
        setPredictions([]);
        setError("No predictions available at the moment. Please try adjusting your filters or check back later.");
      } else {
        setPredictions(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      // Provide actionable error messages
      if (errorMessage.includes('unavailable')) {
        setError("⚠️ Prediction services temporarily unavailable. Please check back in a few moments.");
      } else if (errorMessage.includes('timeout')) {
        setError("⚠️ Request timeout. Please refresh the page or try again later.");
      } else {
        setError("⚠️ Unable to load live predictions. Please refresh the page.");
      }

      console.error('Fetch error:', err);
      setPredictions([]);
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

  const shareMatch = async (pred: EnhancedPrediction) => {
    const shareText = `🎯 ${pred.consensus.prediction} - ${pred.consensus.avgConfidence.toFixed(1)}% confidence\n${pred.homeTeam} vs ${pred.awayTeam}\n${pred.league}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sports Prediction',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Prediction copied to clipboard!');
    }
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

  const renderConfidenceMeter = (confidence: number) => {
    const percentage = Math.min(100, Math.max(0, confidence));
    const color = confidence >= 85 ? "bg-green-500" : confidence >= 70 ? "bg-blue-500" : "bg-amber-500";

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Confidence</span>
          <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

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
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "table"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Table View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "cards"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={fetchEnhancedPredictions}
              disabled={loading}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors relative"
              title={isRetrying ? `Retrying... (${retryCount}/3)` : "Refresh predictions"}
            >
              <RefreshCw className={`w-6 h-6 text-gray-400 ${loading ? "animate-spin" : ""}`} />
              {isRetrying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>
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
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value as "all" | "soccer")}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="all">⚽ All Sports</option>
              <option value="soccer">⚽ Soccer Only</option>
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

        {/* Retry Status */}
        {isRetrying && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-amber-400 font-semibold">Retrying connection...</p>
                <p className="text-sm text-gray-400">Attempt {retryCount} of 3</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Shield className="w-5 h-5 text-green-400" />}
            label="High Confidence"
            value={filteredPredictions.filter(p => p.consensus.avgConfidence >= 85).length}
            gradient="from-green-500/20 to-green-600/10 border-green-500/30"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-blue-400" />}
            label="Strong Consensus"
            value={filteredPredictions.filter(p => p.consensus.agreement >= 80).length}
            gradient="from-blue-500/20 to-blue-600/10 border-blue-500/30"
          />
          <StatCard
            icon={<Flame className="w-5 h-5 text-purple-400" />}
            label="Live Matches"
            value={filteredPredictions.filter(p => p.status === "live").length}
            gradient="from-purple-500/20 to-purple-600/10 border-purple-500/30"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-amber-400" />}
            label="Total Predictions"
            value={filteredPredictions.length}
            gradient="from-amber-500/20 to-amber-600/10 border-amber-500/30"
          />
        </div>

        {/* Predictions Display */}
        {loading && filteredPredictions.length === 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded-lg w-1/2 mb-3"></div>
                <div className="h-16 bg-white/5 rounded-lg mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-white/10 rounded-lg w-24"></div>
                  <div className="h-8 bg-white/10 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      League
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Agreement
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Sources
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPredictions.map((pred) => (
                    <tr
                      key={pred.id}
                      onClick={() => setSelectedPrediction(pred)}
                      className="hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {pred.status === "live" && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {pred.homeTeam}
                            </div>
                            <div className="text-sm text-gray-400">
                              vs {pred.awayTeam}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{pred.league}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceBg(pred.consensus.avgConfidence)}`}>
                          {pred.consensus.prediction}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className={`text-2xl font-bold ${getConfidenceColor(pred.consensus.avgConfidence)}`}>
                          {pred.consensus.avgConfidence.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-300">
                          {pred.consensus.agreement.toFixed(0)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                          {pred.sources.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {pred.gameTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareMatch(pred);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Share prediction"
                        >
                          <Share2 className="w-4 h-4 text-gray-400 hover:text-purple-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 gap-5 animate-fadeIn">
            {filteredPredictions.map((pred, index) => (
              <div
                key={pred.id}
                className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedPrediction(pred)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-slate-700/50 text-gray-300 text-xs font-semibold rounded-full border border-white/10">
                          {pred.league}
                        </span>
                        {pred.status === "live" && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse-badge shadow-lg shadow-red-500/50">
                            🔴 LIVE
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {pred.homeTeam} <span className="text-gray-500 mx-2">vs</span> {pred.awayTeam}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">{pred.gameTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-xl border border-purple-500/20">
                        <div className={`text-4xl font-black ${getConfidenceColor(pred.consensus.avgConfidence)} drop-shadow-lg`}>
                          {pred.consensus.avgConfidence.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400 mt-1 font-semibold">
                          {pred.consensus.agreement.toFixed(0)}% consensus
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareMatch(pred);
                        }}
                        className="p-3 bg-purple-500/10 hover:bg-purple-500/30 rounded-xl transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50 hover:scale-110"
                        title="Share prediction"
                      >
                        <Share2 className="w-5 h-5 text-purple-400" />
                      </button>
                    </div>
                  </div>

                {/* Confidence Meter */}
                <div className="mb-4">
                  {renderConfidenceMeter(pred.consensus.avgConfidence)}
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
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="relative overflow-hidden text-center py-16 bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-2xl border border-red-500/30 backdrop-blur-sm animate-scaleIn">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 animate-shimmer"></div>
            <div className="relative z-10">
              <div className="text-7xl mb-6 animate-bounce">⚠️</div>
              <p className="text-red-400 text-2xl font-bold mb-3">{error}</p>
              <div className="max-w-md mx-auto mb-6">
                <p className="text-gray-400 text-sm mb-4">Having trouble? Try these steps:</p>
                <ul className="text-left text-gray-300 text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Check your internet connection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Adjust date or confidence filters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Try refreshing the page
                  </li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={fetchEnhancedPredictions}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Retrying..." : "Retry Now"}
                </button>
                <button
                  onClick={() => {
                    setFilterLeague("all");
                    setFilterConfidence("all");
                    setMinConfidence(86);
                    setError(null);
                    fetchEnhancedPredictions();
                  }}
                  disabled={loading}
                  className="px-8 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold rounded-xl transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredPredictions.length === 0 && !loading && !error && (
          <div className="relative overflow-hidden text-center py-20 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-white/5 backdrop-blur-sm animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="text-8xl mb-6 opacity-50">🔍</div>
              <p className="text-gray-300 text-2xl font-bold mb-3">No Predictions Available</p>
              <p className="text-gray-500 text-base mt-2 mb-6 max-w-md mx-auto">
                There are no predictions matching your current filters. Try adjusting the date, confidence level, or league filters.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setFilterLeague("all");
                    setFilterConfidence("all");
                    setMinConfidence(86);
                    fetchEnhancedPredictions();
                  }}
                  className="px-6 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-semibold rounded-lg transition-all duration-200 border border-purple-500/30"
                >
                  Reset Filters
                </button>
                <button
                  onClick={fetchEnhancedPredictions}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}