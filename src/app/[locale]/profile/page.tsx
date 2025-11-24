"use client";

import React, { useState } from "react";
import { User, Mail, MapPin, Calendar, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

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
            <User className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>My Profile</h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Profile Card */}
          <div style={{
            gridColumn: "1 / -1",
            background: "linear-gradient(135deg, rgba(126,34,206,0.2), rgba(217,70,239,0.2))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700" }}>User Profile</h2>
                  <p style={{ color: "rgba(255,255,255,0.6)" }}>Sports Enthusiast</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: "rgba(102,126,234,0.2)",
                  border: "1px solid rgba(102,126,234,0.5)",
                  color: "#818cf8",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Settings className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Email</p>
                  <p style={{ color: "#fff" }}>user@example.com</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Location</p>
                  <p style={{ color: "#fff" }}>San Francisco, CA</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Calendar className="w-5 h-5 text-purple-400" />
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Member Since</p>
                  <p style={{ color: "#fff" }}>January 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {[
            { label: "Predictions Made", value: "247", color: "text-blue-400" },
            { label: "Win Rate", value: "73%", color: "text-green-400" },
            { label: "Rewards Earned", value: "2.5K", color: "text-purple-400" }
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
                padding: "20px",
                textAlign: "center"
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontSize: "2rem", fontWeight: "700", color: stat.color }}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
