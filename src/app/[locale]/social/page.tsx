"use client";

import React from "react";
import { Users, MessageCircle, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function SocialPage() {
  const posts = [
    { author: "SportsFan2024", content: "Just nailed a 5-game parlay! 🔥", likes: 234, comments: 45 },
    { author: "PredictionPro", content: "New strategy: Following expert predictions only", likes: 512, comments: 89 },
    { author: "BettingGuru", content: "80% accuracy this week! Join my prediction group", likes: 1205, comments: 156 }
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
        className="max-w-2xl mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Social</h1>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, idx) => (
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
                padding: "16px"
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <p style={{ color: "#fff", fontWeight: "600", marginBottom: "4px" }}>{post.author}</p>
                <p style={{ color: "rgba(255,255,255,0.8)" }}>{post.content}</p>
              </div>
              <div style={{ display: "flex", gap: "24px", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
