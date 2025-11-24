"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, PieChart, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

export default function AdvancedAnalytics() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulated analytics data - replace with real API call
        const mockStats: Stat[] = [
          {
            label: "Prediction Accuracy",
            value: "90.3%",
            change: 2.1,
            trend: "up",
          },
          {
            label: "Win Rate (Last 7 Days)",
            value: "62%",
            change: 8.5,
            trend: "up",
          },
          {
            label: "Average Confidence",
            value: "78%",
            change: -1.2,
            trend: "down",
          },
          {
            label: "Total Predictions",
            value: "1,247",
            change: 15.3,
            trend: "up",
          },
        ];
        setStats(mockStats);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDownLeft className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time performance metrics powered by ML model
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                {getTrendIcon(stat.trend)}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                {stat.change !== undefined && (
                  <span className={`text-sm font-semibold ${getTrendColor(stat.trend)}`}>
                    {stat.change > 0 ? "+" : ""}{stat.change}%
                  </span>
                )}
              </div>

              <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    stat.trend === "up" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.random() * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Model Performance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              ML Model Performance
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Test Accuracy
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  90.3%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[90.3%] bg-gradient-to-r from-blue-500 to-green-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Training Accuracy
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  98.7%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[98.7%] bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Model trained on 10,000 samples | 7 input features | Random Forest Classifier
            </p>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Prediction Features
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Home Team Strength</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[30%] bg-blue-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Away Team Strength</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[30%] bg-blue-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Home Advantage Factor</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[20%] bg-green-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Recent Form Analysis</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[25%] bg-purple-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Head-to-Head Stats</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[15%] bg-orange-500" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Injury Status Impact</span>
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-full w-[10%] bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
