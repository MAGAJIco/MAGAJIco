"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Share2, ExternalLink, Zap, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
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
  const [stakeAmount, setStakeAmount] = useState(10);
  const [minConfidence, setMinConfidence] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  useEffect(() => {
    fetchTodaysBets();
  }, []);

  const fetchTodaysBets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nflRes, nbaRes, soccerRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/nfl`),
        fetch(`${API_BASE_URL}/api/nba`),
        fetch(`${API_BASE_URL}/api/soccer`)
      ]);

      const [nflData, nbaData, soccerData] = await Promise.all([
        nflRes.json(),
        nbaRes.json(),
        soccerRes.json()
      ]);

      const allBets: Bet[] = [];

      // NFL Live Matches
      if (nflData.matches) {
        nflData.matches.forEach((match: any, idx: number) => {
          allBets.push({
            id: `nfl-${idx}`,
            homeTeam: match.home_team || "TBD",
            awayTeam: match.away_team || "TBD",
            prediction: match.status || "Scheduled",
            odds: match.home_odds || 1.9,
            confidence: match.status === "live" ? 85 : 70,
            source: "ESPN",
            league: "NFL",
            gameTime: match.game_time || "Today"
          });
        });
      }

      // NBA Live Matches
      if (nbaData.matches) {
        nbaData.matches.forEach((match: any, idx: number) => {
          allBets.push({
            id: `nba-${idx}`,
            homeTeam: match.home_team || "TBD",
            awayTeam: match.away_team || "TBD",
            prediction: match.status || "Scheduled",
            odds: match.home_odds || 1.85,
            confidence: match.status === "live" ? 85 : 70,
            source: "ESPN",
            league: "NBA",
            gameTime: match.game_time || "Today"
          });
        });
      }

      // Soccer Live Matches
      if (soccerData.matches) {
        soccerData.matches.forEach((match: any, idx: number) => {
          allBets.push({
            id: `soccer-${idx}`,
            homeTeam: match.home_team || "TBD",
            awayTeam: match.away_team || "TBD",
            prediction: match.status || "Scheduled",
            odds: match.home_odds || 1.8,
            confidence: match.status === "live" ? 85 : 70,
            source: "ESPN",
            league: "Soccer",
            gameTime: match.game_time || "Today"
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
    if (selectedBets.length === 0) return { odds: 0, count: 0, payout: 0 };
    const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
    return { 
      odds: totalOdds.toFixed(2), 
      count: selectedBets.length,
      payout: (stakeAmount * totalOdds).toFixed(2)
    };
  };

  const filteredBets = bets.filter(bet => {
    if (minConfidence > 0 && bet.confidence < minConfidence) return false;
    if (sourceFilter !== "all" && bet.source !== sourceFilter) return false;
    return true;
  });

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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a via-purple-900 to-slate-900)",
      paddingTop: "96px",
      paddingBottom: "48px"
    }}>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "clamp(1.875rem, 5vw, 2.5rem)",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Today's Bets</h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>Pick predictions and stake on Stake.com</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Available Bets", value: filteredBets.length, color: "text-blue-400" },
            { label: "Selected", value: selectedBets.length, color: "text-purple-400" },
            { label: "Potential Win", value: `$${parlay.payout}`, color: "text-green-400" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "16px"
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "8px" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px"
          }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Filters:</span>
            </div>
            
            {/* Source Filter */}
            <div className="flex gap-2">
              {["all", "MyBetsToday", "StatArea", "FlashScore"].map((source) => (
                <button
                  key={source}
                  onClick={() => setSourceFilter(source)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    sourceFilter === source
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {source === "all" ? "All" : source}
                </button>
              ))}
            </div>

            {/* Confidence Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Min Confidence:</label>
              <select
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value={0}>All</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Bets List */}
          <div className="lg:col-span-2">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div style={{ color: "rgba(255,255,255,0.6)" }}>Loading today's bets...</div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "12px",
                  padding: "24px",
                  color: "rgba(252,165,165,1)"
                }}
              >
                {error}
              </motion.div>
            ) : filteredBets.length === 0 ? (
              <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.6)" }}>
                No bets match your filters. Try adjusting them!
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBets.map((bet, idx) => (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => toggleBetSelection(bet)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: selectedBets.find(b => b.id === bet.id)
                        ? "1px solid rgba(168,85,247,1)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: selectedBets.find(b => b.id === bet.id)
                        ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.1))"
                        : "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(10px)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: selectedBets.find(b => b.id === bet.id)
                        ? "0 0 20px rgba(168,85,247,0.3)"
                        : "none"
                    }}
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Bet Slip */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div
              className="sticky top-24"
              style={{
                background: "linear-gradient(135deg, rgba(126,34,206,0.2), rgba(217,70,239,0.2))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "16px",
                padding: "24px"
              }}
            >
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
                  {/* Quick Stake Amounts */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-2 block">Quick Stake</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setStakeAmount(amount)}
                          className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                            stakeAmount === amount
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      className="w-full mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                      placeholder="Custom amount"
                      min="1"
                    />
                  </div>

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
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-gray-300 text-sm mb-1">Stake</div>
                        <div className="text-2xl font-bold text-white">${stakeAmount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-300 text-sm mb-1">Odds</div>
                        <div className="text-2xl font-bold text-purple-300">{parlay.odds}x</div>
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="text-gray-300 text-sm mb-1">Potential Payout</div>
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        ${parlay.payout}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Profit: ${(Number(parlay.payout) - stakeAmount).toFixed(2)} ({parlay.count} picks)
                      </div>
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
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
}
