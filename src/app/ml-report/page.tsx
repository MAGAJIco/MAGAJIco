"use client";

import React, { useEffect, useState } from "react";
import { Brain, CheckCircle, TrendingUp, Zap } from "lucide-react";

interface ModelStatus {
  status: string;
  model: string;
  accuracy: number;
  features: number;
  feature_names: string[];
  prediction_classes: string[];
  training_samples: number;
  training_accuracy: number;
  test_accuracy: number;
}

export default function MLReport() {
  const [data, setData] = useState<ModelStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/ml/status", {
          cache: "no-store"
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin">
          <Brain className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Brain className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connection Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to connect to ML backend. Please ensure the backend server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ML Integration Report
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            MagajiCo Sports Prediction Platform - Machine Learning Status & Performance
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Model Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {data.status}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(data.test_accuracy * 100).toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Model Type</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.model.split(" ")[0]}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Model Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Model Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Architecture
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Model Type:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Input Features:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data.features}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Output Classes:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data.prediction_classes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Training Samples:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data.training_samples.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Training Accuracy:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {(data.training_accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Test Accuracy:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {(data.test_accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Accuracy Gap</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${((data.training_accuracy - data.test_accuracy) * 100).toFixed(1)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {((data.training_accuracy - data.test_accuracy) * 100).toFixed(2)}% gap
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Input Features ({data.features})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.feature_names.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {feature.replace(/_/g, " ").toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Classes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Prediction Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.prediction_classes.map((cls, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center"
              >
                <div className="text-3xl mb-2">
                  {idx === 0 ? "🏠" : idx === 1 ? "🤝" : "✈️"}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {cls.split("(")[0].trim()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {cls.split("(")[1]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            API Endpoints
          </h2>
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                GET /api/ml/status
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get model status and metrics
              </p>
              <div className="bg-gray-900 dark:bg-gray-950 text-green-400 rounded p-4 font-mono text-xs overflow-x-auto">
                <div>curl http://localhost:8000/api/ml/status</div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                GET /api/ml/predict
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get real-time predictions
              </p>
              <div className="bg-gray-900 dark:bg-gray-950 text-green-400 rounded p-4 font-mono text-xs overflow-x-auto">
                <div>curl "http://localhost:8000/api/ml/predict?</div>
                <div>home_strength=0.7&away_strength=0.6&</div>
                <div>home_advantage=0.65&recent_form_home=0.7&</div>
                <div>recent_form_away=0.6&head_to_head=0.5&</div>
                <div>injuries=0.8"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-block bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full px-6 py-3">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              ✅ ML Integration Status: READY FOR PRODUCTION
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
