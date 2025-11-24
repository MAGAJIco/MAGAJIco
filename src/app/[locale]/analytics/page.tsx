"use client";

import React from "react";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function AnalyticsPage() {
  const stats = [
    { label: "Predictions Made", value: "247", change: "+12% this month" },
    { label: "Accuracy Rate", value: "73%", change: "+5% improvement" },
    { label: "Avg Odds Selected", value: "1.85x", change: "Stable" },
    { label: "Win Streak", value: "8 games", change: "Currently active" }
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
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Analytics</h1>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
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
                padding: "20px"
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginBottom: "8px" }}>{stat.label}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "2rem", fontWeight: "700", color: "#fff" }}>{stat.value}</span>
              </div>
              <p style={{ color: "rgba(102,126,234,1)", fontSize: "0.875rem" }}>{stat.change}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <TrendingUp className="w-12 h-12 text-purple-400 opacity-50" />
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.125rem" }}>Performance Charts</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>Detailed analytics coming soon</p>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
