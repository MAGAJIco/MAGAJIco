"use client";

import React from "react";
import { Target, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function ChallengesPage() {
  const challenges = [
    { title: "Weekend Warriors", description: "Make 5 predictions this weekend", progress: 3, total: 5, reward: 250 },
    { title: "Accuracy Expert", description: "Achieve 80% accuracy", progress: 75, total: 80, reward: 500 },
    { title: "Consistency", description: "7-day prediction streak", progress: 4, total: 7, reward: 300 }
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
            <Target className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Challenges</h1>
          </div>
        </motion.div>

        {/* Active Challenges */}
        <div className="space-y-4">
          {challenges.map((challenge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "20px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "1.125rem", fontWeight: "600", marginBottom: "4px" }}>
                    {challenge.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                    {challenge.description}
                  </p>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#818cf8", fontSize: "0.875rem", fontWeight: "600" }}>
                  <Award className="w-4 h-4" />
                  +{challenge.reward} pts
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "8px" }}>
                <div style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(challenge.progress / challenge.total) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                    transition: "width 0.3s ease"
                  }}></div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", marginTop: "4px" }}>
                  {challenge.progress} / {challenge.total} completed
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
