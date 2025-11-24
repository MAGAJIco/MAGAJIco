"use client";

import React from "react";
import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: "PredictionMaster", score: 9847, accuracy: "92%", streak: 15 },
    { rank: 2, name: "SportsGuru", score: 8934, accuracy: "89%", streak: 12 },
    { rank: 3, name: "BettingPro", score: 8123, accuracy: "87%", streak: 10 },
    { rank: 4, name: "AnalyticsKing", score: 7654, accuracy: "85%", streak: 8 },
    { rank: 5, name: "PicksExpert", score: 7234, accuracy: "84%", streak: 7 }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a via-purple-900 to-slate-900)",
      paddingTop: "96px",
      paddingBottom: "48px"
    }}>
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 40 }}>
        <ThemeToggle />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Leaderboard</h1>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Rank", "Player", "Score", "Accuracy", "Win Streak"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: idx === 0 ? "rgba(255,215,0,0.05)" : "transparent"
                    }}
                  >
                    <td style={{ padding: "16px", color: "#fff", fontWeight: "600" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {idx === 0 && <Trophy className="w-4 h-4 text-yellow-400" />}
                        {idx === 1 && <Medal className="w-4 h-4 text-gray-300" />}
                        {idx === 2 && <Medal className="w-4 h-4 text-orange-600" />}
                        {entry.rank}
                      </div>
                    </td>
                    <td style={{ padding: "16px", color: "#fff" }}>{entry.name}</td>
                    <td style={{ padding: "16px", color: "#818cf8", fontWeight: "600" }}>{entry.score}</td>
                    <td style={{ padding: "16px", color: "#10b981" }}>{entry.accuracy}</td>
                    <td style={{ padding: "16px", color: "#f59e0b" }}>🔥 {entry.streak}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
