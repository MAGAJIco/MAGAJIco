"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestTimerProps {
  isVisible: boolean;
  timeRemaining: number;
  onSignUpClick: () => void;
  onDismiss: () => void;
}

export default function GuestTimer({
  isVisible,
  timeRemaining,
  onSignUpClick,
  onDismiss,
}: GuestTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / 600) * 100; // Assuming 10 minutes (600s) total

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="guest-timer-container"
        >
          <div className="guest-timer-banner">
            <div className="timer-content">
              <div className="timer-message">
                <span className="timer-icon">⏱️</span>
                <span className="timer-text">
                  Guest Session • <strong>{formattedTime}</strong> remaining
                </span>
              </div>
              <p className="timer-subtitle">
                Sign up to unlock full access and save your predictions!
              </p>
            </div>

            <div className="timer-actions">
              <button className="timer-btn-signup" onClick={onSignUpClick}>
                Sign Up Now
              </button>
              <button className="timer-btn-dismiss" onClick={onDismiss}>
                ✕
              </button>
            </div>
          </div>

          <div className="timer-progress-bar">
            <motion.div
              className="timer-progress-fill"
              style={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          <style jsx>{`
            .guest-timer-container {
              position: fixed;
              top: 60px;
              left: 0;
              right: 0;
              z-index: 1500;
            }

            .guest-timer-banner {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 14px 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .timer-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }

            .timer-message {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 15px;
              font-weight: 600;
            }

            .timer-icon {
              font-size: 20px;
              animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }

            .timer-text {
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .timer-subtitle {
              font-size: 13px;
              color: rgba(255, 255, 255, 0.9);
              margin: 0;
            }

            .timer-actions {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .timer-btn-signup {
              padding: 8px 18px;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;
            }

            .timer-btn-signup:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            .timer-btn-signup:active {
              transform: translateY(0);
            }

            .timer-btn-dismiss {
              width: 32px;
              height: 32px;
              border: none;
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            }

            .timer-btn-dismiss:hover {
              background: rgba(255, 255, 255, 0.3);
            }

            .timer-progress-bar {
              height: 3px;
              background: rgba(0, 0, 0, 0.1);
              width: 100%;
            }

            .timer-progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #10b981 0%, #667eea 100%);
              transition: width 1s linear;
            }

            @media (max-width: 640px) {
              .guest-timer-banner {
                flex-direction: column;
                gap: 12px;
                padding: 12px 16px;
              }

              .timer-actions {
                width: 100%;
                justify-content: space-between;
              }

              .timer-btn-signup {
                flex: 1;
                padding: 10px 16px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
