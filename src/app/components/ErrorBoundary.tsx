
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              className="error-button"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>

          <style jsx>{`
            .error-container {
              min-height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
            }
            .error-card {
              background: white;
              border-radius: 1rem;
              padding: 2rem;
              max-width: 400px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .error-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .error-title {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
              color: #1f2937;
            }
            .error-message {
              color: #6b7280;
              margin-bottom: 1.5rem;
            }
            .error-button {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              border: none;
              padding: 0.75rem 2rem;
              border-radius: 0.5rem;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .error-button:hover {
              transform: scale(1.05);
            }
            .error-button:active {
              transform: scale(0.95);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
