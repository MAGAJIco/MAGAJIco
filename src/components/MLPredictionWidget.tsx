"use client";

import React, { useState } from "react";
import { Brain, Loader } from "lucide-react";

interface PredictionResult {
  prediction: "home_win" | "draw" | "away_win";
  confidence: number;
  probabilities: {
    home_win: number;
    draw: number;
    away_win: number;
  };
  model_accuracy: number;
}

export default function MLPredictionWidget() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example: Get backend URL from environment
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const predictMatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      home_strength: formData.get("home_strength") as string,
      away_strength: formData.get("away_strength") as string,
      home_advantage: formData.get("home_advantage") as string,
      recent_form_home: formData.get("recent_form_home") as string,
      recent_form_away: formData.get("recent_form_away") as string,
      head_to_head: formData.get("head_to_head") as string,
      injuries: formData.get("injuries") as string,
    });

    try {
      const response = await fetch(`${API_BASE}/api/ml/predict?${params}`);
      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case "home_win":
        return "text-green-600 dark:text-green-400";
      case "away_win":
        return "text-red-600 dark:text-red-400";
      case "draw":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600";
    }
  };

  const getPredictionEmoji = (prediction: string) => {
    switch (prediction) {
      case "home_win":
        return "🏠";
      case "away_win":
        return "✈️";
      case "draw":
        return "🤝";
      default:
        return "❓";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ML Match Predictor
        </h2>
      </div>

      <form onSubmit={predictMatch} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Home Strength (0.3-1.0)
            </label>
            <input
              type="number"
              name="home_strength"
              defaultValue="0.7"
              step="0.1"
              min="0.3"
              max="1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Away Strength (0.3-1.0)
            </label>
            <input
              type="number"
              name="away_strength"
              defaultValue="0.6"
              step="0.1"
              min="0.3"
              max="1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Home Advantage (0.5-0.8)
            </label>
            <input
              type="number"
              name="home_advantage"
              defaultValue="0.65"
              step="0.05"
              min="0.5"
              max="0.8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recent Form Home (0.2-1.0)
            </label>
            <input
              type="number"
              name="recent_form_home"
              defaultValue="0.7"
              step="0.1"
              min="0.2"
              max="1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recent Form Away (0.2-1.0)
            </label>
            <input
              type="number"
              name="recent_form_away"
              defaultValue="0.6"
              step="0.1"
              min="0.2"
              max="1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Head-to-Head (0.3-0.7)
            </label>
            <input
              type="number"
              name="head_to_head"
              defaultValue="0.5"
              step="0.05"
              min="0.3"
              max="0.7"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Injuries (0.4-1.0)
            </label>
            <input
              type="number"
              name="injuries"
              defaultValue="0.8"
              step="0.1"
              min="0.4"
              max="1.0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Predicting...
            </>
          ) : (
            "Get Prediction"
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Prediction
            </p>
            <div className={`text-4xl font-bold ${getPredictionColor(result.prediction)}`}>
              {getPredictionEmoji(result.prediction)}{" "}
              {result.prediction.replace("_", " ").toUpperCase()}
            </div>
            <p className="text-lg mt-2 text-gray-900 dark:text-white">
              Confidence: <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Probabilities:</p>
            <div className="space-y-2">
              {Object.entries(result.probabilities).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(value * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
            Model Accuracy: {(result.model_accuracy * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
