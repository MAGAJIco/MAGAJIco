"use client";

import React from "react";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";
import AdvancedAnalytics from "../../components/AdvancedAnalytics";

export default function AnalyticsPage() {
  const stats = [
    { label: "Predictions Made", value: "247", change: "+12% this month" },
    { label: "Accuracy Rate", value: "73%", change: "+5% improvement" },
    { label: "Avg Odds Selected", value: "1.85x", change: "Stable" },
    { label: "Win Streak", value: "8 games", change: "Currently active" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 40 }}>
        <ThemeToggle />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered sports prediction analytics
          </p>
        </motion.div>

        {/* ML-Powered Analytics Component */}
        <AdvancedAnalytics />

        {/* Legacy Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {stat.change}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
