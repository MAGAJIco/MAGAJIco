"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";

const faqs = [
  { question: "How do I make predictions?", answer: "Navigate to the Predictions page and select from available matches." },
  { question: "How do rewards work?", answer: "Earn rewards based on prediction accuracy and engagement." },
  { question: "Can I edit my bets?", answer: "Yes, you can modify bets before they are finalized." },
  { question: "How is accuracy calculated?", answer: "Accuracy is calculated based on correct predictions out of total predictions." }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <HelpCircle className="w-8 h-8 text-purple-400" />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "-0.02em"
            }}>Help & Support</h1>
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px 16px",
            gap: "8px"
          }}>
            <Search className="w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search help..."
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                outline: "none",
                flex: 1
              }}
            />
          </div>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                overflow: "hidden"
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                style={{
                  width: "100%",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  color: "#fff"
                }}
              >
                <span style={{ fontWeight: "600" }}>{faq.question}</span>
                <ChevronDown
                  className="w-5 h-5"
                  style={{
                    transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                  }}
                />
              </button>
              {openIndex === idx && (
                <div style={{
                  padding: "0 16px 16px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)"
                }}>
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
