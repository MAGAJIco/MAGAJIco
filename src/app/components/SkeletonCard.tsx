// SkeletonCard.jsx
"use client";

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-shimmer w-12 h-12 rounded-xl" />
        <div className="skeleton-shimmer w-16 h-6 rounded-xl" />
      </div>
      <div className="skeleton-shimmer w-4/5 h-6 rounded-md mb-3" />
      <div className="skeleton-shimmer w-full h-4 rounded-sm mb-4" />
      <div className="skeleton-meta flex gap-3">
        <div className="skeleton-shimmer w-20 h-4 rounded-sm" />
        <div className="skeleton-shimmer w-20 h-4 rounded-sm" />
        <div className="skeleton-shimmer w-20 h-4 rounded-sm" />
      </div>

      <style jsx>{`
        .skeleton-card {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          min-width: 320px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}