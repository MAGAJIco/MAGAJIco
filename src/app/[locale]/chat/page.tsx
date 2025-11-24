
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai"; timestamp: Date }>>([
    { text: "👋 Welcome to Sports Central Chat! Ask me anything about sports, predictions, or matches.", sender: "ai", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseText = "";
      const userInput = userMessage.text.toLowerCase();

      // Check if user is asking about current prediction/selection
      if (
        userInput.includes("prediction") ||
        userInput.includes("current") ||
        userInput.includes("selected") ||
        userInput.includes("this match") ||
        userInput.includes("analyze")
      ) {
        // Check if there's a selected prediction from localStorage or session
        let selectedPredictionStr = "";
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            selectedPredictionStr = window.localStorage.getItem("selectedPrediction") || "";
          }
        } catch (e) {
          console.warn("localStorage not available:", e);
        }
        
        if (!selectedPredictionStr || selectedPredictionStr === "null" || selectedPredictionStr === "") {
          // No current selection
          aiResponseText = "You have no current selection. Please select a prediction first to get detailed analysis and recommendations.";
        } else {
          // Has selection
          try {
            const selectedPrediction = JSON.parse(selectedPredictionStr);
            const responses = [
              `📊 Analyzing ${selectedPrediction.homeTeam || "this match"}: The consensus prediction is ${selectedPrediction.prediction || "favorable"} with ${selectedPrediction.consensus?.avgConfidence || "high"}% confidence. Based on multi-source data, this looks promising!`,
              `🎯 For this ${selectedPrediction.league || "match"}, I recommend ${selectedPrediction.consensus?.prediction || "going with the consensus"}. The odds are solid and multiple sources agree.`,
              `⚡ This match has ${selectedPrediction.consensus?.agreement || "strong"}% consensus among prediction sources. ${selectedPrediction.homeTeam || "The home team"} looks likely to ${selectedPrediction.consensus?.prediction || "perform well"}.`,
              `🏆 According to AI analysis, this ${selectedPrediction.consensus?.prediction || "prediction"} has a strong basis. Risk assessment is ${(100 - (selectedPrediction.consensus?.avgConfidence || 80)) > 50 ? "low" : "moderate"}.`
            ];
            aiResponseText = responses[Math.floor(Math.random() * responses.length)];
          } catch (e) {
            console.warn("Error parsing prediction:", e);
            aiResponseText = "I found a selection but had trouble analyzing it. Please try again or select a different prediction.";
          }
        }
      } else {
        // General sports questions
        const aiResponses = [
          "🤖 Based on current stats, I predict a 78% chance of that outcome!",
          "⚡ Great question! The live match data shows interesting trends...",
          "🎯 According to our AI predictions, here's what to expect...",
          "📊 Let me analyze that for you... The accuracy rate is looking strong!",
          "🏆 That's a popular topic! Here's what our data shows..."
        ];
        aiResponseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      }
      
      const aiMessage = {
        text: aiResponseText,
        sender: "ai" as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      paddingBottom: "80px"
    }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link href={`/${locale}`} className="nav-icon">←</Link>
          <div className="logo">💬 Sports Chat</div>
        </div>
      </nav>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "20px",
          height: "calc(100vh - 64px - 80px)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Messages Container */}
        <div style={{
          flex: 1,
          background: "rgba(255,255,255,0.95)",
          borderRadius: "24px 24px 0 0",
          padding: "24px",
          overflowY: "auto",
          marginBottom: "0"
        }}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px"
              }}
            >
              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "16px",
                background: msg.sender === "user" 
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : "#f3f4f6",
                color: msg.sender === "user" ? "#fff" : "#1a202c",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: "15px", lineHeight: "1.5" }}>{msg.text}</div>
                <div style={{ 
                  fontSize: "11px", 
                  marginTop: "4px",
                  opacity: 0.7
                }}>
                  {msg.timestamp.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "16px"
              }}
            >
              <div style={{
                padding: "12px 16px",
                borderRadius: "16px",
                background: "#f3f4f6",
                color: "#666"
              }}>
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  AI is typing...
                </motion.span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "0 0 24px 24px",
          padding: "16px 24px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about predictions, matches, stats..."
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                background: input.trim() 
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : "#e5e7eb",
                color: input.trim() ? "#fff" : "#9ca3af",
                fontSize: "15px",
                fontWeight: "600",
                cursor: input.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                transform: input.trim() ? "scale(1)" : "scale(0.98)"
              }}
            >
              Send 🚀
            </button>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .navbar {
          background: white;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .navbar-left { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
        }
        .logo { 
          font-size: 20px; 
          font-weight: bold; 
          color: #667eea; 
        }
        .nav-icon {
          width: 40px; 
          height: 40px; 
          border-radius: 50%;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer; 
          transition: background 0.2s;
          text-decoration: none;
          color: #333;
          font-size: 20px;
        }
        .nav-icon:hover { 
          background: #f5f5f5; 
        }
      `}</style>
    </div>
  );
}
