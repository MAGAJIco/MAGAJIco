"use client";

import React from "react";
import { Gift, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function RewardsPage() {
  const rewards = [
    { title: "Daily Login", points: 100, icon: "📅", unlocked: true },
    { title: "First Prediction", points: 50, icon: "🎯", unlocked: true },
    { title: "Winning Streak (5)", points: 500, icon: "🔥", unlocked: false },
    { title: "100 Predictions", points: 1000, icon: "💯", unlocked: false }
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
        className="max-w-6xl mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Rewards</h1>
          </div>
        </motion.div>

        {/* Total Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "linear-gradient(135deg, rgba(126,34,206,0.2), rgba(217,70,239,0.2))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Total Points</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "#fff" }}>2,450</p>
          </div>
          <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.1)" }}></div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Next Tier</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "#818cf8" }}>1,550 pts</p>
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: reward.unlocked
                  ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
                  : "linear-gradient(135deg, rgba(100,100,100,0.1), rgba(80,80,80,0.1))",
                backdropFilter: "blur(10px)",
                border: "1px solid " + (reward.unlocked ? "rgba(255,255,255,0.1)" : "rgba(100,100,100,0.2)"),
                borderRadius: "12px",
                padding: "16px",
                opacity: reward.unlocked ? 1 : 0.6
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                <span style={{ fontSize: "2rem" }}>{reward.icon}</span>
                <span style={{ color: reward.unlocked ? "#818cf8" : "#666", fontSize: "0.875rem", fontWeight: "600" }}>
                  +{reward.points} pts
                </span>
              </div>
              <p style={{ color: "#fff", fontWeight: "600" }}>{reward.title}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                {reward.unlocked ? "Unlocked ✓" : "Locked"}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
