
"use client";

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-icon"></div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-meta">
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item"></div>
      </div>
      
      <style jsx>{`
        .skeleton-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          min-width: 320px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .skeleton-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        
        .skeleton-badge {
          width: 60px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        
        .skeleton-title {
          width: 80%;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        
        .skeleton-description {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        
        .skeleton-meta {
          display: flex;
          gap: 12px;
        }
        
        .skeleton-meta-item {
          width: 80px;
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
