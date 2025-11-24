"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Share2, ExternalLink, Zap, Target, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../../../lib/api";

interface Bet {
  id: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
  confidence: number;
  source: string;
  league: string;
  gameTime: string;
}

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaysBets();
  }, []);

  const fetchTodaysBets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mybetsRes, statareaRes, flashscoreRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/predictions/soccer?min_confidence=86&date=today`),
        fetch(`${API_BASE_URL}/api/predictions/statarea?min_odds=1.5&max_odds=3.0`),
        fetch(`${API_BASE_URL}/api/predictions/flashscore/over45?exclude_african=true&min_odds=1.5`)
      ]);

      const [mybetsData, statareaData, flashscoreData] = await Promise.all([
        mybetsRes.json(),
        statareaRes.json(),
        flashscoreRes.json()
      ]);

      const allBets: Bet[] = [];

      // MyBets predictions
      if (mybetsData.predictions) {
        mybetsData.predictions.forEach((pred: any, idx: number) => {
          allBets.push({
            id: `mybets-${idx}`,
            homeTeam: pred.home_team || "TBD",
            awayTeam: pred.away_team || "TBD",
            prediction: pred.prediction || "Unknown",
            odds: pred.implied_odds || 1.5,
            confidence: pred.confidence || 0,
            source: "MyBetsToday",
            league: "Premier League",
            gameTime: pred.game_time || "Today"
          });
        });
      }

      // StatArea predictions
      if (statareaData.predictions) {
        statareaData.predictions.forEach((pred: any, idx: number) => {
          allBets.push({
            id: `statarea-${idx}`,
            homeTeam: pred.home_team || "TBD",
            awayTeam: pred.away_team || "TBD",
            prediction: pred.prediction || "Unknown",
            odds: pred.odds || 1.8,
            confidence: pred.confidence || 0,
            source: "StatArea",
            league: "Top 5 Leagues",
            gameTime: pred.game_time || "Today"
          });
        });
      }

      // FlashScore predictions
      if (flashscoreData.predictions) {
        flashscoreData.predictions.forEach((pred: any, idx: number) => {
          allBets.push({
            id: `flashscore-${idx}`,
            homeTeam: pred.home_team || "TBD",
            awayTeam: pred.away_team || "TBD",
            prediction: pred.prediction || "Over 4.5",
            odds: pred.odds || 1.9,
            confidence: pred.confidence || 0,
            source: "FlashScore",
            league: "Soccer",
            gameTime: pred.game_time || "Today"
          });
        });
      }

      setBets(allBets.sort((a, b) => b.confidence - a.confidence));
    } catch (err) {
      setError("Failed to load today's bets. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBetSelection = (bet: Bet) => {
    const isSelected = selectedBets.find(b => b.id === bet.id);
    if (isSelected) {
      setSelectedBets(selectedBets.filter(b => b.id !== bet.id));
    } else {
      setSelectedBets([...selectedBets, bet]);
    }
  };

  const calculateParlay = () => {
    if (selectedBets.length === 0) return { odds: 0, count: 0 };
    const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
    return { odds: totalOdds.toFixed(2), count: selectedBets.length };
  };

  const getStakeBetSlip = () => {
    if (selectedBets.length === 0) return "";
    return selectedBets.map(bet => `${bet.homeTeam} vs ${bet.awayTeam} - ${bet.prediction} @ ${bet.odds}`).join("\n");
  };

  const openStake = () => {
    const slip = getStakeBetSlip();
    // Stake.com affiliate/direct link - replace with your referral code
    const stakeUrl = `https://stake.com?promo=MAGAJICO`;
    window.open(stakeUrl, '_blank');
  };

  const copyToClipboard = () => {
    const slip = `🎯 MAGAJICO BET SLIP\n\n${getStakeBetSlip()}\n\nParlay Odds: ${calculateParlay().odds}x`;
    navigator.clipboard.writeText(slip);
    alert("Bet slip copied to clipboard!");
  };

  const parlay = calculateParlay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Today's Bets</h1>
          </div>
          <p className="text-gray-400">Pick predictions and stake on Stake.com</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Available Bets</div>
            <div className="text-3xl font-bold text-white">{bets.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Selected</div>
            <div className="text-3xl font-bold text-purple-400">{selectedBets.length}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/30 rounded-lg p-4">
            <div className="text-gray-300 text-sm mb-1">Parlay Odds</div>
            <div className="text-3xl font-bold text-pink-400">{parlay.odds}x</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bets List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading today's bets...</div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-300">
                {error}
              </div>
            ) : bets.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No bets available right now. Check back soon!
              </div>
            ) : (
              <div className="space-y-3">
                {bets.map(bet => (
                  <div
                    key={bet.id}
                    onClick={() => toggleBetSelection(bet)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedBets.find(b => b.id === bet.id)
                        ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-semibold text-white">
                            {bet.homeTeam} vs {bet.awayTeam}
                          </div>
                          <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                            {bet.source}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mb-2">
                          Prediction: <span className="text-purple-300 font-semibold">{bet.prediction}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Odds:</span>
                            <span className="ml-2 font-bold text-green-400">{bet.odds.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Confidence:</span>
                            <span className="ml-2 font-bold text-yellow-400">{bet.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedBets.find(b => b.id === bet.id)
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedBets.find(b => b.id === bet.id) && (
                          <div className="text-white text-sm">✓</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bet Slip */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Bet Slip
              </h3>

              {selectedBets.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  Select bets to create a parlay
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                    {selectedBets.map((bet, idx) => (
                      <div
                        key={bet.id}
                        className="text-sm bg-white/5 p-3 rounded border border-white/10"
                      >
                        <div className="font-semibold text-white">
                          {idx + 1}. {bet.homeTeam} vs {bet.awayTeam}
                        </div>
                        <div className="text-purple-300 text-xs mt-1">
                          {bet.prediction} @ {bet.odds.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Parlay */}
                  <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50 rounded-lg p-4 mb-6">
                    <div className="text-gray-300 text-sm mb-2">Total Parlay Odds</div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {parlay.odds}x
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ({parlay.count} selections)
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={openStake}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Stake on Stake.com
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Slip
                    </button>
                    <button
                      onClick={() => {
                        const slip = `🎯 Check out these bets: ${getStakeBetSlip().replace(/\n/g, ' | ')}`;
                        navigator.share?.({ text: slip, title: "MAGAJICO Bet Slip" });
                      }}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
