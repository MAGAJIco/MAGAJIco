"use client";

import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (onSignUp) {
          await onSignUp(email, password);
        } else {
          setError("Sign up is coming soon! Please sign in instead.");
          setIsLoading(false);
          return;
        }
      } else {
        await onSignIn(email, password);
      }
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose} />
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>
        
        <div className="auth-footer">
          <button 
            className="toggle-mode-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp 
              ? "Already have an account? Sign In" 
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .auth-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        
        .auth-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 420px;
          z-index: 2001;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .auth-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .auth-modal-header h2 {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .close-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .close-btn:hover {
          background: #e5e5e5;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #555;
        }
        
        .form-group input {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        .error-message {
          padding: 12px 16px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .submit-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:active {
          transform: translateY(0);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .auth-footer {
          margin-top: 20px;
          text-align: center;
        }
        
        .toggle-mode-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .toggle-mode-btn:hover {
          color: #764ba2;
        }
      `}</style>
    </>
  );
}
